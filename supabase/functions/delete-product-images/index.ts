import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createSupabaseContext } from "npm:@supabase/server";

import { DeleteObjectsCommand, S3Client } from "npm:@aws-sdk/client-s3@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,

    headers: {
      ...corsHeaders,

      "Content-Type": "application/json",
    },
  });
};

Deno.serve(async (req: Request) => {
  /*
   * ===============================
   * CORS
   * ===============================
   */

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  /*
   * Sadece POST
   */

  if (req.method !== "POST") {
    return json(
      {
        error: "METHOD_NOT_ALLOWED",
      },
      405,
    );
  }

  try {
    /*
     * ===============================
     * AUTH
     * ===============================
     */

    const authorization = req.headers.get("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return json(
        {
          error: "UNAUTHORIZED",
        },
        401,
      );
    }

    const { data: ctx, error: contextError } = await createSupabaseContext(
      req,
      {
        auth: "user",
      },
    );

    if (contextError || !ctx) {
      console.error("Supabase auth context error:", contextError);

      return json(
        {
          error: "UNAUTHORIZED",

          message: contextError?.message ?? "Authentication failed",
        },
        401,
      );
    }

    const userId = ctx.userClaims?.id ?? ctx.jwtClaims?.sub;

    if (!userId) {
      return json(
        {
          error: "USER_ID_NOT_FOUND",
        },
        401,
      );
    }

    /*
     * ===============================
     * ADMIN KONTROLÜ
     * ===============================
     */

    const { data: profile, error: profileError } = await ctx.supabaseAdmin
      .from("profiles")
      .select("id, role, is_active")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup failed:", profileError);

      return json(
        {
          error: "PROFILE_LOOKUP_FAILED",

          message: profileError.message,

          code: profileError.code,
        },
        500,
      );
    }

    if (!profile) {
      return json(
        {
          error: "PROFILE_NOT_FOUND",
        },
        403,
      );
    }

    if (profile.role !== "admin" || profile.is_active !== true) {
      return json(
        {
          error: "ADMIN_REQUIRED",
        },
        403,
      );
    }

    /*
     * ===============================
     * REQUEST BODY
     * ===============================
     */

    const body = await req.json().catch(() => null);

    if (!body) {
      return json(
        {
          error: "INVALID_REQUEST_BODY",
        },
        400,
      );
    }

    const { productId, objectKeys } = body;

    if (typeof productId !== "string" || !productId.trim()) {
      return json(
        {
          error: "PRODUCT_ID_REQUIRED",
        },
        400,
      );
    }

    if (!Array.isArray(objectKeys) || objectKeys.length === 0) {
      return json(
        {
          error: "OBJECT_KEYS_REQUIRED",
        },
        400,
      );
    }

    const cleanProductId = productId.trim();

    const cleanObjectKeys = objectKeys
      .filter((objectKey) => typeof objectKey === "string" && objectKey.trim())
      .map((objectKey) => objectKey.trim());

    if (cleanObjectKeys.length === 0) {
      return json(
        {
          error: "OBJECT_KEYS_REQUIRED",
        },
        400,
      );
    }

    /*
     * ===============================
     * DB KONTROLÜ
     * ===============================
     *
     * Frontend istediği object key'i
     * gönderip başka dosyaları silemesin.
     *
     * Yalnızca ilgili product_id'ye bağlı
     * product_images kayıtlarını kabul ediyoruz.
     */

    const { data: imageRecords, error: imageLookupError } =
      await ctx.supabaseAdmin
        .from("product_images")
        .select("id, product_id, object_key")
        .eq("product_id", cleanProductId)
        .in("object_key", cleanObjectKeys);

    if (imageLookupError) {
      console.error("Product image lookup failed:", imageLookupError);

      return json(
        {
          error: "PRODUCT_IMAGES_LOOKUP_FAILED",

          message: imageLookupError.message,
        },
        500,
      );
    }

    const validKeys = (imageRecords || []).map((image) => image.object_key);

    /*
     * Hiç eşleşme yoksa hata vermek yerine
     * idempotent davranıyoruz.
     */

    if (validKeys.length === 0) {
      return json({
        success: true,

        deleted: 0,

        requested: cleanObjectKeys.length,
      });
    }

    /*
     * ===============================
     * R2 CONFIG
     * ===============================
     */

    const accountId = Deno.env.get("R2_ACCOUNT_ID");

    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");

    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");

    const bucketName = Deno.env.get("R2_BUCKET_NAME");

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error("R2 environment is incomplete", {
        accountId: Boolean(accountId),

        accessKeyId: Boolean(accessKeyId),

        secretAccessKey: Boolean(secretAccessKey),

        bucketName: Boolean(bucketName),
      });

      return json(
        {
          error: "R2_NOT_CONFIGURED",
        },
        503,
      );
    }

    /*
     * ===============================
     * R2 CLIENT
     * ===============================
     */

    const r2 = new S3Client({
      region: "auto",

      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,

      credentials: {
        accessKeyId,

        secretAccessKey,
      },
    });

    /*
     * ===============================
     * R2 DELETE
     * ===============================
     */

    await r2.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,

        Delete: {
          Objects: validKeys.map((key) => ({
            Key: key,
          })),

          Quiet: true,
        },
      }),
    );

    /*
     * Burada DB kaydını silmiyoruz.
     *
     * Onu frontend tarafındaki
     * deleteProductImageRecords()
     * yapacak.
     */

    return json({
      success: true,

      deleted: validKeys.length,

      requested: cleanObjectKeys.length,
    });
  } catch (error) {
    console.error("delete-product-images failed:", error);

    return json(
      {
        error: "INTERNAL_SERVER_ERROR",

        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

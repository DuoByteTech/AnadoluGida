import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

import { DeleteObjectCommand, S3Client } from "npm:@aws-sdk/client-s3@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,

    headers: {
      ...corsHeaders,

      "Content-Type": "application/json",
    },
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,

      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "METHOD_NOT_ALLOWED",
      },
      405,
    );
  }

  try {
    /*
     * =========================================
     * AUTH
     * =========================================
     */

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse(
        {
          error: "UNAUTHORIZED",
        },
        401,
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse(
        {
          error: "SUPABASE_ENV_MISSING",
        },
        500,
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonResponse(
        {
          error: "UNAUTHORIZED",
        },
        401,
      );
    }

    /*
     * =========================================
     * ADMIN KONTROLÜ
     * =========================================
     */

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
          role,
          is_active
        `,
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return jsonResponse(
        {
          error: "PROFILE_NOT_FOUND",
        },
        403,
      );
    }

    if (profile.role !== "admin" || profile.is_active !== true) {
      return jsonResponse(
        {
          error: "ADMIN_REQUIRED",
        },
        403,
      );
    }

    /*
     * =========================================
     * REQUEST BODY
     * =========================================
     */

    const body = await req.json().catch(() => null);

    if (!body) {
      return jsonResponse(
        {
          error: "INVALID_REQUEST_BODY",
        },
        400,
      );
    }

    const { promotionId, objectKey } = body;

    if (typeof promotionId !== "string" || !promotionId.trim()) {
      return jsonResponse(
        {
          error: "PROMOTION_ID_REQUIRED",
        },
        400,
      );
    }

    if (typeof objectKey !== "string" || !objectKey.trim()) {
      return jsonResponse(
        {
          error: "OBJECT_KEY_REQUIRED",
        },
        400,
      );
    }

    const cleanPromotionId = promotionId.trim();

    const cleanObjectKey = objectKey.trim();

    /*
     * =========================================
     * PROMOTION KONTROLÜ
     * =========================================
     */

    const { data: promotion, error: promotionError } = await supabase
      .from("promotions")
      .select("id")
      .eq("id", cleanPromotionId)
      .maybeSingle();

    if (promotionError) {
      console.error("Promotion lookup failed:", promotionError);

      return jsonResponse(
        {
          error: "PROMOTION_LOOKUP_FAILED",
        },
        500,
      );
    }

    /*
     * Promosyon silinmişse function yine
     * güvenli şekilde çalışabilsin.
     *
     * Esas güvenlik kontrolümüz objectKey'in
     * yalnızca ilgili promotion klasörünün
     * altında olmasıdır.
     */

    const expectedPrefix = `promotions/${cleanPromotionId}/`;

    if (!cleanObjectKey.startsWith(expectedPrefix)) {
      return jsonResponse(
        {
          error: "INVALID_OBJECT_KEY",
        },
        403,
      );
    }

    /*
     * Promosyon mevcut değilse de ilgili
     * promotionId klasörünün altındaki dosyayı
     * temizlemeye izin veriyoruz.
     *
     * Böylece DB kaydı silindikten sonra kalan
     * orphan dosyalar da temizlenebilir.
     */

    if (!promotion) {
      console.warn(
        `Promotion ${cleanPromotionId} not found. Cleaning orphan R2 object.`,
      );
    }

    /*
     * =========================================
     * R2 CONFIG
     * =========================================
     */

    const r2AccountId = Deno.env.get("R2_ACCOUNT_ID");

    const r2AccessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");

    const r2SecretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");

    const r2BucketName = Deno.env.get("R2_BUCKET_NAME");

    if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName) {
      return jsonResponse(
        {
          error: "R2_CONFIG_MISSING",
        },
        500,
      );
    }

    /*
     * =========================================
     * R2 CLIENT
     * =========================================
     */

    const r2Client = new S3Client({
      region: "auto",

      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,

      credentials: {
        accessKeyId: r2AccessKeyId,

        secretAccessKey: r2SecretAccessKey,
      },
    });

    /*
     * =========================================
     * R2 DELETE
     * =========================================
     */

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: r2BucketName,

        Key: cleanObjectKey,
      }),
    );

    return jsonResponse({
      success: true,

      deleted: true,

      objectKey: cleanObjectKey,
    });
  } catch (error) {
    console.error("delete-promotion-image error:", error);

    return jsonResponse(
      {
        error: "INTERNAL_SERVER_ERROR",

        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

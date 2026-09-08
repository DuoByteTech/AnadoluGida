import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3";

import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3";

const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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

    const body = await req.json();

    const { promotionId, fileName, contentType, fileSize } = body;

    if (!promotionId) {
      return jsonResponse(
        {
          error: "PROMOTION_ID_REQUIRED",
        },
        400,
      );
    }

    if (!fileName) {
      return jsonResponse(
        {
          error: "FILE_NAME_REQUIRED",
        },
        400,
      );
    }

    if (!contentType) {
      return jsonResponse(
        {
          error: "CONTENT_TYPE_REQUIRED",
        },
        400,
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      return jsonResponse(
        {
          error: "IMAGE_TYPE_NOT_ALLOWED",
        },
        400,
      );
    }

    const parsedFileSize = Number(fileSize);

    if (!Number.isFinite(parsedFileSize) || parsedFileSize <= 0) {
      return jsonResponse(
        {
          error: "INVALID_FILE_SIZE",
        },
        400,
      );
    }

    if (parsedFileSize > MAX_IMAGE_SIZE) {
      return jsonResponse(
        {
          error: "IMAGE_TOO_LARGE",
        },
        400,
      );
    }

    const { data: promotion, error: promotionError } = await supabase
      .from("promotions")
      .select("id")
      .eq("id", promotionId)
      .maybeSingle();

    if (promotionError) {
      return jsonResponse(
        {
          error: "PROMOTION_LOOKUP_FAILED",
        },
        500,
      );
    }

    if (!promotion) {
      return jsonResponse(
        {
          error: "PROMOTION_NOT_FOUND",
        },
        404,
      );
    }

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

    const extension = ALLOWED_IMAGE_TYPES.get(contentType);

    const uniqueId = crypto.randomUUID();

    const objectKey = `promotions/${promotionId}/${uniqueId}.${extension}`;

    const s3Client = new S3Client({
      region: "auto",

      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,

      credentials: {
        accessKeyId: r2AccessKeyId,

        secretAccessKey: r2SecretAccessKey,
      },
    });

    const command = new PutObjectCommand({
      Bucket: r2BucketName,

      Key: objectKey,

      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60 * 5,
    });

    return jsonResponse({
      uploadUrl,
      objectKey,
    });
  } catch (error) {
    console.error("create-promotion-image-upload error:", error);

    return jsonResponse(
      {
        error: "INTERNAL_SERVER_ERROR",
      },
      500,
    );
  }
});

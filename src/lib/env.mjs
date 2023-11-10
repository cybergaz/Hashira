import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /* -----------------------------------------------------------------------------------------------
   * Opt out of validation
   * -----------------------------------------------------------------------------------------------*/

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  server: {
    /* -----------------------------------------------------------------------------------------------
     * Node.js Environment
     * -----------------------------------------------------------------------------------------------*/

    NODE_ENV: z.enum(["development", "test", "production"]),

    /* -----------------------------------------------------------------------------------------------
     * NextAuth.js
     * -----------------------------------------------------------------------------------------------*/

    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),

    /* -----------------------------------------------------------------------------------------------
     * Google OAuth
     * -----------------------------------------------------------------------------------------------*/

    GOOGLE_CLIENT_ID: z
      .string()
      .min(1, { message: "Google Client ID is invalid or missing" }),
    GOOGLE_CLIENT_SECRET: z
      .string()
      .min(1, { message: "Google Client Secret is invalid or missing" }),

    /* -----------------------------------------------------------------------------------------------
     * Github OAuth
     * -----------------------------------------------------------------------------------------------*/

    GITHUB_CLIENT_ID: z
      .string()
      .min(1, { message: "Github Client ID is invalid or missing" }),
    GITHUB_CLIENT_SECRET: z
      .string()
      .min(1, { message: "Github Client Secret is invalid or missing" }),

    /* -----------------------------------------------------------------------------------------------
     * Postgres Database URL (Supabase)
     * -----------------------------------------------------------------------------------------------*/

    DATABASE_URL: z
      .string()
      .min(1, { message: "Database URL is invalid or missing" }),

    /* -----------------------------------------------------------------------------------------------
     * Upstash Rate Limiting (Redis)
     * -----------------------------------------------------------------------------------------------*/

    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    ENABLE_RATE_LIMITING: z.coerce.boolean().default(false),
    RATE_LIMITING_REQUESTS_PER_SECOND: z.coerce.number().default(50),
  },
});

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define schema for environment variables with fallback defaults for development
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
  PORT: z.string().default("5000"),
  API_VERSION: z.string().default("v1"),
  
  // Neon DB URL or regular DATABASE_URL
  DATABASE_URL: z.string().default("postgresql://neondb_owner:npg_fQSbtco3AWK6@ep-long-wave-aoay8uwc-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"),
  
  // JWT Configuration
  JWT_SECRET: z.string().default("your-super-secret-access-token-key-should-be-at-least-32-characters"),
  JWT_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().default("your-super-secret-refresh-token-key-should-be-at-least-32-characters"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),
  
  // CORS
  CORS_ORIGIN: z.string().default("*"),
  
  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100"),
  
  // Swagger Documentation
  SWAGGER_ENABLED: z.string().default("true"),
});

// Load DB_URL to DATABASE_URL if DATABASE_URL is not set
if (process.env.DB_URL && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DB_URL;
}

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment validation failed:");
  Object.entries(parsed.error.flatten().fieldErrors).forEach(([key, errors]) => {
    console.error(`  ${key}: ${errors?.join(", ")}`);
  });
  process.exit(1);
}

export const config = {
  NODE_ENV: parsed.data.NODE_ENV,
  PORT: parseInt(parsed.data.PORT, 10),
  API_VERSION: parsed.data.API_VERSION,
  isDevelopment: parsed.data.NODE_ENV === "development",
  isProduction: parsed.data.NODE_ENV === "production",
  isStaging: parsed.data.NODE_ENV === "staging",
  
  DATABASE_URL: parsed.data.DATABASE_URL,
  
  JWT: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRY,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRY,
  },
  
  CORS_ORIGIN: parsed.data.CORS_ORIGIN,
  LOG_LEVEL: parsed.data.LOG_LEVEL,
  
  RATE_LIMIT: {
    windowMs: parseInt(parsed.data.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(parsed.data.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  
  SWAGGER_ENABLED: parsed.data.SWAGGER_ENABLED === "true",
};

export default config;
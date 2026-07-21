import winston from "winston";
import config from "../config/env.js";

// Custom format for dev console logging
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let msg = `[${timestamp}] ${level}: ${message}`;
    if (stack) msg += `\n❌ Stack: ${stack}`;
    if (Object.keys(meta).length > 0 && !stack) {
      msg += ` | Meta: ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Production-ready JSON format
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: config.NODE_ENV === "production" ? prodFormat : devFormat,
  defaultMeta: { service: "sfa-backend" },
  transports: [
    new winston.transports.Console({
      silent: config.NODE_ENV === "test",
    }),
  ],
});

export default logger;

import { PrismaClient } from '../../generated/prisma/index.js';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Configure WebSocket engine for Neon serverless driver to run in Node.js environment
neonConfig.webSocketConstructor = ws;

let prismaInstance;

/**
 * Get Prisma client instance (singleton pattern)
 * Ensures only one database connection across the application
 */
export const getPrismaClient = () => {
  if (prismaInstance) {
    return prismaInstance;
  }

  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

  prismaInstance = new PrismaClient({
    adapter,
    errorFormat: 'pretty',
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  // Handle disconnection gracefully
  process.on('SIGINT', async () => {
    await prismaInstance.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await prismaInstance.$disconnect();
    process.exit(0);
  });

  return prismaInstance;
};

export const prisma = getPrismaClient();

export default prisma;

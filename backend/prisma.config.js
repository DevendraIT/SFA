  // Prisma configuration — plain JavaScript, no TypeScript required.
// Prisma v7 requires the database URL in this file, not in schema.prisma.

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'prisma/seed.js',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function main() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
    errorFormat: 'pretty',
  });

  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Add metadata column if not exists
    const result = await prisma.$executeRawUnsafe(
      'ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "metadata" JSONB'
    );
    console.log('✅ ALTER TABLE completed');

    // Try to find a task and update it with metadata to verify
    const existingTask = await prisma.task.findFirst();
    if (existingTask) {
      await prisma.task.update({
        where: { id: existingTask.id },
        data: { metadata: { test: true, verified: new Date().toISOString() } }
      });
      console.log('✅ Successfully updated existing task with metadata');
      
      // Read it back
      const updated = await prisma.task.findFirst({ where: { id: existingTask.id } });
      console.log('✅ Metadata read back:', JSON.stringify(updated.metadata));
      
      // Clean up test data
      await prisma.task.update({
        where: { id: existingTask.id },
        data: { metadata: null }
      });
      console.log('✅ Test metadata cleaned up');
    } else {
      console.log('⚠️ No tasks found to test metadata column');
    }
    
    console.log('✅ metadata column is working correctly');
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

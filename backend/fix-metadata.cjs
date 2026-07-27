// Fix: Add metadata column to Task table if missing
const { PrismaClient } = require('./generated/prisma/client.js');

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    // Try to add the column (IF NOT EXISTS is idempotent)
    await prisma.$executeRawUnsafe('ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "metadata" JSONB');
    console.log('✅ Column "metadata" added/verified on Task table');
    
    // Verify the column now exists
    const result = await prisma.$queryRawUnsafe(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'Task' AND column_name = 'metadata'`
    );
    console.log('✅ Verification:', result.length > 0 ? 'Column exists' : 'Column still missing');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();


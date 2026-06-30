import 'dotenv/config';
import prisma from '../src/config/database.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      isActive: true,
    },
  });

  console.log(`🏢 Organization created: ${org.name} (${org.slug})`);

  // 2. Create Administrator Role
  const adminRole = await prisma.role.upsert({
    where: {
      organizationId_name: {
        organizationId: org.id,
        name: 'Administrator',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: 'Administrator',
      description: 'System Administrator with full access',
      isSystem: true,
    },
  });

  console.log(`👑 Role created: ${adminRole.name}`);

  // 3. Create Default Permissions
  const permissionsData = [
    { name: 'Read Users', slug: 'read:users', moduleName: 'users' },
    { name: 'Write Users', slug: 'write:users', moduleName: 'users' },
    { name: 'Manage Sessions', slug: 'manage:sessions', moduleName: 'auth' },
    { name: 'Read Organization', slug: 'read:organization', moduleName: 'organization' },
    { name: 'Update Organization', slug: 'update:organization', moduleName: 'organization' },
  ];

  for (const permData of permissionsData) {
    const permission = await prisma.permission.upsert({
      where: { slug: permData.slug },
      update: {},
      create: permData,
    });

    // Link permission to Admin role
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('🔒 Permissions seeded and mapped to Administrator');

  // 4. Create Admin User
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: org.id,
        email: 'admin@acme-corp.com',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@acme-corp.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`👤 Admin User created: ${user.email}`);

  // 5. Map User to Admin Role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  // 6. Create Initial Password History record to bypass 90-day expiry check on login
  await prisma.passwordHistory.create({
    data: {
      userId: user.id,
      passwordHash,
    },
  });

  console.log('🔑 Password history seeded.');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

#!/usr/bin/env node
/**
 * Quick Seed Script - Creates default admin user and permissions
 * Run: node quick-seed.js
 */

import 'dotenv/config';
import { prisma } from './src/config/database.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting quick seed...');

  try {
    // 1. Get or create Organization
    let org = await prisma.organization.findFirst({ where: { slug: 'acme-corp' } });
    
    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: 'Acme Corporation',
          slug: 'acme-corp',
          isActive: true,
        },
      });
      console.log(`✅ Organization created: ${org.name}`);
    } else {
      console.log(`✅ Organization found: ${org.name}`);
    }

    // 2. Get or create Admin Role
    let adminRole = await prisma.role.findFirst({
      where: { organizationId: org.id, name: 'Administrator' },
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          organizationId: org.id,
          name: 'Administrator',
          description: 'System Administrator with full access',
          isSystem: true,
        },
      });
      console.log(`✅ Role created: ${adminRole.name}`);
    } else {
      console.log(`✅ Role found: ${adminRole.name}`);
    }

    // 3. Create/Update All Permissions
    const permissionsData = [
      // Organization
      { name: 'org:read', slug: 'organization:read', moduleName: 'organization' },
      { name: 'org:create', slug: 'organization:create', moduleName: 'organization' },
      { name: 'org:update', slug: 'organization:update', moduleName: 'organization' },
      { name: 'org:delete', slug: 'organization:delete', moduleName: 'organization' },

      // Companies
      { name: 'company:read', slug: 'company:read', moduleName: 'organization' },
      { name: 'company:create', slug: 'company:create', moduleName: 'organization' },
      { name: 'company:update', slug: 'company:update', moduleName: 'organization' },
      { name: 'company:delete', slug: 'company:delete', moduleName: 'organization' },

      // Branches
      { name: 'branch:read', slug: 'branch:read', moduleName: 'organization' },
      { name: 'branch:create', slug: 'branch:create', moduleName: 'organization' },
      { name: 'branch:update', slug: 'branch:update', moduleName: 'organization' },
      { name: 'branch:delete', slug: 'branch:delete', moduleName: 'organization' },

      // Departments
      { name: 'dept:read', slug: 'department:read', moduleName: 'organization' },
      { name: 'dept:create', slug: 'department:create', moduleName: 'organization' },
      { name: 'dept:update', slug: 'department:update', moduleName: 'organization' },
      { name: 'dept:delete', slug: 'department:delete', moduleName: 'organization' },

      // Territories
      { name: 'territory:read', slug: 'territory:read', moduleName: 'organization' },
      { name: 'territory:create', slug: 'territory:create', moduleName: 'organization' },
      { name: 'territory:update', slug: 'territory:update', moduleName: 'organization' },
      { name: 'territory:delete', slug: 'territory:delete', moduleName: 'organization' },

      // Users
      { name: 'user:read', slug: 'read:users', moduleName: 'users' },
      { name: 'user:create', slug: 'create:users', moduleName: 'users' },
      { name: 'user:update', slug: 'update:users', moduleName: 'users' },
      { name: 'user:delete', slug: 'delete:users', moduleName: 'users' },

      // Leads
      { name: 'lead:read', slug: 'lead:read', moduleName: 'lead-management' },
      { name: 'lead:create', slug: 'lead:create', moduleName: 'lead-management' },
      { name: 'lead:update', slug: 'lead:update', moduleName: 'lead-management' },
      { name: 'lead:delete', slug: 'lead:delete', moduleName: 'lead-management' },

      // Orders
      { name: 'order:read', slug: 'order:read', moduleName: 'sales-order' },
      { name: 'order:create', slug: 'order:create', moduleName: 'sales-order' },
      { name: 'order:update', slug: 'order:update', moduleName: 'sales-order' },
      { name: 'order:approve', slug: 'order:approve', moduleName: 'sales-order' },

      // Field Force
      { name: 'attendance:write', slug: 'attendance:write', moduleName: 'field-force' },
      { name: 'visit:write', slug: 'visit:write', moduleName: 'field-force' },
      { name: 'expense:write', slug: 'expense:write', moduleName: 'field-force' },
    ];

    let permCount = 0;
    for (const permData of permissionsData) {
      let permission = await prisma.permission.upsert({
        where: { slug: permData.slug },
        update: {},
        create: permData,
      });
      permCount++;

      // Ensure admin role has this permission
      const rolePermExists = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id },
        },
      });

      if (!rolePermExists) {
        await prisma.rolePermission.create({
          data: { roleId: adminRole.id, permissionId: permission.id },
        });
      }
    }

    console.log(`✅ Permissions: All mapped to Admin role`);

    // 4. Create Admin User
    const email = 'admin@acme-corp.com';
    const passwordHash = await bcrypt.hash('Password123!', 10);

    let user = await prisma.user.findUnique({
      where: { organizationId_email: { organizationId: org.id, email } },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          organizationId: org.id,
          email,
          passwordHash,
          firstName: 'Admin',
          lastName: 'User',
          isActive: true,
          emailVerifiedAt: new Date(),
        },
      });
      console.log(`✅ Admin user created: ${user.email}`);
    } else {
      console.log(`✅ Admin user found: ${user.email}`);
    }

    // 5. Assign Admin Role to User
    const userRoleExists = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    });

    if (!userRoleExists) {
      await prisma.userRole.create({
        data: { userId: user.id, roleId: adminRole.id },
      });
      console.log(`✅ Admin role assigned to user`);
    } else {
      console.log(`✅ Admin role already assigned`);
    }

    // 6. Create password history
    const historyExists = await prisma.passwordHistory.findFirst({
      where: { userId: user.id },
    });

    if (!historyExists) {
      await prisma.passwordHistory.create({
        data: { userId: user.id, passwordHash },
      });
    }

    console.log('\n✨ Seed completed!');
    console.log(`\n🔐 Login with:\n   Email: ${email}\n   Password: Password123!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

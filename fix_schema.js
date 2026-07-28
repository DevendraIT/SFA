const fs = require('fs');
const path = 'backend/prisma/schema.prisma';
let c = fs.readFileSync(path, 'utf-8');

// Add @@index([status]) after @@index([assignedToId])
c = c.replace(
  '  @@index([assignedToId])\n\n}\n\nenum TaskPriority',
  '  @@index([assignedToId])\n  @@index([status])\n}\n\nenum TaskStatus {\n  PENDING\n  ACCEPTED\n  IN_PROGRESS\n  ARRIVED\n  CHECKED_IN\n  DELIVERY_IN_PROGRESS\n  CHECKED_OUT\n  COMPLETED\n  CANCELLED\n}\n\nenum TaskPriority'
);

fs.writeFileSync(path, c, 'utf-8');
console.log('Schema fixed successfully');

const fs = require('fs');
let c = fs.readFileSync('frontend/src/hooks/useFieldForce.js', 'utf-8');

// Fix the corrupted safeExtract function
c = c.replace(
  '  return [];\n}\n\n\n  if (!res?.value) return null;',
  '  return [];\n}\n\nfunction safeExtract(res) {\n  if (!res?.value) return null;'
);

fs.writeFileSync('frontend/src/hooks/useFieldForce.js', c, 'utf-8');
console.log('Hook fixed successfully');

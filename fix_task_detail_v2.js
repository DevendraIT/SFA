const fs = require('fs');
const path = 'frontend/src/pages/team/TaskDetail.jsx';
let c = fs.readFileSync(path, 'utf-8');
let count = 0;

// Fix 1: Add missing </div> to close the header flex div before the bg-white card
const f1 = '</div>\n\n      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">';
const r1 = '</div>\n      </div>\n\n      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">';
if (c.includes(f1)) {
  c = c.replace(f1, r1);
  count++;
  console.log('Fix 1: Header div closed');
} else {
  console.log('Fix 1: Pattern not found - checking...');
  // Check what's actually there
  const idx = c.indexOf('<div className="bg-white rounded-2xl');
  if (idx > -1) {
    console.log('Found bg-white card at index', idx);
    console.log('Context:', c.substring(idx-50, idx+50));
  }
}

// Fix 2: Close the inner div and card div before the grid
const f2 = '</div>\n      </div>\n\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">';
const r2 = '</div>\n        </div>\n      </div>\n\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">';
if (c.includes(f2)) {
  c = c.replace(f2, r2);
  count++;
  console.log('Fix 2: Card div closed');
} else {
  console.log('Fix 2: Pattern not found');
  const idx = c.indexOf('grid grid-cols-1 lg:grid-cols-3');
  if (idx > -1) {
    console.log('Found grid at index', idx);
    console.log('Context:', c.substring(idx-80, idx+20));
  }
}

// Fix 3: Close the inner div in assigned-to card
const f3 = '                    </div>\n              </div>\n              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">\n                <p className="text-xs text-slate-500 font-medium mb-1">Assigned By</p>';
const r3 = '                    </div>\n                  </div>\n              </div>\n              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">\n                <p className="text-xs text-slate-500 font-medium mb-1">Assigned By</p>';
if (c.includes(f3)) {
  c = c.replace(f3, r3);
  count++;
  console.log('Fix 3: Inner div closed');
} else {
  console.log('Fix 3: Pattern not found');
  const idx = c.indexOf('Assigned By');
  if (idx > -1) {
    console.log('Found "Assigned By" at index', idx);
    console.log('Context:', c.substring(idx-120, idx+20));
  }
}

// Fix 4: Close the grid div before completedAt
const f4 = '              </div>\n            {task.completedAt && (';
const r4 = '              </div>\n            </div>\n            {task.completedAt && (';
if (c.includes(f4)) {
  c = c.replace(f4, r4);
  count++;
  console.log('Fix 4: Grid closed before completedAt');
} else {
  console.log('Fix 4: Pattern not found');
}

// Fix 5: Close flex-1 div in instructions section
const f5 = '<p className="text-sm text-slate-600 mt-1">{inst.text}</p>\n                    </div>\n                ))}\n              </div>\n            </Section>';
const r5 = '<p className="text-sm text-slate-600 mt-1">{inst.text}</p>\n                    </div>\n                  </div>\n                ))}\n              </div>\n            </Section>';
if (c.includes(f5)) {
  c = c.replace(f5, r5);
  count++;
  console.log('Fix 5: Instructions section fixed');
} else {
  console.log('Fix 5: Pattern not found');
}

// Fix 6: Close Reference section and end structure
const f6 = '              </div>\n          </Section>\n        </div>\n    </motion.div>\n  );\n}';
const r6 = '              </div>\n            </div>\n          </Section>\n        </div>\n      </div>\n    </motion.div>\n  );\n}';
if (c.includes(f6)) {
  c = c.replace(f6, r6);
  count++;
  console.log('Fix 6: Reference section closed properly');
} else {
  console.log('Fix 6: Pattern not found');
  const idx = c.indexOf('</motion.div>');
  if (idx > -1) {
    console.log('Found </motion.div> at index', idx);
    console.log('Context:', c.substring(idx-120, idx+20));
  }
}

console.log('Total fixes applied:', count);
fs.writeFileSync(path, c, 'utf-8');
console.log('File written successfully');

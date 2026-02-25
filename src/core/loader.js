const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function loadFiles(dir, filterFn) {
  if (!fs.existsSync(dir)) return [];
  return walk(dir).filter(filterFn);
}

module.exports = { walk, loadFiles };

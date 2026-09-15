const fs = require('fs');
const path = require('path');

function cleanBOM(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === 'node_modules' || item.name === '.git' || item.name === '.next') continue;
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      cleanBOM(fullPath);
    } else if (item.isFile()) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Stripped BOM from:', fullPath);
      }
    }
  }
}

cleanBOM('.');
console.log('BOM cleanup complete.');

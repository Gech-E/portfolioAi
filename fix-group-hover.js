const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.module.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('group-hover:opacity-100')) {
        let newContent = content.replace(/group-hover:opacity-100 /g, '').replace(/group-hover:opacity-100;/g, ';');
        newContent += '\n\n.card:hover .dragHandle {\n  opacity: 1;\n}\n';
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed group-hover in', fullPath);
      }
    }
  }
}

processDir(path.resolve('c:/Users/Gech/Desktop/PortfolioAI/apps/web/src/components/editor'));

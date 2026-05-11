const fs = require('fs');
const path = require('path');

const globalsPath = path.resolve('c:/Users/Gech/Desktop/PortfolioAI/apps/web/src/app/globals.css');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.module.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('@reference')) {
        let relativePath = path.relative(path.dirname(fullPath), globalsPath).replace(/\\/g, '/');
        const newContent = `@reference "${relativePath}";\n\n` + content;
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(path.resolve('c:/Users/Gech/Desktop/PortfolioAI/apps/web/src/components/editor'));
processDir(path.resolve('c:/Users/Gech/Desktop/PortfolioAI/apps/web/src/app/(dashboard)/dashboard'));

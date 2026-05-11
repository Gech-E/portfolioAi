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
      if (content.includes(' group ')) {
        let newContent = content.replace(/ group /g, ' ');
        fs.writeFileSync(fullPath, newContent);
        console.log('Removed group from', fullPath);
      }
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('className={styles.card}')) {
        let newContent = content.replace(/className=\{styles\.card\}/g, 'className={`${styles.card} group`}');
        fs.writeFileSync(fullPath, newContent);
        console.log('Added group to TSX', fullPath);
      }
    }
  }
}

processDir(path.resolve('c:/Users/Gech/Desktop/PortfolioAI/apps/web/src/components/editor'));

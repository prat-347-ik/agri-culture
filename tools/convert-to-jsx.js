/* Simple converter:
   - Walks src/pages and src/components
   - For each .js file creates a .jsx copy (if not present)
   - Replaces the original .js with a proxy that imports and re-exports the .jsx
   NOTE: Review changes / run in a branch; this is a helpful automation but keep backups.
*/
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'Frontend', 'client', 'src');
const targets = [path.join(root, 'pages'), path.join(root, 'components')];

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) walk(res, cb);
    else cb(res);
  });
}

function isJSFile(file) {
  return file.endsWith('.js');
}

targets.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  walk(dir, file => {
    if (!isJSFile(file)) return;
    // skip files that already are small proxies to .jsx
    const content = fs.readFileSync(file, 'utf8');
    const basename = path.basename(file, '.js');
    const dirName = path.dirname(file);
    const jsxPath = path.join(dirName, basename + '.jsx');

    const alreadyProxy = /import\s+\w+\s+from\s+['"].\/.*\.jsx['"];?\s*export\s+default\s+\w+;?/s.test(content);
    if (alreadyProxy) {
      console.log('Skipping proxy already present:', file);
      return;
    }

    // create .jsx if it doesn't exist
    if (!fs.existsSync(jsxPath)) {
      fs.writeFileSync(jsxPath, content, 'utf8');
      console.log('Created .jsx:', jsxPath);
    } else {
      console.log('.jsx already exists, skipping creation:', jsxPath);
    }

    // overwrite original .js with a proxy
    const relative = './' + basename + '.jsx';
    const proxy = `// Auto-generated proxy to ${basename}.jsx\nimport Component from '${relative}';\nexport default Component;\n`;
    fs.writeFileSync(file, proxy, 'utf8');
    console.log('Replaced .js with proxy:', file);
  });
});

console.log('Conversion complete. Review and commit changes.');

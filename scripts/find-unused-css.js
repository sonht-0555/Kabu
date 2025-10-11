const fs = require('fs');
const path = require('path');

function walk(dir, exts = ['.js', '.ts', '.jsx', '.tsx', '.html']) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist' || e.name === 'build') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full, exts));
    else if (exts.includes(path.extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractClassesFromCSS(cssText) {
  const set = new Set();
  // match selectors before '{' and extract .className occurrences
  const selectorRegex = /([^\{\}]+)\{/g;
  let m;
  while ((m = selectorRegex.exec(cssText)) !== null) {
    const sel = m[1];
    const classRegex = /\.([a-zA-Z0-9_-]+)/g;
    let c;
    while ((c = classRegex.exec(sel)) !== null) set.add(c[1]);
  }
  return Array.from(set).sort();
}

function fileContainsClass(fileText, cls) {
  const patterns = [
    new RegExp(`class\\s*=\\s*["'][^"']*\\b${escapeReg(cls)}\\b[^"']*["']`, 'i'),
    new RegExp(`\\.classList\\.(?:add|remove|toggle)\\s*\\(\\s*['\"]${escapeReg(cls)}['\"]\\s*\\)`, 'i'),
    new RegExp(`querySelector(All)?\\s*\\(\\s*['\"][^'\"]*\\.${escapeReg(cls)}[^'\"]*['\"]\\s*\\)`, 'i'),
    new RegExp(`\\.${escapeReg(cls)}\\b`, 'i'),
    new RegExp(`['\"]${escapeReg(cls)}['\"]`, 'i')
  ];
  return patterns.some(rx => rx.test(fileText));
}

function removeRulesContainingClasses(cssText, unusedClasses) {
  // naive: remove any selector group that references any unused class
  const blocks = cssText.split('}');
  const kept = [];
  for (let block of blocks) {
    if (!block.trim()) continue;
    const parts = block.split('{');
    const selectorPart = parts[0] || '';
    const body = parts.slice(1).join('{');
    let keep = true;
    for (const cls of unusedClasses) {
      const rx = new RegExp(`(^|[^a-zA-Z0-9_-])\\.${escapeReg(cls)}([\\s\\.,:#\\[]|$)`);
      if (rx.test(selectorPart)) { keep = false; break; }
    }
    if (keep) kept.push(selectorPart + (body ? '{' + body + '}' : '}'));
  }
  return kept.join('\n\n');
}

/* ----- main ----- */
const args = process.argv.slice(2);
const cssPathArgIndex = args.indexOf('--css');
const cssPath = cssPathArgIndex !== -1 ? args[cssPathArgIndex + 1] : 'src/css/main.css';
const root = process.cwd();
const removeFlag = args.includes('--remove');

if (!fs.existsSync(cssPath)) {
  console.error('CSS file not found:', cssPath);
  process.exit(1);
}

const cssText = fs.readFileSync(cssPath, 'utf8');
const classes = extractClassesFromCSS(cssText);
console.log(`Found ${classes.length} classes in ${cssPath}`);

const files = walk(root).filter(f => !f.includes('/scripts/'));
console.log(`Scanning ${files.length} .js/.html files under ${root} ...`);

const fileContents = files.map(f => ({ path: f, text: fs.readFileSync(f, 'utf8') }));

const unused = [];
for (const cls of classes) {
  let used = false;
  for (const f of fileContents) {
    if (fileContainsClass(f.text, cls)) { used = true; break; }
  }
  if (!used) unused.push(cls);
}

if (unused.length === 0) {
  console.log('No unused classes found.');
  process.exit(0);
}

console.log('\nUnused classes:');
unused.forEach(c => console.log(' -', c));

if (removeFlag) {
  const backup = cssPath + '.bak.' + Date.now();
  fs.copyFileSync(cssPath, backup);
  const cleaned = removeRulesContainingClasses(cssText, unused);
  fs.writeFileSync(cssPath, cleaned, 'utf8');
  console.log(`\nRemoved rules referencing unused classes. Backup saved to ${backup}`);
} else {
  console.log('\nRun with --remove to delete their rules from the CSS file (a backup will be created).');
}

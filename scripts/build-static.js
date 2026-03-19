const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function copyPublicToDist() {
  fs.cpSync(publicDir, distDir, { recursive: true, force: true });
}

function stripSocketIoScriptTag(html) {
  return html.replace(/\s*<script src="\/socket\.io\/socket\.io\.js"><\/script>\s*/g, '\n');
}

function patchDuelHtml() {
  const duelHtmlPath = path.join(distDir, 'duel.html');
  if (!fs.existsSync(duelHtmlPath)) return;
  const duelHtml = fs.readFileSync(duelHtmlPath, 'utf8');
  fs.writeFileSync(duelHtmlPath, stripSocketIoScriptTag(duelHtml), 'utf8');
}

function buildRootIndexFromDuel() {
  const duelHtmlPath = path.join(distDir, 'duel.html');
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(duelHtmlPath)) return;
  const duelHtml = fs.readFileSync(duelHtmlPath, 'utf8');
  fs.writeFileSync(indexHtmlPath, duelHtml, 'utf8');
}

function writeBuildInfo() {
  const infoPath = path.join(distDir, 'build-info.json');
  const info = {
    builtAt: new Date().toISOString(),
    mode: 'static',
    entry: 'index.html',
    notes: [
      'socket.io client script is removed for static hosting',
      'online mode requires a realtime backend and is not available in static-only hosting',
    ],
  };
  fs.writeFileSync(infoPath, `${JSON.stringify(info, null, 2)}\n`, 'utf8');
}

function countDistFiles() {
  let count = 0;

  function walk(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        count += 1;
      }
    });
  }

  walk(distDir);
  return count;
}

function main() {
  if (!fs.existsSync(publicDir)) {
    console.error('public directory not found.');
    process.exit(1);
  }

  cleanDir(distDir);
  ensureDir(distDir);
  copyPublicToDist();
  patchDuelHtml();
  buildRootIndexFromDuel();
  writeBuildInfo();

  const files = countDistFiles();
  console.log(`Static build complete: ${distDir}`);
  console.log(`Files: ${files}`);
}

main();

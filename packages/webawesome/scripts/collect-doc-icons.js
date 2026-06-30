#!/usr/bin/env node
//
// Scans the docs (and components' internal default-library icons) for every
// `<wa-icon>` that resolves against the *default* icon library, maps each
// (family, variant) to its Font Awesome folder, and writes the sorted list of
// `<folder>/<name>.svg` paths to icons.json.
//
// icons.json is the input for `npm run icons`, which downloads/copies the
// matching SVGs from Font Awesome Free into docs/assets/icons.
//
// Usage: node scripts/collect-doc-icons.js
//
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS = join(ROOT, 'docs');
const COMPONENTS = join(ROOT, 'src/components');
const OUT = join(ROOT, 'icons.json');

// Font Awesome Free ships only these folders. Everything else (regular is
// largely Pro, plus light/thin/duotone/sharp/jelly/…) is Pro/Pro+. We still
// record the requested path; `npm run icons --fallback solid` fills the gap
// where a Free solid equivalent exists.
const FREE_FOLDERS = new Set(['solid', 'regular', 'brands']);

// Mirror of getIconFolder() from src/components/icon/library.default.ts
function getIconFolder(_name, family, variant) {
  let folder = 'solid';
  if (family === 'chisel') folder = 'chisel-regular';
  if (family === 'etch') folder = 'etch-solid';
  if (family === 'graphite') folder = 'graphite-thin';
  if (family === 'jelly') {
    folder = 'jelly-regular';
    if (variant === 'duo-regular') folder = 'jelly-duo-regular';
    if (variant === 'fill-regular') folder = 'jelly-fill-regular';
  }
  if (family === 'jelly-duo') folder = 'jelly-duo-regular';
  if (family === 'jelly-fill') folder = 'jelly-fill-regular';
  if (family === 'notdog') {
    if (variant === 'solid') folder = 'notdog-solid';
    if (variant === 'duo-solid') folder = 'notdog-duo-solid';
  }
  if (family === 'notdog-duo') folder = 'notdog-duo-solid';
  if (family === 'slab') {
    if (variant === 'solid' || variant === 'regular') folder = 'slab-regular';
    if (variant === 'press-regular') folder = 'slab-press-regular';
  }
  if (family === 'slab-press') folder = 'slab-press-regular';
  if (family === 'thumbprint') folder = 'thumbprint-light';
  if (family === 'utility') folder = 'utility-semibold';
  if (family === 'utility-duo') folder = 'utility-duo-semibold';
  if (family === 'utility-fill') folder = 'utility-fill-semibold';
  if (family === 'whiteboard') folder = 'whiteboard-semibold';
  if (family === 'classic') {
    if (variant === 'thin') folder = 'thin';
    if (variant === 'light') folder = 'light';
    if (variant === 'regular') folder = 'regular';
    if (variant === 'solid') folder = 'solid';
  }
  if (family === 'duotone') {
    if (variant === 'thin') folder = 'duotone-thin';
    if (variant === 'light') folder = 'duotone-light';
    if (variant === 'regular') folder = 'duotone-regular';
    if (variant === 'solid') folder = 'duotone';
  }
  if (family === 'sharp') {
    if (variant === 'thin') folder = 'sharp-thin';
    if (variant === 'light') folder = 'sharp-light';
    if (variant === 'regular') folder = 'sharp-regular';
    if (variant === 'solid') folder = 'sharp-solid';
  }
  if (family === 'sharp-duotone') {
    if (variant === 'thin') folder = 'sharp-duotone-thin';
    if (variant === 'light') folder = 'sharp-duotone-light';
    if (variant === 'regular') folder = 'sharp-duotone-regular';
    if (variant === 'solid') folder = 'sharp-duotone-solid';
  }
  if (family === 'brands') folder = 'brands';
  return folder;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`));
  return m ? m[1] : undefined;
}

function collectFiles(dir, exts, skipDirs = new Set()) {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      if (skipDirs.has(e)) continue;
      const p = join(d, e);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (exts.includes(extname(p))) out.push(p);
    }
  })(dir);
  return out;
}

// componentCategories.json drives the one dynamic icon (variant=regular)
const catIcons = JSON.parse(readFileSync(join(DOCS, '_data/componentCategories.json'), 'utf8')).map(c => c.icon);

const wanted = new Set();
const pro = new Set();
const dynamic = [];

function add(folder, name) {
  const key = `${folder}/${name}.svg`;
  if (FREE_FOLDERS.has(folder)) wanted.add(key);
  else pro.add(key);
}

function scanTag(tag) {
  const library = attr(tag, 'library');
  if (library && library !== 'default') return; // custom library, handled elsewhere
  if (attr(tag, 'src')) return; // explicit SVG url, not a library icon
  const name = attr(tag, 'name');
  if (!name) return;
  const family = attr(tag, 'family') || 'classic';
  const variant = attr(tag, 'variant') || 'solid';

  if (name.includes('{{')) {
    if (name.includes('cat.icon')) for (const ic of catIcons) add(getIconFolder(ic, family, variant), ic);
    else dynamic.push(tag.slice(0, 80));
    return;
  }
  if (/[$`{}]/.test(name) || !/^[a-z0-9-]+$/.test(name)) {
    dynamic.push(tag.slice(0, 80)); // JS template literal / interpolated
    return;
  }
  add(getIconFolder(name, family, variant), name);
}

const tagRe = /<wa-icon\b[\s\S]*?>/g;
const docFiles = collectFiles(DOCS, ['.md', '.njk', '.html'], new Set(['_site', 'node_modules', 'assets']));
const componentFiles = collectFiles(COMPONENTS, ['.ts']).filter(f => !f.endsWith('.test.ts'));

let scanned = 0;
for (const file of [...docFiles, ...componentFiles]) {
  const text = readFileSync(file, 'utf8');
  let m;
  while ((m = tagRe.exec(text))) {
    // Components keep their own internal icons on the `system` library; only
    // pick up default-library icons (no library attr / library="default").
    scanTag(m[0]);
  }
  scanned++;
}

const list = [...wanted].sort();
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : [];
const prevSet = new Set(prev);
const added = list.filter(x => !prevSet.has(x));
const removed = prev.filter(x => !wanted.has(x));

writeFileSync(OUT, JSON.stringify(list, null, 2) + '\n');

const byFolder = {};
for (const k of list) byFolder[k.split('/')[0]] = (byFolder[k.split('/')[0]] || 0) + 1;

console.log(`Scanned ${scanned} files (${docFiles.length} docs + ${componentFiles.length} components).`);
console.log(`icons.json: ${list.length} Free icons`, byFolder);
console.log(`Added: ${added.length}`, added.length ? '\n  ' + added.join('\n  ') : '');
if (removed.length) console.log(`Removed (no longer used): ${removed.length}\n  ` + removed.join('\n  '));
console.log(`Pro/Pro+ icons referenced (not written to icons.json): ${pro.size}`);
if (dynamic.length) console.log(`Skipped dynamic/interpolated names: ${dynamic.length}`);

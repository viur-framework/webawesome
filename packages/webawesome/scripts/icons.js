#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const PKG = '@fortawesome/fontawesome-free';
const ASSETS_DIR = path.resolve('assets');
const ICONS_JSON = path.resolve('icons.json');

function normalizeIconPath(p) {
  const clean = p.replace(/^\/+/, '').replace(/\\/g, '/');
  return clean.endsWith('.svg') ? clean : `${clean}.svg`;
}

function ensureDirSync(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function semverCmp(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

function pickLatest7x(versions) {
  const v7 = versions.filter(v => /^7\./.test(v));
  if (v7.length === 0) return null;
  return v7.sort(semverCmp).at(-1);
}

function haveTar() {
  const out = spawnSync('tar', ['--version'], {
    stdio: 'ignore',
  });
  return out.status === 0;
}

async function main() {
  let iconsJsonPath = ICONS_JSON;
  let assetsDir = ASSETS_DIR;

  // Parse args: positionals are [icons.json dir, assets dir]; `--fallback <folder>`
  // sources any requested icon that's missing from the given folder (e.g. `solid`).
  // Font Awesome's `regular`, `light`, `thin`, duotone, etc. are largely Pro, so a
  // Free-only build can fall back to `solid` to keep those icons rendering.
  const positionals = [];
  let fallbackFolder = null;
  const rawArgs = process.argv.slice(2);
  for (let i = 0; i < rawArgs.length; i++) {
    const a = rawArgs[i];
    if (a === '--fallback') fallbackFolder = rawArgs[++i];
    else if (a.startsWith('--fallback=')) fallbackFolder = a.slice('--fallback='.length);
    else positionals.push(a);
  }
  if (positionals[0]) {
    iconsJsonPath = path.join(path.resolve(positionals[0]), 'icons.json');
  }
  if (positionals[1]) {
    assetsDir = path.resolve(positionals[1]);
  }

  if (!fs.existsSync(iconsJsonPath)) {
    console.error(`icons.json not found: ${iconsJsonPath}`);
    process.exit(1);
  }
  let iconList;
  try {
    iconList = JSON.parse(await fsp.readFile(iconsJsonPath, 'utf8'));
  } catch (e) {
    console.error('error while reading icons.json :', e.message);
    process.exit(1);
  }
  if (!Array.isArray(iconList) || iconList.length === 0) {
    console.error('icons.json is empty');
    process.exit(1);
  }
  const wanted = new Set(iconList.map(normalizeIconPath));

  if (!haveTar()) {
    console.error('No tar command');
    process.exit(1);
  }

  console.log('getting latest fontawesome 7 version');
  const versionsJson = execSync(`npm view ${PKG} versions --json`, { encoding: 'utf8' });
  const versions = JSON.parse(versionsJson);
  const latest7 = pickLatest7x(versions);
  if (!latest7) {
    console.error('No matching version');
    process.exit(1);
  }
  console.log(`Version found: ${latest7}`);

  const tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'fa7-'));
  console.log(`extracting...`);
  const packOut = execSync(`npm pack ${PKG}@${latest7}`, { cwd: tmp, encoding: 'utf8' }).trim();
  const tgzPath = path.join(tmp, packOut);
  if (!fs.existsSync(tgzPath)) {
    console.error('error while extracting', tgzPath);
    process.exit(1);
  }

  execSync(`tar -xzf "${tgzPath}" -C "${tmp}"`, {
    stdio: 'ignore',
  });

  const pkgRoot = path.join(tmp, 'package');
  const svgsRoot = path.join(pkgRoot, 'svgs');
  if (!fs.existsSync(svgsRoot)) {
    console.error(`Error while searching svgs folder: ${svgsRoot}`);
    process.exit(1);
  }

  ensureDirSync(assetsDir);

  console.log('collecting icons...');
  let copied = 0;
  const missing = [];

  for (const rel of wanted) {
    const src = path.join(svgsRoot, rel);
    if (fs.existsSync(src)) {
      const dest = path.join(assetsDir, rel);
      ensureDirSync(path.dirname(dest));
      fs.copyFileSync(src, dest);
      copied++;
    } else {
      missing.push(rel);
    }
  }

  // Optional fallback: source still-missing icons from `--fallback` folder (e.g. solid).
  const fellBack = [];
  if (fallbackFolder && missing.length) {
    for (let i = missing.length - 1; i >= 0; i--) {
      const rel = missing[i];
      const name = path.basename(rel);
      const src = path.join(svgsRoot, fallbackFolder, name);
      if (fs.existsSync(src)) {
        const dest = path.join(assetsDir, rel);
        ensureDirSync(path.dirname(dest));
        fs.copyFileSync(src, dest);
        copied++;
        fellBack.push(rel);
        missing.splice(i, 1);
      }
    }
  }

  const manifest = {
    package: PKG,
    version: latest7,
    totalRequested: wanted.size,
    copied,
    fallbackFolder,
    fellBack,
    missing,
    timestamp: new Date().toISOString(),
  };
  await fsp.writeFile(path.join(assetsDir, 'fontawesome-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`✔ Finished: ${copied}/${wanted.size} Icons.`);
  if (fellBack.length) {
    console.log(`↳ ${fellBack.length} icon(s) fell back to "${fallbackFolder}".`);
  }
  if (missing.length) {
    console.warn(`Still missing (${missing.length}):`);
    for (const m of missing) console.warn('  -', m);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

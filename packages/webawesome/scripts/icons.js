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
  if (process.argv[2]) {
    iconsJsonPath = path.join(path.resolve(process.argv[2]), 'icons.json');
  }
  if (process.argv[3]) {
    assetsDir = path.resolve(process.argv[3]);
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

  const manifest = {
    package: PKG,
    version: latest7,
    totalRequested: wanted.size,
    copied,
    missing,
    timestamp: new Date().toISOString(),
  };
  await fsp.writeFile(path.join(assetsDir, 'fontawesome-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`✔ Finished: ${copied}/${wanted.size} Icons.`);
  if (missing.length) {
    for (const m of missing) console.warn('  -', m);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

// Input is the imagegen output directory. No API calls or photo retouching.
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/prepare-assets.cjs <imagegen-output-directory>');
const files = {
  'sable': 'exec-8e00647a-6d0b-4297-b568-1fa165cf2928.png',
  'sable-break': 'exec-94b4916d-8852-4745-9878-cc1959eb82c6.png',
};
if (process.argv[3]) files.package = process.argv[3];
(async () => {
  fs.mkdirSync('public/images/kiro', { recursive: true });
  const report = [];
  for (const [name, file] of Object.entries(files)) {
    const input = path.join(source, file);
    const output = `public/images/kiro/${name}.webp`;
    await sharp(input).resize({ width: 1254, height: 1254, fit: 'contain', background: '#00000000' }).webp({ quality: 86, alphaQuality: 100 }).toFile(output);
    await sharp(input).resize({ width: 768, height: 768, fit: 'contain', background: '#00000000' }).webp({ quality: 82, alphaQuality: 100 }).toFile(`public/images/kiro/${name}-mobile.webp`);
    const meta = await sharp(output).metadata();
    report.push({ file: output, width: meta.width, height: meta.height, alpha: meta.hasAlpha, bytes: fs.statSync(output).size });
  }
  console.log(JSON.stringify(report, null, 2));
  fs.writeFileSync('docs/ASSET_REPORT.json', JSON.stringify(report, null, 2));
})().catch(e => { console.error(e); process.exit(1); });

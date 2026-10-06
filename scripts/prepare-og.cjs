const sharp = require('sharp');
(async () => {
  const bg = Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#EF762C"/><text x="40" y="548" font-family="Arial,sans-serif" font-weight="900" font-size="350" letter-spacing="-25" fill="#382015">KIRO</text><text x="54" y="62" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#382015">BURNT CARAMEL SABLE</text><text x="54" y="595" font-family="Arial,sans-serif" font-size="12" fill="#382015">FICTIONAL BRAND / CONCEPT WEBSITE</text></svg>');
  const box = await sharp('public/images/kiro/package.webp').resize(630, 630).toBuffer();
  const cookie = await sharp('public/images/kiro/sable.webp').resize(365, 365).toBuffer();
  await sharp(bg).composite([{ input: box, left: 515, top: 0 }, { input: cookie, left: 820, top: 260 }]).webp({ quality: 84 }).toFile('public/images/kiro/og.webp');
  console.log('OG image: 1200x630');
})().catch(e => { console.error(e); process.exit(1); });

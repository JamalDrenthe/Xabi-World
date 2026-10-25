const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createIco(pngBuffers, sizes) {
  // Build a multi-image ICO binary
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + numImages * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 (ICO)
  header.writeUInt16LE(numImages, 4);

  const entries = [];
  for (let i = 0; i < numImages; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(size.w >= 256 ? 0 : size.w, 0);
    entry.writeUInt8(size.h >= 256 ? 0 : size.h, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // file offset
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function generateBrandAssets() {
  const publicDir = path.resolve(__dirname, '../public');
  const svgPath = path.join(publicDir, 'favicon.svg');
  const svgContent = fs.readFileSync(svgPath);

  console.log('🎨 LogoAnywhere: Genereren van complete Digital Brand Asset Pack voor Xabi World...');

  // 1. Render master high-resolution PNG (2048x2048)
  const masterPng = await sharp(svgContent, { density: 300 })
    .resize(2048, 2048, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 2. Favicon PNGs (16x16, 32x32, 48x48, 96x96)
  const png16 = await sharp(masterPng).resize(16, 16).png().toBuffer();
  const png32 = await sharp(masterPng).resize(32, 32).png().toBuffer();
  const png48 = await sharp(masterPng).resize(48, 48).png().toBuffer();
  const png96 = await sharp(masterPng).resize(96, 96).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), png96);
  console.log('  ✓ favicon-16x16.png, favicon-32x32.png, favicon-96x96.png');

  // 3. Multi-resolution favicon.ico (16, 32, 48)
  const icoBuffer = await createIco(
    [png16, png32, png48],
    [{ w: 16, h: 16 }, { w: 32, h: 32 }, { w: 48, h: 48 }]
  );
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('  ✓ favicon.ico (16x16, 32x32, 48x48)');

  // 4. Apple Touch Icon (180x180 with solid #0b1714 obsidian background)
  const appleTouchInner = await sharp(masterPng)
    .resize(140, 140, { fit: 'contain' })
    .png()
    .toBuffer();

  const appleTouch = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: '#0b1714',
    },
  })
    .composite([{ input: appleTouchInner, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
  console.log('  ✓ apple-touch-icon.png (180x180, solid #0b1714)');

  // 5. Android / PWA Icons (192x192 & 512x512)
  const pwa192Inner = await sharp(masterPng).resize(154, 154, { fit: 'contain' }).png().toBuffer();
  const pwa192 = await sharp({
    create: { width: 192, height: 192, channels: 4, background: '#0b1714' },
  })
    .composite([{ input: pwa192Inner, gravity: 'center' }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), pwa192);
  fs.writeFileSync(path.join(publicDir, 'web-app-manifest-192x192.png'), pwa192);

  const pwa512Inner = await sharp(masterPng).resize(410, 410, { fit: 'contain' }).png().toBuffer();
  const pwa512 = await sharp({
    create: { width: 512, height: 512, channels: 4, background: '#0b1714' },
  })
    .composite([{ input: pwa512Inner, gravity: 'center' }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), pwa512);
  fs.writeFileSync(path.join(publicDir, 'web-app-manifest-512x512.png'), pwa512);
  console.log('  ✓ android-chrome-192x192.png & android-chrome-512x512.png');

  // 6. Social Avatar (1000x1000, 20% safe-margin)
  const avatarInner = await sharp(masterPng).resize(720, 720, { fit: 'contain' }).png().toBuffer();
  const avatar = await sharp({
    create: { width: 1000, height: 1000, channels: 4, background: '#0b1714' },
  })
    .composite([{ input: avatarInner, gravity: 'center' }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'social-avatar.png'), avatar);
  console.log('  ✓ social-avatar.png (1000x1000)');

  // 7. Open Graph Image (1200x630 link preview for WhatsApp, LinkedIn, X, Slack)
  // High-end cinematic layout: obsidian emerald background with subtle radial glow,
  // 240px Xabi squircle logo mark on the left/center, bold typography "Xabi World" + tagline
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="og-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#142620"/>
        <stop offset="45%" stop-color="#0b1714"/>
        <stop offset="100%" stop-color="#040807"/>
      </linearGradient>

      <linearGradient id="og-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9fe870" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#2ead4b" stop-opacity="0"/>
      </linearGradient>

      <linearGradient id="lime-text" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="70%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#9fe870"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#og-bg)"/>

    <!-- Subtle Radial Aura -->
    <circle cx="600" cy="220" r="450" fill="url(#og-glow)" filter="blur(80px)"/>

    <!-- Geometric Grid lines hint -->
    <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
      <line x1="0" y1="157" x2="1200" y2="157"/>
      <line x1="0" y1="315" x2="1200" y2="315"/>
      <line x1="0" y1="472" x2="1200" y2="472"/>
      <line x1="300" y1="0" x2="300" y2="630"/>
      <line x1="600" y1="0" x2="600" y2="630"/>
      <line x1="900" y1="0" x2="900" y2="630"/>
    </g>

    <!-- Top Badge -->
    <g transform="translate(600, 110)">
      <rect x="-160" y="-18" width="320" height="36" rx="18" fill="rgba(159,232,112,0.12)" stroke="rgba(159,232,112,0.3)" stroke-width="1.5"/>
      <circle cx="-135" cy="0" r="4" fill="#9fe870"/>
      <text x="-120" y="5" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="#9fe870">QUANTUM INITIUM HOLDING</text>
    </g>

    <!-- Centered Logo Squircle -->
    <g transform="translate(600, 260) scale(0.38) translate(-256, -256)">
      ${svgContent.toString().replace(/<svg[^>]*>|<\/svg>/gi, '')}
    </g>

    <!-- Title & Brand Name -->
    <text x="600" y="425" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.5" fill="url(#lime-text)">
      Xabi World
    </text>

    <!-- Subtitle / Tagline -->
    <text x="600" y="475" text-anchor="middle" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#94a3b8" letter-spacing="-0.2">
      Financiële Helderheid &amp; Ambitie · Meer overzicht voor de volgende stap
    </text>

    <!-- Bottom URL and security pill -->
    <text x="600" y="555" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="#2ead4b" letter-spacing="1.5">
      XABI.WORLD · BANK-GRADE PRIVATE RAILS
    </text>
  </svg>
  `;

  const ogImage = await sharp(Buffer.from(ogSvg))
    .png({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogImage);
  console.log('  ✓ og-image.png (1200x630, safe zone centered)');

  // 8. Site Webmanifest
  const manifest = {
    name: "Xabi World",
    short_name: "Xabi",
    description: "Xabi World brengt financiële helderheid en ambitie samen in één rustige omgeving.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0b1714",
    theme_color: "#0b1714",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('  ✓ site.webmanifest bijgewerkt');

  console.log('\n✨ Alle brand assets succesvol gegenereerd!');
}

generateBrandAssets().catch((err) => {
  console.error('Fout bij genereren brand assets:', err);
  process.exit(1);
});

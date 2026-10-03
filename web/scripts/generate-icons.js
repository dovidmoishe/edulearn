const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const faviconPath = path.join(__dirname, '../src/app/favicon.ico');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(faviconPath)) {
  console.error('Favicon not found at:', faviconPath);
  process.exit(1);
}

async function generateIcons() {
  try {
    console.log('Reading favicon from:', faviconPath);
    const faviconBuffer = fs.readFileSync(faviconPath);

    console.log('Generating favicon-16x16.png...');
    await sharp(faviconBuffer)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    console.log('Generating favicon-32x32.png...');
    await sharp(faviconBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    console.log('Generating apple-touch-icon.png (180x180)...');
    await sharp(faviconBuffer)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    console.log('✅ All icons generated successfully!');
    console.log('Generated files:');
    console.log('  - public/favicon-16x16.png');
    console.log('  - public/favicon-32x32.png');
    console.log('  - public/apple-touch-icon.png');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();


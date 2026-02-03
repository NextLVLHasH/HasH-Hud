import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const sizes = [192, 384, 512];

async function generateIcons() {
  const sourceIcon = join(publicDir, 'icon.png');

  // Get original dimensions
  const metadata = await sharp(sourceIcon).metadata();
  console.log(`Original: ${metadata.width}x${metadata.height}`);

  for (const size of sizes) {
    // Create transparent canvas first
    const canvas = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).png().toBuffer();

    // Resize the icon maintaining aspect ratio
    const resizedIcon = await sharp(sourceIcon)
      .resize({
        width: size,
        height: size,
        fit: 'inside',
        withoutEnlargement: false
      })
      .png()
      .toBuffer();

    // Get resized dimensions for centering
    const resizedMeta = await sharp(resizedIcon).metadata();
    const left = Math.floor((size - resizedMeta.width) / 2);
    const top = Math.floor((size - resizedMeta.height) / 2);

    // Composite on transparent canvas
    await sharp(canvas)
      .composite([{
        input: resizedIcon,
        left: left,
        top: top
      }])
      .png()
      .toFile(join(publicDir, `icon-${size}x${size}.png`));

    console.log(`Created icon-${size}x${size}.png`);
  }

  // Create maskable icon with solid background
  const maskableSize = 512;
  const innerSize = Math.floor(maskableSize * 0.6);

  const maskableCanvas = await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 26, g: 26, b: 46, alpha: 255 }
    }
  }).png().toBuffer();

  const maskableIcon = await sharp(sourceIcon)
    .resize({
      width: innerSize,
      height: innerSize,
      fit: 'inside'
    })
    .png()
    .toBuffer();

  const maskableMeta = await sharp(maskableIcon).metadata();
  const maskableLeft = Math.floor((maskableSize - maskableMeta.width) / 2);
  const maskableTop = Math.floor((maskableSize - maskableMeta.height) / 2);

  await sharp(maskableCanvas)
    .composite([{
      input: maskableIcon,
      left: maskableLeft,
      top: maskableTop
    }])
    .png()
    .toFile(join(publicDir, 'icon-maskable-512x512.png'));

  console.log('Created icon-maskable-512x512.png');

  // Create apple touch icon
  const appleSize = 180;
  const appleCanvas = await sharp({
    create: {
      width: appleSize,
      height: appleSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).png().toBuffer();

  const appleIcon = await sharp(sourceIcon)
    .resize({
      width: appleSize,
      height: appleSize,
      fit: 'inside'
    })
    .png()
    .toBuffer();

  const appleMeta = await sharp(appleIcon).metadata();
  const appleLeft = Math.floor((appleSize - appleMeta.width) / 2);
  const appleTop = Math.floor((appleSize - appleMeta.height) / 2);

  await sharp(appleCanvas)
    .composite([{
      input: appleIcon,
      left: appleLeft,
      top: appleTop
    }])
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));

  console.log('Created apple-touch-icon.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);

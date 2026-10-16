import sharp from 'sharp';

const sizes = [192, 512];

for (const size of sizes) {
  await sharp('public/icons/icon.svg')
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}.png`);

  console.log(`Generated ${size}x${size}`);
}

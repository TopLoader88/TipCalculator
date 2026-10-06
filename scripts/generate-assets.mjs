import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const glyph = '<g fill="#146D4D"><circle cx="404" cy="404" r="78"/><circle cx="676" cy="676" r="78"/><rect x="506" y="310" width="68" height="460" rx="34" transform="rotate(38 540 540)"/></g>';
const image = (background = '') => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">${background}${glyph}</svg>`);
await mkdir('assets', { recursive: true });
await sharp(image('<rect width="1080" height="1080" fill="#E6F3EB"/>')).resize(1024, 1024).png().toFile('assets/tip-icon.png');
await sharp(image()).png().toFile('assets/tip-foreground.png');
await sharp(image('<rect width="1080" height="1080" rx="160" fill="#E6F3EB"/>')).resize(64, 64).png().toFile('assets/tip-favicon.png');
console.log('Generated app icon, Android foreground, and web favicon.');
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const assetsDir = path.resolve(publicDir, 'assets');
const sourceImage = path.resolve(assetsDir, 'yihung_transparent.webp');

// Favicon 尺寸配置
// Google 搜尋要求最小 48x48，建議提供 48 的倍數
const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon-48x48.png': 48,      // Google 搜尋最小要求
  'favicon-96x96.png': 96,
  'favicon-192x192.png': 192,   // Android Chrome
  'favicon-512x512.png': 512,   // PWA
  'apple-touch-icon.png': 180,  // iOS
};

async function generateFavicons() {
  console.log('🎨 開始生成 favicon...');
  console.log(`📂 來源圖片: ${sourceImage}`);

  // 確認來源圖片存在
  if (!fs.existsSync(sourceImage)) {
    console.error(`❌ 找不到來源圖片: ${sourceImage}`);
    process.exit(1);
  }

  // 生成各種尺寸的 PNG
  for (const [filename, size] of Object.entries(sizes)) {
    const outputPath = path.resolve(publicDir, filename);
    try {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ 已生成: ${filename} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ 生成 ${filename} 失敗:`, error);
    }
  }

  // 生成 favicon.ico（包含 16, 32, 48 尺寸）
  // ICO 格式需要特殊處理
  const icoSizes = [16, 32, 48];
  const icoBuffers: Buffer[] = [];

  for (const size of icoSizes) {
    const buffer = await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    icoBuffers.push(buffer);
  }

  // 使用 png-to-ico 生成 ICO
  try {
    const pngToIco = await import('png-to-ico');
    const icoBuffer = await pngToIco.default(icoBuffers);
    const icoPath = path.resolve(publicDir, 'favicon.ico');
    fs.writeFileSync(icoPath, icoBuffer);
    console.log(`✅ 已生成: favicon.ico (包含 ${icoSizes.join(', ')} 尺寸)`);
  } catch (error) {
    console.error('❌ 生成 favicon.ico 失敗:', error);
  }

  console.log('\n🎉 Favicon 生成完成！');
  console.log('\n📋 Google 搜尋結果 favicon 要求：');
  console.log('   - 最小尺寸: 48x48 像素 ✅');
  console.log('   - 建議尺寸: 48 的倍數 ✅');
  console.log('   - 格式: ICO, PNG, SVG ✅');
}

generateFavicons().catch(console.error);

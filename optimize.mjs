import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = path.join(process.cwd(), 'client', 'public', 'images');

async function optimizeImages(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                await optimizeImages(filePath);
            } else if (file.match(/\.(png|jpe?g)$/i)) {
                const originalExt = path.extname(file);
                const newFile = file.replace(originalExt, '.webp');
                const newFilePath = path.join(dir, newFile);

                console.log(`Optimizing: ${filePath} -> ${newFilePath}`);
                await sharp(filePath)
                    .webp({ quality: 80, effort: 6 })
                    .toFile(newFilePath);

                console.log(`Deleting original: ${filePath}`);
                fs.unlinkSync(filePath);
            }
        }
    } catch (err) {
        console.error('Error processing directory:', err);
    }
}

optimizeImages(directoryPath).then(() => {
    console.log('Image optimization complete.');
});

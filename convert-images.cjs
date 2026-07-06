const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const getFiles = (dir) => {
  const files = fs.readdirSync(dir);
  let fileList = [];
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = fileList.concat(getFiles(filePath));
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const convertImages = async () => {
  const allFiles = getFiles(publicDir);
  const imageFiles = allFiles.filter(file => 
    (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) &&
    !file.endsWith('.webp') // Don't convert already webp files
  );

  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (const file of imageFiles) {
    const stat = fs.statSync(file);
    if (stat.size > 500 * 1024) { // Only convert images larger than 500KB
      const originalSize = (stat.size / (1024 * 1024)).toFixed(2);
      totalOriginalSize += stat.size;
      
      const parsedPath = path.parse(file);
      const newFilePath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      
      try {
        console.log(`Converting ${path.basename(file)} (${originalSize} MB)...`);
        
        await sharp(file)
          .webp({ quality: 80, effort: 6 })
          .toFile(newFilePath);
          
        const newStat = fs.statSync(newFilePath);
        const newSize = (newStat.size / (1024 * 1024)).toFixed(2);
        totalNewSize += newStat.size;
        
        console.log(`  -> Saved as ${path.basename(newFilePath)} (${newSize} MB)`);
        
        // Delete original file to save repo space
        fs.unlinkSync(file);
        console.log(`  -> Deleted original file`);
      } catch (error) {
        console.error(`Error converting ${file}:`, error);
      }
    }
  }
  
  console.log('--- Summary ---');
  console.log(`Total original size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total new size: ${(totalNewSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Savings: ${((totalOriginalSize - totalNewSize) / (1024 * 1024)).toFixed(2)} MB`);
};

convertImages();

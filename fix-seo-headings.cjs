const fs = require('fs');

const targetFile = 'src/components/sections/DelhiSeoContent.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const properNouns = ['Delhi', 'New Delhi', 'FlashSpace', 'GST', 'APOB', 'ROC', 'MCA', 'PAN', 'India', 'India\'s'];

function toSentenceCase(str) {
  let sentence = str.trim();
  if (sentence.length === 0) return sentence;
  
  // Convert all to lowercase
  let lower = sentence.toLowerCase();
  // Capitalize first letter
  let result = lower.charAt(0).toUpperCase() + lower.slice(1);
  
  // Restore proper nouns
  // We use regex to match whole words for each proper noun
  properNouns.forEach(noun => {
    const regex = new RegExp(`\\b${noun}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Return exact case from properNouns array
      return noun;
    });
  });

  // the user specifically said "bus i ko capital krdena"
  result = result.replace(/\bi\b/g, 'I');
  result = result.replace(/\bapob\b/g, 'APOB');

  return result;
}

content = content.replace(/(<h[2-4][^>]*>)(.*?)(<\/h[2-4]>)/g, (match, p1, p2, p3) => {
  return p1 + toSentenceCase(p2) + p3;
});

fs.writeFileSync(targetFile, content);
console.log('Done modifying headings in DelhiSeoContent');

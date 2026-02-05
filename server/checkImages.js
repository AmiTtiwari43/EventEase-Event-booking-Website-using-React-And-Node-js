const fs = require('fs');
const https = require('https');

// Read seedData.js to extract URLs
const seedContent = fs.readFileSync('./seedData.js', 'utf8');
const urlRegex = /"https:\/\/images\.unsplash\.com\/[^"]+"/g;
const urls = seedContent.match(urlRegex).map(url => url.replace(/"/g, ''));

console.log(`Found ${urls.length} URLs. Checking validity...`);

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, statusCode: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, statusCode: 'ERROR', error: e.message });
    });
  });
};

async function checkAll() {
  const results = await Promise.all(urls.map(url => checkUrl(url)));
  
  const broken = results.filter(r => r.statusCode !== 200);
  
  if (broken.length === 0) {
    console.log('All URLs are valid (200 OK).');
  } else {
    console.log(`${broken.length} broken URLs found:`);
    broken.forEach(b => console.log(`[${b.statusCode}] ${b.url}`));
  }
}

checkAll();

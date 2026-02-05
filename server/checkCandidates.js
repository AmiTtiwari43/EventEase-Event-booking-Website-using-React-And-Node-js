const https = require('https');

const candidates = [
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800"
];

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`[${res.statusCode}] ${url}`);
      resolve();
    }).on('error', (e) => {
      console.log(`[ERROR] ${url}: ${e.message}`);
      resolve();
    });
  });
};

async function checkCandidates() {
  await Promise.all(candidates.map(checkUrl));
}

checkCandidates();

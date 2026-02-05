const https = require('https');

const imageUrls = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "https://images.unsplash.com/photo-1511285560982-1351c4f631f1?w=800&q=80",
  "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
  "https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=800&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
  "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80",
  "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80",
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  "https://images.unsplash.com/photo-1505373876491-8cd797eeaa9d?w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  "https://images.unsplash.com/photo-1537248381-8172c9162982?w=800&q=80",
  "https://images.unsplash.com/photo-1516054712850-7870653f65d1?w=800&q=80"
];

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      resolve({ url, statusCode: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, error: e.message });
    });
  });
};

const checkAll = async () => {
  const results = await Promise.all(imageUrls.map(checkUrl));
  const broken = results.filter(r => r.statusCode !== 200);
  
  let output = '';
  if (broken.length === 0) {
    output = 'All images are valid/working.';
  } else {
    output = 'Broken images found:\n';
    broken.forEach(b => {
        output += `${b.url} - ${b.statusCode || b.error}\n`;
    });
  }
  console.log(output);
};

checkAll();

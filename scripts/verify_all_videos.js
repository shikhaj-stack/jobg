const https = require('https');
const fs = require('fs');

async function checkVideo(id) {
  return new Promise((resolve) => {
    https.get('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + id + '&format=json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const j = JSON.parse(data);
            resolve({ id, status: 200, title: j.title });
          } catch(e) {
            resolve({ id, status: 500, title: 'JSON parse error' });
          }
        } else {
          resolve({ id, status: res.statusCode, title: 'Unavailable' });
        }
      });
    }).on('error', (err) => resolve({ id, status: 500, title: err.message }));
  });
}

(async () => {
  const streamDataRaw = fs.readFileSync('./src/data/streamData.js', 'utf8');
  const roadmapDataRaw = fs.readFileSync('./src/data/roadmapData.js', 'utf8');

  // Extract all videoId strings
  const streamMatches = [...streamDataRaw.matchAll(/videoId:\s*['"]([a-zA-Z0-9_-]{11})['"]/g)].map(m => m[1]);
  const roadmapMatches = [...roadmapDataRaw.matchAll(/videoId:\s*\{\s*en:\s*['"]([a-zA-Z0-9_-]{11})['"],\s*hi:\s*['"]([a-zA-Z0-9_-]{11})['"]\s*\}/g)];
  
  const allIds = new Set(streamMatches);
  for (const m of roadmapMatches) {
    allIds.add(m[1]);
    allIds.add(m[2]);
  }

  console.log(`Checking ${allIds.size} unique video IDs across streamData and roadmapData...`);

  let failures = 0;
  for (const id of allIds) {
    const res = await checkVideo(id);
    if (res.status === 200) {
      console.log(`[PASS 200] ${id} -> ${res.title.slice(0, 45)}`);
    } else {
      console.error(`[FAIL ${res.status}] ${id}`);
      failures++;
    }
  }

  if (failures === 0) {
    console.log(`\nALL ${allIds.size} VIDEOS ARE VERIFIED AND 100% PLAYABLE!`);
  } else {
    console.error(`\nFAILED: ${failures} videos are invalid.`);
    process.exit(1);
  }
})();

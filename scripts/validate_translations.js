const fs = require("fs");
const path = require("path");

const enPath = path.join(__dirname, "../src/i18n/en.json");
const hiPath = path.join(__dirname, "../src/i18n/hi.json");

if (!fs.existsSync(enPath) || !fs.existsSync(hiPath)) {
  console.error("? Translation files missing!");
  process.exit(1);
}

const en = JSON.parse(fs.readFileSync(enPath, "utf-8").replace(/^\uFEFF/, ""));
const hi = JSON.parse(fs.readFileSync(hiPath, "utf-8").replace(/^\uFEFF/, ""));

function getKeys(obj, prefix = "") {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res.concat(prefix + el);
    } else if (typeof obj[el] === "object" && obj[el] !== null) {
      return res.concat(getKeys(obj[el], prefix + el + "."));
    }
    return res.concat(prefix + el);
  }, []);
}

const enKeys = new Set(getKeys(en));
const hiKeys = new Set(getKeys(hi));

let missingInHi = [];
let missingInEn = [];

for (const k of enKeys) {
  if (!hiKeys.has(k)) missingInHi.push(k);
}
for (const k of hiKeys) {
  if (!enKeys.has(k)) missingInEn.push(k);
}

console.log("==========================================");
console.log("?? Translation Completeness Validation");
console.log("==========================================");
console.log(`Total English keys: ${enKeys.size}`);
console.log(`Total Hindi keys:   ${hiKeys.size}`);

if (missingInHi.length > 0) {
  console.warn(`?? Keys in en.json missing in hi.json (${missingInHi.length}):`, missingInHi);
}
if (missingInEn.length > 0) {
  console.warn(`?? Keys in hi.json missing in en.json (${missingInEn.length}):`, missingInEn);
}

if (missingInHi.length === 0 && missingInEn.length === 0) {
  console.log("? Perfect 100% key parity between en.json and hi.json!");
} else {
  console.log("Validation completed with notices.");
}

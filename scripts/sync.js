// Pull data from Apps Script endpoint and write JSON files into data/.
// Env: APPSCRIPT_URL (base URL, không kèm ?name=), SHEET_NAMES (comma-separated).

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APPSCRIPT_URL;
const NAMES = (process.env.SHEET_NAMES || '').split(',').map(s => s.trim()).filter(Boolean);

if (!BASE_URL) throw new Error('APPSCRIPT_URL is required');
if (NAMES.length === 0) throw new Error('SHEET_NAMES is required (comma-separated)');

const OUT_DIR = path.join(__dirname, '..', 'data');
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
    for (const name of NAMES) {
        const url = `${BASE_URL}?name=${encodeURIComponent(name)}`;
        console.log(`Fetching ${name}…`);
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`  failed: ${res.status} ${res.statusText}`);
            process.exitCode = 1;
            continue;
        }
        const text = await res.text();
        // Validate JSON; nếu Apps Script trả "File not found" sẽ skip.
        try {
            JSON.parse(text);
        } catch {
            console.error(`  not JSON, skipping: ${text.slice(0, 80)}`);
            continue;
        }
        const outPath = path.join(OUT_DIR, `${name}.json`);
        fs.writeFileSync(outPath, text);
        console.log(`  wrote ${outPath}`);
    }
})();

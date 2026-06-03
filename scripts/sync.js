// Pull data from Apps Script endpoint and write JSON files into data/.
// Env: APPSCRIPT_URL (base URL, không kèm ?name=)
//      SHEET_NAMES (comma-separated, tuỳ chọn — nếu bỏ trống sẽ tự lấy danh sách từ endpoint)

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APPSCRIPT_URL;
if (!BASE_URL) throw new Error('APPSCRIPT_URL is required');

const OUT_DIR = path.join(__dirname, '..', 'data');
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
    let names = (process.env.SHEET_NAMES || '').split(',').map(s => s.trim()).filter(Boolean);

    if (names.length === 0) {
        console.log('SHEET_NAMES not set — fetching list from endpoint…');
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error(`Failed to fetch sheet list: ${res.status} ${res.statusText}`);
        names = await res.json();
        console.log(`  found: ${names.join(', ')}`);
    }

    for (const name of names) {
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

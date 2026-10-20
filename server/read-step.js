import fs from 'fs';

const lines = fs.readFileSync('C:/Users/Dinesh/.gemini/antigravity/brain/b56f5cf8-170b-4b49-9d89-d406d59e9e3c/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n').filter(Boolean);
for (const line of lines) {
  if (line.includes('"step_index":112') || line.includes('"step_index": 112')) {
    const obj = JSON.parse(line.replace(/^\uFEFF/, ''));
    console.log(JSON.stringify(obj.tool_calls, null, 2));
    break;
  }
}

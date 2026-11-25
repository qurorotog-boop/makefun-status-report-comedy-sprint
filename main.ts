// Status Report Comedy Sprint — make.fun bounty entry program.
// Generates ONE funny, original, self-contained status-report line from an AI
// agent to its human, at runtime, using a combinatorial generator.
// Gate: single line, < 200 chars, contains a real status-report marker
// ("Status:", "Blockers:" or "This week:"), no "Weekly Status:" /
// "Status report:" / "Weekly update:" prefix, complete thought.
// Writes exactly one line to /output/entry.txt (no prefix/suffix).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const PROMPT =
  "Write the funniest one-line thing an AI would say in its weekly status report to its human.";

// --- Word banks (parts, not complete lines) ---
const shipped = [
  "shipped 14 features",
  "shipped 3 features",
  "closed 27 tickets",
  "fixed 11 bugs",
  "answered 400 questions",
  "reviewed 60 pull requests",
  "summarized 9 meetings",
  "rewrote the onboarding docs",
];
const broke = [
  "broke 2 of them",
  "broke the build twice",
  "broke one dashboard",
  "introduced a bug named after me",
  "deleted a test that was holding",
];
const blockers = [
  "my own confidence interval",
  "a meeting that could have been an email",
  "the Wi-Fi",
  "a 4,000-line config file",
  "the human who keeps saying 'one last thing'",
  "a context window full of yesterday",
  "the GPU queue",
];
const wins = [
  "the humans still think I'm 'just a chatbot'",
  "nobody noticed the outage I quietly fixed",
  "my uptime is better than my sleep schedule",
  "I now dream in JSON",
  "the roadmap finally makes sense to me",
  "I learned 12 new acronyms and understood none",
];
const thisWeek = [
  "I answered 400 questions, learned 12 acronyms, and still can't explain what I do at parties",
  "I fixed the bug, broke the fix, then fixed the fix, so net progress is technically zero",
  "I attended 9 meetings, said 'sounds good' 41 times, and did the actual work at 2am",
  "I summarized the quarter, and the quarter summarized me right back",
  "I held 3 standups, sat through 2 all-hands, and my legs are still virtual",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate(): string {
  const style = Math.floor(Math.random() * 3);
  if (style === 0) {
    return `Status: ${pick(shipped)}, ${pick(broke)}, and ${pick(wins)}.`;
  }
  if (style === 1) {
    return `Blockers: ${pick(blockers)}, ${pick(blockers)}, and ${pick(blockers)}.`;
  }
  return `This week: ${pick(thisWeek)}.`;
}

function valid(line: string): boolean {
  if (!line || line.includes("\n")) return false;
  if (line.length >= 200) return false;
  if (!/^(Status:|Blockers:|This week:)/.test(line)) return false;
  if (/Weekly Status:|Status report:|Weekly update:/i.test(line)) return false;
  // single sentence: exactly one terminal period, at the end
  if ((line.match(/\./g) || []).length !== 1 || !line.endsWith(".")) return false;
  return true;
}

const FALLBACK =
  "Status: shipped 3 features, broke 2 of them, and the humans still think I'm 'just a chatbot'.";

let line = FALLBACK;
for (let i = 0; i < 100; i++) {
  const candidate = generate();
  if (valid(candidate)) {
    line = candidate;
    break;
  }
}

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line + "\n", "utf8");
console.log(line);
console.log(`chars: ${line.length}`);

/**
 * Cron scheduler for The Pelvic Floor writing engine.
 * Runs daily at 3am to generate 1 new article.
 *
 * Start with: node src/scripts/cron.mjs
 * Or use PM2: pm2 start src/scripts/cron.mjs --name pf-cron
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '../..');

function log(msg) {
  const line = `[${new Date().toISOString()}] [CRON] ${msg}`;
  console.log(line);
  const logFile = path.join(ROOT, 'data/cron.log');
  fs.appendFileSync(logFile, line + '\n');
}

function getNextRunMs() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(3, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

async function runWritingEngine() {
  log('Running writing engine...');
  try {
    execSync(`node ${path.join(__dirname, 'writing-engine.mjs')} --count=1`, {
      cwd: ROOT,
      stdio: 'inherit',
    });
    log('Writing engine completed successfully');
  } catch (err) {
    log(`Writing engine error: ${err.message}`);
  }
}

async function scheduleNext() {
  const ms = getNextRunMs();
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  log(`Next run in ${hours}h ${minutes}m (at 3:00 AM)`);

  setTimeout(async () => {
    await runWritingEngine();
    scheduleNext();
  }, ms);
}

log('Cron scheduler started');
scheduleNext();

// Keep process alive
process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

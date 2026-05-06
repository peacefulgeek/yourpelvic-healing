/**
 * Cron orchestrator — The Pelvic Floor
 * All crons run INSIDE the Express process via node-cron.
 * No Manus scheduler. No external scheduler. No cron.d.
 * Import this from server/index.mjs to activate.
 */
import { startPublisherCron } from './publisher.mjs';

export function startAllCrons() {
  startPublisherCron();
  console.log('[cron] All in-process crons started.');
}

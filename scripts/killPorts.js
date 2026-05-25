/**
 * killPorts.js — cross-platform port cleaner
 * Kills any process sitting on ports 4000, 3000, 3001, 3002
 * before the dev servers start, so you never hit EADDRINUSE.
 */
'use strict';
const { execSync } = require('child_process');

const PORTS = [4000, 3000, 3001, 3002];

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // netstat gives us lines like:  TCP  0.0.0.0:4000  ...  1234
      const out = execSync(`netstat -ano | findstr :${port}`, {
        stdio: 'pipe',
        encoding: 'utf8',
      });

      const pids = new Set();
      for (const line of out.trim().split('\n')) {
        const cols = line.trim().split(/\s+/);
        // Only match lines where the local address ends with :PORT
        const localAddr = cols[1] || '';
        if (localAddr.endsWith(`:${port}`)) {
          const pid = cols[cols.length - 1];
          if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
        }
      }

      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'pipe' });
          console.log(`  killed PID ${pid} (port ${port})`);
        } catch (_) {
          // process might have already exited
        }
      }
    } else {
      // macOS / Linux
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'pipe', shell: true });
      console.log(`  killed port ${port}`);
    }
  } catch (_) {
    // port wasn't in use — nothing to do
  }
}

console.log('\n🔪  Clearing dev ports...');
for (const p of PORTS) killPort(p);
console.log('✅  Ports clear — starting servers\n');

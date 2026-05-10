const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const PORT = process.env.PORT || 3000;

async function killPort() {
  try {
    // Find process using the port
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`netstat -ano | findstr :${PORT}`);
      
      const lines = stdout.trim().split('\n');
      if (lines.length === 0) {
        console.log(`Port ${PORT} is free`);
        return;
      }
      
      // Extract PIDs and kill them
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(parseInt(pid))) {
          pids.add(pid);
        }
      }
      
      for (const pid of pids) {
        try {
          await execAsync(`taskkill /PID ${pid} /F`);
          console.log(`Killed process ${pid} on port ${PORT}`);
        } catch (e) {
          // Process might have already ended
        }
      }
    } else {
      // Unix-like systems
      try {
        await execAsync(`lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true`);
        console.log(`Port ${PORT} cleared`);
      } catch (e) {
        console.log(`Port ${PORT} is free`);
      }
    }
    
    console.log(`Port ${PORT} is now free. You can start the server.`);
  } catch (error) {
    // Port might be free (error means no output from netstat)
    console.log(`Port ${PORT} is free to use`);
  }
}

killPort();
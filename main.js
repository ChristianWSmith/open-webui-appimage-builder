const { default: getPort } = require('get-port');
const { spawn } = require('child_process');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');

let serverProcess;

async function waitForPort(port, host = '127.0.0.1') {
  return new Promise(resolve => {
    const tryConnect = () => {
      const socket = net.createConnection({ port, host });
      socket.on('connect', () => {
        socket.end();
        resolve();
      });
      socket.on('error', () => setTimeout(tryConnect, 200));
    };
    tryConnect();
  });
}

async function createWindow(port) {
  const win = new BrowserWindow(
    {
      width: 1200,
      height: 800,
      autoHideMenuBar: true
    });
  await waitForPort(port);
  win.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(async () => {
  const port = await getPort({ port: [8000, 9000] });
  console.log("Selected port:", port);

  const scriptPath = path.join(
    app.isPackaged ? process.resourcesPath : path.resolve(__dirname), 
    'open-webui', 
    'start.sh'
  );

  serverProcess = spawn(scriptPath, [port], {
    cwd: path.dirname(scriptPath),
    shell: true,
    detached: true
  });

  serverProcess.stdout.on('data', d => console.log("[server]", d.toString()));
  serverProcess.stderr.on('data', d => console.error("[server-error]", d.toString()));

  await createWindow(port);
});

app.on('will-quit', () => {
  if (serverProcess) {
    // Kill the entire process group using the negative PID
    process.kill(-serverProcess.pid, 'SIGTERM');
  }
});

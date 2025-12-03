const { default: getPort } = require('get-port');
const { spawn } = require('child_process');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');
const appName = 'Open WebUI Desktop';
const appId = 'com.openwebui.openwebuidesktop';

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
  const iconPath = path.join(
    app.isPackaged ? process.resourcesPath : path.resolve(__dirname),
    'open-webui',
    'icon.png'
  );
  const win = new BrowserWindow(
    {
      width: 1200,
      height: 800,
      autoHideMenuBar: true,
      icon: iconPath,
      title: appName
    });
  win.webContents.on('page-title-updated', (event) => {
        event.preventDefault();
        win.setTitle(appName);
    });
  win.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(async () => {
  app.setAppUserModelId(appId);

  const port = await getPort({ port: [8000, 9000] });
  console.log("Selected port:", port);

  const serverPath = path.join(
    app.isPackaged ? process.resourcesPath : path.resolve(__dirname), 
    'open-webui', '.venv', 'bin', 'open-webui'
  );

  serverProcess = spawn(serverPath, ["serve", "--port", port], {
    cwd: path.dirname(serverPath),
    shell: false,
    detached: true,
    env: {
      ...process.env,
      WEBUI_AUTH: process.env.WEBUI_AUTH || 'False',
      // WEBUI_SECRET_KEY: process.env.WEBUI_SECRET_KEY || 'yH7V8xtcbDMYqlxb',
      WEBUI_SECRET_KEY: process.env.WEBUI_SECRET_KEY || '🤖',
      DATA_DIR: process.env.DATA_DIR || app.getPath('userData'),
      CACHE_DIR: process.env.CACHE_DIR || app.getPath('userData')
    }
  });

  serverProcess.stdout.on('data', d => console.log("[server]", d.toString()));
  serverProcess.stderr.on('data', d => console.error("[server-error]", d.toString()));

  await waitForPort(port);
  await createWindow(port);
});

app.on('will-quit', () => {
  if (serverProcess) {
    process.kill(-serverProcess.pid, 'SIGTERM');
  }
});

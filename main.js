const { default: getPort } = require('get-port');
const { spawn } = require('child_process');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');
const pjson = require(path.join(__dirname, 'package.json'));

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
      title: pjson.build.productName
    });
  win.webContents.on('page-title-updated', (event) => {
        event.preventDefault();
        win.setTitle(pjson.build.productName);
    });
  win.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(async () => {
  const appId = pjson.build.appId;
  app.setAppUserModelId(appId);

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
    detached: true,
    env: {
      ...process.env,
      WEBUI_AUTH: process.env.WEBUI_AUTH || 'False',
      DATA_DIR: process.env.DATA_DIR || app.getPath('userData'),
      CACHE_DIR: process.env.CACHE_DIR || app.getPath('sessionData')
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

const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let serverProcess;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      autoHideMenuBar: true,
      contextIsolation: true
    }
  });

  win.loadURL("http://127.0.0.1:8080");
}

app.whenReady().then(async () => {
  const resources = process.resourcesPath;
  const script = path.join(resources, "open-webui", "start.sh");

  // launch your server
  serverProcess = spawn(script, {
    cwd: path.dirname(script),
    shell: true,
    detached: false
  });

  serverProcess.stdout.on("data", (d) => {
    console.log("[server]", d.toString());
  });

  serverProcess.stderr.on("data", (d) => {
    console.error("[server-error]", d.toString());
  });

  // small delay to let it boot — Open-WebUI starts fast
  await wait(1200);

  await createWindow();
});

app.on("will-quit", () => {
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
});


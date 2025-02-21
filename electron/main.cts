import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { services } from "./services/index.cjs";

let mainWindow;

const isDevelopment = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    minWidth: 800,
    minHeight: 600,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: true, // Разрешает использовать Node.js в рендерере
      contextIsolation: true,
    },
  });

  if (isDevelopment) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile("./dist/index.html");
  }
}

const initServicesIPC = () => {
  for (const namespace of Object.keys(services)) {
    for (const serviceName of Object.keys(services[namespace])) {
      const service = services[namespace][serviceName];

      for (const method of Object.keys(service)) {
        if (typeof service[method] === "function") {
          const ipcEvent = `${namespace}:${serviceName}:${method}`;
          console.log(`Registering IPC: ${ipcEvent}`);

          ipcMain.handle(ipcEvent, async (_event, ...args) => {
            try {
              return await service[method](...args);
            } catch (error) {
              console.error(`Error in ${ipcEvent}:`, error);
              throw error;
            }
          });
        }
      }
    }
  }
};

app.whenReady().then(() => {
  createWindow();
  initServicesIPC();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

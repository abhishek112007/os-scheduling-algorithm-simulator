const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: true, // Hide menu bar
    title: 'CPU Scheduling Visualizer'
  });

  // Load the app
  const isDev = !!process.env.ELECTRON_START_URL;
  
  if (isDev) {
    // Try port 3000 first, then 3001 if it fails
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      console.log('Port 3000 failed, trying 3001...');
      mainWindow.loadURL('http://localhost:3001');
    });
    // DevTools removed - app opens without console
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

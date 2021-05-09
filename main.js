/**
 * Logitech G Battery Reporter for Work PCs
 */

const { app, BrowserWindow, ipcMain} = require('electron');

///////// ELECTRON CODE
let win;

function createWindow () {
  // Create browser window
  win = new BrowserWindow({
    width: 330,
    height: 900,
    //frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setMenuBarVisibility(false)
  // load the index.html of the app
  win.loadFile('index.html');

  // Emitted when the window is closed
  win.on('closed', () => {
    // Dereference the window object
    win = null;
  });
}

// Called when Electron has finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});

ipcMain.on('min', () => {
  //mainWindow is the reference to your window
  win.minimize();
});
ipcMain.on('close', () => {
  //mainWindow is the reference to your window
  app.quit();
});
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { electron } = require('process');
const { v4: uuidv4 } = require("uuid");
const { addProjectToDatabase } = require('./js/db');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow = undefined;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1150,
    height: 620,
    minHeight: 620,
    minWidth: 900,
    autoHideMenuBar: true,
    frame: false,
    icon: __dirname + "/images/icon.ico",
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'pages/index.html'));
  // mainWindow.removeMenu()
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  console.log(app.getPath('userData'))

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Below function gets the currrently focused window
function CurWindow() {
  return BrowserWindow.getFocusedWindow()
}

ipcMain.handle('open-folder', async (event, ...arg) => {
  const curWin = CurWindow()
  const result = await dialog.showOpenDialog(curWin, {
    properties: ['openDirectory']
  });
  if (!result.canceled) {
    filePath = result.filePaths
    return filePath
  }
  return undefined
})


// Below function handles the custom minimize button
ipcMain.handle('minimize-window', async (event, ...args) => {
  CurWindow().minimize();
})

// Below function handles the custom maximize button
ipcMain.handle('toggle-max-window', async (event, ...args) => {
  const curWindow = CurWindow()
  if (curWindow.isMaximized()) {
    curWindow.unmaximize()
  } else {
    curWindow.maximize();
  }
})

// Below function handles the custom close button
ipcMain.handle('close-window', async (event, ...args) => {
  CurWindow().close();
})

/* ----------------------- NEW PROJECT WINDOW ------------------ */
ipcMain.handle("open-new-project-window", (event, ...arg) => {
  const newProjWin = new BrowserWindow({
    width: 1100,
    height: 650,
    frame: false,
    minHeight: 650,
    minWidth: 800,
    autoHideMenuBar: true,
    icon: __dirname + "/images/icon.ico",
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  })
  newProjWin.loadFile(path.join(__dirname, "pages/new-project.html"))
  // newProjWin.webContents.openDevTools();
  newProjWin.show()
})
/*------------------------------------------------------------------*/

/*  HANDLE CREATE NEW BLENDER PROJECT  */

function showLoadingFrame(win) {
  win.loadFile(path.join(__dirname, "pages/loading-editor.html"))
}

ipcMain.handle("create-project", (event, args) => {
  const cw = CurWindow()
  showLoadingFrame(cw);

  const projectName = args[0]
  const description = args[1]
  const blendName = args[2]
  const location = args[3]
  const mode = args[4]
  const type = args[5]
  const templateLocation = ""
  let id = uuidv4()

  const fs = require('fs');
  const dir = `${location}\\${projectName}`;
  const pythonFile = path.join(__dirname, "python/createBlenderFile.py")
  const executablePath = "E:\\blender\\blender-2.92\\blender-2.92.0-8d3d4c884084-windows64\\blender.exe";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    var child = require('child_process').execFile;
    var parameters = ["-b", '-P', pythonFile, "--", dir, blendName, mode, type, templateLocation];
    var d = new Date();

    let jsonContents = {
      appname: app.getName(),
      app_version: app.getVersion(),
      project_name: projectName,
      project_description: description,
      project_created: d,
      author: "",
      tldr: "",
      id: id
    }
    child(executablePath, parameters, function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      fs.writeFile(dir + '\\project.blenderlab', JSON.stringify(jsonContents, null, 2), function (err) {
        if (err) return console.log(err);
      });
      var param=[dir + `\\${blendName}`+'.blend']

      var child = require('child_process').spawn;
      var cp = child(executablePath, param, {detached: true, windowsHide:false});
      cp.unref();
      cw.close()
      addProjectToDatabase([dir, id, app.getPath('userData')])

      console.log(data.toString());
    }
    );
  }


})
/*  ---------------------------------  */

ipcMain.handle("get-user-data-path", (event, args) => {
  return app.getPath('userData')
});


/*
这个文件是electron的入口文件， 和react无关
electron-packager <应用目录> <应用名称> <打包平台> --out <输出目录> <架构> <应用版本>
electron-packager . MBPT --win --out ./MBPTApp --arch=x64 --version=0.0.1 --electron-version=1.8.4  --overwrite
*/

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const pkg = require('./package.json') // 引用package.json 

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  // 800 /2*3
  mainWindow = new BrowserWindow({width: 1200, height: 900,
    minWidth:1200,
    minHeight:900,
    title:'JSEN',
    backgroundColor:'#314760'
  })
  mainWindow.maximize()
  // mainWindow.setFullScreen(true)

  // and load the index.html of the app.
  if(pkg.DEV) { 
    mainWindow.loadURL("http://localhost:3000/")
  } else { 
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }
  

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
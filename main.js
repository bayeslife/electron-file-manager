const { app, BrowserWindow,ipcMain:ipc } = require('electron');
const fs = require('fs');
const path = require('path')
const debug = require('debug')('main')

const config = require('./src/config')
const { Uploader } = require('./src/processing/uploader')

const uploader = Uploader(config.storageAccount)

if(process.env.DEVELOP)
  app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

  let mainWindow = null
function createHostWindow () {
  mainWindow = new BrowserWindow({
      show:false,
      //frame: false,
      width: 1920,
      height: 1200,
      webPreferences: {        
        preload: path.join(__dirname, 'preload.js')
      }      
    })
        
    mainWindow.loadURL('https://localhost:3016')

    mainWindow.webContents.on('ready-to-show', () => {      
      mainWindow.webContents.openDevTools()
      mainWindow.show()
    })
  }

  let chooserWin = null
  function createFileWindow () {
    chooserWin = new BrowserWindow({
      show:false,
      frame: false,
      width: 900,
      height: 1200,
      webPreferences: {        
        preload: path.join(__dirname, 'preload.js')
      }      
    })
    
    chooserWin.loadFile('index.html')
    
    chooserWin.webContents.on('ready-to-show', () => {      
      chooserWin.webContents.openDevTools()      
    })
  }

  app.whenReady().then(() => {
    createHostWindow()
    createFileWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  ipc.on('command', (event, eventData) => {    
    debug(`command received ${eventData.type}`)
    if(eventData.type==='show-chooser')
      chooserWin.show()    
    else if(eventData.type==='file-chosen'){      
      uploader.add(eventData.path)      
      chooserWin.hide()
      mainWindow.webContents.send('event',{type:'path-change',path: eventData.path})      
    }
    else if(eventData.type==='upload'){
      debug('Upload Command')
      debug(eventData)
      
      event.sender.send('event',{type:'progress',progress:0})
      setTimeout(()=>{          
          event.sender.send('event',{type:'progress',progress: 100})
      },5000)    
    }
      
  })
  
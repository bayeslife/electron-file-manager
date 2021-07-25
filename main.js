const { app, BrowserWindow,ipcMain:ipc } = require('electron');
const fs = require('fs');
const path = require('path')

const uploads= []

if(process.env.DEVELOP)
  app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

  let mainWindow = null
function createWindow () {
  mainWindow = new BrowserWindow({
      show:false,
      //frame: false,
      width: 1920,
      height: 1200,
      webPreferences: {        
        preload: path.join(__dirname, 'preload.js')
      }      
    })
        
    mainWindow.loadURL('https://localhost:3005')

    mainWindow.webContents.on('ready-to-show', () => {      
      mainWindow.webContents.openDevTools()
      mainWindow.show()
    })
  }

  let chooserWin = null
  function createChooserWindow () {
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
    createWindow()
    createChooserWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  ipc.on('command', (event, eventData) => {    
    console.log('command')
    if(eventData.type==='show-chooser')
      chooserWin.show()    
    else if(eventData.type==='file-chosen'){
      console.log('file-chosen')
      uploads.push(eventData.path)
      chooserWin.hide()
      mainWindow.webContents.send('event',{type:'path-change',path: eventData.path})      
    }
    else if(eventData.type==='upload'){
      console.log('Upload Command')
      console.log(eventData)
  
      console.log('exists',fs.existsSync(eventData.path))
  
      event.sender.send('event',{type:'progress',progress:0})
      setTimeout(()=>{          
          event.sender.send('event',{type:'progress',progress: 100})
      },5000)    
    }
      
  })
  
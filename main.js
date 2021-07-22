const { app, BrowserWindow,ipcMain:ipc } = require('electron')
const path = require('path')


function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    
    win.loadFile('index.html')
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  ipc.on('upload', (event, uploadconfig) => {

    console.log(uploadconfig)


    event.sender.send('uploading',{progress:0})
    setTimeout(()=>{        
        event.sender.send('uploading',{progress: 100})
    },5000)    
  })
  
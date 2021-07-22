const { contextBridge, ipcRenderer:ipc } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  upload: (path) => {
    ipc.send('upload', {path})
  }
})

// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//       const element = document.getElementById(selector)
//       if (element) element.innerText = text
//     }
  
//     for (const dependency of ['chrome', 'node', 'electron']) {
//       replaceText(`${dependency}-version`, process.versions[dependency])
//     }
//   })

ipc.on('uploading', (event, progress) => {    
    const element = document.getElementById("progress")
    element.innerText= JSON.stringify(progress)
})
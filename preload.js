const { contextBridge, ipcRenderer:ipc } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  fileChosen: (path) => {
    console.log('file-chosen')
    ipc.send('command', {type:'file-chosen',path})
  },
  upload: (path) => {
    console.log('upload')
    ipc.send('command', {type:'upload',path})
  }
})


window.addEventListener('DOMContentLoaded', () => {  
  window.addEventListener('message', event => {
    // do something with custom event
    const message = event.data;    
    ipc.send('command', message)
  });  
})

ipc.on('event', (event, eventData) => {   
  console.log(eventData) 
    if(eventData.type==='path-change'){      
      const element = document.getElementById("file-path")
      element.innerText= JSON.stringify(eventData.path)
    }else if(eventData.type==="progress"){
      const element = document.getElementById("progress")
      element.innerText= JSON.stringify(eventData.progress)
    }
    
})



document.getElementById('file-choose-button').addEventListener('click', () => {    
    const file = document.getElementById('file-path')        
    const path = file.files[0].path    
    console.log(path)
    window.electron.fileChosen(path)    

})

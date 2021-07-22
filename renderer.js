
function msg(config){    
    window.electron.upload(config)
}

document.querySelector('#btn').addEventListener('click', () => {
    const file = document.getElementById('pointcloud')    
    const project = document.getElementById('project')
    const uploadconfig = {
        project: project.value,
        path: file.files[0].path
    }
    console.log(uploadconfig)
    msg(uploadconfig)
})

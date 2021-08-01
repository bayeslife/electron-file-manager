const { default : AzureStorageClient } = require('../../../2021-07-18-LargeFileStorage/dist/src/azureStorageClient')

const uploads = []

const Uploader = (config)=>{
        
    const client = AzureStorageClient(config)

    const add = (path)=>{
        console.log(`Adding ${path}`)
        uploads.push(path)
    }

    return {
        add
    }
}

module.exports={
    Uploader
}
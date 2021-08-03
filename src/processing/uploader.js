const fs = require('fs')
const path = require('path')
const {v4 : uuid} =require('uuid')
const { default : AzureStorageClient } = require('../../../2021-07-18-LargeFileStorage/dist/src/azureStorageClient')
const debug= require('debug')('Uploader')

const UPLOADS_JSON = 'uploads.json'

const BLOCK_SIZE=1024*1024 //1megabyte

let uploads = {
}

const Uploader = (config)=>{
        
    const client = AzureStorageClient(config)

    const saveUploads = ()=>{
        debug(`save uploads ${JSON.stringify(uploads)}`)
        fs.writeFileSync(UPLOADS_JSON,JSON.stringify(uploads))
    }
    
    const continueUploads=()=>{
        debug('Loading In Progress Uploads')
        fs.access(UPLOADS_JSON,fs.constants.f_OK,(err)=>{
            if(!err){
                let persisted = fs.readFileSync(UPLOADS_JSON)
                uploads = JSON.parse(persisted)
                const uploadkeys = Object.keys(uploads)
                debug(`Uploads to start ${uploadkeys.length}`)
                uploadkeys.forEach((uploadkey)=>{
                    const upload = uploads[uploadkey]
                    startUpload(upload)
                })
            }
        }) 
    }
    continueUploads()


    const startUpload = (uploadConfig)=>{        
        const {filepath,uploadprefix,uploadedBlockCount}=uploadConfig
        client.upload(filepath, path.basename(filepath),{
            prefix: uploadprefix,
            blockSize: BLOCK_SIZE,
            blockOffset: uploadedBlockCount/*Block Offset*/,
            debugMode: false,
            progressCallback: (block)=>{
                debug(`Upload block ${uploadprefix} ${block}`)
                if(block>=0){
                    debug(`Block Number ${block} stored`)
                    uploads[uploadprefix].uploadedBlockCount=block
                } else {
                    debug(`Blob committed`)
                    delete uploads[uploadprefix]
                }
                saveUploads()
            }
          })
    }
    const add = (filepath)=>{
        const uploadid = uuid().slice(0,8)
        const uploadConfig = {
            filepath: filepath,
            uploadprefix: uploadid,
            uploadedBlockCount: 0
        }
        uploads[uploadid]=uploadConfig
        debug(`Adding Upload ${uploadid} ${filepath}`)
        saveUploads()
        startUpload(uploadConfig)
    }

    return {
        add
    }
}

module.exports={
    Uploader
}
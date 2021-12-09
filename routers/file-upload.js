const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { FAIL, SUCCESS } = require('../config')


const dirPath = path.join(__dirname, '..', 'public/upload')

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    if(!fs.existsSync(dirPath)){
      fs.mkdir(dirPath,function(err){
          if(err){
          console.log(err)
        }else{
          cb(null,dirPath)
        }
      })
    }else {
      cb(null,dirPath)
    }
  },
  filename:function(req,file,cb){
    var ext = path.extname(file.originalname)
    cb(null,file.fieldname+'-'+Date.now()+ext)
  },
})

// 文件大小这里设置
const upload = multer({storage,limits:'5000kb'})
const uploadSingle = upload.single('image')

module.exports = function fileUpload(router) {
  // 上传图片
  router.post('/img/upload',(req,res)=>{
    uploadSingle(req,res,function(err){
        if(err){
          console.log(err)
          return res.send({status:FAIL,msg:'上传图片失败'})
        }
        var file = req.file
        console.log(file)
        // res.send({status:SUCCESS,data:{name:file.filename,url:'http://101.132.153.210/upload/'+file.filename}})
        res.send({status:SUCCESS,data:{name:file.filename,url:'http://localhost:9000/upload/'+file.filename}})
      }
    )
  })
  // 删除图片
  router.post('/img/delete',(req,res)=>{
    const {name} = req.body
    fs.unlink(path.join(dirPath,name),(err)=>{
      if(err){
        console.log(err)
        res.send({status:FAIL,msg:'删除文件失败'})
      }else{
        res.send({status:SUCCESS})
      }
    })
  })
}
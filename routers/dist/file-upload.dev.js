"use strict";

var multer = require('multer');

var path = require('path');

var fs = require('fs');

var _require = require('../config'),
    FAIL = _require.FAIL,
    SUCCESS = _require.SUCCESS;

var dirPath = path.join(__dirname, '..', 'public/upload');
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, function (err) {
        if (err) {
          console.log(err);
        } else {
          cb(null, dirPath);
        }
      });
    } else {
      cb(null, dirPath);
    }
  },
  filename: function filename(req, file, cb) {
    var ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
}); // 文件大小这里设置

var upload = multer({
  storage: storage,
  limits: '5000kb'
});
var uploadSingle = upload.single('image');

module.exports = function fileUpload(router) {
  // 上传图片
  router.post('/img/upload', function (req, res) {
    uploadSingle(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.send({
          status: FAIL,
          msg: '上传图片失败'
        });
      }

      var file = req.file;
      console.log(file); // res.send({status:SUCCESS,data:{name:file.filename,url:'http://101.132.153.210/upload/'+file.filename}})

      res.send({
        status: SUCCESS,
        data: {
          name: file.filename,
          url: 'http://localhost:9000/upload/' + file.filename
        }
      });
    });
  }); // 删除图片

  router.post('/img/delete', function (req, res) {
    var name = req.body.name;
    fs.unlink(path.join(dirPath, name), function (err) {
      if (err) {
        console.log(err);
        res.send({
          status: FAIL,
          msg: '删除文件失败'
        });
      } else {
        res.send({
          status: SUCCESS
        });
      }
    });
  });
};
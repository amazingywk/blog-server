"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var md5 = require('blueimp-md5');

var UserModel = require('../models/UserModel');

var ArticleModel = require('../models/ArticleModel');

var ClassificationModel = require('../models/ClassificationModel');

var _require = require('../config/index'),
    SUCCESS = _require.SUCCESS,
    FAIL = _require.FAIL;

var MessageModel = require('../models/MessageModel'); // 得到路由器对象


var router = express.Router();
/**
 * 文件上传与删除
 * 上传post('img/upload') 删除post('img/delete'){name}
 */

require('./file-upload')(router);

var _require2 = require('../token'),
    setToken = _require2.setToken; // 登录


router.post('/login', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  UserModel.findOne({
    username: username,
    password: md5(password)
  }).then(function (user) {
    if (user) {
      // 登录成功
      setToken(user.username).then(function (token) {
        res.send({
          status: SUCCESS,
          data: user,
          token: token
        }); // return res.json({
        //   code:200,
        //   message:'登录成功',
        //   token:token
        // })
      }); // res.cookie('') 设置cookie待实现
      // res.send({status: SUCCESS, data: user,token:token})
    } else {
      // 登录失败
      res.send({
        status: FAIL,
        data: '用户名或密码不正确'
      });
    }
  })["catch"](function (error) {
    console.log('登录异常', error);
    res.send({
      status: FAIL,
      msg: '登录异常，请重新尝试'
    });
  });
}); // 获取分类列表

router.get('/classification/list', function (req, res) {
  ClassificationModel.find().then(function (classifications) {
    res.send({
      status: SUCCESS,
      data: classifications
    });
  })["catch"](function (error) {
    console.log('获取分类列表异常', error);
    res.send({
      status: FAIL,
      msg: '获取分类列表异常，请重新尝试'
    });
  });
}); // 添加分类

router.post('/classification/add', function (req, res) {
  var name = req.body.name;
  ClassificationModel.findOne({
    name: name
  }).then(function (classification) {
    if (classification) {
      res.send({
        status: FAIL,
        msg: '该分类已存在'
      });
    } else {
      ClassificationModel.create({
        name: name
      }).then(function (classification) {
        res.send({
          status: SUCCESS,
          data: classification
        });
      })["catch"](function (error) {
        console.log('添加分类异常', error);
        res.send({
          status: FAIL,
          msg: '添加分类异常，请重新尝试'
        });
      });
    }
  });
}); // 删除分类

router.post('/classification/delete', function (req, res) {
  ClassificationModel.findOneAndDelete(req.body).then(function (classification) {
    res.send({
      status: SUCCESS,
      data: classification
    });
  })["catch"](function (err) {
    console.log(err);
    res.send({
      status: FAIL,
      msg: '删除分类异常，请重新尝试'
    });
  });
}); // 根据_id更新分类

router.post('/classification/update', function (req, res) {
  var _req$body2 = req.body,
      _id = _req$body2._id,
      name = _req$body2.name;
  ClassificationModel.findOneAndUpdate({
    _id: _id
  }, {
    name: name
  }).then(function (old) {
    res.send({
      status: SUCCESS,
      data: old
    });
  })["catch"](function (error) {
    console.log('更新分类异常', error);
    res.send({
      status: FAIL,
      msg: '更新分类异常，请重新尝试'
    });
  });
}); // 获取用户列表

router.get('/user/list', function (req, res) {
  UserModel.find().then(function (userList) {
    res.send({
      status: SUCCESS,
      data: userList
    });
  })["catch"](function (error) {
    console.log('获取用户列表异常', error);
    res.send({
      status: FAIL,
      msg: '获取用户列表异常，请重新尝试'
    });
  });
}); // 添加用户

router.post('/user/add', function (req, res) {
  var _req$body3 = req.body,
      username = _req$body3.username,
      password = _req$body3.password;
  UserModel.findOne({
    username: username
  }).then(function (user) {
    if (user) {
      res.send({
        status: FAIL,
        msg: '该用户已经存在',
        data: user
      });
    } else {
      UserModel.create(_objectSpread({}, req.body, {
        password: md5(password)
      })).then(function (user) {
        res.send({
          status: SUCCESS,
          data: user
        });
      })["catch"](function (error) {
        console.log('添加用户异常', error);
        res.send({
          status: FAIL,
          msg: '添加用户异常，请重新尝试'
        });
      });
    }
  });
}); // 更新数据或id查找用户

router.post('/user/update', function (req, res) {
  var user = req.body;
  UserModel.findOneAndUpdate({
    _id: user._id
  }, user).then(function (OldUser) {
    res.send({
      status: SUCCESS,
      data: Object.assign(OldUser, user)
    });
  })["catch"](function (error) {
    console.log('更新用户异常', error);
    res.send({
      status: FAIL,
      msg: '更新用户异常，请重新尝试'
    });
  });
}); // 删除用户

router.post('/user/delete', function (req, res) {
  var _id = req.body._id;
  UserModel.findOneAndDelete({
    _id: _id
  }).then(function (user) {
    res.send({
      status: SUCCESS,
      data: user
    });
  })["catch"](function (error) {
    console.log('删除用户异常');
    res.send({
      status: FAIL,
      msg: '删除用户异常，请重新尝试'
    });
  });
}); // 获取文章列表

router.get('/article/list', function (req, res) {
  ArticleModel.find().then(function (articles) {
    res.send({
      status: SUCCESS,
      data: articles
    });
  })["catch"](function (err) {
    console.log('获取文章列表异常', err);
    res.send({
      status: FAIL,
      msg: '获取文章列表异常，请重新尝试'
    });
  });
}); // 添加文章

router.post('/article/add', function (req, res) {
  var _req$body4 = req.body,
      article = _req$body4.article,
      _id = _req$body4._id;
  ArticleModel.create(_objectSpread({}, article, {
    author: _id
  })).then(function (article) {
    res.send({
      status: SUCCESS,
      data: article
    });
    UserModel.findOneAndUpdate({
      _id: _id
    }, {
      $addToSet: {
        published_article: article._id
      }
    }).then(function (old) {
      console.log('向作者发布文章中添加该文章成功');
    })["catch"](function (err) {
      console.log('向作者发布文章中添加该文章异常', err);
    });
    ClassificationModel.findOneAndUpdate({
      name: article.classification
    }, {
      $addToSet: {
        article: article._id
      }
    }).then(function (old) {
      console.log('向分类发布文章中添加该文章成功');
    })["catch"](function (err) {
      console.log('向分类发布文章中添加该文章异常', err);
    });
  })["catch"](function (err) {
    console.log('添加文章异常', err);
    res.send({
      status: FAIL,
      msg: '添加文章异常，请重新尝试'
    });
  });
}); // 删除文章

router.post('/article/delete', function (req, res) {
  ArticleModel.findOneAndDelete({
    _id: req.body
  }).then(function (article) {
    res.send({
      status: SUCCESS,
      data: article
    });
    UserModel.findOneAndUpdate({
      _id: article.author
    }, {
      $pull: {
        published_article: article._id
      }
    }).then(function (old) {
      console.log('在作者发布文章中删除该文章成功');
    })["catch"](function (err) {
      console.log('在作者发布文章中删除该文章失败', err);
    });
    ClassificationModel.findOneAndUpdate({
      name: article.classification
    }, {
      $pull: {
        article: article._id
      }
    }).then(function (old) {
      console.log('在分类发布文章中删除该文章成功');
    })["catch"](function (err) {
      console.log('在分类发布文章中删除该文章失败', err);
    });
  })["catch"](function (err) {
    console.log('删除文章异常', err);
    res.send({
      status: FAIL,
      msg: '删除文章异常，请重新尝试'
    });
  });
}); // 更新文章或者根据_id查找文章

router.post('/article/update', function (req, res) {
  var _req$body5 = req.body,
      _id = _req$body5._id,
      article = _req$body5.article;
  ArticleModel.findOne({
    _id: _id
  }).then(function (viewAdd) {
    // 每次请求这个文章，将浏览量+1
    Object.assign(article, {
      view_amount: viewAdd.view_amount + 1
    });
    ArticleModel.findOneAndUpdate({
      _id: _id
    }, article).then(function (old) {
      res.send({
        status: SUCCESS,
        data: Object.assign(old, article)
      });
    })["catch"](function (err) {
      console.log('更新文章异常', err);
      res.send({
        status: FAIL,
        msg: '更新文章异常，请重新尝试'
      });
    });
  });
}); // 发送消息

router.post('/message/add', function (req, res) {
  var message = req.body;
  MessageModel.create(message).then(function (message) {
    res.send({
      status: SUCCESS,
      data: message
    });
    UserModel.findOneAndUpdate({
      _id: message.from_id
    }, {
      $addToSet: {
        sent_message: message._id
      }
    }).then(function () {
      console.log('向消息发送者里面添加消息');
    });
    UserModel.findOneAndUpdate({
      _id: message.to_id
    }, {
      $addToSet: {
        received_message: message._id
      }
    }).then(function () {
      console.log('向消息接收者里面添加消息');
    });
  });
}); // 根据_id获取其接收消息
// router.post('/message/arr',(req,res)=>{
//   const {arr:idArr} = req.body
//   let data = {
//     arr:[]
//   }
//   idArr.map(id=>{
//     MessageModel.find({_id:id})
//       .then(message=>{
//         data.arr.push(message)
//       })
//   })
//   res.send({status:SUCCESS,data})
// })
// 获取所有信息

router.get('/message/list', function (req, res) {
  MessageModel.find().then(function (messages) {
    res.send({
      status: SUCCESS,
      data: messages
    });
  })["catch"](function (err) {
    console.log("获取信息列表失败", err);
    res.send({
      status: FAIL,
      msg: "获取信息列表异常，请重新尝试"
    });
  });
});
module.exports = router;
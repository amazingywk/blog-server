const express = require('express')
const md5 = require('blueimp-md5')



const UserModel = require('../models/UserModel')
const ArticleModel = require('../models/ArticleModel')
const ClassificationModel = require('../models/ClassificationModel')
const {SUCCESS,FAIL} = require('../config/index')
const MessageModel = require('../models/MessageModel')

// 得到路由器对象
const router = express.Router()

/**
 * 文件上传与删除
 * 上传post('img/upload') 删除post('img/delete'){name}
 */
require('./file-upload')(router)
const {setToken} = require('../token')

// 登录
router.post('/login', (req, res) =>{
  const {username, password} = req.body
  UserModel.findOne({username, password: md5(password)})
    .then(user =>{
      if(user) { // 登录成功
        setToken(user.username).then(token=>{
          res.send({status: SUCCESS, data: user,token:token})
          // return res.json({
          //   code:200,
          //   message:'登录成功',
          //   token:token
          // })
        })
        // res.cookie('') 设置cookie待实现
        // res.send({status: SUCCESS, data: user,token:token})
      } else { // 登录失败
        res.send({status: FAIL, data: '用户名或密码不正确'})
      }
    })
    .catch(error => {
      console.log('登录异常', error)
      res.send({status: FAIL, msg: '登录异常，请重新尝试'})
    })
})

// 获取分类列表
router.get('/classification/list', (req,res)=>{
  ClassificationModel.find()
    .then(classifications=>{
      res.send({status: SUCCESS, data: classifications})
    })
    .catch(error=>{
      console.log('获取分类列表异常', error)
      res.send({status: FAIL, msg: '获取分类列表异常，请重新尝试'})
    })
})

// 添加分类
router.post('/classification/add',(req,res)=>{
  const {name} = req.body
  ClassificationModel.findOne({name})
    .then(classification=>{
      if(classification){
        res.send({status:FAIL,msg:'该分类已存在'})
      }else{
        ClassificationModel.create({name})
          .then(classification=>{
            res.send({status:SUCCESS, data: classification})
          })
          .catch(error=>{
            console.log('添加分类异常', error)
            res.send({status: FAIL, msg:'添加分类异常，请重新尝试'})
          })
      }
    })
})

// 删除分类
router.post('/classification/delete',(req,res)=>{
  ClassificationModel.findOneAndDelete(req.body)
    .then(classification=>{
      res.send({status:SUCCESS,data:classification})
    })
    .catch(err=>{
      console.log(err)
      res.send({status:FAIL,msg:'删除分类异常，请重新尝试'})
    })
})

// 根据_id更新分类
router.post('/classification/update',(req,res)=>{
  const {_id,name} = req.body
  ClassificationModel.findOneAndUpdate({_id},{name})
    .then(old=>{
      res.send({status:SUCCESS,data:old})
    })
    .catch(error=>{
      console.log('更新分类异常',error)
      res.send({status:FAIL,msg:'更新分类异常，请重新尝试'})
    })
})

// 获取用户列表
router.get('/user/list',(req,res)=>{
  UserModel.find()
    .then(userList=>{
      res.send({status:SUCCESS,data:userList})
    })
    .catch(error=>{
      console.log('获取用户列表异常',error)
      res.send({status:FAIL,msg:'获取用户列表异常，请重新尝试'})
    })
})

// 添加用户
router.post('/user/add',(req,res)=>{
  const {username,password} = req.body
  UserModel.findOne({username})
    .then(user=>{
      if(user){
        res.send({status:FAIL,msg:'该用户已经存在',data:user})
      }else{
        UserModel.create({...req.body,password: md5(password)})
          .then(user=>{
            res.send({status:SUCCESS,data:user})
          })
          .catch(error=>{
            console.log('添加用户异常',error)
            res.send({status:FAIL,msg:'添加用户异常，请重新尝试'})
          })
      }
    })
  
})

// 更新数据或id查找用户
router.post('/user/update',(req,res)=>{
  const user = req.body
  UserModel.findOneAndUpdate({_id:user._id},user)
    .then(OldUser=>{
      res.send({status:SUCCESS,data:Object.assign(OldUser,user)})
    })
    .catch(error=>{
      console.log('更新用户异常',error)
      res.send({status:FAIL,msg:'更新用户异常，请重新尝试'})
    })
})

// 删除用户
router.post('/user/delete',(req,res)=>{
  const {_id} = req.body
  UserModel.findOneAndDelete({_id})
    .then(user=>{
      res.send({status:SUCCESS,data:user})
    })
    .catch(error=>{
      console.log('删除用户异常')
      res.send({status:FAIL,msg:'删除用户异常，请重新尝试'})
    })
})

// 获取文章列表
router.get('/article/list',(req,res)=>{
  ArticleModel.find()
    .then(articles=>{
      res.send({status:SUCCESS,data:articles})
    })
    .catch(err=>{
      console.log('获取文章列表异常',err)
      res.send({status:FAIL,msg:'获取文章列表异常，请重新尝试'})
    })
})

// 添加文章
router.post('/article/add',(req,res)=>{
  const {article,_id} = req.body

  ArticleModel.create({...article,author:_id})
    .then(article=>{
      res.send({status:SUCCESS,data:article})
      UserModel.findOneAndUpdate({_id:_id},{$addToSet:{published_article:article._id}})
        .then(old=>{
          console.log('向作者发布文章中添加该文章成功')
        })
        .catch(err=>{
          console.log('向作者发布文章中添加该文章异常',err)
        })
      ClassificationModel.findOneAndUpdate({name:article.classification},{$addToSet:{article:article._id}})
        .then(old=>{
          console.log('向分类发布文章中添加该文章成功')
        })
        .catch(err=>{
          console.log('向分类发布文章中添加该文章异常',err)
        })
    })
    .catch(err=>{
      console.log('添加文章异常',err)
      res.send({status:FAIL,msg:'添加文章异常，请重新尝试'})
    })
})

// 删除文章
router.post('/article/delete',(req,res)=>{
  ArticleModel.findOneAndDelete({_id:req.body})
  .then(article=>{
    res.send({status:SUCCESS,data:article})
    UserModel.findOneAndUpdate({_id:article.author},{$pull:{published_article:article._id}})
      .then(old=>{
        console.log('在作者发布文章中删除该文章成功')
      })
      .catch(err=>{
        console.log('在作者发布文章中删除该文章失败',err)
      })
    ClassificationModel.findOneAndUpdate({name:article.classification},{$pull:{article:article._id}})
    .then(old=>{
      console.log('在分类发布文章中删除该文章成功')
    })
    .catch(err=>{
      console.log('在分类发布文章中删除该文章失败',err)
    })
  })
  .catch(err=>{
    console.log('删除文章异常',err)
    res.send({status:FAIL,msg:'删除文章异常，请重新尝试'})
  })
})

// 更新文章或者根据_id查找文章
router.post('/article/update',(req,res)=>{
  const {_id,article} = req.body
  ArticleModel.findOne({_id})
    .then(viewAdd=>{
      // 每次请求这个文章，将浏览量+1
      Object.assign(article,{view_amount : viewAdd.view_amount+1})
    
      ArticleModel.findOneAndUpdate({_id},article)
      .then(old=>{
        res.send({status:SUCCESS,data:Object.assign(old,article)})
      })
      .catch(err=>{
        console.log('更新文章异常',err)
        res.send({status:FAIL,msg:'更新文章异常，请重新尝试'})
      })
    })
})

// 发送消息
router.post('/message/add',(req,res)=>{
  const message = req.body
  MessageModel.create(message)
    .then(message=>{
      res.send({status:SUCCESS,data:message})
      UserModel.findOneAndUpdate({_id:message.from_id},{$addToSet:{sent_message:message._id}})
        .then(()=>{
          console.log('向消息发送者里面添加消息')
        })
      UserModel.findOneAndUpdate({_id:message.to_id},{$addToSet:{received_message:message._id}})
        .then(()=>{
          console.log('向消息接收者里面添加消息')
        })
    })
})

// 根据_id获取其接收消息
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
router.get('/message/list',(req,res)=>{
  MessageModel.find()
    .then(messages=>{
      res.send({status:SUCCESS,data:messages})
    })
    .catch(err=>{
      console.log("获取信息列表失败",err)
      res.send({status:FAIL,msg:"获取信息列表异常，请重新尝试"})
    })
})

module.exports = router
/*
能操作messages集合数据的Model
 */
const mongoose = require('mongoose')
const UserModel = require('./UserModel')

const messageSchema = new mongoose.Schema({
  from_id:{type:String,required:true},
  to_id:{type:String,required:true},
  title:{type:String,required:true},
  image:{type:String},
  content:{type:String},
  create_time:{type:Number,default:Date.now},
})

const MessageModel = mongoose.model('blog-messages',messageSchema)

// 找到内部机器人_id
// let robotId = ''
// UserModel.findOne({username:'机器人小凯'})
//   .then(robot=>{
//     if(robot){
//       robotId = robot._id
//     }else{
//       console.log('查找机器人小凯_id失败')
//     }
//   })

// 为每一个用户发送欢迎信息
// UserModel.find()
//   .then(users=>{
//     users.map(user=>{
//       MessageModel.findOne({from_id:robotId})
//       .then(message=>{
//         if(!message){
//           MessageModel.create({
//             from_id:robotId,
//             to_id:user._id,
//             title:'新用户欢迎',
//             content:'欢迎欢迎，热烈欢迎',
//             create_time:Date.now
//           })
//             .then(message=>{
//               UserModel.findOneAndDelete({id:user._id},{$addToSet:{received_message:message._id}})
//                 .then(()=>{
//                   console.log('向用户里添加他发送的消息')
//                 })
//               UserModel.findByIdAndUpdate({id:robotId})
//             })
//         }
//       })
//     })
//   })



module.exports = MessageModel
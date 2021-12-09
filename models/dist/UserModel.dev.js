"use strict";

/*
能操作users集合数据的Model
 */
// 引入mongoose和md5加密
var mongoose = require('mongoose');

var md5 = require('blueimp-md5');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  create_time: {
    type: Number,
    "default": Date.now
  },
  role: {
    type: String,
    required: true
  },
  published_article: {
    type: Array
  },
  // 发表的文章
  collected_article: {
    type: Array
  },
  // 收藏的文章
  // personal_article: {type: Array},              // 私密文章
  sent_message: {
    type: Array
  },
  // 发送的信息
  received_message: {
    type: Array
  },
  // 接收的信息
  fans: {
    type: Array
  },
  portrait: {
    type: String,
    "default": 'https://tse2-mm.cn.bing.net/th/id/OIP-C.AjC_T4iZJYRr-_fAGNI_igAAAA?pid=ImgDet&rs=1'
  },
  background: {
    type: String,
    "default": 'https://pic.3gbizhi.com/2015/0212/20150212040645699.jpg'
  } // menus: Array 所有有权限操作菜单path的数组

}); //定义Model（与集合对应，可以操作集合）

var UserModel = mongoose.model('blog_users', userSchema); // 初始化默认超级管理员用户：admin/admin007

UserModel.findOne({
  username: 'admin'
}).then(function (user) {
  if (!user) {
    UserModel.create({
      username: 'admin',
      password: md5('admin007'),
      gender: 'male',
      email: '641321656@qq.com',
      role: 'admin'
    }).then(function (user) {
      console.log('初始化用户: 用户名: admin 密码为: admin007');
    });
  }
}); // 向外暴露Model

module.exports = UserModel;
/*
能操作articles集合数据的Model
 */
// 引入mongoose
const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  title:{type: String,required: true},                  // 文章标题
  author:{type: String,required: true},                 // 文章作者
  author_name:{type:String,required:true},              // 文章作者名称
  classification: {type: String,required: true},        // 文章所属分类
  content:{type:String},                                // 文章主要内容
  like_amount:{type: Number,default: 0},                // 文章被喜欢数量
  view_amount: {type: Number,default: 0},               // 文章浏览量
  collect_user: {type: Array,default: []},              // 收藏该文章的人
  images:{type:Array},                                  // 文章包含图片
  comment_area: {type: Array},                          // 文章评论区
  public:{type:Boolean,default:false},                  // 文章是否公开
  checked:{type:Boolean,default:false},                 // 文章是否已经被审核
});

const ArticleModel = mongoose.model('blog_articles', articleSchema)

module.exports = ArticleModel
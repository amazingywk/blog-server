/*
能操作categorys集合数据的Model
 */
const mongoose = require('mongoose')

const classificationSchema = new mongoose.Schema({
  name:{type:String,required:true},
  article:{type:Array}
})

const ClassificationModel = mongoose.model('blog-classifications',classificationSchema)

module.exports = ClassificationModel
"use strict";

/*
能操作categorys集合数据的Model
 */
var mongoose = require('mongoose');

var classificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  article: {
    type: Array
  }
});
var ClassificationModel = mongoose.model('blog-classifications', classificationSchema);
module.exports = ClassificationModel;
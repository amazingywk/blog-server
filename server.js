/*
应用的启动模块
1. 通过express启动服务器
2. 通过mongoose连接数据库
  说明: 只有当连接上数据库后才去启动服务器
3. 使用中间件
 */

const mongoose = require('mongoose')
const express = require('express')

const app = express()

// 设置允许跨域访问
// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin",req.headers.origin || '*');
//         //允许的header类型
//     res.header("Access-Control-Allow-Headers","Content-Type,Authorization,X-Requested-With"); //跨域允许的请求方式
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");// 可以带cookies
//     res.header("Access-Control-Allow-Credentials",1)
//         next();
// });

const expressJwt = require('express-jwt')
const {getToken,SECRET_KEY} = require('./token')

// app.use(expressJwt({
//     secret:SECRET_KEY,
//     algorithms:['HS256']
// }).unless({
//     path:['/login','/user/add','/home',/^\public\/.*/,/\public\/.*/,'/']
// }))

app.use(function (req,res,next) {
    // console.log(req)
    var token = req.headers['authorization'];
    console.log(token,'servertoken')
    if(token==undefined||token.split(' ')[1]=='null'){
        // res.status(401).send("干嘛呢？想硬闯？！")
        return next();
    }else{
        getToken(token).then((data)=>{
            req.user = data                 //将token解析出来的用户存入req.user
            return next();
        }).catch(()=>{
            return next();
        })
    }
})

// app.use(expressJwt({
//     secret:SECRET_KEY,
//     algorithms:['HS256']
// }).unless({
//     path:['/login','/user/add','/home',/^\public\/.*/,'/']
// }))

// 声明使用静态中间件
app.use(express.static('public'))
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true})) // 请求体参数是：name=tom&pwd=123
app.use(express.json({limit:"5000kb"})) // 请求体参数是json结构：{name: tom, pwd: 123}

// 声明使用路由器中间件
const indexRouter = require('./routers')
app.use('/',indexRouter)

// 通过mongoose连接数据库
mongoose.connect('mongodb://localhost/first_blog',{useNewUrlParser: true})
    .then(()=>{
        console.log('连接数据库成功！！！')
        // 只有连接数据库成功后才启动服务器
        app.listen('9000',()=>{
            console.log('网站服务器已经建立，请访问：http://localhost:9000')
        })
    })
    .catch(err =>{
        console.error('连接数据库失败',err)
    })
const express = require('express');
const { user } = require('./routers/user');
const { db } = require('./utils/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { post } = require('./routers/posts');
const app = express();
const PORT= process.env.PORT || 4000;
app.use(express.json({limit:'250mb', strict:false}))
app.use(function(req,res,next){
    cors({origin:req.headers.origin})
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'X-Request-With,Accept,Content-Type,X-HTTP-Method-Override')
    res.header  ('Access-Control-Allow-Credentials', true)
    next()
})
app
.use(cookieParser())
.use('/user',user)
.use('/post',post)
db();
app.listen(PORT,()=>{
    console.log('listening on port shown here:',PORT);
})
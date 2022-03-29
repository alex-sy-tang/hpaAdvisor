const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')


const access = false


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/contentDB');


  const contentSchema = new mongoose.Schema({
    title:String,
    comment:String,
    imageUrl:String,
  })

  const userSchema = new mongoose.Schema({
    usrName:{
      type:String,
      required:true
    },
    passWord:{
      type:String,
      required:true
    },
    profileUrl:String,
    content:[contentSchema]
  })



  // const userSchema = new mongoose.Schema({
  //   usrName:{
  //     type:String,
  //     required:true
  //   },
  //   passWord:{
  //     type:String,
  //     required:true
  //   },
  //   profileImage:String,
  // })


  const Content = mongoose.model('Content',contentSchema)
  const User = mongoose.model('User',userSchema)
  app.listen('3000',()=>{
    console.log('The server is set up and running on port 3000')
  })

  app.get('/portal',(req,res)=>{
    res.render('portal')
  })

  app.post('/portal',(req,res)=>{
    const usrName = req.body.usrName
    const password = req.body.password
    const logIn = req.body.logIn
    const signUp = req.body.signUp


      User.findOne({usrName:usrName},(err,result)=>{
        if(err){
          console.log('err')
        }else{
          if(! result){
            const newUser = new User({
              usrName:usrName,
              passWord:password
            })
            newUser.save()
            res.redirect('/')
            access = true
          }else{
            res.redirect('/')
            access = true
          }
        }
      })

  })

  app.get('/',(req,res)=>{
    res.render('index')
  })



  app.get('/food',(req,res)=>{
    res.render('food')
  })

  app.get('/trip',(req,res)=>{
    res.render('trip')
  })

  app.get('/yours',(req,res)=>{
    res.render('yours')
  })

  app.get('/community',(req,res)=>{
    Content.find({},(err,docs)=>{
      if(err){
        console.log(err)
      }else{
        res.render('community',{usrContent:docs})
      }
    })

  })

  app.post('/community',(req,res)=>{
    const title = req.body.title
    const comments = req.body.comments
    const imageUrl = req.body.image
    const userContent = new Content({title:title,comment:comments,imageUrl:__dirname+imageUrl})
    userContent.save()
    res.redirect('/community')
  })
}

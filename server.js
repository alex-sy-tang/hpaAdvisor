const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/contentDB');
  const contentSchema = new mongoose.Schema({
    title:String,
    comment:String,
    imageUrl:String,
    userName:String,
  })
  const Content = mongoose.model('Content',contentSchema)
  app.listen('3000',()=>{
    console.log('The server is set up and running on port 3000')
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


// app.listen('3000',()=>{
//   console.log('The server is set up and running on port 3000')
// })
//
// app.get('/',(req,res)=>{
//   res.render('index')
// })
//
// app.get('/food',(req,res)=>{
//   res.render('food')
// })
//
// app.get('/trip',(req,res)=>{
//   res.render('trip')
// })
//
// app.get('/yours',(req,res)=>{
//   res.render('yours')
// })
//
// app.get('/community',(req,res)=>{
//   res.render('community')
// })
//
// app.post('/community',(req,res)=>{
//   const title = req.body.title
//   const comments = req.body.comments
//   res.redirect('/community')
// })

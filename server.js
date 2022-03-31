const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')


const upload = multer({dest:'./public/css/image/'})
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/contentDB');
  const userSchema = new mongoose.Schema({
    usrName:{
      type:String,
      required:true,
    },
    passWord:{
      type:String,
      required:true
    },
    profileUrl:String,

  })


  const contentSchema = new mongoose.Schema({
    title:String,
    comment:String,
    imageUrl:String,
    liked:Number
  })

  const mainSchema = new mongoose.Schema({
    content:[contentSchema],
    user:[userSchema]
  })




  const Content = mongoose.model('Content',contentSchema)
  const User = mongoose.model('User',userSchema)
  const Main = mongoose.model('Main',mainSchema)

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
            res.redirect('/signup')
          }else{
            if(result.usrName === usrName && result.passWord === password){
              res.redirect('/')
            }else{
              console.log('Your user name is wrong')
              res.redirect('/portal')
            }

          }
        }
      })
  })

  app.get('/signup',(req,res)=>{
    res.render('signup')
  })

  app.post('/signup',(req,res)=>{
    const usrName = req.body.usrName
    const password = req.body.password
    const signUp = req.body.signUp

    User.findOne({usrName:usrName},(err,result)=>{
      if(! result){
        const newUser = new User({
          usrName:usrName,
          passWord:password
        })
        newUser.save()
        const newInfo = new Main({
          content:[],
          user:[newUser]
        })
        console.log('Your Account has been successfully set up.')
        res.redirect('/')
        account = usrName
      }else{
        console.log('The user name has been created. Please Sign Up for another one.')
        res.redirect('/signup')
      }
    })
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

  app.get('/',(req,res)=>{
    Content.find({},(err,docs)=>{
      if(err){
        console.log(err);
      }else{
        let reverseDocs = []
        for(var i = 0;i < docs.length;i++){
          let ele = docs[docs.length-1-i]
          reverseDocs.push(ele);

        }

        res.render('community',{usrContent:reverseDocs});
      }
    })
  })

  app.post('/',upload.single('image'),(req,res,next)=>{
    const title = req.body.title
    const comments = req.body.comments
    console.log(req.file)
    let imageUrl = ''



    if(! req.file){
      imageUrl = 'css/image/food1.png'
    }else{
      imageUrl = req.file.path.slice(6)
    }

    // const image = req.file.path.slice(6)



    const userContent = new Content({title:countString(title,25),comment:countString(comments,30),imageUrl:imageUrl})
    userContent.save()
    res.redirect('/')
  })
}

let countString = (text,number)=>{
  if (text.length >= number){
    let abbr = text.slice(0,number) + " ..."
    return abbr
  }else{
    let abbr =text
    return abbr
  }
}

let reverse = (oldArray,newArray)=>{
  let reverseDocs = []
  for(var i = 0;i<oldArray.length;i++){
    let ele = oldArray[oldArray.length-1-i]
    reverseDocs = newArray.push(ele)
  }
  return reverseDocs
}

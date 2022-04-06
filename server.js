const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const bson = require('bson');


const upload = multer({dest:'./public/css/image/'})
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))
app.set('view engine','ejs')
app.use(session({
  secret: 'Hello',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/contentDB');

  const contentSchema = new mongoose.Schema({
    _id:{
      type:String,
      required:true,
    },
    user:String,
    title:String,
    comment:String,
    imageUrl:String,
    liked:Number,
    abbr:String,

  })

  const savedSchema = new mongoose.Schema({
    _id:{
      type:String,
      required:true,
    },
    user:String,
    title:String,
    comment:String,
    imageUrl:String,
    liked: Number,
    abbr:String,
  })

  const userSchema = new mongoose.Schema({
    username:{
      type:String,
      required:true,
    },
    password:String,
    profileUrl:String,
    content:[contentSchema]
  })


  userSchema.plugin(passportLocalMongoose);


  const Content = mongoose.model('Content',contentSchema);
  const Saved = mongoose.model('Saved',savedSchema);
  const User = new mongoose.model('User',userSchema);
  // const Main = mongoose.model('Main',mainSchema)

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


  app.listen('3000',()=>{
    console.log('The server is set up and running on port 3000')
  })

  app.get('/login',(req,res)=>{
    res.render('login');
  })

  app.post('/login',(req,res)=>{

    const user = new User({
    username:req.body.username,
    password:req.body.password,
  })

  req.login(user,(err)=>{
    if(err){
      console.log(err);
      res.redirect('/login')
    }
    passport.authenticate('local')(req,res,()=>{
      res.redirect('/yours');
    })
  })

})

  app.get('/signup',(req,res)=>{
    res.render('signup')
  })

  app.post('/signup',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    // const signUp = req.body.signUp

    User.register({username:username,active:true},password,(err,user)=>{
    if(err){
      console.log(err)
      res.redirect('/signup')
    }else{
      const authenticate = passport.authenticate('local');

    //I didn't quite understand the part about authentication.
    authenticate(req,res,()=>{
      res.redirect('/yours');
    })
    }
  })
  })


  app.get('/yours',(req,res)=>{
    if(req.isAuthenticated()){
      Content.find({user:req.user.username},(err,docs)=>{
        if(err){
          console.log(err)
        }else{
          let reverseDocs = []
          for(var i = 0;i < docs.length;i++){
            let ele = docs[docs.length-1-i]
            reverseDocs.push(ele);
          }
          res.render('yours',{usrContent:reverseDocs,user:req.user.username});

        }
      })

    }else{
      res.redirect('/login');
    }
  })

  app.post('/yours',(req,res)=>{
    let direction = req.body.button
    let more = req.body.more
    console.log(direction)
    if(req.body.button==="shared"){
      res.redirect('/shared');
    }
    if(req.body.button === "saved"){
      res.redirect('/saved')
    }

  })



  app.get('/:id',(req,res)=>{
    let param = req.params.id
    if(param === 'shared'){
      if(req.isAuthenticated()){
        Content.find({user:req.user.username},(err,docs)=>{
          if(err){
            console.log(err)
          }else{
            let reverseDocs = []
            for(var i = 0;i < docs.length;i++){
              let ele = docs[docs.length-1-i]
              reverseDocs.push(ele);
            }
            res.render('yours',{usrContent:reverseDocs,user:req.user.username});

          }
        })

      }else{
        res.redirect('/login');
      }
      }
    if(param === 'saved'){
      if(req.isAuthenticated()){
        Saved.find({user:req.user.username},(err,docs)=>{
          if(err){
            console.log(err)
          }else{
            let reverseDocs = []
            for(var i = 0;i < docs.length;i++){
              let ele = docs[docs.length-1-i]
              reverseDocs.push(ele);
            }
            res.render('yours',{usrContent:reverseDocs,user:req.user.username});
          }
        })
      }else{
        res.redirect('/login');
      }
    }
  })



app.post('/community',(req,res)=>{

  res.redirect('/community/'+req.body.more);
})

app.get('/community/:id',(req,res)=>{

  Content.findOne({_id:req.params.id},(err,result)=>{
    if(err){
      console.log(err);
    }
    res.render('more',{usrContent:result});
  });



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

    let imageUrl = ''

    if(! req.file){
      imageUrl = 'css/image/food1.png'
    }else{
      imageUrl = req.file.path.slice(6)
    }
    let id = new mongoose.Types.ObjectId();
    const userContent = new Content({_id:id,user:req.user.username,title:countString(title,25),comment:comments,imageUrl:imageUrl})
    userContent.save()
    res.redirect('/')
  })

}





let countString = (text,number)=>{
  if (text.length >= number){
    let abbr = text.slice(0,number) + " ..."
    return abbr
  }else if(text.length == 0){
    let abbr = 'No Information'
    return abbr
  }else{
    let abbr = text
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

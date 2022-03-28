const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')


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

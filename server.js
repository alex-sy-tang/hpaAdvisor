const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

app.listen('3000',()=>{
  console.log('The server is set up and running on port 3000')
})

app.get('/',(req,res)=>{
  res.sendFile('index.html')
})

app.get('/food',(req,res)=>{
  res.sendFile('food.html')
})

app.get('/trip',(req,res)=>{
  res.sendFile('trip.html')
})

app.get('/yours',(req,res)=>{
  res.sendFile('yours.html')
})

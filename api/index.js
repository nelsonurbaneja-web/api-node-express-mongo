require("dotenv").config({
  path: ".env",
});
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const app = express();
const cloudinary = require('cloudinary').v2

// Config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// import router
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const userRouter = require('./routes/user')
const notesRouter = require('./routes/note')

// settings
app.set('appName', 'Servidor app nodejs express ');
const configMongoose = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads')) // para tener acceso a la carpeta
app.use(morgan('dev'))
app.use((req, res, next) => { //Configuring cors
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Header',
  'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')

  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    res.status(200).json({})
  }
  next();
})


// routes
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/user', userRouter);
app.use('/note', notesRouter);

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
 res.status(error.status || 500);
 res.json({
   error: {
     message: error.message
   }
 })
})

const urlConnect = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASSWORD_MONGO}@api-restful.q2osb.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`
// Running server and connect db
mongoose.connect(urlConnect, configMongoose)
.then(() => {
  console.log(`Conexion establecida a la base de datos`)
  app.listen(process.env.PORT, () => {
    console.log(`Server running in port ${process.env.PORT} - ${app.get('appName')}`)
  })
})
.catch(err => {
  return console.log('Error al conectar a la base de datos ', err)
})


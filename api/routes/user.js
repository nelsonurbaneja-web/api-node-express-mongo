const { Router } = require('express')
const router = Router();
const bcrypt = require('bcryptjs')

// Middleware 
const createToken = require('../middleware/create-token')

// Importing models
const User = require('../models/user')
const Note = require('../models/note')

router.post('/signup', async (req,res) => {
  await User.find({email: req.body.email}) // Busco el usuario para saber si ya se registro
  .then(async user => {
    if(user.length >= 1) { // Si me devuelve el usuario le mando el mensaje 
      return res.status(409).json({message: 'Error, it user is registered'})
    } else { 
      const hash = await bcrypt.hash(req.body.password, 10) // Si no esta registrado, encripto la clave 
      const user = new User({
        firstName: req.body.firstName,
        email: req.body.email,
        password: hash
      })
      await user.save()
      .then(newUser => {
        res.status(200).json({userCreated: newUser})
      })
      .catch(err => {
        res.status(500).json({message: 'Error to register user', err})
      })
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Error to register user', err})
  })
})


router.post('/signin', async (req, res) => {
  await User.find({ email: req.body.email }).populate('notes', '_id, content') // verifico si el usario esta registrado
  .then(user =>  {
    if(user.length < 1) { // Si no está registrado le aviso
      res.status(401).json({message: 'Login fallido, user not register'})
    }
    // Si está registrado compruebo que coloque la clave correcta
    bcrypt.compare(req.body.password, user[0].password, async (err, result) => { // Primero coloco la clave del input luego la comparo con la que me trae la db
     if(err) {
      return res.status(401).json({message: 'Login fallido password'})
     }
     if(result) {
      //  Colocandole las notas al usario, en caso de que no se hayan guardado al crearlas
      //  await Note.find({ creator: user[0]._id }).populate('creator')
      //  .then(notes => {
      //   user[0].notes = notes
      //  })
      return res.status(200).json({message: 'Auth Successful', user, token: createToken(user)})
     } else {
      return res.status(401).json({message: 'Login fallido password'})
     }
    });
  })
  .catch(err => {
    res.status(500).json({message: 'Error to login user', err})
  })
})

// Obtener usuarios

router.get('/', async (req, res) => {
  await User.find().populate('notes', '_id content') 
  .then(users => {
    res.status(200).json({users})
  })
  .catch(err => {
    return res.status(500).send({message: 'Error al consultar los usuarios', err})
  })
})

module.exports = router
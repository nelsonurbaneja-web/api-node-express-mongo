const { Router } = require('express');
const moment = require('moment');
const router = Router();

// import Models
const Note = require('../models/note');
const User = require('../models/user');

router.post('/', async (req, res) => {
  const note = new Note({
    content: req.body.content,
    date: moment().unix(),
    important: req.body.important,
    creator: req.body.userId
  })
  await note.save()
  .then(async note => {
    await User.findById('605781e37025d504ac1e93eb')
    .then(async user => {
      await user.notes.push(note) // Cuando se crea la nota, se la asigno al usario de una
      await user.save()
      return res.status(200).json({ message: 'note created', note })
    })
    .catch(err => {
      return res.status(500).send({message: 'Error asignar la nota al user ', err})
    })
  })
  .catch(err => {
    return res.status(500).send({message: 'Error al crear la nota ', err})
  })
})

router.get('/', async (req, res) => {
  await Note.find().populate('creator', '_id firstName email')
  .then(notes => {
    return res.status(200).json({ notes })
  })
  .catch(err => {
    return res.status(500).send({message: 'Error al buscar las notas ', err})
  })
})

module.exports = router;
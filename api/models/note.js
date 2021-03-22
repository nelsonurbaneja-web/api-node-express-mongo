const { Schema , model} = require('mongoose')

const noteSchema = new Schema({
  content: { type: String, required: true},
  date: Date,
  important: Boolean,
  creator: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('Note', noteSchema)
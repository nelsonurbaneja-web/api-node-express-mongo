const { Schema, model} = require('mongoose');

const userSchema = new Schema({
  firstName: { type: String, required: true},
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: { type: String, required: true},
  notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
})

module.exports = model('User', userSchema)
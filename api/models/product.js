const { Schema, model } =  require('mongoose')

const ProductSchema = new Schema({
  name: {type: String, required: true},
  price: {type: Number, default: 0, required: true},
  description: String,
  category: {type: String, enum: ['metal', 'pasta', 'semi-al-aire', 'al-aire']},
  size: String,
  quantity: {type: Number, default: 0},
  productImage: {type: Schema.Types.ObjectId, ref: 'ProductImage'}
})

module.exports = model('Product', ProductSchema);
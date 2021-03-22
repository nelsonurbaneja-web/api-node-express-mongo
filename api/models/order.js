const { Schema , model} = require('mongoose')

const orderSchema = new Schema({
  product : { type: Schema.Types.ObjectId, ref: 'Product' },
  quiantity: { type: Number, default: 1}
})

module.exports = model('Order', orderSchema)
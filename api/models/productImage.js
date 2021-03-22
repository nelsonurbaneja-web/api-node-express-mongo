const { Schema, model } =  require('mongoose')

const ProductImageSchema = new Schema({
  imageUrl: {type: String, required: true},
  publicId: {type: String, required: true},
  productId: {type: Schema.Types.ObjectId, ref: 'Product'}
})

module.exports = model('ProductImage', ProductImageSchema);
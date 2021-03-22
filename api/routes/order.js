const { Router } = require('express');
const router = Router();

// import Models
const Order = require('../models/order');

router.post('/', async (req, res) => {
  const order = new Order({
    product : req.body.productId, // Validar este id que exista
    quiantity: req.body.quiantity
  })
  await order.save()
  .then(order => {
    return res.status(200).json({ message: 'Order created', order })
  })
  .catch(err => {
    return res.status(500).send({message: 'Error al crear la orden ', err})
  })
})

router.get('/', async (req, res) => {
  await Order.find().populate('product', 'name price')
  .then(orders => {
    return res.status(200).json({ orders })
  })
  .catch(err => {
    return res.status(500).send({message: 'Error al buscar las ordenes ', err})
  })
})

module.exports = router;
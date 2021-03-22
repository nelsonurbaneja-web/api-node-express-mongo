const { Router } = require('express');
const router = Router();
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const fs = require('fs-extra') 

// Import models
const ProductImage = require('../models/productImage')

// Middleware
const checkToken = require('../middleware/check-token')

// Config almacen de imagenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})

// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if(file.minetype === 'image/jpeg' || file.minetype === 'image/png' || file.minetype === 'image/jpg') {
//     cb(null, true)
//   } else {
//      cb(null, false)
//   }
// }

const upload = multer({
  storage: storage, 
  // limits: {
  //   fileSize: 1024 * 1024 * 15
  // },
  // fileFilter: fileFilter
});


// import Models
const Product = require('../models/product');

// Agregar un nuevo producto
router.post('/', upload.single('productImage'), async  (req, res) => {
  console.log('req.file' , req.file)

  // Creo el producto
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    size: req.body.size,
    quantity: req.body.quantity
  })
  
  await product.save() // Guardo el producto 
  .then(async product => {
    const resultImageCloudinary = await cloudinary.uploader.upload(req.file.path)

    // Creo la imagen y la relaciono
    const image = new ProductImage({
      imageUrl: resultImageCloudinary.url,
      publicId: resultImageCloudinary.public_id,
      productId: product._id
    })
    await image.save() // Guardo la imagen 
    await fs.unlink(req.file.path) // Elimino la imagen de /upload
    product.productImage = await image._id // Le asigno al producto su imagen pasandole el id de la imagen
    await product.save() // Guardo los cambios en le producto ya que modifique su propiedad productImage
    return res.status(201).json({message: 'Producto creado con exito:)', product})
  })
  .catch(err => {
    return res.status(500).send({message: 'A ocurrido un erro al crear el producto :/', err})
  })
})

// Consultar todos los productos
router.get('/', async (req, res) => {
  await Product.find().limit(10).sort({price: -1}).select('name price description productImage').populate('productImage') // Traeme solo 10 regsitros y me los ordenas del precio mas alto para abajo y sol otraeme 'name price description y productImage'
  .then(products => {
    if(products.length === 0) return res.status(404).send({message: 'No tiene productos almacenados'})
    return res.status(200).json({ productos: products })
  })
  .catch(err => {
    return res.status(500).send({message: 'A ocurrido un error al obtener los productos :(', err})
  })
})

// Consultar un solo producto
router.get('/:productId', async (req, res) => {
  const productId =  req.params.productId
  await Product.findById(productId).select('name price description productImage').populate('productImage')
  .then(product => {
    if(!product) return res.status(404).send({message: 'El producto no existe :('})
    return res.status(200).json({ product })
  })
  .catch(err => {
    return res.status(500).send({message: 'A ocurrido un error al obtener el producto :(', err})
  })
})

// Consultar por categoria 
router.get('/category/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase();
  await Product.find({category: categoryName})
  .then(products => {
    if(products.length === 0) return res.status(404).send({message: 'No se encontraron productos por la categoria' , categoryName})
    return res.status(200).json({ products })
  })
  .catch(err => {
    return res.status(500).send({message: 'A ocurrido un error al obtener los productos por categorias', err})
  })
})


// Editar un producto
router.put('/:productId', async (req, res) => {
  const productId = req.params.productId
  const product = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    size: req.body.size,
    quantity: req.body.quantity,
  }
  await Product.findByIdAndUpdate(productId, product, {new: true})
  .then(product => {
    if(!product) return res.status(404).send({message: 'El producto que intenta editar no existe.'})
    return res.status(200).json({message: 'Producto modificado con exito', product})
  })
  .catch(err => {
    return res.status(500).send({message: 'No se pudo modificar el producto.'}, err)
  })
})

router.patch('/:productId', async (req,res) => {
  const category = await req.body.category;
  Product.updateOne({_id: req.params.productId}, {$set: {category: category}}, {new: true})
  .then(product => {
    if(!product) return res.status(404).send({message: 'El producto que intenta editar no existe.'})
    res.status(200).json({message: 'Categoria modificada con exito', product})
  })
  .catch(err => {
    return res.status(500).send({message: 'No se pudo modificar el producto.'}, err)
  })
})

// Eliminar un producto
router.delete('/:productId', async (req,res) => {
  const productId =  req.params.productId
  await Product.findByIdAndDelete(productId)
  .then(product => {
    if(!product) return res.status(404).send({message: 'producto no encontrado.'})
    res.status(200).json({message: 'Producto eliminado con exito', product})
  })
  .catch(err => {
    return res.status(500).send({message: 'No se pudo borrar el producto.', err})
  })
})


module.exports = router;
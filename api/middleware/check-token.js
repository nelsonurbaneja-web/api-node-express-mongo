const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // decodificando token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_LOGIN)
    req.userData = decoded
    next();
  } catch(error) {
    return res.status(401).json({message: 'No tienes autorizacion'})
  }
}

module.exports	= checkToken
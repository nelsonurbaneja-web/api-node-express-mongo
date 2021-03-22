const jwt = require('jsonwebtoken');
const moment = require('moment');

const createToken = (user) => { // recibo el usario que se loggea para tomar sus datos y crear el payload
  const payload = {
    sub:  user[0]._id,
    email: user[0].email,
    iat: moment().unix(),
    exp: moment().add(60, 'seconds').unix()
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET_LOGIN);

  return token
}

module.exports = createToken
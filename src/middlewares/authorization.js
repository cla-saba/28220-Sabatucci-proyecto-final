const { logFile } = require('../helpers/loggers');
const jwt = require('jsonwebtoken');

const isAdmin = true;

const checkAuthentication = (req, res, next) => {
  // if (req.isAuthenticated()) {
  try {
    const token = req.headers.authorization.replace('Bearer ','');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      next()
    }
    else {
      return res.status(403).json({
        error: -1,
        descripcion: `usuario no logueado`
      });
    }
  } catch (err) {
    // err
    logFile.warn(`jwt token invalido`);

    return res.status(500).json({
      error: -1,
      descripcion: `jwt token invalido`
    });
  }
}

const checkAuthorization = (req, res, next) => {
  if (!isAdmin) {
    const { method, baseUrl } = req;
    logFile.warn(`ruta ${baseUrl} metodo ${method} no autorizada`);

    return res.status(500).json({
      error: -1,
      descripcion: `ruta ${baseUrl} metodo ${method} no autorizada`
    });
  }
  next();
}

module.exports = {
  checkAuthorization,
  checkAuthentication,
}
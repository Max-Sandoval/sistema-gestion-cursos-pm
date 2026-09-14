const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      mensaje: 'Acceso no autorizado'
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado'
    });
  }
};

const soloAdministrador = (req, res, next) => {
  if (req.usuario.nombre_rol !== 'Administrador') {
    return res.status(403).json({
      mensaje: 'Esta función requiere perfil Administrador'
    });
  }

  next();
};

module.exports = {
  verificarToken,
  soloAdministrador
};
const express = require('express');

const {
  login,
  obtenerRoles,
  obtenerUsuarios,
  registrarUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  restablecerPasswordUsuario,
  cambiarPasswordPropia
} = require('../controllers/authController');


const {
  verificarToken,
  soloAdministrador
} = require('../middleware/authMiddleware');


const router = express.Router();


// =========================================================
// LOGIN
// =========================================================

router.post(
  '/login',
  login
);


// =========================================================
// CAMBIAR CONTRASEÑA PROPIA
// ADMINISTRADOR Y CONSULTA
// =========================================================

router.patch(
  '/cambiar-password',
  verificarToken,
  cambiarPasswordPropia
);


// =========================================================
// ROLES
// SOLO ADMINISTRADOR
// =========================================================

router.get(
  '/roles',
  verificarToken,
  soloAdministrador,
  obtenerRoles
);


// =========================================================
// USUARIOS
// SOLO ADMINISTRADOR
// =========================================================

router.get(
  '/usuarios',
  verificarToken,
  soloAdministrador,
  obtenerUsuarios
);


router.post(
  '/usuarios',
  verificarToken,
  soloAdministrador,
  registrarUsuario
);


router.put(
  '/usuarios/:id',
  verificarToken,
  soloAdministrador,
  actualizarUsuario
);


// =========================================================
// ACTIVAR / DESACTIVAR USUARIO
// SOLO ADMINISTRADOR
// =========================================================

router.patch(
  '/usuarios/:id/estado',
  verificarToken,
  soloAdministrador,
  cambiarEstadoUsuario
);


// =========================================================
// RESTABLECER CONTRASEÑA
// SOLO ADMINISTRADOR
// =========================================================

router.patch(
  '/usuarios/:id/password',
  verificarToken,
  soloAdministrador,
  restablecerPasswordUsuario
);


module.exports = router;
const express = require('express');
const router = express.Router();

const {
  buscarFuncionarios,
  registrarFuncionario,
  obtenerFuncionarios,
  actualizarFuncionario,
  eliminarFuncionario,
  cambiarEstadoFuncionario
} = require('../controllers/funcionarioController');

const {
  verificarToken,
  soloAdministrador
} = require('../middleware/authMiddleware');


// Buscar funcionarios
router.get(
  '/buscar',
  buscarFuncionarios
);


// Obtener todos los funcionarios
router.get(
  '/',
  verificarToken,
  soloAdministrador,
  obtenerFuncionarios
);


// Registrar funcionario
router.post(
  '/',
  verificarToken,
  soloAdministrador,
  registrarFuncionario
);


// Cambiar estado del funcionario
// activo = true  -> Reactivar
// activo = false -> Dar de baja
router.patch(
  '/:id/estado',
  verificarToken,
  soloAdministrador,
  cambiarEstadoFuncionario
);


// Actualizar funcionario
router.put(
  '/:id',
  verificarToken,
  soloAdministrador,
  actualizarFuncionario
);


// Eliminar funcionario
router.delete(
  '/:id',
  verificarToken,
  soloAdministrador,
  eliminarFuncionario
);


module.exports = router;
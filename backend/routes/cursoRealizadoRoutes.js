const express = require('express');

const router = express.Router();

const {
  obtenerCursosFuncionario,
  registrarCursoFuncionario,
  actualizarCursoRealizado,
  eliminarCursoRealizado
} = require('../controllers/cursoRealizadoController');

const {
  verificarToken,
  soloAdministrador
} = require('../middleware/authMiddleware');


// =========================================================
// CURSOS REALIZADOS DE UN FUNCIONARIO
// =========================================================

// Obtener cursos realizados de un funcionario
router.get(
  '/funcionarios/:id/cursos',
  verificarToken,
  soloAdministrador,
  obtenerCursosFuncionario
);


// Registrar un curso realizado para un funcionario
router.post(
  '/funcionarios/:id/cursos',
  verificarToken,
  soloAdministrador,
  registrarCursoFuncionario
);


// =========================================================
// CURSO REALIZADO ESPECÍFICO
// =========================================================

// Actualizar curso realizado
router.put(
  '/cursos-realizados/:id',
  verificarToken,
  soloAdministrador,
  actualizarCursoRealizado
);


// Eliminar curso realizado
router.delete(
  '/cursos-realizados/:id',
  verificarToken,
  soloAdministrador,
  eliminarCursoRealizado
);


module.exports = router;
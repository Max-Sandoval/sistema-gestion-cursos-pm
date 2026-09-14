const express = require('express');


const {

  // ZONAS NAVALES
  obtenerZonas,
  registrarZona,
  actualizarZona,
  eliminarZona,

  // REPARTICIONES
  obtenerReparticiones,
  registrarReparticion,
  actualizarReparticion,
  eliminarReparticion,

  // CURSOS
  obtenerCursos,
  registrarCurso,
  actualizarCurso,
  eliminarCurso,

  // TIPOS DE CURSO
  obtenerTiposCursos,
  registrarTipoCurso,
  actualizarTipoCurso,
  eliminarTipoCurso,

  // INSTITUCIONES
  obtenerInstituciones,
  registrarInstitucion,
  actualizarInstitucion,
  eliminarInstitucion,

  // ESTADOS DE CURSO
  obtenerEstados,
  registrarEstado,
  actualizarEstado,
  eliminarEstado,

  // REPORTES
  obtenerResumenCapacitacion,
  obtenerCursosPorReparticion,
  obtenerCursosPorZona

} = require('../controllers/catalogoController');


const {

  verificarToken,
  soloAdministrador

} = require('../middleware/authMiddleware');


const router = express.Router();


// =========================================================
// ZONAS NAVALES
// =========================================================

router.get(
  '/zonas',
  obtenerZonas
);


router.post(
  '/zonas',
  verificarToken,
  soloAdministrador,
  registrarZona
);


router.put(
  '/zonas/:id',
  verificarToken,
  soloAdministrador,
  actualizarZona
);


router.delete(
  '/zonas/:id',
  verificarToken,
  soloAdministrador,
  eliminarZona
);


// =========================================================
// REPARTICIONES
// =========================================================

router.get(
  '/reparticiones',
  obtenerReparticiones
);


router.post(
  '/reparticiones',
  verificarToken,
  soloAdministrador,
  registrarReparticion
);


router.put(
  '/reparticiones/:id',
  verificarToken,
  soloAdministrador,
  actualizarReparticion
);


router.delete(
  '/reparticiones/:id',
  verificarToken,
  soloAdministrador,
  eliminarReparticion
);


// =========================================================
// CURSOS
// =========================================================

router.get(
  '/cursos',
  obtenerCursos
);


router.post(
  '/cursos',
  verificarToken,
  soloAdministrador,
  registrarCurso
);


router.put(
  '/cursos/:id',
  verificarToken,
  soloAdministrador,
  actualizarCurso
);


router.delete(
  '/cursos/:id',
  verificarToken,
  soloAdministrador,
  eliminarCurso
);


// =========================================================
// TIPOS DE CURSO
// =========================================================

router.get(
  '/tipos-cursos',
  obtenerTiposCursos
);


router.post(
  '/tipos-cursos',
  verificarToken,
  soloAdministrador,
  registrarTipoCurso
);


router.put(
  '/tipos-cursos/:id',
  verificarToken,
  soloAdministrador,
  actualizarTipoCurso
);


router.delete(
  '/tipos-cursos/:id',
  verificarToken,
  soloAdministrador,
  eliminarTipoCurso
);


// =========================================================
// INSTITUCIONES
// =========================================================

router.get(
  '/instituciones',
  obtenerInstituciones
);


router.post(
  '/instituciones',
  verificarToken,
  soloAdministrador,
  registrarInstitucion
);


router.put(
  '/instituciones/:id',
  verificarToken,
  soloAdministrador,
  actualizarInstitucion
);


router.delete(
  '/instituciones/:id',
  verificarToken,
  soloAdministrador,
  eliminarInstitucion
);


// =========================================================
// ESTADOS DE CURSO
// =========================================================

router.get(
  '/estados',
  obtenerEstados
);


router.post(
  '/estados',
  verificarToken,
  soloAdministrador,
  registrarEstado
);


router.put(
  '/estados/:id',
  verificarToken,
  soloAdministrador,
  actualizarEstado
);


router.delete(
  '/estados/:id',
  verificarToken,
  soloAdministrador,
  eliminarEstado
);


// =========================================================
// REPORTES
// =========================================================

router.get(
  '/reportes/resumen-capacitacion',
  verificarToken,
  obtenerResumenCapacitacion
);


router.get(
  '/reportes/cursos-por-reparticion',
  verificarToken,
  obtenerCursosPorReparticion
);


router.get(
  '/reportes/cursos-por-zona',
  verificarToken,
  obtenerCursosPorZona
);


module.exports = router;
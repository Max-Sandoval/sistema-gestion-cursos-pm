const pool = require('../config/db');


// =========================================================
// OBTENER CURSOS REALIZADOS DE UN FUNCIONARIO
// =========================================================

const obtenerCursosFuncionario = async (req, res) => {

  const { id } = req.params;

  try {

    const funcionario = await pool.query(
      `
      SELECT
        f.id_funcionario,
        f.npi,
        f.grado,
        f.apellidos,
        f.nombres,
        f.especialidad,
        f.activo,
        r.nombre_reparticion,
        z.nombre_zona
      FROM funcionarios f
      INNER JOIN reparticiones r
        ON f.id_reparticion = r.id_reparticion
      INNER JOIN zonas_navales z
        ON r.id_zona = z.id_zona
      WHERE f.id_funcionario = $1
      `,
      [id]
    );


    if (funcionario.rows.length === 0) {

      return res.status(404).json({
        mensaje: 'Funcionario no encontrado'
      });

    }


    const cursosRealizados = await pool.query(
      `
      SELECT
        cr.id_curso_realizado,
        cr.id_curso,

        c.nombre_curso,
        c.codigo_curso,
        c.duracion_horas,
        c.vigencia_meses,

        tc.nombre_tipo,

        i.nombre_institucion,

        cr.fecha_inicio,
        cr.fecha_termino,
        cr.fecha_vencimiento,

        cr.id_estado,
        ec.nombre_estado,

        cr.nota,

        cr.puesto,
        cr.total_participantes

      FROM cursos_realizados cr

      INNER JOIN cursos c
        ON cr.id_curso = c.id_curso

      INNER JOIN tipo_curso tc
        ON c.id_tipo_curso = tc.id_tipo_curso

      INNER JOIN instituciones i
        ON c.id_institucion = i.id_institucion

      INNER JOIN estado_curso ec
        ON cr.id_estado = ec.id_estado

      WHERE cr.id_funcionario = $1

      ORDER BY
        cr.fecha_termino DESC NULLS LAST,
        c.nombre_curso ASC
      `,
      [id]
    );


    return res.status(200).json({

      funcionario:
        funcionario.rows[0],

      cursos:
        cursosRealizados.rows

    });


  } catch (error) {

    console.error(
      'Error al obtener cursos del funcionario:',
      error
    );


    return res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });

  }

};


// =========================================================
// REGISTRAR CURSO REALIZADO
// =========================================================

const registrarCursoFuncionario = async (req, res) => {

  const { id } = req.params;

  const {
    id_curso,
    fecha_inicio,
    fecha_termino,
    id_estado,
    nota,
    puesto,
    total_participantes
  } = req.body;


  if (!id_curso || !id_estado) {

    return res.status(400).json({
      mensaje:
        'El curso y el estado son obligatorios'
    });

  }


  // ---------------------------------------------------------
  // VALIDAR PUESTO
  // ---------------------------------------------------------

  if (
    puesto !== undefined &&
    puesto !== null &&
    puesto !== '' &&
    Number(puesto) <= 0
  ) {

    return res.status(400).json({
      mensaje:
        'El lugar obtenido debe ser mayor que cero'
    });

  }


  if (
    total_participantes !== undefined &&
    total_participantes !== null &&
    total_participantes !== '' &&
    Number(total_participantes) <= 0
  ) {

    return res.status(400).json({
      mensaje:
        'El total de participantes debe ser mayor que cero'
    });

  }


  if (
    puesto !== undefined &&
    puesto !== null &&
    puesto !== '' &&
    total_participantes !== undefined &&
    total_participantes !== null &&
    total_participantes !== '' &&
    Number(puesto) > Number(total_participantes)
  ) {

    return res.status(400).json({
      mensaje:
        'El lugar obtenido no puede ser mayor que el total de participantes'
    });

  }


  try {

    // ---------------------------------------------------------
    // VERIFICAR FUNCIONARIO
    // ---------------------------------------------------------

    const funcionario = await pool.query(
      `
      SELECT id_funcionario
      FROM funcionarios
      WHERE id_funcionario = $1
      `,
      [id]
    );


    if (funcionario.rows.length === 0) {

      return res.status(404).json({
        mensaje:
          'Funcionario no encontrado'
      });

    }


    // ---------------------------------------------------------
    // OBTENER INFORMACIÓN DEL CURSO
    // ---------------------------------------------------------

    const curso = await pool.query(
      `
      SELECT
        id_curso,
        vigencia_meses
      FROM cursos
      WHERE id_curso = $1
      `,
      [id_curso]
    );


    if (curso.rows.length === 0) {

      return res.status(404).json({
        mensaje:
          'Curso no encontrado'
      });

    }


    // ---------------------------------------------------------
    // VERIFICAR ESTADO
    // ---------------------------------------------------------

    const estado = await pool.query(
      `
      SELECT id_estado
      FROM estado_curso
      WHERE id_estado = $1
      `,
      [id_estado]
    );


    if (estado.rows.length === 0) {

      return res.status(404).json({
        mensaje:
          'Estado de curso no encontrado'
      });

    }


    // ---------------------------------------------------------
    // CALCULAR FECHA DE VENCIMIENTO
    // ---------------------------------------------------------

    let fechaVencimiento = null;

    const vigenciaMeses =
      curso.rows[0].vigencia_meses;


    if (
      fecha_termino &&
      vigenciaMeses !== null
    ) {

      const calculo = await pool.query(
        `
        SELECT
          (
            $1::date +
            ($2 || ' months')::interval
          )::date AS fecha_vencimiento
        `,
        [
          fecha_termino,
          vigenciaMeses
        ]
      );


      fechaVencimiento =
        calculo.rows[0].fecha_vencimiento;

    }


    // ---------------------------------------------------------
    // INSERTAR CURSO REALIZADO
    // ---------------------------------------------------------

    const resultado = await pool.query(
      `
      INSERT INTO cursos_realizados (
        id_funcionario,
        id_curso,
        fecha_inicio,
        fecha_termino,
        fecha_vencimiento,
        id_estado,
        nota,
        puesto,
        total_participantes
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
      RETURNING *
      `,
      [
        id,
        id_curso,
        fecha_inicio || null,
        fecha_termino || null,
        fechaVencimiento,
        id_estado,
        nota || null,
        puesto || null,
        total_participantes || null
      ]
    );


    return res.status(201).json({

      mensaje:
        'Curso registrado correctamente para el funcionario',

      cursoRealizado:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al registrar curso realizado:',
      error
    );


    return res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });

  }

};


// =========================================================
// ACTUALIZAR CURSO REALIZADO
// =========================================================

const actualizarCursoRealizado = async (req, res) => {

  const { id } = req.params;

  const {
    id_curso,
    fecha_inicio,
    fecha_termino,
    id_estado,
    nota,
    puesto,
    total_participantes
  } = req.body;


  if (!id_curso || !id_estado) {

    return res.status(400).json({
      mensaje:
        'El curso y el estado son obligatorios'
    });

  }


  // ---------------------------------------------------------
  // VALIDAR PUESTO
  // ---------------------------------------------------------

  if (
    puesto !== undefined &&
    puesto !== null &&
    puesto !== '' &&
    Number(puesto) <= 0
  ) {

    return res.status(400).json({
      mensaje:
        'El lugar obtenido debe ser mayor que cero'
    });

  }


  if (
    total_participantes !== undefined &&
    total_participantes !== null &&
    total_participantes !== '' &&
    Number(total_participantes) <= 0
  ) {

    return res.status(400).json({
      mensaje:
        'El total de participantes debe ser mayor que cero'
    });

  }


  if (
    puesto !== undefined &&
    puesto !== null &&
    puesto !== '' &&
    total_participantes !== undefined &&
    total_participantes !== null &&
    total_participantes !== '' &&
    Number(puesto) > Number(total_participantes)
  ) {

    return res.status(400).json({
      mensaje:
        'El lugar obtenido no puede ser mayor que el total de participantes'
    });

  }


  try {

    // ---------------------------------------------------------
    // VERIFICAR REGISTRO
    // ---------------------------------------------------------

    const registro = await pool.query(
      `
      SELECT id_curso_realizado
      FROM cursos_realizados
      WHERE id_curso_realizado = $1
      `,
      [id]
    );


    if (registro.rows.length === 0) {

      return res.status(404).json({
        mensaje:
          'Registro de curso no encontrado'
      });

    }


    // ---------------------------------------------------------
    // OBTENER VIGENCIA DEL CURSO
    // ---------------------------------------------------------

    const curso = await pool.query(
      `
      SELECT vigencia_meses
      FROM cursos
      WHERE id_curso = $1
      `,
      [id_curso]
    );


    if (curso.rows.length === 0) {

      return res.status(404).json({
        mensaje:
          'Curso no encontrado'
      });

    }


    // ---------------------------------------------------------
    // VERIFICAR ESTADO
    // ---------------------------------------------------------

    const estado = await pool.query(
      `
      SELECT id_estado
      FROM estado_curso
      WHERE id_estado = $1
      `,
      [id_estado]
    );


    if (estado.rows.length === 0) {

      return res.status(404).json({
        mensaje:
          'Estado de curso no encontrado'
      });

    }


    // ---------------------------------------------------------
    // CALCULAR FECHA DE VENCIMIENTO
    // ---------------------------------------------------------

    let fechaVencimiento = null;

    const vigenciaMeses =
      curso.rows[0].vigencia_meses;


    if (
      fecha_termino &&
      vigenciaMeses !== null
    ) {

      const calculo = await pool.query(
        `
        SELECT
          (
            $1::date +
            ($2 || ' months')::interval
          )::date AS fecha_vencimiento
        `,
        [
          fecha_termino,
          vigenciaMeses
        ]
      );


      fechaVencimiento =
        calculo.rows[0].fecha_vencimiento;

    }


    // ---------------------------------------------------------
    // ACTUALIZAR
    // ---------------------------------------------------------

    const resultado = await pool.query(
      `
      UPDATE cursos_realizados

      SET
        id_curso = $1,
        fecha_inicio = $2,
        fecha_termino = $3,
        fecha_vencimiento = $4,
        id_estado = $5,
        nota = $6,
        puesto = $7,
        total_participantes = $8

      WHERE id_curso_realizado = $9

      RETURNING *
      `,
      [
        id_curso,
        fecha_inicio || null,
        fecha_termino || null,
        fechaVencimiento,
        id_estado,
        nota || null,
        puesto || null,
        total_participantes || null,
        id
      ]
    );


    return res.status(200).json({

      mensaje:
        'Curso realizado actualizado correctamente',

      cursoRealizado:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al actualizar curso realizado:',
      error
    );


    return res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });

  }

};


// =========================================================
// ELIMINAR CURSO REALIZADO
// =========================================================

const eliminarCursoRealizado = async (req, res) => {

  const { id } = req.params;


  try {

    const resultado = await pool.query(
      `
      DELETE FROM cursos_realizados
      WHERE id_curso_realizado = $1
      RETURNING id_curso_realizado
      `,
      [id]
    );


    if (resultado.rows.length === 0) {

      return res.status(404).json({
        mensaje:
          'Registro de curso no encontrado'
      });

    }


    return res.status(200).json({
      mensaje:
        'Curso realizado eliminado correctamente'
    });


  } catch (error) {

    console.error(
      'Error al eliminar curso realizado:',
      error
    );


    return res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });

  }

};


// =========================================================
// EXPORTAR
// =========================================================

module.exports = {
  obtenerCursosFuncionario,
  registrarCursoFuncionario,
  actualizarCursoRealizado,
  eliminarCursoRealizado
};
const pool = require('../config/db');


// =========================================================
// OBTENER ZONAS NAVALES
// =========================================================

const obtenerZonas = async (req, res) => {

  try {

    const resultado = await pool.query(
      `
        SELECT
          id_zona,
          nombre_zona,
          descripcion
        FROM zonas_navales
        ORDER BY id_zona
      `
    );


    res.json(resultado.rows);


  } catch (error) {

    console.error(
      'Error al consultar las zonas navales:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al consultar las zonas navales'
    });

  }

};


// =========================================================
// OBTENER REPARTICIONES
// =========================================================

const obtenerReparticiones = async (req, res) => {

  try {

    const { zona } = req.query;


    let consulta = `
      SELECT
        r.id_reparticion,
        r.nombre_reparticion,
        r.tipo_reparticion,
        r.id_zona,
        z.nombre_zona
      FROM reparticiones r
      JOIN zonas_navales z
        ON r.id_zona = z.id_zona
    `;


    const valores = [];


    if (zona) {

      consulta += `
        WHERE r.id_zona = $1
      `;

      valores.push(zona);

    }


    consulta += `
      ORDER BY
        z.id_zona,
        r.nombre_reparticion
    `;


    const resultado = await pool.query(
      consulta,
      valores
    );


    res.json(resultado.rows);


  } catch (error) {

    console.error(
      'Error al consultar las reparticiones:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al consultar las reparticiones'
    });

  }

};


// =========================================================
// OBTENER CURSOS
// =========================================================

const obtenerCursos = async (req, res) => {

  try {

    const resultado = await pool.query(
      `
        SELECT
          c.id_curso,
          c.nombre_curso,
          c.codigo_curso,
          c.duracion_horas,
          c.vigencia_meses,
          c.id_tipo_curso,
          tc.nombre_tipo,
          c.id_institucion,
          i.nombre_institucion
        FROM cursos c
        JOIN tipo_curso tc
          ON c.id_tipo_curso = tc.id_tipo_curso
        JOIN instituciones i
          ON c.id_institucion = i.id_institucion
        ORDER BY c.nombre_curso
      `
    );


    res.json(resultado.rows);


  } catch (error) {

    console.error(
      'Error al consultar los cursos:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al consultar los cursos'
    });

  }

};


// =========================================================
// REGISTRAR CURSO
// =========================================================

const registrarCurso = async (req, res) => {

  const cliente =
    await pool.connect();


  try {

    const {
      nombre_curso,
      duracion_horas,
      vigencia_meses,
      id_tipo_curso,
      id_institucion
    } = req.body;


    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    if (
      !nombre_curso ||
      !nombre_curso.trim() ||
      !id_tipo_curso ||
      !id_institucion
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre, tipo de curso e institución son obligatorios'
      });

    }


    if (
      duracion_horas !== null &&
      duracion_horas !== undefined &&
      duracion_horas !== '' &&
      Number(duracion_horas) <= 0
    ) {

      return res.status(400).json({
        mensaje:
          'La duración del curso debe ser mayor que cero'
      });

    }


    if (
      vigencia_meses !== null &&
      vigencia_meses !== undefined &&
      vigencia_meses !== '' &&
      Number(vigencia_meses) <= 0
    ) {

      return res.status(400).json({
        mensaje:
          'La vigencia debe ser mayor que cero'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR TIPO DE CURSO
    // -------------------------------------------------------

    const tipoExiste = await cliente.query(
      `
        SELECT id_tipo_curso
        FROM tipo_curso
        WHERE id_tipo_curso = $1
      `,
      [
        Number(id_tipo_curso)
      ]
    );


    if (tipoExiste.rowCount === 0) {

      return res.status(400).json({
        mensaje:
          'El tipo de curso seleccionado no existe'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR INSTITUCIÓN
    // -------------------------------------------------------

    const institucionExiste =
      await cliente.query(
        `
          SELECT id_institucion
          FROM instituciones
          WHERE id_institucion = $1
        `,
        [
          Number(id_institucion)
        ]
      );


    if (institucionExiste.rowCount === 0) {

      return res.status(400).json({
        mensaje:
          'La institución seleccionada no existe'
      });

    }


    // -------------------------------------------------------
    // INICIAR TRANSACCIÓN
    // -------------------------------------------------------

    await cliente.query('BEGIN');


    // Evita que dos registros generen el mismo código
    // al mismo tiempo.
    await cliente.query(
      `
        SELECT pg_advisory_xact_lock(1001)
      `
    );


    // -------------------------------------------------------
    // OBTENER SIGUIENTE CÓDIGO
    // -------------------------------------------------------

    const ultimoCodigo =
      await cliente.query(
        `
          SELECT
            COALESCE(
              MAX(
                CAST(
                  SUBSTRING(
                    codigo_curso
                    FROM '[0-9]+'
                  ) AS INTEGER
                )
              ),
              0
            ) AS ultimo_numero
          FROM cursos
          WHERE codigo_curso ~ '^CUR-[0-9]+$'
        `
      );


    const siguienteNumero =
      Number(
        ultimoCodigo.rows[0].ultimo_numero
      ) + 1;


    const codigoCurso =
      `CUR-${String(
        siguienteNumero
      ).padStart(3, '0')}`;


    // -------------------------------------------------------
    // INSERTAR CURSO
    // -------------------------------------------------------

    const resultado =
      await cliente.query(
        `
          INSERT INTO cursos (
            nombre_curso,
            codigo_curso,
            duracion_horas,
            vigencia_meses,
            id_tipo_curso,
            id_institucion
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
          )
          RETURNING *
        `,
        [
          nombre_curso.trim(),

          codigoCurso,

          duracion_horas === '' ||
          duracion_horas === null ||
          duracion_horas === undefined
            ? null
            : Number(
                duracion_horas
              ),

          vigencia_meses === '' ||
          vigencia_meses === null ||
          vigencia_meses === undefined
            ? null
            : Number(
                vigencia_meses
              ),

          Number(
            id_tipo_curso
          ),

          Number(
            id_institucion
          )
        ]
      );


    await cliente.query('COMMIT');


    res.status(201).json({

      mensaje:
        `Curso registrado correctamente con código ${codigoCurso}`,

      curso:
        resultado.rows[0]

    });


  } catch (error) {

    try {

      await cliente.query(
        'ROLLBACK'
      );

    } catch (rollbackError) {

      console.error(
        'Error al revertir la transacción:',
        rollbackError
      );

    }


    console.error(
      'Error al registrar curso:',
      error
    );


    if (
      error.code === '23505'
    ) {

      return res.status(409).json({
        mensaje:
          'No fue posible generar un código único para el curso'
      });

    }


    res.status(500).json({
      mensaje:
        'Error al registrar el curso'
    });


  } finally {

    cliente.release();

  }

};


// =========================================================
// ACTUALIZAR CURSO
// =========================================================

const actualizarCurso = async (req, res) => {

  try {

    const { id } =
      req.params;


    const {
      nombre_curso,
      duracion_horas,
      vigencia_meses,
      id_tipo_curso,
      id_institucion
    } = req.body;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const cursoExiste =
      await pool.query(
        `
          SELECT
            id_curso,
            codigo_curso
          FROM cursos
          WHERE id_curso = $1
        `,
        [
          id
        ]
      );


    if (
      cursoExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'El curso no existe'
      });

    }


    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    if (
      !nombre_curso ||
      !nombre_curso.trim() ||
      !id_tipo_curso ||
      !id_institucion
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre, tipo de curso e institución son obligatorios'
      });

    }


    if (
      duracion_horas !== null &&
      duracion_horas !== undefined &&
      duracion_horas !== '' &&
      Number(duracion_horas) <= 0
    ) {

      return res.status(400).json({
        mensaje:
          'La duración del curso debe ser mayor que cero'
      });

    }


    if (
      vigencia_meses !== null &&
      vigencia_meses !== undefined &&
      vigencia_meses !== '' &&
      Number(vigencia_meses) <= 0
    ) {

      return res.status(400).json({
        mensaje:
          'La vigencia debe ser mayor que cero'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR TIPO
    // -------------------------------------------------------

    const tipoExiste =
      await pool.query(
        `
          SELECT id_tipo_curso
          FROM tipo_curso
          WHERE id_tipo_curso = $1
        `,
        [
          Number(
            id_tipo_curso
          )
        ]
      );


    if (
      tipoExiste.rowCount === 0
    ) {

      return res.status(400).json({
        mensaje:
          'El tipo de curso seleccionado no existe'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR INSTITUCIÓN
    // -------------------------------------------------------

    const institucionExiste =
      await pool.query(
        `
          SELECT id_institucion
          FROM instituciones
          WHERE id_institucion = $1
        `,
        [
          Number(
            id_institucion
          )
        ]
      );


    if (
      institucionExiste.rowCount === 0
    ) {

      return res.status(400).json({
        mensaje:
          'La institución seleccionada no existe'
      });

    }


    // -------------------------------------------------------
    // ACTUALIZAR
    // EL CÓDIGO NO SE MODIFICA
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          UPDATE cursos
          SET
            nombre_curso = $1,
            duracion_horas = $2,
            vigencia_meses = $3,
            id_tipo_curso = $4,
            id_institucion = $5
          WHERE id_curso = $6
          RETURNING *
        `,
        [
          nombre_curso.trim(),

          duracion_horas === '' ||
          duracion_horas === null ||
          duracion_horas === undefined
            ? null
            : Number(
                duracion_horas
              ),

          vigencia_meses === '' ||
          vigencia_meses === null ||
          vigencia_meses === undefined
            ? null
            : Number(
                vigencia_meses
              ),

          Number(
            id_tipo_curso
          ),

          Number(
            id_institucion
          ),

          id
        ]
      );


    res.json({

      mensaje:
        'Curso actualizado correctamente',

      curso:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al actualizar curso:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al actualizar el curso'
    });

  }

};


// =========================================================
// ELIMINAR CURSO
// =========================================================

const eliminarCurso = async (req, res) => {

  try {

    const { id } =
      req.params;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const cursoExiste =
      await pool.query(
        `
          SELECT
            id_curso,
            nombre_curso
          FROM cursos
          WHERE id_curso = $1
        `,
        [
          id
        ]
      );


    if (
      cursoExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'El curso no existe'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR SI TIENE HISTORIAL
    // -------------------------------------------------------

    const cursosRealizados =
      await pool.query(
        `
          SELECT
            COUNT(*) AS total
          FROM cursos_realizados
          WHERE id_curso = $1
        `,
        [
          id
        ]
      );


    const total =
      Number(
        cursosRealizados.rows[0].total
      );


    if (
      total > 0
    ) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar este curso porque existen funcionarios que lo tienen registrado en su historial'
      });

    }


    // -------------------------------------------------------
    // ELIMINAR
    // -------------------------------------------------------

    await pool.query(
      `
        DELETE FROM cursos
        WHERE id_curso = $1
      `,
      [
        id
      ]
    );


    res.json({
      mensaje:
        'Curso eliminado correctamente'
    });


  } catch (error) {

    console.error(
      'Error al eliminar curso:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al eliminar el curso'
    });

  }

};


// =========================================================
// OBTENER TIPOS DE CURSO
// =========================================================

// =========================================================
// OBTENER TIPOS DE CURSO
// =========================================================

const obtenerTiposCursos = async (req, res) => {

  try {

    const resultado =
      await pool.query(
        `
          SELECT
            id_tipo_curso,
            nombre_tipo,
            descripcion
          FROM tipo_curso
          ORDER BY nombre_tipo
        `
      );


    res.json(
      resultado.rows
    );


  } catch (error) {

    console.error(
      'Error al consultar los tipos de curso:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al consultar los tipos de curso'
    });

  }

};


// =========================================================
// REGISTRAR TIPO DE CURSO
// =========================================================

const registrarTipoCurso = async (req, res) => {

  try {

    const {
      nombre_tipo,
      descripcion
    } = req.body;


    // -------------------------------------------------------
    // VALIDAR NOMBRE
    // -------------------------------------------------------

    if (
      !nombre_tipo ||
      !nombre_tipo.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre del tipo de curso'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR DUPLICADO
    // -------------------------------------------------------

    const tipoExistente =
      await pool.query(
        `
          SELECT id_tipo_curso
          FROM tipo_curso
          WHERE LOWER(nombre_tipo) =
                LOWER($1)
        `,
        [
          nombre_tipo.trim()
        ]
      );


    if (
      tipoExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe un tipo de curso con ese nombre'
      });

    }


    // -------------------------------------------------------
    // REGISTRAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          INSERT INTO tipo_curso (
            nombre_tipo,
            descripcion
          )
          VALUES (
            $1,
            $2
          )
          RETURNING *
        `,
        [
          nombre_tipo.trim(),

          descripcion &&
          descripcion.trim()
            ? descripcion.trim()
            : null
        ]
      );


    res.status(201).json({

      mensaje:
        'Tipo de curso registrado correctamente',

      tipoCurso:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al registrar tipo de curso:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al registrar el tipo de curso'
    });

  }

};


// =========================================================
// ACTUALIZAR TIPO DE CURSO
// =========================================================

const actualizarTipoCurso = async (req, res) => {

  try {

    const { id } =
      req.params;


    const {
      nombre_tipo,
      descripcion
    } = req.body;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const tipoExiste =
      await pool.query(
        `
          SELECT id_tipo_curso
          FROM tipo_curso
          WHERE id_tipo_curso = $1
        `,
        [
          id
        ]
      );


    if (
      tipoExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'El tipo de curso no existe'
      });

    }


    // -------------------------------------------------------
    // VALIDAR NOMBRE
    // -------------------------------------------------------

    if (
      !nombre_tipo ||
      !nombre_tipo.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre del tipo de curso'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR DUPLICADO
    // -------------------------------------------------------

    const duplicado =
      await pool.query(
        `
          SELECT id_tipo_curso
          FROM tipo_curso
          WHERE LOWER(nombre_tipo) =
                LOWER($1)
            AND id_tipo_curso <> $2
        `,
        [
          nombre_tipo.trim(),
          id
        ]
      );


    if (
      duplicado.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe otro tipo de curso con ese nombre'
      });

    }


    // -------------------------------------------------------
    // ACTUALIZAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          UPDATE tipo_curso
          SET
            nombre_tipo = $1,
            descripcion = $2
          WHERE id_tipo_curso = $3
          RETURNING *
        `,
        [
          nombre_tipo.trim(),

          descripcion &&
          descripcion.trim()
            ? descripcion.trim()
            : null,

          id
        ]
      );


    res.json({

      mensaje:
        'Tipo de curso actualizado correctamente',

      tipoCurso:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al actualizar tipo de curso:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al actualizar el tipo de curso'
    });

  }

};


// =========================================================
// ELIMINAR TIPO DE CURSO
// =========================================================

const eliminarTipoCurso = async (req, res) => {

  try {

    const { id } =
      req.params;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const tipoExiste =
      await pool.query(
        `
          SELECT
            id_tipo_curso,
            nombre_tipo
          FROM tipo_curso
          WHERE id_tipo_curso = $1
        `,
        [
          id
        ]
      );


    if (
      tipoExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'El tipo de curso no existe'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR CURSOS ASOCIADOS
    // -------------------------------------------------------

    const cursos =
      await pool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM cursos
          WHERE id_tipo_curso = $1
        `,
        [
          id
        ]
      );


    if (
      cursos.rows[0].total > 0
    ) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar este tipo de curso porque tiene cursos asociados'
      });

    }


    // -------------------------------------------------------
    // ELIMINAR
    // -------------------------------------------------------

    await pool.query(
      `
        DELETE FROM tipo_curso
        WHERE id_tipo_curso = $1
      `,
      [
        id
      ]
    );


    res.json({
      mensaje:
        'Tipo de curso eliminado correctamente'
    });


  } catch (error) {

    console.error(
      'Error al eliminar tipo de curso:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al eliminar el tipo de curso'
    });

  }

};

// =========================================================
// OBTENER INSTITUCIONES
// =========================================================

const obtenerInstituciones = async (req, res) => {

  try {

    const resultado =
      await pool.query(
        `
          SELECT
            id_institucion,
            nombre_institucion,
            tipo_institucion
          FROM instituciones
          ORDER BY nombre_institucion
        `
      );


    res.json(
      resultado.rows
    );


  } catch (error) {

    console.error(
      'Error al consultar las instituciones:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al consultar las instituciones'
    });

  }

};




// =========================================================
// OBTENER ESTADOS DE CURSOS
// =========================================================

const obtenerEstados = async (req, res) => {

  try {

    const resultado =
      await pool.query(
        `
          SELECT
            id_estado,
            nombre_estado,
            descripcion
          FROM estado_curso
          ORDER BY id_estado
        `
      );


    res.json(
      resultado.rows
    );


  } catch (error) {

    console.error(
      'Error al consultar los estados:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al consultar los estados'
    });

  }

};

// =========================================================
// REGISTRAR ESTADO DE CURSO
// =========================================================

const registrarEstado = async (req, res) => {

  try {

    const {
      nombre_estado,
      descripcion
    } = req.body;


    // -------------------------------------------------------
    // VALIDAR NOMBRE
    // -------------------------------------------------------

    if (
      !nombre_estado ||
      !nombre_estado.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre del estado'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR DUPLICADO
    // -------------------------------------------------------

    const estadoExistente =
      await pool.query(
        `
          SELECT id_estado
          FROM estado_curso
          WHERE LOWER(nombre_estado) =
                LOWER($1)
        `,
        [
          nombre_estado.trim()
        ]
      );


    if (
      estadoExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe un estado con ese nombre'
      });

    }


    // -------------------------------------------------------
    // REGISTRAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          INSERT INTO estado_curso (
            nombre_estado,
            descripcion
          )
          VALUES (
            $1,
            $2
          )
          RETURNING *
        `,
        [
          nombre_estado.trim(),

          descripcion &&
          descripcion.trim()
            ? descripcion.trim()
            : null
        ]
      );


    res.status(201).json({

      mensaje:
        'Estado registrado correctamente',

      estado:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al registrar estado:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al registrar el estado'
    });

  }

};


// =========================================================
// ACTUALIZAR ESTADO DE CURSO
// =========================================================

const actualizarEstado = async (req, res) => {

  try {

    const { id } =
      req.params;


    const {
      nombre_estado,
      descripcion
    } = req.body;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const estadoExiste =
      await pool.query(
        `
          SELECT id_estado
          FROM estado_curso
          WHERE id_estado = $1
        `,
        [
          id
        ]
      );


    if (
      estadoExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'El estado no existe'
      });

    }


    // -------------------------------------------------------
    // VALIDAR NOMBRE
    // -------------------------------------------------------

    if (
      !nombre_estado ||
      !nombre_estado.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre del estado'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR DUPLICADO
    // -------------------------------------------------------

    const duplicado =
      await pool.query(
        `
          SELECT id_estado
          FROM estado_curso
          WHERE LOWER(nombre_estado) =
                LOWER($1)
            AND id_estado <> $2
        `,
        [
          nombre_estado.trim(),
          id
        ]
      );


    if (
      duplicado.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe otro estado con ese nombre'
      });

    }


    // -------------------------------------------------------
    // ACTUALIZAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          UPDATE estado_curso
          SET
            nombre_estado = $1,
            descripcion = $2
          WHERE id_estado = $3
          RETURNING *
        `,
        [
          nombre_estado.trim(),

          descripcion &&
          descripcion.trim()
            ? descripcion.trim()
            : null,

          id
        ]
      );


    res.json({

      mensaje:
        'Estado actualizado correctamente',

      estado:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al actualizar estado:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al actualizar el estado'
    });

  }

};


// =========================================================
// ELIMINAR ESTADO DE CURSO
// =========================================================

const eliminarEstado = async (req, res) => {

  try {

    const { id } =
      req.params;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const estadoExiste =
      await pool.query(
        `
          SELECT
            id_estado,
            nombre_estado
          FROM estado_curso
          WHERE id_estado = $1
        `,
        [
          id
        ]
      );


    if (
      estadoExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'El estado no existe'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR CURSOS REALIZADOS ASOCIADOS
    // -------------------------------------------------------

    const cursosRealizados =
      await pool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM cursos_realizados
          WHERE id_estado = $1
        `,
        [
          id
        ]
      );


    if (
      cursosRealizados.rows[0].total > 0
    ) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar este estado porque tiene cursos realizados asociados'
      });

    }


    // -------------------------------------------------------
    // ELIMINAR
    // -------------------------------------------------------

    await pool.query(
      `
        DELETE FROM estado_curso
        WHERE id_estado = $1
      `,
      [
        id
      ]
    );


    res.json({
      mensaje:
        'Estado eliminado correctamente'
    });


  } catch (error) {

    console.error(
      'Error al eliminar estado:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al eliminar el estado'
    });

  }

};

// =========================================================
// REGISTRAR ZONA NAVAL
// =========================================================

const registrarZona = async (req, res) => {

  try {

    const {
      nombre_zona,
      descripcion
    } = req.body;


    // -------------------------------------------------------
    // VALIDAR NOMBRE
    // -------------------------------------------------------

    if (
      !nombre_zona ||
      !nombre_zona.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre de la Zona Naval'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR NOMBRE DUPLICADO
    // -------------------------------------------------------

    const zonaExistente =
      await pool.query(
        `
          SELECT id_zona
          FROM zonas_navales
          WHERE LOWER(nombre_zona) =
                LOWER($1)
        `,
        [
          nombre_zona.trim()
        ]
      );


    if (
      zonaExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe una Zona Naval con ese nombre'
      });

    }


    // -------------------------------------------------------
    // REGISTRAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          INSERT INTO zonas_navales (
            nombre_zona,
            descripcion
          )
          VALUES (
            $1,
            $2
          )
          RETURNING *
        `,
        [
          nombre_zona.trim(),

          descripcion &&
          descripcion.trim()
            ? descripcion.trim()
            : null
        ]
      );


    res.status(201).json({

      mensaje:
        'Zona Naval registrada correctamente',

      zona:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al registrar Zona Naval:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al registrar la Zona Naval'
    });

  }

};


// =========================================================
// ACTUALIZAR ZONA NAVAL
// =========================================================

const actualizarZona = async (req, res) => {

  try {

    const { id } =
      req.params;


    const {
      nombre_zona,
      descripcion
    } = req.body;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const zonaExiste =
      await pool.query(
        `
          SELECT id_zona
          FROM zonas_navales
          WHERE id_zona = $1
        `,
        [
          id
        ]
      );


    if (
      zonaExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La Zona Naval no existe'
      });

    }


    // -------------------------------------------------------
    // VALIDAR NOMBRE
    // -------------------------------------------------------

    if (
      !nombre_zona ||
      !nombre_zona.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre de la Zona Naval'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR DUPLICADO
    // -------------------------------------------------------

    const duplicada =
      await pool.query(
        `
          SELECT id_zona
          FROM zonas_navales
          WHERE LOWER(nombre_zona) =
                LOWER($1)
            AND id_zona <> $2
        `,
        [
          nombre_zona.trim(),
          id
        ]
      );


    if (
      duplicada.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe otra Zona Naval con ese nombre'
      });

    }


    // -------------------------------------------------------
    // ACTUALIZAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          UPDATE zonas_navales
          SET
            nombre_zona = $1,
            descripcion = $2
          WHERE id_zona = $3
          RETURNING *
        `,
        [
          nombre_zona.trim(),

          descripcion &&
          descripcion.trim()
            ? descripcion.trim()
            : null,

          id
        ]
      );


    res.json({

      mensaje:
        'Zona Naval actualizada correctamente',

      zona:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al actualizar Zona Naval:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al actualizar la Zona Naval'
    });

  }

};


// =========================================================
// ELIMINAR ZONA NAVAL
// =========================================================

const eliminarZona = async (req, res) => {

  try {

    const { id } =
      req.params;


    // -------------------------------------------------------
    // VERIFICAR QUE EXISTA
    // -------------------------------------------------------

    const zonaExiste =
      await pool.query(
        `
          SELECT
            id_zona,
            nombre_zona
          FROM zonas_navales
          WHERE id_zona = $1
        `,
        [
          id
        ]
      );


    if (
      zonaExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La Zona Naval no existe'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR REPARTICIONES ASOCIADAS
    // -------------------------------------------------------

    const reparticiones =
      await pool.query(
        `
          SELECT COUNT(*) AS total
          FROM reparticiones
          WHERE id_zona = $1
        `,
        [
          id
        ]
      );


    const totalReparticiones =
      Number(
        reparticiones.rows[0].total
      );


    if (
      totalReparticiones > 0
    ) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar esta Zona Naval porque tiene reparticiones asociadas'
      });

    }


    // -------------------------------------------------------
    // ELIMINAR
    // -------------------------------------------------------

    await pool.query(
      `
        DELETE FROM zonas_navales
        WHERE id_zona = $1
      `,
      [
        id
      ]
    );


    res.json({
      mensaje:
        'Zona Naval eliminada correctamente'
    });


  } catch (error) {

    console.error(
      'Error al eliminar Zona Naval:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al eliminar la Zona Naval'
    });

  }

};


// =========================================================
// REGISTRAR REPARTICIÓN
// =========================================================

const registrarReparticion = async (req, res) => {

  try {

    const {
      nombre_reparticion,
      tipo_reparticion,
      id_zona
    } = req.body;


    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    if (
      !nombre_reparticion ||
      !nombre_reparticion.trim() ||
      !id_zona
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre de la repartición y seleccionar una Zona Naval'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR ZONA NAVAL
    // -------------------------------------------------------

    const zonaExiste =
      await pool.query(
        `
          SELECT id_zona
          FROM zonas_navales
          WHERE id_zona = $1
        `,
        [id_zona]
      );


    if (zonaExiste.rowCount === 0) {

      return res.status(404).json({
        mensaje:
          'La Zona Naval seleccionada no existe'
      });

    }


    // -------------------------------------------------------
    // EVITAR DUPLICADOS EN LA MISMA ZONA
    // -------------------------------------------------------

    const reparticionExistente =
      await pool.query(
        `
          SELECT id_reparticion
          FROM reparticiones
          WHERE LOWER(nombre_reparticion) =
                LOWER($1)
            AND id_zona = $2
        `,
        [
          nombre_reparticion.trim(),
          id_zona
        ]
      );


    if (
      reparticionExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe una repartición con ese nombre en la Zona Naval seleccionada'
      });

    }


    // -------------------------------------------------------
    // REGISTRAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          INSERT INTO reparticiones (
            nombre_reparticion,
            tipo_reparticion,
            id_zona
          )
          VALUES (
            $1,
            $2,
            $3
          )
          RETURNING *
        `,
        [
          nombre_reparticion.trim(),

          tipo_reparticion &&
          tipo_reparticion.trim()
            ? tipo_reparticion.trim()
            : null,

          id_zona
        ]
      );


    res.status(201).json({

      mensaje:
        'Repartición registrada correctamente',

      reparticion:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al registrar repartición:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al registrar la repartición'
    });

  }

};


// =========================================================
// ACTUALIZAR REPARTICIÓN
// =========================================================

const actualizarReparticion = async (req, res) => {

  try {

    const { id } = req.params;


    const {
      nombre_reparticion,
      tipo_reparticion,
      id_zona
    } = req.body;


    // -------------------------------------------------------
    // VERIFICAR REPARTICIÓN
    // -------------------------------------------------------

    const reparticionExiste =
      await pool.query(
        `
          SELECT id_reparticion
          FROM reparticiones
          WHERE id_reparticion = $1
        `,
        [id]
      );


    if (
      reparticionExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La repartición no existe'
      });

    }


    // -------------------------------------------------------
    // VALIDACIONES
    // -------------------------------------------------------

    if (
      !nombre_reparticion ||
      !nombre_reparticion.trim() ||
      !id_zona
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre de la repartición y seleccionar una Zona Naval'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR ZONA NAVAL
    // -------------------------------------------------------

    const zonaExiste =
      await pool.query(
        `
          SELECT id_zona
          FROM zonas_navales
          WHERE id_zona = $1
        `,
        [id_zona]
      );


    if (
      zonaExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La Zona Naval seleccionada no existe'
      });

    }


    // -------------------------------------------------------
    // EVITAR DUPLICADOS
    // -------------------------------------------------------

    const duplicada =
      await pool.query(
        `
          SELECT id_reparticion
          FROM reparticiones

          WHERE LOWER(nombre_reparticion) =
                LOWER($1)

            AND id_zona = $2

            AND id_reparticion <> $3
        `,
        [
          nombre_reparticion.trim(),
          id_zona,
          id
        ]
      );


    if (
      duplicada.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe otra repartición con ese nombre en la Zona Naval seleccionada'
      });

    }


    // -------------------------------------------------------
    // ACTUALIZAR
    // -------------------------------------------------------

    const resultado =
      await pool.query(
        `
          UPDATE reparticiones

          SET
            nombre_reparticion = $1,
            tipo_reparticion = $2,
            id_zona = $3

          WHERE id_reparticion = $4

          RETURNING *
        `,
        [
          nombre_reparticion.trim(),

          tipo_reparticion &&
          tipo_reparticion.trim()
            ? tipo_reparticion.trim()
            : null,

          id_zona,

          id
        ]
      );


    res.json({

      mensaje:
        'Repartición actualizada correctamente',

      reparticion:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al actualizar repartición:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al actualizar la repartición'
    });

  }

};


// =========================================================
// ELIMINAR REPARTICIÓN
// =========================================================

const eliminarReparticion = async (req, res) => {

  try {

    const { id } = req.params;


    // -------------------------------------------------------
    // VERIFICAR REPARTICIÓN
    // -------------------------------------------------------

    const reparticionExiste =
      await pool.query(
        `
          SELECT
            id_reparticion,
            nombre_reparticion

          FROM reparticiones

          WHERE id_reparticion = $1
        `,
        [id]
      );


    if (
      reparticionExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La repartición no existe'
      });

    }


    // -------------------------------------------------------
    // VERIFICAR FUNCIONARIOS ASOCIADOS
    // -------------------------------------------------------

    const funcionarios =
      await pool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM funcionarios
          WHERE id_reparticion = $1
        `,
        [id]
      );


    if (
      funcionarios.rows[0].total > 0
    ) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar esta repartición porque tiene funcionarios asociados'
      });

    }


    // -------------------------------------------------------
    // ELIMINAR
    // -------------------------------------------------------

    await pool.query(
      `
        DELETE FROM reparticiones
        WHERE id_reparticion = $1
      `,
      [id]
    );


    res.json({
      mensaje:
        'Repartición eliminada correctamente'
    });


  } catch (error) {

    console.error(
      'Error al eliminar repartición:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al eliminar la repartición'
    });

  }

};

// =========================================================
// REGISTRAR INSTITUCIÓN
// =========================================================

const registrarInstitucion = async (req, res) => {

  try {

    const {
      nombre_institucion,
      tipo_institucion
    } = req.body;


    if (
      !nombre_institucion ||
      !nombre_institucion.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre de la institución'
      });

    }


    const institucionExistente =
      await pool.query(
        `
          SELECT id_institucion
          FROM instituciones
          WHERE LOWER(nombre_institucion) =
                LOWER($1)
        `,
        [
          nombre_institucion.trim()
        ]
      );


    if (
      institucionExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe una institución con ese nombre'
      });

    }


    const resultado =
      await pool.query(
        `
          INSERT INTO instituciones (
            nombre_institucion,
            tipo_institucion
          )
          VALUES (
            $1,
            $2
          )
          RETURNING *
        `,
        [
          nombre_institucion.trim(),

          tipo_institucion &&
          tipo_institucion.trim()
            ? tipo_institucion.trim()
            : null
        ]
      );


    res.status(201).json({

      mensaje:
        'Institución registrada correctamente',

      institucion:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al registrar institución:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al registrar la institución'
    });

  }

};


// =========================================================
// ACTUALIZAR INSTITUCIÓN
// =========================================================

const actualizarInstitucion = async (req, res) => {

  try {

    const { id } = req.params;


    const {
      nombre_institucion,
      tipo_institucion
    } = req.body;


    const institucionExiste =
      await pool.query(
        `
          SELECT id_institucion
          FROM instituciones
          WHERE id_institucion = $1
        `,
        [id]
      );


    if (
      institucionExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La institución no existe'
      });

    }


    if (
      !nombre_institucion ||
      !nombre_institucion.trim()
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar el nombre de la institución'
      });

    }


    const duplicada =
      await pool.query(
        `
          SELECT id_institucion
          FROM instituciones

          WHERE LOWER(nombre_institucion) =
                LOWER($1)

            AND id_institucion <> $2
        `,
        [
          nombre_institucion.trim(),
          id
        ]
      );


    if (
      duplicada.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe otra institución con ese nombre'
      });

    }


    const resultado =
      await pool.query(
        `
          UPDATE instituciones

          SET
            nombre_institucion = $1,
            tipo_institucion = $2

          WHERE id_institucion = $3

          RETURNING *
        `,
        [
          nombre_institucion.trim(),

          tipo_institucion &&
          tipo_institucion.trim()
            ? tipo_institucion.trim()
            : null,

          id
        ]
      );


    res.json({

      mensaje:
        'Institución actualizada correctamente',

      institucion:
        resultado.rows[0]

    });


  } catch (error) {

    console.error(
      'Error al actualizar institución:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al actualizar la institución'
    });

  }

};


// =========================================================
// ELIMINAR INSTITUCIÓN
// =========================================================

const eliminarInstitucion = async (req, res) => {

  try {

    const { id } = req.params;


    const institucionExiste =
      await pool.query(
        `
          SELECT
            id_institucion,
            nombre_institucion

          FROM instituciones

          WHERE id_institucion = $1
        `,
        [id]
      );


    if (
      institucionExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La institución no existe'
      });

    }


    const cursos =
      await pool.query(
        `
          SELECT COUNT(*)::int AS total
          FROM cursos
          WHERE id_institucion = $1
        `,
        [id]
      );


    if (
      cursos.rows[0].total > 0
    ) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar esta institución porque tiene cursos asociados'
      });

    }


    await pool.query(
      `
        DELETE FROM instituciones
        WHERE id_institucion = $1
      `,
      [id]
    );


    res.json({
      mensaje:
        'Institución eliminada correctamente'
    });


  } catch (error) {

    console.error(
      'Error al eliminar institución:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al eliminar la institución'
    });

  }

};

// =========================================================
// OBTENER RESUMEN DE CAPACITACIÓN
// =========================================================

const obtenerResumenCapacitacion = async (req, res) => {

  try {

    // -------------------------------------------------------
    // RESUMEN GENERAL
    // -------------------------------------------------------

    const resumenGeneral =
      await pool.query(
        `
          SELECT

            (
              SELECT COUNT(*)::int
              FROM funcionarios
              WHERE activo = TRUE
            ) AS funcionarios_activos,

            (
              SELECT COUNT(*)::int
              FROM cursos
            ) AS cursos_registrados,

            (
              SELECT COUNT(*)::int
              FROM cursos_realizados
            ) AS cursos_realizados,

            (
              SELECT COUNT(*)::int
              FROM cursos_realizados cr
              JOIN estado_curso ec
                ON cr.id_estado = ec.id_estado
              WHERE LOWER(ec.nombre_estado) = 'vigente'
            ) AS cursos_vigentes,

            (
              SELECT COUNT(*)::int
              FROM cursos_realizados cr
              JOIN estado_curso ec
                ON cr.id_estado = ec.id_estado
              WHERE LOWER(ec.nombre_estado) = 'vencido'
            ) AS cursos_vencidos,

            (
              SELECT COUNT(*)::int
              FROM cursos_realizados cr
              JOIN estado_curso ec
                ON cr.id_estado = ec.id_estado
              WHERE LOWER(ec.nombre_estado) = 'en proceso'
            ) AS cursos_en_proceso
        `
      );


    // -------------------------------------------------------
    // TOTAL DE CURSOS REALIZADOS POR CURSO
    // -------------------------------------------------------

    const cursosPorCurso =
      await pool.query(
        `
          SELECT
            c.id_curso,
            c.codigo_curso,
            c.nombre_curso,
            COUNT(cr.id_curso_realizado)::int AS cantidad

          FROM cursos c

          LEFT JOIN cursos_realizados cr
            ON c.id_curso = cr.id_curso

          GROUP BY
            c.id_curso,
            c.codigo_curso,
            c.nombre_curso

          ORDER BY
            cantidad DESC,
            c.nombre_curso ASC
        `
      );


    res.json({

      resumen:
        resumenGeneral.rows[0],

      cursos:
        cursosPorCurso.rows

    });


  } catch (error) {

    console.error(
      'Error al obtener resumen de capacitación:',
      error
    );


    res.status(500).json({

      mensaje:
        'Error al obtener el resumen de capacitación'

    });

  }

};


// =========================================================
// OBTENER REPORTE DE CURSOS POR REPARTICIÓN
// =========================================================

const obtenerCursosPorReparticion = async (req, res) => {

  try {

    const {
      zona,
      reparticion
    } = req.query;


    if (!reparticion) {

      return res.status(400).json({
        mensaje:
          'Debe seleccionar una repartición'
      });

    }


    const parametros = [
      reparticion
    ];


    let condicionZona = '';


    if (zona) {

      parametros.push(zona);

      condicionZona = `
        AND z.id_zona = $2
      `;

    }


    // -------------------------------------------------------
    // INFORMACIÓN DE LA REPARTICIÓN
    // -------------------------------------------------------

    const reparticionResultado =
      await pool.query(
        `
          SELECT
            r.id_reparticion,
            r.nombre_reparticion,
            z.id_zona,
            z.nombre_zona

          FROM reparticiones r

          INNER JOIN zonas_navales z
            ON r.id_zona = z.id_zona

          WHERE r.id_reparticion = $1

          ${condicionZona}
        `,
        parametros
      );


    if (
      reparticionResultado.rows.length === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La repartición seleccionada no existe'
      });

    }


    // -------------------------------------------------------
    // RESUMEN GENERAL
    // -------------------------------------------------------

    const resumenResultado =
      await pool.query(
        `
          SELECT

            COUNT(
              DISTINCT f.id_funcionario
            )::int
              AS funcionarios_con_cursos,

            COUNT(
              cr.id_curso_realizado
            )::int
              AS cursos_realizados,

            COUNT(
              CASE
                WHEN LOWER(ec.nombre_estado) =
                  'vigente'
                THEN 1
              END
            )::int
              AS cursos_vigentes,

            COUNT(
              CASE
                WHEN LOWER(ec.nombre_estado) =
                  'vencido'
                THEN 1
              END
            )::int
              AS cursos_vencidos,

            COUNT(
              CASE
                WHEN LOWER(ec.nombre_estado) =
                  'en proceso'
                THEN 1
              END
            )::int
              AS cursos_en_proceso

          FROM funcionarios f

          INNER JOIN cursos_realizados cr
            ON f.id_funcionario =
              cr.id_funcionario

          INNER JOIN estado_curso ec
            ON cr.id_estado =
              ec.id_estado

          WHERE
            f.id_reparticion = $1
        `,
        [
          reparticion
        ]
      );


    // -------------------------------------------------------
    // CURSOS REALIZADOS AGRUPADOS POR CURSO
    // -------------------------------------------------------

    const cursosResultado =
      await pool.query(
        `
          SELECT
            c.id_curso,
            c.codigo_curso,
            c.nombre_curso,

            COUNT(
              cr.id_curso_realizado
            )::int
              AS cantidad

          FROM cursos_realizados cr

          INNER JOIN funcionarios f
            ON cr.id_funcionario =
              f.id_funcionario

          INNER JOIN cursos c
            ON cr.id_curso =
              c.id_curso

          WHERE
            f.id_reparticion = $1

          GROUP BY
            c.id_curso,
            c.codigo_curso,
            c.nombre_curso

          ORDER BY
            cantidad DESC,
            c.nombre_curso ASC
        `,
        [
          reparticion
        ]
      );


    res.json({

      reparticion:
        reparticionResultado.rows[0],

      resumen:
        resumenResultado.rows[0],

      cursos:
        cursosResultado.rows

    });


  } catch (error) {

    console.error(
      'Error al obtener cursos por repartición:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al obtener el reporte de cursos por repartición'
    });

  }

};


// =========================================================
// OBTENER REPORTE DE CURSOS POR ZONA NAVAL
// =========================================================

const obtenerCursosPorZona = async (req, res) => {

  try {

    const {
      zona
    } = req.query;


    if (!zona) {

      return res.status(400).json({
        mensaje:
          'Debe seleccionar una Zona Naval'
      });

    }


    // -------------------------------------------------------
    // INFORMACIÓN DE LA ZONA NAVAL
    // -------------------------------------------------------

    const zonaResultado =
      await pool.query(
        `
          SELECT
            id_zona,
            nombre_zona,
            descripcion

          FROM zonas_navales

          WHERE id_zona = $1
        `,
        [
          zona
        ]
      );


    if (
      zonaResultado.rows.length === 0
    ) {

      return res.status(404).json({
        mensaje:
          'La Zona Naval seleccionada no existe'
      });

    }


    // -------------------------------------------------------
    // RESUMEN GENERAL
    // -------------------------------------------------------

    const resumenResultado =
      await pool.query(
        `
          SELECT

            COUNT(
              DISTINCT f.id_funcionario
            )::int
              AS funcionarios_con_cursos,

            COUNT(
              cr.id_curso_realizado
            )::int
              AS cursos_realizados,

            COUNT(
              CASE
                WHEN LOWER(ec.nombre_estado) =
                  'vigente'
                THEN 1
              END
            )::int
              AS cursos_vigentes,

            COUNT(
              CASE
                WHEN LOWER(ec.nombre_estado) =
                  'vencido'
                THEN 1
              END
            )::int
              AS cursos_vencidos,

            COUNT(
              CASE
                WHEN LOWER(ec.nombre_estado) =
                  'en proceso'
                THEN 1
              END
            )::int
              AS cursos_en_proceso

          FROM funcionarios f

          INNER JOIN reparticiones r
            ON f.id_reparticion =
              r.id_reparticion

          INNER JOIN cursos_realizados cr
            ON f.id_funcionario =
              cr.id_funcionario

          INNER JOIN estado_curso ec
            ON cr.id_estado =
              ec.id_estado

          WHERE
            r.id_zona = $1
        `,
        [
          zona
        ]
      );


    // -------------------------------------------------------
    // CURSOS REALIZADOS AGRUPADOS POR REPARTICIÓN
    // -------------------------------------------------------

    const reparticionesResultado =
      await pool.query(
        `
          SELECT
            r.id_reparticion,
            r.nombre_reparticion,

            COUNT(
              cr.id_curso_realizado
            )::int
              AS cantidad

          FROM reparticiones r

          LEFT JOIN funcionarios f
            ON r.id_reparticion =
              f.id_reparticion

          LEFT JOIN cursos_realizados cr
            ON f.id_funcionario =
              cr.id_funcionario

          WHERE
            r.id_zona = $1

          GROUP BY
            r.id_reparticion,
            r.nombre_reparticion

          ORDER BY
            cantidad DESC,
            r.nombre_reparticion ASC
        `,
        [
          zona
        ]
      );


    res.json({

      zona:
        zonaResultado.rows[0],

      resumen:
        resumenResultado.rows[0],

      reparticiones:
        reparticionesResultado.rows

    });


  } catch (error) {

    console.error(
      'Error al obtener cursos por Zona Naval:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al obtener el reporte de cursos por Zona Naval'
    });

  }

};

// =========================================================
// EXPORTACIONES
// =========================================================

module.exports = {

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

  // ESTADOS DE CURSOS
  obtenerEstados,
  registrarEstado,
  actualizarEstado,
  eliminarEstado,

  // REPORTES
 obtenerResumenCapacitacion,
 obtenerCursosPorReparticion,
 obtenerCursosPorZona
};
const pool = require('../config/db');


// =========================================================
// BUSCAR FUNCIONARIOS EN CONSULTAS
// =========================================================

const buscarFuncionarios = async (req, res) => {
  try {

    const {
      zona,
      reparticion,
      curso,
      estado
    } = req.query;


    let consulta = `
      SELECT
        cr.id_curso_realizado,
        f.id_funcionario,
        f.npi,
        f.grado,
        f.apellidos,
        f.nombres,
        f.especialidad,
        f.activo,
        r.nombre_reparticion,
        z.nombre_zona,
        c.nombre_curso,
        e.nombre_estado,
        cr.fecha_inicio,
        cr.fecha_termino,
        cr.fecha_vencimiento,
        cr.nota

      FROM funcionarios f

      JOIN reparticiones r
        ON f.id_reparticion = r.id_reparticion

      JOIN zonas_navales z
        ON r.id_zona = z.id_zona

      JOIN cursos_realizados cr
        ON f.id_funcionario = cr.id_funcionario

      JOIN cursos c
        ON cr.id_curso = c.id_curso

      JOIN estado_curso e
        ON cr.id_estado = e.id_estado
    `;


    // =========================================================
    // SOLO FUNCIONARIOS ACTIVOS EN CONSULTAS
    // =========================================================

    const condiciones = [
      'f.activo = TRUE'
    ];

    const valores = [];


    if (zona) {

      valores.push(zona);

      condiciones.push(
        `z.id_zona = $${valores.length}`
      );
    }


    if (reparticion) {

      valores.push(reparticion);

      condiciones.push(
        `r.id_reparticion = $${valores.length}`
      );
    }


    if (curso) {

      valores.push(curso);

      condiciones.push(
        `c.id_curso = $${valores.length}`
      );
    }


    if (estado) {

      valores.push(estado);

      condiciones.push(
        `e.id_estado = $${valores.length}`
      );
    }


    consulta += `
      WHERE ${condiciones.join(' AND ')}
    `;


    // =========================================================
    // ORDEN JERÁRQUICO
    // =========================================================

    consulta += `
      ORDER BY

        z.id_zona ASC,

        r.id_reparticion ASC,

        CASE

          WHEN LOWER(TRIM(f.grado)) = 'almirante'
            THEN 1

          WHEN LOWER(TRIM(f.grado)) = 'vice almirante'
            THEN 2

          WHEN LOWER(TRIM(f.grado)) = 'contra almirante'
            THEN 3

          WHEN LOWER(TRIM(f.grado)) IN (
            'capitan de navio',
            'capitán de navío',
            'capitan de navío',
            'capitán de navio'
          )
            THEN 4

          WHEN LOWER(TRIM(f.grado)) IN (
            'capitan de fragata',
            'capitán de fragata'
          )
            THEN 5

          WHEN LOWER(TRIM(f.grado)) IN (
            'capitan de corbeta',
            'capitán de corbeta'
          )
            THEN 6

          WHEN LOWER(TRIM(f.grado)) IN (
            'teniente 1°',
            'teniente 1º',
            'teniente 1'
          )
            THEN 7

          WHEN LOWER(TRIM(f.grado)) IN (
            'teniente 2°',
            'teniente 2º',
            'teniente 2'
          )
            THEN 8

          WHEN LOWER(TRIM(f.grado)) = 'subteniente'
            THEN 9

          WHEN LOWER(TRIM(f.grado)) = 'suboficial mayor'
            THEN 10

          WHEN LOWER(TRIM(f.grado)) = 'suboficial'
            THEN 11

          WHEN LOWER(TRIM(f.grado)) IN (
            'sargento 1°',
            'sargento 1º',
            'sargento 1'
          )
            THEN 12

          WHEN LOWER(TRIM(f.grado)) IN (
            'sargento 2°',
            'sargento 2º',
            'sargento 2'
          )
            THEN 13

          WHEN LOWER(TRIM(f.grado)) IN (
            'cabo 1°',
            'cabo 1º',
            'cabo 1'
          )
            THEN 14

          WHEN LOWER(TRIM(f.grado)) IN (
            'cabo 2°',
            'cabo 2º',
            'cabo 2'
          )
            THEN 15

          WHEN LOWER(TRIM(f.grado)) IN (
            'marinero 1°',
            'marinero 1º',
            'marinero 1'
          )
            THEN 16

          WHEN LOWER(TRIM(f.grado)) =
            'marinero tropa profesional'
            THEN 17

          ELSE 99

        END ASC,

        f.apellidos ASC,
        f.nombres ASC,
        c.nombre_curso ASC
    `;


    const resultado = await pool.query(
      consulta,
      valores
    );


    res.json(resultado.rows);

  } catch (error) {

    console.error(
      'Error al buscar funcionarios:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al buscar funcionarios'
    });
  }
};


// =========================================================
// REGISTRAR FUNCIONARIO
// =========================================================

const registrarFuncionario = async (req, res) => {
  try {

    const {
      npi,
      grado,
      especialidad,
      apellidos,
      nombres,
      rut,
      id_reparticion
    } = req.body;


    if (
      !npi ||
      !grado ||
      !apellidos ||
      !nombres ||
      !id_reparticion
    ) {

      return res.status(400).json({
        mensaje:
          'Debe completar los campos obligatorios'
      });
    }


    const existente = await pool.query(
      `
        SELECT
          id_funcionario

        FROM funcionarios

        WHERE npi = $1
      `,
      [
        npi
      ]
    );


    if (existente.rows.length > 0) {

      return res.status(409).json({
        mensaje:
          'Ya existe un funcionario registrado con ese NPI'
      });
    }


    const resultado = await pool.query(
      `
        INSERT INTO funcionarios
        (
          npi,
          grado,
          especialidad,
          apellidos,
          nombres,
          rut,
          id_reparticion
        )

        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )

        RETURNING
          id_funcionario,
          npi,
          grado,
          especialidad,
          apellidos,
          nombres,
          rut,
          activo,
          id_reparticion
      `,
      [
        npi,
        grado,
        especialidad || null,
        apellidos,
        nombres,
        rut || null,
        id_reparticion
      ]
    );


    res.status(201).json({
      mensaje:
        'Funcionario registrado correctamente',

      funcionario:
        resultado.rows[0]
    });

  } catch (error) {

    console.error(
      'Error al registrar funcionario:',
      error
    );


    if (error.code === '23505') {

      return res.status(409).json({
        mensaje:
          'El NPI o RUT ingresado ya se encuentra registrado'
      });
    }


    res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });
  }
};


// =========================================================
// OBTENER FUNCIONARIOS PARA ADMINISTRACIÓN
// BUSCAR POR NPI, APELLIDO O NOMBRE
// FILTRAR POR ZONA NAVAL Y REPARTICIÓN
// =========================================================

const obtenerFuncionarios = async (req, res) => {
  try {

    const {
      buscar,
      zona,
      reparticion
    } = req.query;


    const valores = [];

    const condiciones = [];


    let consulta = `
      SELECT
        f.id_funcionario,
        f.npi,
        f.grado,
        f.especialidad,
        f.apellidos,
        f.nombres,
        f.rut,
        f.activo,
        f.id_reparticion,
        r.nombre_reparticion,
        z.id_zona,
        z.nombre_zona

      FROM funcionarios f

      JOIN reparticiones r
        ON f.id_reparticion = r.id_reparticion

      JOIN zonas_navales z
        ON r.id_zona = z.id_zona
    `;


    // =========================================================
    // BUSCADOR POR NPI, APELLIDO O NOMBRE
    // =========================================================

    if (
      buscar &&
      buscar.trim() !== ''
    ) {

      valores.push(
        `%${buscar.trim()}%`
      );


      condiciones.push(
        `
          (
            f.npi ILIKE $${valores.length}
            OR f.apellidos ILIKE $${valores.length}
            OR f.nombres ILIKE $${valores.length}
          )
        `
      );
    }


    // =========================================================
    // FILTRO POR ZONA NAVAL
    // =========================================================

    if (
      zona &&
      String(zona).trim() !== ''
    ) {

      valores.push(zona);


      condiciones.push(
        `z.id_zona = $${valores.length}`
      );
    }


    // =========================================================
    // FILTRO POR REPARTICIÓN
    // =========================================================

    if (
      reparticion &&
      String(reparticion).trim() !== ''
    ) {

      valores.push(reparticion);


      condiciones.push(
        `r.id_reparticion = $${valores.length}`
      );
    }


    // =========================================================
    // AGREGAR CONDICIONES
    // =========================================================

    if (condiciones.length > 0) {

      consulta += `
        WHERE
          ${condiciones.join(' AND ')}
      `;
    }


    // =========================================================
    // ORDEN JERÁRQUICO
    // =========================================================

    consulta += `
      ORDER BY

        z.id_zona ASC,

        r.id_reparticion ASC,

        CASE

          WHEN LOWER(TRIM(f.grado)) = 'almirante'
            THEN 1

          WHEN LOWER(TRIM(f.grado)) = 'vice almirante'
            THEN 2

          WHEN LOWER(TRIM(f.grado)) = 'contra almirante'
            THEN 3

          WHEN LOWER(TRIM(f.grado)) IN (
            'capitan de navio',
            'capitán de navío',
            'capitan de navío',
            'capitán de navio'
          )
            THEN 4

          WHEN LOWER(TRIM(f.grado)) IN (
            'capitan de fragata',
            'capitán de fragata'
          )
            THEN 5

          WHEN LOWER(TRIM(f.grado)) IN (
            'capitan de corbeta',
            'capitán de corbeta'
          )
            THEN 6

          WHEN LOWER(TRIM(f.grado)) IN (
            'teniente 1°',
            'teniente 1º',
            'teniente 1'
          )
            THEN 7

          WHEN LOWER(TRIM(f.grado)) IN (
            'teniente 2°',
            'teniente 2º',
            'teniente 2'
          )
            THEN 8

          WHEN LOWER(TRIM(f.grado)) = 'subteniente'
            THEN 9

          WHEN LOWER(TRIM(f.grado)) = 'suboficial mayor'
            THEN 10

          WHEN LOWER(TRIM(f.grado)) = 'suboficial'
            THEN 11

          WHEN LOWER(TRIM(f.grado)) IN (
            'sargento 1°',
            'sargento 1º',
            'sargento 1'
          )
            THEN 12

          WHEN LOWER(TRIM(f.grado)) IN (
            'sargento 2°',
            'sargento 2º',
            'sargento 2'
          )
            THEN 13

          WHEN LOWER(TRIM(f.grado)) IN (
            'cabo 1°',
            'cabo 1º',
            'cabo 1'
          )
            THEN 14

          WHEN LOWER(TRIM(f.grado)) IN (
            'cabo 2°',
            'cabo 2º',
            'cabo 2'
          )
            THEN 15

          WHEN LOWER(TRIM(f.grado)) IN (
            'marinero 1°',
            'marinero 1º',
            'marinero 1'
          )
            THEN 16

          WHEN LOWER(TRIM(f.grado)) =
            'marinero tropa profesional'
            THEN 17

          ELSE 99

        END ASC,

        f.apellidos ASC,
        f.nombres ASC
    `;


    const resultado = await pool.query(
      consulta,
      valores
    );


    res.json(resultado.rows);

  } catch (error) {

    console.error(
      'Error al obtener los funcionarios:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al obtener los funcionarios'
    });
  }
};


// =========================================================
// ACTUALIZAR FUNCIONARIO
// =========================================================

const actualizarFuncionario = async (req, res) => {
  try {

    const { id } = req.params;


    const {
      npi,
      grado,
      especialidad,
      apellidos,
      nombres,
      rut,
      id_reparticion
    } = req.body;


    if (
      !npi ||
      !grado ||
      !apellidos ||
      !nombres ||
      !id_reparticion
    ) {

      return res.status(400).json({
        mensaje:
          'Faltan datos obligatorios'
      });
    }


    const existe = await pool.query(
      `
        SELECT
          id_funcionario

        FROM funcionarios

        WHERE id_funcionario = $1
      `,
      [
        id
      ]
    );


    if (existe.rowCount === 0) {

      return res.status(404).json({
        mensaje:
          'Funcionario no encontrado'
      });
    }


    const resultado = await pool.query(
      `
        UPDATE funcionarios

        SET
          npi = $1,
          grado = $2,
          especialidad = $3,
          apellidos = $4,
          nombres = $5,
          rut = $6,
          id_reparticion = $7

        WHERE id_funcionario = $8

        RETURNING *
      `,
      [
        npi,
        grado,
        especialidad || null,
        apellidos,
        nombres,
        rut || null,
        id_reparticion,
        id
      ]
    );


    res.json({
      mensaje:
        'Funcionario actualizado correctamente',

      funcionario:
        resultado.rows[0]
    });

  } catch (error) {

    console.error(
      'Error al actualizar funcionario:',
      error
    );


    if (error.code === '23505') {

      return res.status(409).json({
        mensaje:
          'El NPI o RUT ya se encuentra registrado'
      });
    }


    res.status(500).json({
      mensaje:
        'Error al actualizar funcionario'
    });
  }
};


// =========================================================
// ELIMINAR FUNCIONARIO
// =========================================================

const eliminarFuncionario = async (req, res) => {
  try {

    const { id } = req.params;


    const existe = await pool.query(
      `
        SELECT
          id_funcionario

        FROM funcionarios

        WHERE id_funcionario = $1
      `,
      [
        id
      ]
    );


    if (existe.rowCount === 0) {

      return res.status(404).json({
        mensaje:
          'Funcionario no encontrado'
      });
    }


    const cursosRealizados =
      await pool.query(
        `
          SELECT
            COUNT(*)::int AS cantidad

          FROM cursos_realizados

          WHERE id_funcionario = $1
        `,
        [
          id
        ]
      );


    if (
      cursosRealizados.rows[0].cantidad > 0
    ) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar el funcionario porque tiene cursos registrados'
      });
    }


    await pool.query(
      `
        DELETE FROM funcionarios

        WHERE id_funcionario = $1
      `,
      [
        id
      ]
    );


    res.json({
      mensaje:
        'Funcionario eliminado correctamente'
    });

  } catch (error) {

    console.error(
      'Error al eliminar funcionario:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al eliminar funcionario'
    });
  }
};


// =========================================================
// DAR DE BAJA / REACTIVAR FUNCIONARIO
// =========================================================

const cambiarEstadoFuncionario = async (req, res) => {
  try {

    const { id } = req.params;

    const { activo } = req.body;


    if (
      typeof activo !== 'boolean'
    ) {

      return res.status(400).json({
        mensaje:
          'El estado activo debe ser verdadero o falso'
      });
    }


    const existe = await pool.query(
      `
        SELECT
          id_funcionario,
          activo

        FROM funcionarios

        WHERE id_funcionario = $1
      `,
      [
        id
      ]
    );


    if (existe.rowCount === 0) {

      return res.status(404).json({
        mensaje:
          'Funcionario no encontrado'
      });
    }


    if (
      existe.rows[0].activo === activo
    ) {

      return res.status(200).json({

        mensaje: activo
          ? 'El funcionario ya se encuentra activo'
          : 'El funcionario ya se encuentra inactivo',

        funcionario:
          existe.rows[0]
      });
    }


    const resultado = await pool.query(
      `
        UPDATE funcionarios

        SET activo = $1

        WHERE id_funcionario = $2

        RETURNING
          id_funcionario,
          npi,
          grado,
          apellidos,
          nombres,
          activo
      `,
      [
        activo,
        id
      ]
    );


    res.json({

      mensaje: activo
        ? 'Funcionario reactivado correctamente'
        : 'Funcionario dado de baja correctamente',

      funcionario:
        resultado.rows[0]
    });

  } catch (error) {

    console.error(
      'Error al cambiar estado del funcionario:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al cambiar el estado del funcionario'
    });
  }
};


// =========================================================
// EXPORTACIONES
// =========================================================

module.exports = {
  buscarFuncionarios,
  registrarFuncionario,
  obtenerFuncionarios,
  actualizarFuncionario,
  eliminarFuncionario,
  cambiarEstadoFuncionario
};
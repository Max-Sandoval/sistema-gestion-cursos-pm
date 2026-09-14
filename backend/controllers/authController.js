const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// =========================================================
// INICIAR SESIÓN
// =========================================================

const login = async (req, res) => {
  try {

    const {
      nombre_usuario,
      password
    } = req.body;


    if (!nombre_usuario || !password) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar usuario y contraseña'
      });
    }


    const resultado = await pool.query(
      `
        SELECT
          u.id_usuario,
          u.nombre_usuario,
          u.password_hash,
          u.correo,
          u.activo,
          r.id_rol,
          r.nombre_rol

        FROM usuarios u

        JOIN roles r
          ON u.id_rol = r.id_rol

        WHERE u.nombre_usuario = $1
      `,
      [
        nombre_usuario
      ]
    );


    if (resultado.rows.length === 0) {

      return res.status(401).json({
        mensaje:
          'Usuario o contraseña incorrectos'
      });
    }


    const usuario =
      resultado.rows[0];


    if (!usuario.activo) {

      return res.status(403).json({
        mensaje:
          'Usuario inactivo'
      });
    }


    const passwordCorrecta =
      await bcrypt.compare(
        password,
        usuario.password_hash
      );


    if (!passwordCorrecta) {

      return res.status(401).json({
        mensaje:
          'Usuario o contraseña incorrectos'
      });
    }


    const token = jwt.sign(
      {
        id_usuario:
          usuario.id_usuario,

        nombre_usuario:
          usuario.nombre_usuario,

        id_rol:
          usuario.id_rol,

        nombre_rol:
          usuario.nombre_rol
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '2h'
      }
    );


    res.json({

      mensaje:
        'Inicio de sesión correcto',

      token,

      usuario: {

        id_usuario:
          usuario.id_usuario,

        nombre_usuario:
          usuario.nombre_usuario,

        correo:
          usuario.correo,

        id_rol:
          usuario.id_rol,

        nombre_rol:
          usuario.nombre_rol
      }

    });

  } catch (error) {

    console.error(
      'Error en login:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });
  }
};


// =========================================================
// OBTENER ROLES
// =========================================================

const obtenerRoles = async (req, res) => {
  try {

    const resultado =
      await pool.query(
        `
          SELECT
            id_rol,
            nombre_rol,
            descripcion

          FROM roles

          ORDER BY id_rol ASC
        `
      );


    res.json(
      resultado.rows
    );

  } catch (error) {

    console.error(
      'Error al obtener roles:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al obtener los roles'
    });
  }
};


// =========================================================
// OBTENER USUARIOS
// BUSCAR POR USUARIO, CORREO O PERFIL
// =========================================================

const obtenerUsuarios = async (req, res) => {
  try {

    const {
      buscar
    } = req.query;


    const valores = [];


    let consulta = `
      SELECT
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.activo,
        u.id_rol,
        r.nombre_rol

      FROM usuarios u

      JOIN roles r
        ON u.id_rol = r.id_rol
    `;


    if (
      buscar &&
      buscar.trim() !== ''
    ) {

      valores.push(
        `%${buscar.trim()}%`
      );


      consulta += `
        WHERE
          u.nombre_usuario ILIKE $1
          OR u.correo ILIKE $1
          OR r.nombre_rol ILIKE $1
      `;
    }


    consulta += `
      ORDER BY
        u.nombre_usuario ASC
    `;


    const resultado =
      await pool.query(
        consulta,
        valores
      );


    res.json(
      resultado.rows
    );

  } catch (error) {

    console.error(
      'Error al obtener usuarios:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al obtener los usuarios'
    });
  }
};


// =========================================================
// REGISTRAR USUARIO
// =========================================================

const registrarUsuario = async (req, res) => {
  try {

    const {
      nombre_usuario,
      correo,
      password,
      id_rol
    } = req.body;


    if (
      !nombre_usuario ||
      !correo ||
      !password ||
      !id_rol
    ) {

      return res.status(400).json({
        mensaje:
          'Debe completar todos los campos obligatorios'
      });
    }


    const nombreLimpio =
      nombre_usuario.trim();


    const correoLimpio =
      correo.trim().toLowerCase();


    if (password.length < 8) {

      return res.status(400).json({
        mensaje:
          'La contraseña debe tener al menos 8 caracteres'
      });
    }


    // =====================================================
    // VALIDAR ROL
    // =====================================================

    const rolExiste =
      await pool.query(
        `
          SELECT
            id_rol

          FROM roles

          WHERE id_rol = $1
        `,
        [
          id_rol
        ]
      );


    if (rolExiste.rowCount === 0) {

      return res.status(400).json({
        mensaje:
          'El perfil seleccionado no es válido'
      });
    }


    // =====================================================
    // VALIDAR NOMBRE DE USUARIO
    // =====================================================

    const usuarioExistente =
      await pool.query(
        `
          SELECT
            id_usuario

          FROM usuarios

          WHERE LOWER(nombre_usuario)
            = LOWER($1)
        `,
        [
          nombreLimpio
        ]
      );


    if (
      usuarioExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe un usuario con ese nombre'
      });
    }


    // =====================================================
    // VALIDAR CORREO
    // =====================================================

    const correoExistente =
      await pool.query(
        `
          SELECT
            id_usuario

          FROM usuarios

          WHERE LOWER(correo)
            = LOWER($1)
        `,
        [
          correoLimpio
        ]
      );


    if (
      correoExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe un usuario registrado con ese correo'
      });
    }


    // =====================================================
    // CIFRAR CONTRASEÑA
    // =====================================================

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );


    // =====================================================
    // REGISTRAR
    // =====================================================

    const resultado =
      await pool.query(
        `
          INSERT INTO usuarios
          (
            nombre_usuario,
            password_hash,
            correo,
            activo,
            id_rol
          )

          VALUES
          (
            $1,
            $2,
            $3,
            TRUE,
            $4
          )

          RETURNING
            id_usuario,
            nombre_usuario,
            correo,
            activo,
            id_rol
        `,
        [
          nombreLimpio,
          passwordHash,
          correoLimpio,
          id_rol
        ]
      );


    res.status(201).json({

      mensaje:
        'Usuario registrado correctamente',

      usuario:
        resultado.rows[0]
    });

  } catch (error) {

    console.error(
      'Error al registrar usuario:',
      error
    );


    if (
      error.code === '23505'
    ) {

      return res.status(409).json({
        mensaje:
          'El nombre de usuario o correo ya se encuentra registrado'
      });
    }


    res.status(500).json({
      mensaje:
        'Error al registrar el usuario'
    });
  }
};


// =========================================================
// ACTUALIZAR USUARIO
// =========================================================

const actualizarUsuario = async (req, res) => {
  try {

    const {
      id
    } = req.params;


    const {
      nombre_usuario,
      correo,
      id_rol
    } = req.body;


    if (
      !nombre_usuario ||
      !correo ||
      !id_rol
    ) {

      return res.status(400).json({
        mensaje:
          'Debe completar todos los campos obligatorios'
      });
    }


    const nombreLimpio =
      nombre_usuario.trim();


    const correoLimpio =
      correo.trim().toLowerCase();


    // =====================================================
    // VERIFICAR USUARIO
    // =====================================================

    const usuarioExiste =
      await pool.query(
        `
          SELECT
            id_usuario

          FROM usuarios

          WHERE id_usuario = $1
        `,
        [
          id
        ]
      );


    if (
      usuarioExiste.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'Usuario no encontrado'
      });
    }


    // =====================================================
    // VALIDAR ROL
    // =====================================================

    const rolExiste =
      await pool.query(
        `
          SELECT
            id_rol

          FROM roles

          WHERE id_rol = $1
        `,
        [
          id_rol
        ]
      );


    if (
      rolExiste.rowCount === 0
    ) {

      return res.status(400).json({
        mensaje:
          'El perfil seleccionado no es válido'
      });
    }


    // =====================================================
    // VALIDAR NOMBRE DUPLICADO
    // =====================================================

    const nombreExistente =
      await pool.query(
        `
          SELECT
            id_usuario

          FROM usuarios

          WHERE LOWER(nombre_usuario)
            = LOWER($1)

          AND id_usuario <> $2
        `,
        [
          nombreLimpio,
          id
        ]
      );


    if (
      nombreExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe otro usuario con ese nombre'
      });
    }


    // =====================================================
    // VALIDAR CORREO DUPLICADO
    // =====================================================

    const correoExistente =
      await pool.query(
        `
          SELECT
            id_usuario

          FROM usuarios

          WHERE LOWER(correo)
            = LOWER($1)

          AND id_usuario <> $2
        `,
        [
          correoLimpio,
          id
        ]
      );


    if (
      correoExistente.rowCount > 0
    ) {

      return res.status(409).json({
        mensaje:
          'Ya existe otro usuario con ese correo'
      });
    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    const resultado =
      await pool.query(
        `
          UPDATE usuarios

          SET
            nombre_usuario = $1,
            correo = $2,
            id_rol = $3

          WHERE id_usuario = $4

          RETURNING
            id_usuario,
            nombre_usuario,
            correo,
            activo,
            id_rol
        `,
        [
          nombreLimpio,
          correoLimpio,
          id_rol,
          id
        ]
      );


    res.json({

      mensaje:
        'Usuario actualizado correctamente',

      usuario:
        resultado.rows[0]
    });

  } catch (error) {

    console.error(
      'Error al actualizar usuario:',
      error
    );


    if (
      error.code === '23505'
    ) {

      return res.status(409).json({
        mensaje:
          'El nombre de usuario o correo ya se encuentra registrado'
      });
    }


    res.status(500).json({
      mensaje:
        'Error al actualizar el usuario'
    });
  }
};


// =========================================================
// ACTIVAR / DESACTIVAR USUARIO
// =========================================================

const cambiarEstadoUsuario = async (req, res) => {
  try {

    const {
      id
    } = req.params;


    const {
      activo
    } = req.body;


    if (
      typeof activo !== 'boolean'
    ) {

      return res.status(400).json({
        mensaje:
          'El estado debe ser verdadero o falso'
      });
    }


    // =====================================================
    // EVITAR DESACTIVAR LA PROPIA CUENTA
    // =====================================================

    if (
      Number(id) ===
        Number(req.usuario.id_usuario) &&
      activo === false
    ) {

      return res.status(400).json({
        mensaje:
          'No puede desactivar su propia cuenta'
      });
    }


    const existe =
      await pool.query(
        `
          SELECT
            id_usuario,
            activo

          FROM usuarios

          WHERE id_usuario = $1
        `,
        [
          id
        ]
      );


    if (
      existe.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'Usuario no encontrado'
      });
    }


    if (
      existe.rows[0].activo === activo
    ) {

      return res.status(200).json({

        mensaje: activo
          ? 'El usuario ya se encuentra activo'
          : 'El usuario ya se encuentra inactivo'
      });
    }


    const resultado =
      await pool.query(
        `
          UPDATE usuarios

          SET activo = $1

          WHERE id_usuario = $2

          RETURNING
            id_usuario,
            nombre_usuario,
            correo,
            activo,
            id_rol
        `,
        [
          activo,
          id
        ]
      );


    res.json({

      mensaje: activo
        ? 'Usuario reactivado correctamente'
        : 'Usuario desactivado correctamente',

      usuario:
        resultado.rows[0]
    });

  } catch (error) {

    console.error(
      'Error al cambiar estado del usuario:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al cambiar el estado del usuario'
    });
  }
};


// =========================================================
// RESTABLECER CONTRASEÑA DE USUARIO
// SOLO ADMINISTRADOR
// =========================================================

const restablecerPasswordUsuario = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      nueva_password,
      confirmar_password
    } = req.body;


    // =====================================================
    // VALIDAR CAMPOS
    // =====================================================

    if (
      !nueva_password ||
      !confirmar_password
    ) {

      return res.status(400).json({
        mensaje:
          'Debe ingresar y confirmar la nueva contraseña'
      });
    }


    // =====================================================
    // VALIDAR CONFIRMACIÓN
    // =====================================================

    if (
      nueva_password !==
      confirmar_password
    ) {

      return res.status(400).json({
        mensaje:
          'Las contraseñas no coinciden'
      });
    }


    // =====================================================
    // VALIDAR LONGITUD
    // =====================================================

    if (
      nueva_password.length < 8
    ) {

      return res.status(400).json({
        mensaje:
          'La contraseña debe tener al menos 8 caracteres'
      });
    }


    // =====================================================
    // IMPEDIR RESTABLECER LA PROPIA CONTRASEÑA
    // =====================================================

    if (
      Number(id) ===
      Number(req.usuario.id_usuario)
    ) {

      return res.status(400).json({
        mensaje:
          'No puede restablecer su propia contraseña desde Administración. Utilice Mi Perfil.'
      });
    }


    // =====================================================
    // BUSCAR USUARIO
    // =====================================================

    const resultadoUsuario =
      await pool.query(
        `
          SELECT
            id_usuario,
            nombre_usuario,
            password_hash

          FROM usuarios

          WHERE id_usuario = $1
        `,
        [
          id
        ]
      );


    if (
      resultadoUsuario.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'Usuario no encontrado'
      });
    }


    const usuario =
      resultadoUsuario.rows[0];


    // =====================================================
    // IMPEDIR USAR LA MISMA CONTRASEÑA
    // =====================================================

    const mismaPassword =
      await bcrypt.compare(
        nueva_password,
        usuario.password_hash
      );


    if (mismaPassword) {

      return res.status(400).json({
        mensaje:
          'La nueva contraseña debe ser diferente a la contraseña actual'
      });
    }


    // =====================================================
    // CIFRAR NUEVA CONTRASEÑA
    // =====================================================

    const nuevoHash =
      await bcrypt.hash(
        nueva_password,
        10
      );


    // =====================================================
    // ACTUALIZAR CONTRASEÑA
    // =====================================================

    await pool.query(
      `
        UPDATE usuarios

        SET password_hash = $1

        WHERE id_usuario = $2
      `,
      [
        nuevoHash,
        id
      ]
    );


    res.json({
      mensaje:
        `Contraseña del usuario ${usuario.nombre_usuario} restablecida correctamente`
    });

  } catch (error) {

    console.error(
      'Error al restablecer contraseña:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al restablecer la contraseña del usuario'
    });
  }
};


// =========================================================
// CAMBIAR CONTRASEÑA PROPIA
// USUARIO AUTENTICADO
// =========================================================

const cambiarPasswordPropia = async (req, res) => {
  try {

    const {
      password_actual,
      nueva_password,
      confirmar_password
    } = req.body;


    // =====================================================
    // VALIDAR CAMPOS
    // =====================================================

    if (
      !password_actual ||
      !nueva_password ||
      !confirmar_password
    ) {

      return res.status(400).json({
        mensaje:
          'Debe completar todos los campos'
      });
    }


    // =====================================================
    // VALIDAR CONFIRMACIÓN
    // =====================================================

    if (
      nueva_password !==
      confirmar_password
    ) {

      return res.status(400).json({
        mensaje:
          'Las contraseñas nuevas no coinciden'
      });
    }


    // =====================================================
    // VALIDAR LONGITUD
    // =====================================================

    if (
      nueva_password.length < 8
    ) {

      return res.status(400).json({
        mensaje:
          'La nueva contraseña debe tener al menos 8 caracteres'
      });
    }


    // =====================================================
    // OBTENER USUARIO AUTENTICADO
    // =====================================================

    const resultadoUsuario =
      await pool.query(
        `
          SELECT
            id_usuario,
            nombre_usuario,
            password_hash,
            activo

          FROM usuarios

          WHERE id_usuario = $1
        `,
        [
          req.usuario.id_usuario
        ]
      );


    if (
      resultadoUsuario.rowCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          'Usuario no encontrado'
      });
    }


    const usuario =
      resultadoUsuario.rows[0];


    if (!usuario.activo) {

      return res.status(403).json({
        mensaje:
          'Usuario inactivo'
      });
    }


    // =====================================================
    // VALIDAR CONTRASEÑA ACTUAL
    // =====================================================

    const passwordActualCorrecta =
      await bcrypt.compare(
        password_actual,
        usuario.password_hash
      );


    if (!passwordActualCorrecta) {

      return res.status(401).json({
        mensaje:
          'La contraseña actual es incorrecta'
      });
    }


    // =====================================================
    // IMPEDIR USAR LA MISMA CONTRASEÑA
    // =====================================================

    const mismaPassword =
      await bcrypt.compare(
        nueva_password,
        usuario.password_hash
      );


    if (mismaPassword) {

      return res.status(400).json({
        mensaje:
          'La nueva contraseña debe ser diferente a la contraseña actual'
      });
    }


    // =====================================================
    // CIFRAR NUEVA CONTRASEÑA
    // =====================================================

    const nuevoHash =
      await bcrypt.hash(
        nueva_password,
        10
      );


    // =====================================================
    // ACTUALIZAR CONTRASEÑA
    // =====================================================

    await pool.query(
      `
        UPDATE usuarios

        SET password_hash = $1

        WHERE id_usuario = $2
      `,
      [
        nuevoHash,
        usuario.id_usuario
      ]
    );


    res.json({
      mensaje:
        'Contraseña actualizada correctamente'
    });

  } catch (error) {

    console.error(
      'Error al cambiar contraseña propia:',
      error
    );


    res.status(500).json({
      mensaje:
        'Error al actualizar la contraseña'
    });
  }
};


// =========================================================
// EXPORTACIONES
// =========================================================

module.exports = {
  login,
  obtenerRoles,
  obtenerUsuarios,
  registrarUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  restablecerPasswordUsuario,
  cambiarPasswordPropia
};
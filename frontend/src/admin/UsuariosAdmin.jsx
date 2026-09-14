import { useEffect, useState } from 'react';


function UsuariosAdmin() {

  // =========================================================
  // ESTADOS
  // =========================================================

  const [
    usuarios,
    setUsuarios
  ] = useState([]);


  const [
    roles,
    setRoles
  ] = useState([]);


  const [
    busqueda,
    setBusqueda
  ] = useState('');


  const [
    mostrarFormulario,
    setMostrarFormulario
  ] = useState(false);


  const [
    modoEdicion,
    setModoEdicion
  ] = useState(false);


  const [
    usuarioEditando,
    setUsuarioEditando
  ] = useState(null);


  const [
    mensaje,
    setMensaje
  ] = useState('');


  const [
    error,
    setError
  ] = useState('');


  const [
    mostrarRestablecerPassword,
    setMostrarRestablecerPassword
  ] = useState(false);


  const [
    usuarioPassword,
    setUsuarioPassword
  ] = useState(null);


  const [
    formularioPassword,
    setFormularioPassword
  ] = useState({
    nueva_password: '',
    confirmar_password: ''
  });


  const [
    formulario,
    setFormulario
  ] = useState({
    nombre_usuario: '',
    correo: '',
    password: '',
    id_rol: ''
  });


  // =========================================================
  // OBTENER TOKEN
  // =========================================================

  const obtenerToken = () => {
    return localStorage.getItem('token');
  };


  // =========================================================
  // OBTENER USUARIOS
  // =========================================================

  const obtenerUsuarios = async (
    textoBusqueda = ''
  ) => {

    try {

      setError('');


      const token =
        obtenerToken();


      if (!token) {

        setError(
          'No existe una sesión activa'
        );

        return;
      }


      const parametros =
        new URLSearchParams();


      const textoLimpio =
        textoBusqueda.trim();


      if (textoLimpio) {

        parametros.append(
          'buscar',
          textoLimpio
        );
      }


      let url =
        'http://localhost:3000/api/auth/usuarios';


      const queryString =
        parametros.toString();


      if (queryString) {

        url += `?${queryString}`;
      }


      const respuesta =
        await fetch(
          url,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible obtener los usuarios'
        );
      }


      setUsuarios(
        Array.isArray(datos)
          ? datos
          : []
      );

    } catch (error) {

      console.error(
        'Error al obtener usuarios:',
        error
      );


      setError(
        error.message ||
        'No fue posible obtener los usuarios'
      );
    }
  };


  // =========================================================
  // OBTENER ROLES
  // =========================================================

  const obtenerRoles = async () => {

    try {

      const token =
        obtenerToken();


      if (!token) {
        return;
      }


      const respuesta =
        await fetch(
          'http://localhost:3000/api/auth/roles',
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible obtener los perfiles'
        );
      }


      setRoles(
        Array.isArray(datos)
          ? datos
          : []
      );

    } catch (error) {

      console.error(
        'Error al obtener roles:',
        error
      );


      setError(
        error.message ||
        'No fue posible obtener los perfiles'
      );
    }
  };


  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {

    obtenerUsuarios();

    obtenerRoles();

  }, []);


  // =========================================================
  // BUSCAR
  // =========================================================

  const buscarUsuarios = async (e) => {

    e.preventDefault();


    await obtenerUsuarios(
      busqueda
    );

  };


  // =========================================================
  // LIMPIAR BÚSQUEDA
  // =========================================================

  const limpiarBusqueda = async () => {

    setBusqueda('');


    await obtenerUsuarios('');

  };


  // =========================================================
  // ABRIR REGISTRO
  // =========================================================

  const abrirRegistro = () => {

    setModoEdicion(false);

    setUsuarioEditando(null);

    setMensaje('');

    setError('');


    setFormulario({
      nombre_usuario: '',
      correo: '',
      password: '',
      id_rol: ''
    });


    setMostrarFormulario(true);

  };


  // =========================================================
  // ABRIR EDICIÓN
  // =========================================================

  const abrirEdicion = (usuario) => {

    setModoEdicion(true);


    setUsuarioEditando(
      usuario.id_usuario
    );


    setMensaje('');

    setError('');


    setFormulario({

      nombre_usuario:
        usuario.nombre_usuario || '',

      correo:
        usuario.correo || '',

      password: '',

      id_rol:
        String(
          usuario.id_rol
        )

    });


    setMostrarFormulario(true);

  };


  // =========================================================
  // CANCELAR FORMULARIO
  // =========================================================

  const cancelarFormulario = () => {

    setMostrarFormulario(false);

    setModoEdicion(false);

    setUsuarioEditando(null);

    setMensaje('');

    setError('');


    setFormulario({
      nombre_usuario: '',
      correo: '',
      password: '',
      id_rol: ''
    });

  };


  // =========================================================
  // REGISTRAR USUARIO
  // =========================================================

  const registrarUsuario = async (e) => {

    e.preventDefault();


    setMensaje('');

    setError('');


    try {

      const token =
        obtenerToken();


      if (!token) {

        setError(
          'No existe una sesión activa'
        );

        return;
      }


      if (
        !formulario.nombre_usuario ||
        !formulario.correo ||
        !formulario.password ||
        !formulario.id_rol
      ) {

        setError(
          'Debe completar todos los campos obligatorios'
        );

        return;
      }


      if (
        formulario.password.length < 8
      ) {

        setError(
          'La contraseña debe tener al menos 8 caracteres'
        );

        return;
      }


      const respuesta =
        await fetch(
          'http://localhost:3000/api/auth/usuarios',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify(
                formulario
              )
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible registrar el usuario'
        );
      }


      setMensaje(
        datos.mensaje ||
        'Usuario registrado correctamente'
      );


      setFormulario({
        nombre_usuario: '',
        correo: '',
        password: '',
        id_rol: ''
      });


      setMostrarFormulario(false);


      await obtenerUsuarios(
        busqueda
      );

    } catch (error) {

      console.error(
        'Error al registrar usuario:',
        error
      );


      setError(
        error.message ||
        'No fue posible registrar el usuario'
      );
    }
  };


  // =========================================================
  // ACTUALIZAR USUARIO
  // =========================================================

  const actualizarUsuario = async (e) => {

    e.preventDefault();


    setMensaje('');

    setError('');


    try {

      const token =
        obtenerToken();


      if (!token) {

        setError(
          'No existe una sesión activa'
        );

        return;
      }


      if (
        !formulario.nombre_usuario ||
        !formulario.correo ||
        !formulario.id_rol
      ) {

        setError(
          'Debe completar todos los campos obligatorios'
        );

        return;
      }


      const respuesta =
        await fetch(
          `http://localhost:3000/api/auth/usuarios/${usuarioEditando}`,
          {
            method: 'PUT',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify({
                nombre_usuario:
                  formulario.nombre_usuario,

                correo:
                  formulario.correo,

                id_rol:
                  formulario.id_rol
              })
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible actualizar el usuario'
        );
      }


      setMensaje(
        datos.mensaje ||
        'Usuario actualizado correctamente'
      );


      setModoEdicion(false);

      setUsuarioEditando(null);

      setMostrarFormulario(false);


      setFormulario({
        nombre_usuario: '',
        correo: '',
        password: '',
        id_rol: ''
      });


      await obtenerUsuarios(
        busqueda
      );

    } catch (error) {

      console.error(
        'Error al actualizar usuario:',
        error
      );


      setError(
        error.message ||
        'No fue posible actualizar el usuario'
      );
    }
  };


  // =========================================================
  // ACTIVAR / DESACTIVAR USUARIO
  // =========================================================

  const cambiarEstado = async (usuario) => {

    const nuevoEstado =
      !usuario.activo;


    const accion =
      nuevoEstado
        ? 'reactivar'
        : 'desactivar';


    const confirmar =
      window.confirm(
        `¿Está seguro de que desea ${accion} al usuario ${usuario.nombre_usuario}?`
      );


    if (!confirmar) {

      return;
    }


    setMensaje('');

    setError('');


    try {

      const token =
        obtenerToken();


      if (!token) {

        setError(
          'No existe una sesión activa'
        );

        return;
      }


      const respuesta =
        await fetch(
          `http://localhost:3000/api/auth/usuarios/${usuario.id_usuario}/estado`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify({
                activo:
                  nuevoEstado
              })
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible cambiar el estado del usuario'
        );
      }


      setMensaje(
        datos.mensaje
      );


      await obtenerUsuarios(
        busqueda
      );

    } catch (error) {

      console.error(
        'Error al cambiar estado:',
        error
      );


      setError(
        error.message ||
        'No fue posible cambiar el estado del usuario'
      );
    }
  };


  // =========================================================
  // ABRIR RESTABLECIMIENTO DE CONTRASEÑA
  // =========================================================

  const abrirRestablecerPassword = (usuario) => {

    const usuarioSesion =
      JSON.parse(
        localStorage.getItem('usuario') || 'null'
      );


    if (
      usuarioSesion &&
      Number(usuarioSesion.id_usuario) ===
        Number(usuario.id_usuario)
    ) {

      setMensaje('');

      setError(
        'No puede restablecer su propia contraseña desde Administración. Utilice Mi Perfil.'
      );

      return;
    }


    setUsuarioPassword(usuario);

    setFormularioPassword({
      nueva_password: '',
      confirmar_password: ''
    });

    setMensaje('');

    setError('');

    setMostrarRestablecerPassword(true);

  };


  // =========================================================
  // CANCELAR RESTABLECIMIENTO
  // =========================================================

  const cancelarRestablecerPassword = () => {

    setMostrarRestablecerPassword(false);

    setUsuarioPassword(null);

    setFormularioPassword({
      nueva_password: '',
      confirmar_password: ''
    });

    setError('');

  };


  // =========================================================
  // RESTABLECER CONTRASEÑA
  // =========================================================

  const restablecerPassword = async (e) => {

    e.preventDefault();

    setMensaje('');

    setError('');


    if (!usuarioPassword) {
      return;
    }


    if (
      !formularioPassword.nueva_password ||
      !formularioPassword.confirmar_password
    ) {

      setError(
        'Debe ingresar y confirmar la nueva contraseña'
      );

      return;
    }


    if (
      formularioPassword.nueva_password.length < 8
    ) {

      setError(
        'La contraseña debe tener al menos 8 caracteres'
      );

      return;
    }


    if (
      formularioPassword.nueva_password !==
      formularioPassword.confirmar_password
    ) {

      setError(
        'Las contraseñas no coinciden'
      );

      return;
    }


    try {

      const token =
        obtenerToken();


      if (!token) {

        setError(
          'No existe una sesión activa'
        );

        return;
      }


      const respuesta =
        await fetch(
          `http://localhost:3000/api/auth/usuarios/${usuarioPassword.id_usuario}/password`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify(
                formularioPassword
              )
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible restablecer la contraseña'
        );
      }


      setMostrarRestablecerPassword(false);

      setUsuarioPassword(null);

      setFormularioPassword({
        nueva_password: '',
        confirmar_password: ''
      });

      setMensaje(
        datos.mensaje ||
        'Contraseña restablecida correctamente'
      );

    } catch (error) {

      console.error(
        'Error al restablecer contraseña:',
        error
      );


      setError(
        error.message ||
        'No fue posible restablecer la contraseña'
      );
    }
  };


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (

    <section className="panel-inicio usuarios-admin">


      <h2>
        Gestión de Usuarios
      </h2>


      <p>
        Registre y administre las cuentas
        de acceso al sistema.
      </p>


      {!mostrarFormulario &&
      !mostrarRestablecerPassword ? (

        <>


          {/* =================================================
              BUSCADOR Y REGISTRO
          ================================================= */}

          <div
            className="usuarios-admin-acciones"
          >


            <form
              className="buscador-usuarios-form"
              onSubmit={
                buscarUsuarios
              }
            >


              <input
                type="text"
                className="buscador-usuarios"
                placeholder="Buscar por usuario, correo o perfil..."
                value={
                  busqueda
                }
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                autoComplete="off"
              />


              <button
                type="submit"
                className="boton-buscar"
              >
                Buscar
              </button>


              <button
                type="button"
                className="boton-limpiar"
                onClick={
                  limpiarBusqueda
                }
              >
                Limpiar
              </button>


            </form>


            <button
              type="button"
              className="boton-buscar boton-registrar-usuario"
              onClick={
                abrirRegistro
              }
            >
              Registrar nuevo usuario
            </button>


          </div>


          {/* =================================================
              MENSAJES
          ================================================= */}

          {mensaje && (

            <p className="mensaje-registro">
              {mensaje}
            </p>

          )}


          {error && (

            <p className="mensaje-error">
              {error}
            </p>

          )}


          {/* =================================================
              TABLA
          ================================================= */}

          <div className="panel-resultados">


            <h3>
              Usuarios registrados
            </h3>


            {usuarios.length === 0 ? (

              <p className="sin-resultados">

                {busqueda
                  ? 'No se encontraron usuarios que coincidan con la búsqueda.'
                  : 'No existen usuarios registrados.'}

              </p>

            ) : (

              <div
                className="tabla-contenedor tabla-usuarios"
              >


                <table>


                  <thead>


                    <tr>

                      <th>
                        Usuario
                      </th>

                      <th>
                        Correo
                      </th>

                      <th>
                        Perfil
                      </th>

                      <th>
                        Estado
                      </th>

                      <th>
                        Acciones
                      </th>

                    </tr>


                  </thead>


                  <tbody>


                    {usuarios.map(
                      (usuario) => (

                        <tr
                          key={
                            usuario.id_usuario
                          }
                        >


                          <td>
                            {
                              usuario.nombre_usuario
                            }
                          </td>


                          <td>
                            {
                              usuario.correo
                            }
                          </td>


                          <td>
                            {
                              usuario.nombre_rol
                            }
                          </td>


                          <td>


                            <span
                              className={
                                usuario.activo
                                  ? 'estado-activo'
                                  : 'estado-inactivo'
                              }
                            >

                              {
                                usuario.activo
                                  ? 'Activo'
                                  : 'Inactivo'
                              }

                            </span>


                          </td>


                          <td>


                            <div
                              className="acciones-tabla"
                            >


                              <button
                                type="button"
                                className="boton-editar"
                                onClick={() =>
                                  abrirEdicion(
                                    usuario
                                  )
                                }
                              >
                                Editar
                              </button>


                              <button
                                type="button"
                                className="boton-password"
                                onClick={() =>
                                  abrirRestablecerPassword(
                                    usuario
                                  )
                                }
                              >
                                Restablecer contraseña
                              </button>


                              {usuario.activo ? (

                                <button
                                  type="button"
                                  className="boton-baja"
                                  onClick={() =>
                                    cambiarEstado(
                                      usuario
                                    )
                                  }
                                >
                                  Desactivar
                                </button>

                              ) : (

                                <button
                                  type="button"
                                  className="boton-reactivar"
                                  onClick={() =>
                                    cambiarEstado(
                                      usuario
                                    )
                                  }
                                >
                                  Reactivar
                                </button>

                              )}


                            </div>


                          </td>


                        </tr>

                      )
                    )}


                  </tbody>


                </table>


              </div>

            )}


          </div>


        </>

      ) : mostrarRestablecerPassword ? (

        /* ===================================================
           RESTABLECER CONTRASEÑA
        =================================================== */

        <section className="panel-filtros">

          <h3>
            Restablecer contraseña
          </h3>

          <p>
            Usuario: <strong>
              {usuarioPassword?.nombre_usuario}
            </strong>
          </p>


          <form
            onSubmit={
              restablecerPassword
            }
          >

            <div className="filtros">

              <div className="campo">

                <label>
                  Nueva contraseña *
                </label>

                <input
                  type="password"
                  value={
                    formularioPassword.nueva_password
                  }
                  onChange={(e) =>
                    setFormularioPassword({
                      ...formularioPassword,
                      nueva_password:
                        e.target.value
                    })
                  }
                  minLength="8"
                  autoComplete="new-password"
                  required
                />

                <small>
                  Mínimo 8 caracteres.
                </small>

              </div>


              <div className="campo">

                <label>
                  Confirmar nueva contraseña *
                </label>

                <input
                  type="password"
                  value={
                    formularioPassword.confirmar_password
                  }
                  onChange={(e) =>
                    setFormularioPassword({
                      ...formularioPassword,
                      confirmar_password:
                        e.target.value
                    })
                  }
                  minLength="8"
                  autoComplete="new-password"
                  required
                />

              </div>

            </div>


            {error && (

              <p className="mensaje-error">
                {error}
              </p>

            )}


            <button
              type="submit"
              className="boton-buscar"
            >
              Restablecer contraseña
            </button>


            <button
              type="button"
              className="boton-cancelar"
              onClick={
                cancelarRestablecerPassword
              }
            >
              Cancelar
            </button>

          </form>

        </section>

      ) : (

        /* ===================================================
           FORMULARIO REGISTRO / EDICIÓN
        =================================================== */

        <section className="panel-filtros">


          <h3>

            {modoEdicion
              ? 'Editar usuario'
              : 'Registrar usuario'}

          </h3>


          <form
            onSubmit={
              modoEdicion
                ? actualizarUsuario
                : registrarUsuario
            }
          >


            <div className="filtros">


              {/* USUARIO */}

              <div className="campo">


                <label>
                  Nombre de usuario *
                </label>


                <input
                  type="text"
                  value={
                    formulario.nombre_usuario
                  }
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nombre_usuario:
                        e.target.value
                    })
                  }
                  autoComplete="off"
                  required
                />


              </div>


              {/* CORREO */}

              <div className="campo">


                <label>
                  Correo *
                </label>


                <input
                  type="email"
                  value={
                    formulario.correo
                  }
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      correo:
                        e.target.value
                    })
                  }
                  autoComplete="off"
                  required
                />


              </div>


              {/* CONTRASEÑA */}

              {!modoEdicion && (

                <div className="campo">


                  <label>
                    Contraseña inicial *
                  </label>


                  <input
                    type="password"
                    value={
                      formulario.password
                    }
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        password:
                          e.target.value
                      })
                    }
                    minLength="8"
                    autoComplete="new-password"
                    required
                  />


                  <small>
                    Mínimo 8 caracteres.
                  </small>


                </div>

              )}


              {/* PERFIL */}

              <div className="campo">


                <label>
                  Perfil *
                </label>


                <select
                  value={
                    formulario.id_rol
                  }
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      id_rol:
                        e.target.value
                    })
                  }
                  required
                >


                  <option value="">
                    Seleccione un perfil
                  </option>


                  {roles.map(
                    (rol) => (

                      <option
                        key={
                          rol.id_rol
                        }
                        value={
                          rol.id_rol
                        }
                      >
                        {
                          rol.nombre_rol
                        }
                      </option>

                    )
                  )}


                </select>


              </div>


            </div>


            {/* MENSAJES */}

            {mensaje && (

              <p className="mensaje-registro">
                {mensaje}
              </p>

            )}


            {error && (

              <p className="mensaje-error">
                {error}
              </p>

            )}


            {/* BOTONES */}

            <button
              type="submit"
              className="boton-buscar"
            >

              {modoEdicion
                ? 'Guardar cambios'
                : 'Guardar usuario'}

            </button>


            <button
              type="button"
              className="boton-cancelar"
              onClick={
                cancelarFormulario
              }
            >
              Cancelar
            </button>


          </form>


        </section>

      )}


    </section>

  );

}


export default UsuariosAdmin;
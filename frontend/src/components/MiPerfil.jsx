import { useState } from 'react';


function MiPerfil({ usuario, irA }) {

  const [
    mostrarCambioPassword,
    setMostrarCambioPassword
  ] = useState(false);


  const [
    formularioPassword,
    setFormularioPassword
  ] = useState({
    password_actual: '',
    nueva_password: '',
    confirmar_password: ''
  });


  const [
    mensaje,
    setMensaje
  ] = useState('');


  const [
    error,
    setError
  ] = useState('');


  // =========================================================
  // ABRIR CAMBIO DE CONTRASEÑA
  // =========================================================

  const abrirCambioPassword = () => {

    setMensaje('');

    setError('');

    setFormularioPassword({
      password_actual: '',
      nueva_password: '',
      confirmar_password: ''
    });

    setMostrarCambioPassword(true);

  };


  // =========================================================
  // CANCELAR CAMBIO DE CONTRASEÑA
  // =========================================================

  const cancelarCambioPassword = () => {

    setMostrarCambioPassword(false);

    setMensaje('');

    setError('');

    setFormularioPassword({
      password_actual: '',
      nueva_password: '',
      confirmar_password: ''
    });

  };


  // =========================================================
  // CAMBIAR CONTRASEÑA
  // =========================================================

  const cambiarPassword = async (e) => {

    e.preventDefault();

    setMensaje('');

    setError('');


    if (
      !formularioPassword.password_actual ||
      !formularioPassword.nueva_password ||
      !formularioPassword.confirmar_password
    ) {

      setError(
        'Debe completar todos los campos'
      );

      return;
    }


    if (
      formularioPassword.nueva_password.length < 8
    ) {

      setError(
        'La nueva contraseña debe tener al menos 8 caracteres'
      );

      return;
    }


    if (
      formularioPassword.nueva_password !==
      formularioPassword.confirmar_password
    ) {

      setError(
        'Las contraseñas nuevas no coinciden'
      );

      return;
    }


    if (
      formularioPassword.password_actual ===
      formularioPassword.nueva_password
    ) {

      setError(
        'La nueva contraseña debe ser diferente a la contraseña actual'
      );

      return;
    }


    try {

      const token =
        localStorage.getItem('token');


      if (!token) {

        setError(
          'No existe una sesión activa'
        );

        return;
      }


      const respuesta =
        await fetch(
          'http://localhost:3000/api/auth/cambiar-password',
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
          'No fue posible cambiar la contraseña'
        );
      }


      setMensaje(
        datos.mensaje ||
        'Contraseña actualizada correctamente'
      );


      setFormularioPassword({
        password_actual: '',
        nueva_password: '',
        confirmar_password: ''
      });


      setMostrarCambioPassword(false);

    } catch (error) {

      console.error(
        'Error al cambiar contraseña:',
        error
      );


      setError(
        error.message ||
        'No fue posible cambiar la contraseña'
      );
    }
  };


  return (
    <>
      <div className="barra-navegacion-interna">

        <span>
          Inicio &gt; Mi Perfil
        </span>

        <button
          type="button"
          onClick={() => irA('inicio')}
          className="boton-volver"
        >
          ← Volver al inicio
        </button>

      </div>


      <section className="panel-inicio mi-perfil">

        <h2>
          Mi Perfil
        </h2>


        {/* =====================================================
            INFORMACIÓN DEL USUARIO
        ===================================================== */}

        <div className="datos-perfil">

          <h3>
            Información de la cuenta
            </h3>

            <p>
                <strong>
                Nombre de usuario:
                </strong>{' '}
                {usuario.nombre_usuario}
            </p>

            <p>
                <strong>
                Correo:
                </strong>{' '}
                {usuario.correo}
            </p>

            <p>
                <strong>
                Perfil:
                </strong>{' '}
                {usuario.nombre_rol}
            </p>

        </div>


        {/* =====================================================
            OPCIONES
        ===================================================== */}

        {!mostrarCambioPassword && (

          <div className="tarjetas-inicio">



            <button
              type="button"
              className="tarjeta-menu"
              onClick={
                abrirCambioPassword
              }
            >

              <h3>
                Cambiar contraseña
              </h3>

              <p>
                Modificar la contraseña de acceso al sistema.
              </p>

            </button>

          </div>

        )}


        {/* =====================================================
            FORMULARIO CAMBIO DE CONTRASEÑA
        ===================================================== */}

        {mostrarCambioPassword && (

          <section className="panel-filtros perfil-password">

            <h3>
              Cambiar contraseña
            </h3>


            <p>
              Ingrese su contraseña actual y luego defina una nueva contraseña.
            </p>


            <form
              onSubmit={
                cambiarPassword
              }
            >

              <div className="filtros">


                {/* CONTRASEÑA ACTUAL */}

                <div className="campo">

                  <label>
                    Contraseña actual *
                  </label>

                  <input
                    type="password"
                    value={
                      formularioPassword.password_actual
                    }
                    onChange={(e) =>
                      setFormularioPassword({
                        ...formularioPassword,
                        password_actual:
                          e.target.value
                      })
                    }
                    autoComplete="current-password"
                    required
                  />

                </div>


                {/* NUEVA CONTRASEÑA */}

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


                {/* CONFIRMAR CONTRASEÑA */}

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
                Cambiar contraseña
              </button>


              <button
                type="button"
                className="boton-cancelar"
                onClick={
                  cancelarCambioPassword
                }
              >
                Cancelar
              </button>

            </form>

          </section>

        )}


        {/* =====================================================
            MENSAJE DE ÉXITO
        ===================================================== */}

        {mensaje && (

          <p className="mensaje-registro">
            {mensaje}
          </p>

        )}


        {error &&
          !mostrarCambioPassword && (

            <p className="mensaje-error">
              {error}
            </p>

          )}

      </section>
    </>
  );
}


export default MiPerfil;
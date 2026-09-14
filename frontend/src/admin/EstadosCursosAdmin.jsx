import { useEffect, useState } from 'react';

const API_URL = 'https://sistema-gestion-cursos-pm.onrender.com/api';

function EstadosCursosAdmin() {

  const [estados, setEstados] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [idEstadoEditar, setIdEstadoEditar] =
    useState(null);

  const [nombreEstado, setNombreEstado] =
    useState('');

  const [descripcion, setDescripcion] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const [tipoMensaje, setTipoMensaje] =
    useState('');


  // =========================================================
  // OBTENER TOKEN
  // =========================================================

  const obtenerToken = () => {
    return localStorage.getItem('token');
  };


  // =========================================================
  // OBTENER ESTADOS
  // =========================================================

  const obtenerEstados = async () => {

    try {

      const respuesta =
        await fetch(
          `${API_URL}/estados`
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'Error al obtener los estados'
        );

      }


      setEstados(datos);


    } catch (error) {

      console.error(
        'Error al obtener estados:',
        error
      );

      setMensaje(
        error.message
      );

      setTipoMensaje(
        'error'
      );

    }

  };


  // =========================================================
  // CARGAR ESTADOS
  // =========================================================

  useEffect(() => {

    obtenerEstados();

  }, []);


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {

    setNombreEstado('');
    setDescripcion('');

    setModoEdicion(false);
    setIdEstadoEditar(null);

  };


  // =========================================================
  // ABRIR FORMULARIO DE REGISTRO
  // =========================================================

  const abrirRegistro = () => {

    limpiarFormulario();

    setMensaje('');
    setTipoMensaje('');

    setMostrarFormulario(true);

  };


  // =========================================================
  // CANCELAR FORMULARIO
  // =========================================================

  const cancelarFormulario = () => {

    limpiarFormulario();

    setMostrarFormulario(false);

    setMensaje('');
    setTipoMensaje('');

  };


  // =========================================================
  // GUARDAR ESTADO
  // =========================================================

  const guardarEstado = async (event) => {

    event.preventDefault();


    if (!nombreEstado.trim()) {

      setMensaje(
        'Debe ingresar el nombre del estado'
      );

      setTipoMensaje(
        'error'
      );

      return;

    }


    try {

      const token =
        obtenerToken();


      if (!token) {

        throw new Error(
          'La sesión ha expirado. Inicie sesión nuevamente.'
        );

      }


      const datosEstado = {

        nombre_estado:
          nombreEstado.trim(),

        descripcion:
          descripcion.trim()

      };


      let url =
        `${API_URL}/estados`;

      let metodo =
        'POST';


      if (modoEdicion) {

        url =
          `${API_URL}/estados/${idEstadoEditar}`;

        metodo =
          'PUT';

      }


      const respuesta =
        await fetch(
          url,
          {
            method: metodo,

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify(
                datosEstado
              )
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible guardar el estado'
        );

      }


      setMensaje(
        datos.mensaje
      );

      setTipoMensaje(
        'exito'
      );


      limpiarFormulario();

      setMostrarFormulario(false);

      await obtenerEstados();


    } catch (error) {

      console.error(
        'Error al guardar estado:',
        error
      );


      setMensaje(
        error.message
      );

      setTipoMensaje(
        'error'
      );

    }

  };


  // =========================================================
  // EDITAR ESTADO
  // =========================================================

  const editarEstado = (estado) => {

    setIdEstadoEditar(
      estado.id_estado
    );

    setNombreEstado(
      estado.nombre_estado || ''
    );

    setDescripcion(
      estado.descripcion || ''
    );

    setModoEdicion(true);

    setMostrarFormulario(true);

    setMensaje('');
    setTipoMensaje('');

  };


  // =========================================================
  // ELIMINAR ESTADO
  // =========================================================

  const eliminarEstado = async (estado) => {

    const confirmar =
      window.confirm(
        `¿Está seguro que desea eliminar el estado "${estado.nombre_estado}"?`
      );


    if (!confirmar) {
      return;
    }


    try {

      const token =
        obtenerToken();


      if (!token) {

        throw new Error(
          'La sesión ha expirado. Inicie sesión nuevamente.'
        );

      }


      const respuesta =
        await fetch(
          `${API_URL}/estados/${estado.id_estado}`,
          {
            method:
              'DELETE',

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
          'No fue posible eliminar el estado'
        );

      }


      setMensaje(
        datos.mensaje
      );

      setTipoMensaje(
        'exito'
      );


      await obtenerEstados();


    } catch (error) {

      console.error(
        'Error al eliminar estado:',
        error
      );


      setMensaje(
        error.message
      );

      setTipoMensaje(
        'error'
      );

    }

  };


  // =========================================================
  // FILTRAR ESTADOS
  // =========================================================

  const estadosFiltrados =
    estados.filter(
      (estado) => {

        const texto =
          busqueda
            .trim()
            .toLowerCase();


        if (!texto) {
          return true;
        }


        return (

          estado.nombre_estado
            ?.toLowerCase()
            .includes(texto)

          ||

          estado.descripcion
            ?.toLowerCase()
            .includes(texto)

        );

      }
    );


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (

    <section className="panel-inicio estados-cursos-admin">

      <h2>
        Administración de Estados de Cursos
      </h2>

      <p>
        Permite registrar, modificar y eliminar los estados
        utilizados para identificar la situación de los cursos
        realizados por el personal.
      </p>


      {/* =====================================================
          BUSCADOR Y BOTÓN REGISTRAR
      ====================================================== */}

      <div className="estados-cursos-admin-acciones">

        <input
          type="text"
          className="buscador-estados-cursos"
          placeholder="Buscar por estado o descripción..."
          value={busqueda}
          onChange={
            (event) =>
              setBusqueda(
                event.target.value
              )
          }
        />


        <button
          type="button"
          className="boton-buscar boton-registrar-estado"
          onClick={abrirRegistro}
        >
          Registrar Estado
        </button>

      </div>


      {/* =====================================================
          MENSAJES
      ====================================================== */}

      {mensaje && (

        <div
          className={
            tipoMensaje === 'error'
              ? 'mensaje-error'
              : 'mensaje-registro'
          }
        >
          {mensaje}
        </div>

      )}


      {/* =====================================================
          FORMULARIO
      ====================================================== */}

      {mostrarFormulario && (

        <section className="panel-filtros">

          <h3>

            {modoEdicion
              ? 'Editar Estado'
              : 'Registrar Estado'}

          </h3>


          <form
            onSubmit={guardarEstado}
          >

            <div className="campo">

              <label>
                Estado *
              </label>

              <input
                type="text"
                value={nombreEstado}
                onChange={
                  (event) =>
                    setNombreEstado(
                      event.target.value
                    )
                }
                placeholder="Ejemplo: Vigente"
                maxLength="50"
                required
              />

            </div>


            <div className="campo">

              <label>
                Descripción
              </label>

              <textarea
                value={descripcion}
                onChange={
                  (event) =>
                    setDescripcion(
                      event.target.value
                    )
                }
                placeholder="Descripción del estado"
                maxLength="255"
                rows="4"
              />

            </div>


            <div className="acciones-formulario">

              <button
                type="submit"
                className="boton-buscar"
              >

                {modoEdicion
                  ? 'Guardar Cambios'
                  : 'Registrar Estado'}

              </button>


              <button
                type="button"
                className="boton-limpiar"
                onClick={cancelarFormulario}
              >
                Cancelar
              </button>

            </div>

          </form>

        </section>

      )}


      {/* =====================================================
          LISTADO
      ====================================================== */}

      <section className="panel-resultados">

        <h3>
          Estados de Cursos registrados
        </h3>


        {estadosFiltrados.length === 0 ? (

          <p>
            No se encontraron estados.
          </p>

        ) : (

          <div className="tabla-contenedor tabla-estados-cursos">

            <table>

              <thead>

                <tr>

                  <th>
                    Estado
                  </th>

                  <th>
                    Descripción
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {estadosFiltrados.map(
                  (estado) => (

                    <tr
                      key={
                        estado.id_estado
                      }
                    >

                      <td>

                        <strong>
                          {estado.nombre_estado}
                        </strong>

                      </td>


                      <td>

                        {estado.descripcion ||
                          'Sin descripción'}

                      </td>


                      <td>

                        <div className="acciones-tabla">

                          <button
                            type="button"
                            className="boton-editar"
                            onClick={
                              () =>
                                editarEstado(
                                  estado
                                )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="boton-eliminar"
                            onClick={
                              () =>
                                eliminarEstado(
                                  estado
                                )
                            }
                          >
                            Eliminar
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </section>

  );

}


export default EstadosCursosAdmin;
import {
  useEffect,
  useState
} from 'react';


function ZonasNavalesAdmin() {

  // =========================================================
  // ESTADOS
  // =========================================================

  const [
    zonas,
    setZonas
  ] = useState([]);


  const [
    cargando,
    setCargando
  ] = useState(true);


  const [
    mensaje,
    setMensaje
  ] = useState('');


  const [
    textoBusqueda,
    setTextoBusqueda
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
    zonaEditando,
    setZonaEditando
  ] = useState(null);


  const [
    guardando,
    setGuardando
  ] = useState(false);


  const [
    mensajeFormulario,
    setMensajeFormulario
  ] = useState('');


  const [
    formulario,
    setFormulario
  ] = useState({

    nombre_zona: '',

    descripcion: ''

  });


  // =========================================================
  // OBTENER ZONAS
  // =========================================================

  const obtenerZonas = async () => {

    try {

      setCargando(true);

      setMensaje('');


      const respuesta =
        await fetch(
          'https://sistema-gestion-cursos-pm.onrender.com/api/zonas'
        );


      const data =
        await respuesta.json();


      if (!respuesta.ok) {

        setMensaje(
          data.mensaje ||
          'No fue posible cargar las Zonas Navales.'
        );

        return;

      }


      setZonas(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        'Error al obtener Zonas Navales:',
        error
      );


      setMensaje(
        'No fue posible conectarse con el servidor.'
      );


    } finally {

      setCargando(false);

    }

  };


  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {

    obtenerZonas();

  }, []);


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {

    setFormulario({

      nombre_zona: '',

      descripcion: ''

    });

  };


  // =========================================================
  // ABRIR REGISTRO
  // =========================================================

  const abrirFormulario = () => {

    setModoEdicion(false);

    setZonaEditando(null);

    setMensajeFormulario('');

    limpiarFormulario();

    setMostrarFormulario(true);

  };


  // =========================================================
  // ABRIR EDICIÓN
  // =========================================================

  const abrirEdicion = (zona) => {

    setModoEdicion(true);

    setZonaEditando(
      zona.id_zona
    );


    setFormulario({

      nombre_zona:
        zona.nombre_zona || '',

      descripcion:
        zona.descripcion || ''

    });


    setMensajeFormulario('');

    setMostrarFormulario(true);

  };


  // =========================================================
  // CANCELAR
  // =========================================================

  const cancelarFormulario = () => {

    setMostrarFormulario(false);

    setModoEdicion(false);

    setZonaEditando(null);

    setMensajeFormulario('');

    limpiarFormulario();

  };


  // =========================================================
  // VALIDACIÓN
  // =========================================================

  const validarFormulario = () => {

    if (
      !formulario.nombre_zona.trim()
    ) {

      setMensajeFormulario(
        'Debe ingresar el nombre de la Zona Naval.'
      );

      return false;

    }


    return true;

  };


  // =========================================================
  // REGISTRAR ZONA
  // =========================================================

  const registrarZona =
    async (e) => {

      e.preventDefault();

      setMensajeFormulario('');


      if (!validarFormulario()) {
        return;
      }


      try {

        setGuardando(true);


        const token =
          localStorage.getItem('token');


        if (!token) {

          setMensajeFormulario(
            'No existe una sesión válida.'
          );

          return;

        }


        const respuesta =
          await fetch(
            'https://sistema-gestion-cursos-pm.onrender.com/api/zonas',
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


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          setMensajeFormulario(
            data.mensaje ||
            'No fue posible registrar la Zona Naval.'
          );

          return;

        }


        window.alert(
          data.mensaje ||
          'Zona Naval registrada correctamente.'
        );


        setMostrarFormulario(false);

        limpiarFormulario();

        await obtenerZonas();


      } catch (error) {

        console.error(
          'Error al registrar Zona Naval:',
          error
        );


        setMensajeFormulario(
          'No fue posible conectarse con el servidor.'
        );


      } finally {

        setGuardando(false);

      }

    };


  // =========================================================
  // ACTUALIZAR ZONA
  // =========================================================

  const actualizarZona =
    async (e) => {

      e.preventDefault();

      setMensajeFormulario('');


      if (!validarFormulario()) {
        return;
      }


      try {

        setGuardando(true);


        const token =
          localStorage.getItem('token');


        if (!token) {

          setMensajeFormulario(
            'No existe una sesión válida.'
          );

          return;

        }


        const respuesta =
          await fetch(
            `https://sistema-gestion-cursos-pm.onrender.com/api/zonas/${zonaEditando}`,
            {

              method: 'PUT',

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


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          setMensajeFormulario(
            data.mensaje ||
            'No fue posible actualizar la Zona Naval.'
          );

          return;

        }


        window.alert(
          data.mensaje ||
          'Zona Naval actualizada correctamente.'
        );


        setMostrarFormulario(false);

        setModoEdicion(false);

        setZonaEditando(null);

        limpiarFormulario();

        await obtenerZonas();


      } catch (error) {

        console.error(
          'Error al actualizar Zona Naval:',
          error
        );


        setMensajeFormulario(
          'No fue posible conectarse con el servidor.'
        );


      } finally {

        setGuardando(false);

      }

    };


  // =========================================================
  // ELIMINAR ZONA
  // =========================================================

  const eliminarZona =
    async (zona) => {

      const confirmar =
        window.confirm(
          `¿Está seguro de que desea eliminar "${zona.nombre_zona}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        const token =
          localStorage.getItem('token');


        if (!token) {

          window.alert(
            'No existe una sesión válida.'
          );

          return;

        }


        const respuesta =
          await fetch(
            `https://sistema-gestion-cursos-pm.onrender.com/api/zonas/${zona.id_zona}`,
            {

              method: 'DELETE',

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          window.alert(
            data.mensaje ||
            'No fue posible eliminar la Zona Naval.'
          );

          return;

        }


        window.alert(
          data.mensaje ||
          'Zona Naval eliminada correctamente.'
        );


        await obtenerZonas();


      } catch (error) {

        console.error(
          'Error al eliminar Zona Naval:',
          error
        );


        window.alert(
          'No fue posible conectarse con el servidor.'
        );

      }

    };


  // =========================================================
  // FILTRO LOCAL
  // =========================================================

  const zonasFiltradas =
    zonas.filter((zona) => {

      const texto =
        textoBusqueda
          .trim()
          .toLowerCase();


      if (!texto) {
        return true;
      }


      return (

        zona.nombre_zona
          ?.toLowerCase()
          .includes(texto) ||

        zona.descripcion
          ?.toLowerCase()
          .includes(texto)

      );

    });


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (

    <section className="panel-filtros">

      <h2>
        Administración de Zonas Navales
      </h2>


      <p>
        Desde esta sección puede registrar,
        modificar y eliminar Zonas Navales.
      </p>


      <div className="acciones-admin zonas-admin-acciones">

        <input
          type="text"
          className="buscador-zonas"
          value={
            textoBusqueda
          }
          onChange={(e) =>
            setTextoBusqueda(
              e.target.value
            )
          }
          placeholder="Buscar por nombre o descripción"
        />


        <button
          type="button"
          className="boton-buscar boton-registrar-zona"
          onClick={
            abrirFormulario
          }
        >
          Registrar Zona Naval
        </button>

      </div>


      {mostrarFormulario && (

        <div className="panel-resultados">

          <h3>

            {
              modoEdicion
                ? 'Editar Zona Naval'
                : 'Registrar Zona Naval'
            }

          </h3>


          <form
            onSubmit={
              modoEdicion
                ? actualizarZona
                : registrarZona
            }
          >

            <div className="filtros">


              <div className="campo">

                <label>
                  Nombre de la Zona Naval *
                </label>


                <input
                  type="text"
                  value={
                    formulario.nombre_zona
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      nombre_zona:
                        e.target.value

                    })
                  }
                  placeholder="Ej: Sexta Zona Naval"
                  required
                />

              </div>


              <div className="campo">

                <label>
                  Descripción
                </label>


                <input
                  type="text"
                  value={
                    formulario.descripcion
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      descripcion:
                        e.target.value

                    })
                  }
                  placeholder="Descripción opcional"
                />

              </div>

            </div>


            {mensajeFormulario && (

              <p className="mensaje-registro">

                {mensajeFormulario}

              </p>

            )}


            <button
              type="submit"
              className="boton-buscar"
              disabled={
                guardando
              }
            >

              {
                guardando
                  ? 'Guardando...'
                  : modoEdicion
                    ? 'Guardar cambios'
                    : 'Guardar Zona Naval'
              }

            </button>


            <button
              type="button"
              className="boton-cancelar"
              onClick={
                cancelarFormulario
              }
              disabled={
                guardando
              }
            >
              Cancelar
            </button>

          </form>

        </div>

      )}


      <div className="panel-resultados">

        <h3>
          Zonas Navales registradas
        </h3>


        {cargando ? (

          <p className="sin-resultados">
            Cargando Zonas Navales...
          </p>

        ) : mensaje ? (

          <p className="sin-resultados">
            {mensaje}
          </p>

        ) : zonasFiltradas.length === 0 ? (

          <p className="sin-resultados">
            No se encontraron Zonas Navales.
          </p>

        ) : (

          <div className="tabla-contenedor">

            <table>

              <thead>

                <tr>

                  <th>
                    Zona Naval
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

                {zonasFiltradas.map(
                  (zona) => (

                    <tr
                      key={
                        zona.id_zona
                      }
                    >

                      <td>
                        {
                          zona.nombre_zona
                        }
                      </td>


                      <td>
                        {
                          zona.descripcion ||
                          '-'
                        }
                      </td>


                      <td>

                        <div className="acciones-tabla">

                          <button
                            type="button"
                            className="boton-editar"
                            onClick={() =>
                              abrirEdicion(
                                zona
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="boton-eliminar"
                            onClick={() =>
                              eliminarZona(
                                zona
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

      </div>

    </section>

  );

}


export default ZonasNavalesAdmin;
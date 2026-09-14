import {
  useEffect,
  useState
} from 'react';


function InstitucionesAdmin() {

  const [
    instituciones,
    setInstituciones
  ] = useState([]);


  const [
    buscar,
    setBuscar
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
    institucionEditando,
    setInstitucionEditando
  ] = useState(null);


  const [
    cargando,
    setCargando
  ] = useState(true);


  const [
    guardando,
    setGuardando
  ] = useState(false);


  const [
    mensaje,
    setMensaje
  ] = useState('');


  const [
    formulario,
    setFormulario
  ] = useState({

    nombre_institucion: '',

    tipo_institucion: ''

  });


  // =========================================================
  // CARGAR INSTITUCIONES
  // =========================================================

  const cargarInstituciones =
    async () => {

      try {

        setCargando(true);


        const respuesta =
          await fetch(
            'http://localhost:3000/api/instituciones'
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          setMensaje(
            'No fue posible cargar las instituciones.'
          );

          return;

        }


        setInstituciones(
          Array.isArray(data)
            ? data
            : []
        );


        setMensaje('');


      } catch (error) {

        console.error(
          'Error al cargar instituciones:',
          error
        );


        setMensaje(
          'No fue posible conectarse con el servidor.'
        );


      } finally {

        setCargando(false);

      }

    };


  useEffect(() => {

    cargarInstituciones();

  }, []);


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {

    setFormulario({

      nombre_institucion: '',

      tipo_institucion: ''

    });

  };


  // =========================================================
  // REGISTRAR
  // =========================================================

  const abrirRegistro = () => {

    setModoEdicion(false);

    setInstitucionEditando(null);

    limpiarFormulario();

    setMensaje('');

    setMostrarFormulario(true);

  };


  // =========================================================
  // EDITAR
  // =========================================================

  const abrirEdicion =
    (institucion) => {

      setModoEdicion(true);

      setInstitucionEditando(
        institucion.id_institucion
      );


      setFormulario({

        nombre_institucion:
          institucion.nombre_institucion || '',

        tipo_institucion:
          institucion.tipo_institucion || ''

      });


      setMensaje('');

      setMostrarFormulario(true);

    };


  // =========================================================
  // CANCELAR
  // =========================================================

  const cancelar = () => {

    setMostrarFormulario(false);

    setModoEdicion(false);

    setInstitucionEditando(null);

    setMensaje('');

    limpiarFormulario();

  };


  // =========================================================
  // GUARDAR
  // =========================================================

  const guardarInstitucion =
    async (e) => {

      e.preventDefault();


      if (
        !formulario.nombre_institucion.trim()
      ) {

        setMensaje(
          'Debe ingresar el nombre de la institución.'
        );

        return;

      }


      try {

        setGuardando(true);

        setMensaje('');


        const token =
          localStorage.getItem('token');


        if (!token) {

          setMensaje(
            'No existe una sesión válida.'
          );

          return;

        }


        const url =
          modoEdicion

            ? `http://localhost:3000/api/instituciones/${institucionEditando}`

            : 'http://localhost:3000/api/instituciones';


        const metodo =
          modoEdicion
            ? 'PUT'
            : 'POST';


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
                  formulario
                )

            }
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          setMensaje(
            data.mensaje ||
            'No fue posible guardar la institución.'
          );

          return;

        }


        window.alert(
          data.mensaje
        );


        setMostrarFormulario(false);

        setModoEdicion(false);

        setInstitucionEditando(null);

        limpiarFormulario();

        await cargarInstituciones();


      } catch (error) {

        console.error(
          'Error al guardar institución:',
          error
        );


        setMensaje(
          'No fue posible conectarse con el servidor.'
        );


      } finally {

        setGuardando(false);

      }

    };


  // =========================================================
  // ELIMINAR
  // =========================================================

  const eliminarInstitucion =
    async (institucion) => {

      const confirmar =
        window.confirm(
          `¿Está seguro de que desea eliminar "${institucion.nombre_institucion}"?`
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
            `http://localhost:3000/api/instituciones/${institucion.id_institucion}`,
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
            'No fue posible eliminar la institución.'
          );

          return;

        }


        window.alert(
          data.mensaje
        );


        await cargarInstituciones();


      } catch (error) {

        console.error(
          'Error al eliminar institución:',
          error
        );


        window.alert(
          'No fue posible conectarse con el servidor.'
        );

      }

    };


  // =========================================================
  // FILTRAR
  // =========================================================

  const institucionesFiltradas =
    instituciones.filter(
      (institucion) => {

        const texto =
          buscar
            .trim()
            .toLowerCase();


        if (!texto) {
          return true;
        }


        return (

          institucion.nombre_institucion
            ?.toLowerCase()
            .includes(texto)

          ||

          institucion.tipo_institucion
            ?.toLowerCase()
            .includes(texto)

        );

      }
    );


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (

    <section className="panel-filtros">

      <h2>
        Administración de Instituciones
      </h2>


      <p>
        Desde esta sección puede registrar,
        modificar y eliminar instituciones.
      </p>


      <div className="acciones-admin instituciones-admin-acciones">

        <input
          type="text"
          className="buscador-instituciones"
          placeholder="Buscar por nombre o tipo"
          value={buscar}
          onChange={(e) =>
            setBuscar(
              e.target.value
            )
          }
        />


        <button
          type="button"
          className="boton-buscar boton-registrar-institucion"
          onClick={abrirRegistro}
        >
          Registrar Institución
        </button>

      </div>


      {mostrarFormulario && (

        <div className="panel-resultados">

          <h3>

            {
              modoEdicion
                ? 'Editar Institución'
                : 'Registrar Institución'
            }

          </h3>


          <form
            onSubmit={
              guardarInstitucion
            }
          >

            <div className="filtros">


              <div className="campo">

                <label>
                  Nombre de la institución *
                </label>


                <input
                  type="text"
                  value={
                    formulario.nombre_institucion
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      nombre_institucion:
                        e.target.value

                    })
                  }
                  required
                />

              </div>


              <div className="campo">

                <label>
                  Tipo de institución
                </label>


                <input
                  type="text"
                  value={
                    formulario.tipo_institucion
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      tipo_institucion:
                        e.target.value

                    })
                  }
                  placeholder="Ej: Institución pública"
                />

              </div>

            </div>


            {mensaje && (

              <p className="mensaje-registro">
                {mensaje}
              </p>

            )}


            <button
              type="submit"
              className="boton-buscar"
              disabled={guardando}
            >

              {
                guardando
                  ? 'Guardando...'
                  : modoEdicion
                    ? 'Guardar cambios'
                    : 'Guardar Institución'
              }

            </button>


            <button
              type="button"
              className="boton-cancelar"
              onClick={cancelar}
              disabled={guardando}
            >
              Cancelar
            </button>

          </form>

        </div>

      )}


      <div className="panel-resultados">

        <h3>
          Instituciones registradas
        </h3>


        {cargando ? (

          <p className="sin-resultados">
            Cargando instituciones...
          </p>

        ) : mensaje &&
          !mostrarFormulario ? (

          <p className="sin-resultados">
            {mensaje}
          </p>

        ) : institucionesFiltradas.length === 0 ? (

          <p className="sin-resultados">
            No se encontraron instituciones.
          </p>

        ) : (

          <div className="tabla-contenedor tabla-instituciones">

            <table>

              <thead>

                <tr>

                  <th>
                    Institución
                  </th>

                  <th>
                    Tipo
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {institucionesFiltradas.map(
                  (institucion) => (

                    <tr
                      key={
                        institucion.id_institucion
                      }
                    >

                      <td>
                        {
                          institucion.nombre_institucion
                        }
                      </td>


                      <td>
                        {
                          institucion.tipo_institucion ||
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
                                institucion
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="boton-eliminar"
                            onClick={() =>
                              eliminarInstitucion(
                                institucion
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


export default InstitucionesAdmin;
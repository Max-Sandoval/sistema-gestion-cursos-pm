import {
  useEffect,
  useState
} from 'react';


function ReparticionesAdmin() {

  const [
    reparticiones,
    setReparticiones
  ] = useState([]);


  const [
    zonas,
    setZonas
  ] = useState([]);


  const [
    buscando,
    setBuscando
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
    reparticionEditando,
    setReparticionEditando
  ] = useState(null);


  const [
    guardando,
    setGuardando
  ] = useState(false);


  const [
    mensaje,
    setMensaje
  ] = useState('');


  const [
    cargando,
    setCargando
  ] = useState(true);


  const [
    formulario,
    setFormulario
  ] = useState({

    nombre_reparticion: '',

    tipo_reparticion: '',

    id_zona: ''

  });


  // =========================================================
  // CARGAR DATOS
  // =========================================================

  const cargarDatos = async () => {

    try {

      setCargando(true);


      const [
        respuestaReparticiones,
        respuestaZonas
      ] = await Promise.all([

        fetch(
          'https://sistema-gestion-cursos-pm.onrender.com/api/reparticiones'
        ),

        fetch(
          'https://sistema-gestion-cursos-pm.onrender.com/api/zonas'
        )

      ]);


      const dataReparticiones =
        await respuestaReparticiones.json();


      const dataZonas =
        await respuestaZonas.json();


      if (
        !respuestaReparticiones.ok ||
        !respuestaZonas.ok
      ) {

        setMensaje(
          'No fue posible cargar la información.'
        );

        return;

      }


      setReparticiones(
        Array.isArray(dataReparticiones)
          ? dataReparticiones
          : []
      );


      setZonas(
        Array.isArray(dataZonas)
          ? dataZonas
          : []
      );


      setMensaje('');


    } catch (error) {

      console.error(
        'Error al cargar reparticiones:',
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

    cargarDatos();

  }, []);


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {

    setFormulario({

      nombre_reparticion: '',

      tipo_reparticion: '',

      id_zona: ''

    });

  };


  // =========================================================
  // ABRIR REGISTRO
  // =========================================================

  const abrirRegistro = () => {

    setModoEdicion(false);

    setReparticionEditando(null);

    setMensaje('');

    limpiarFormulario();

    setMostrarFormulario(true);

  };


  // =========================================================
  // ABRIR EDICIÓN
  // =========================================================

  const abrirEdicion = (reparticion) => {

    setModoEdicion(true);

    setReparticionEditando(
      reparticion.id_reparticion
    );


    setFormulario({

      nombre_reparticion:
        reparticion.nombre_reparticion || '',

      tipo_reparticion:
        reparticion.tipo_reparticion || '',

      id_zona:
        String(
          reparticion.id_zona || ''
        )

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

    setReparticionEditando(null);

    setMensaje('');

    limpiarFormulario();

  };


  // =========================================================
  // GUARDAR
  // =========================================================

  const guardarReparticion =
    async (e) => {

      e.preventDefault();


      if (
        !formulario.nombre_reparticion.trim() ||
        !formulario.id_zona
      ) {

        setMensaje(
          'Debe completar los campos obligatorios.'
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
            ? `https://sistema-gestion-cursos-pm.onrender.com/api/reparticiones/${reparticionEditando}`
            : 'https://sistema-gestion-cursos-pm.onrender.com/api/reparticiones';


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
            'No fue posible guardar la repartición.'
          );

          return;

        }


        window.alert(
          data.mensaje
        );


        setMostrarFormulario(false);

        setModoEdicion(false);

        setReparticionEditando(null);

        limpiarFormulario();

        await cargarDatos();


      } catch (error) {

        console.error(
          'Error al guardar repartición:',
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

  const eliminarReparticion =
    async (reparticion) => {

      const confirmar =
        window.confirm(
          `¿Está seguro de que desea eliminar "${reparticion.nombre_reparticion}"?`
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
            `https://sistema-gestion-cursos-pm.onrender.com/api/reparticiones/${reparticion.id_reparticion}`,
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
            'No fue posible eliminar la repartición.'
          );

          return;

        }


        window.alert(
          data.mensaje
        );


        await cargarDatos();


      } catch (error) {

        console.error(
          'Error al eliminar repartición:',
          error
        );


        window.alert(
          'No fue posible conectarse con el servidor.'
        );

      }

    };


  // =========================================================
  // BUSCADOR
  // =========================================================

  const reparticionesFiltradas =
    reparticiones.filter(
      (reparticion) => {

        const texto =
          buscando
            .trim()
            .toLowerCase();


        if (!texto) {
          return true;
        }


        return (

          reparticion.nombre_reparticion
            ?.toLowerCase()
            .includes(texto) ||

          reparticion.tipo_reparticion
            ?.toLowerCase()
            .includes(texto) ||

          reparticion.nombre_zona
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
        Administración de Reparticiones
      </h2>


      <p>
        Desde esta sección puede registrar,
        modificar y eliminar reparticiones.
      </p>


      <div className="acciones-admin reparticiones-admin-acciones">

        <input
          type="text"
          className="buscador-reparticiones"
          value={buscando}
          onChange={(e) =>
            setBuscando(
              e.target.value
            )
          }
          placeholder="Buscar por nombre, tipo o Zona Naval"
        />


        <button
          type="button"
          className="boton-buscar boton-registrar-reparticion"
          onClick={abrirRegistro}
        >
          Registrar Repartición
        </button>

      </div>


      {mostrarFormulario && (

        <div className="panel-resultados">

          <h3>

            {
              modoEdicion
                ? 'Editar Repartición'
                : 'Registrar Repartición'
            }

          </h3>


          <form
            onSubmit={
              guardarReparticion
            }
          >

            <div className="filtros">


              <div className="campo">

                <label>
                  Nombre de la repartición *
                </label>


                <input
                  type="text"
                  value={
                    formulario.nombre_reparticion
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      nombre_reparticion:
                        e.target.value

                    })
                  }
                  required
                />

              </div>


              <div className="campo">

                <label>
                  Tipo de repartición
                </label>


                <input
                  type="text"
                  value={
                    formulario.tipo_reparticion
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      tipo_reparticion:
                        e.target.value

                    })
                  }
                  placeholder="Ej: Gobernación Marítima"
                />

              </div>


              <div className="campo">

                <label>
                  Zona Naval *
                </label>


                <select
                  value={
                    formulario.id_zona
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      id_zona:
                        e.target.value

                    })
                  }
                  required
                >

                  <option value="">
                    Seleccione una Zona Naval
                  </option>


                  {zonas.map(
                    (zona) => (

                      <option
                        key={
                          zona.id_zona
                        }
                        value={
                          zona.id_zona
                        }
                      >

                        {
                          zona.nombre_zona
                        }

                      </option>

                    )
                  )}

                </select>

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
                    : 'Guardar Repartición'
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
          Reparticiones registradas
        </h3>


        {cargando ? (

          <p className="sin-resultados">
            Cargando reparticiones...
          </p>

        ) : mensaje &&
          !mostrarFormulario ? (

          <p className="sin-resultados">
            {mensaje}
          </p>

        ) : reparticionesFiltradas.length === 0 ? (

          <p className="sin-resultados">
            No se encontraron reparticiones.
          </p>

        ) : (

          <div className="tabla-contenedor tabla-reparticiones">

            <table>

              <thead>

                <tr>

                  <th>
                    Repartición
                  </th>

                  <th>
                    Tipo
                  </th>

                  <th>
                    Zona Naval
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {reparticionesFiltradas.map(
                  (reparticion) => (

                    <tr
                      key={
                        reparticion.id_reparticion
                      }
                    >

                      <td>
                        {
                          reparticion.nombre_reparticion
                        }
                      </td>


                      <td>
                        {
                          reparticion.tipo_reparticion ||
                          '-'
                        }
                      </td>


                      <td>
                        {
                          reparticion.nombre_zona
                        }
                      </td>


                      <td>

                        <div className="acciones-tabla">

                          <button
                            type="button"
                            className="boton-editar"
                            onClick={() =>
                              abrirEdicion(
                                reparticion
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="boton-eliminar"
                            onClick={() =>
                              eliminarReparticion(
                                reparticion
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


export default ReparticionesAdmin;
import { useEffect, useState } from 'react';

function TiposCursosAdmin() {

  const [tiposCursos, setTiposCursos] = useState([]);
  const [buscar, setBuscar] = useState('');

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [tipoEditando, setTipoEditando] =
    useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState('');

  const [formulario, setFormulario] =
    useState({
      nombre_tipo: '',
      descripcion: ''
    });


  const token =
    localStorage.getItem('token');


  // =========================================================
  // OBTENER TIPOS DE CURSOS
  // =========================================================

  const obtenerTiposCursos = async () => {

    try {

      setCargando(true);

      const respuesta = await fetch(
        'https://sistema-gestion-cursos-pm.onrender.com/api/tipos-cursos'
      );

      const datos =
        await respuesta.json();

      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible obtener los tipos de cursos'
        );

      }

      setTiposCursos(datos);

    } catch (error) {

      console.error(error);

      setMensaje(
        error.message
      );

    } finally {

      setCargando(false);

    }

  };


  useEffect(() => {

    obtenerTiposCursos();

  }, []);


  // =========================================================
  // FILTRAR
  // =========================================================

  const tiposFiltrados =
    tiposCursos.filter((tipo) => {

      const texto =
        buscar
          .trim()
          .toLowerCase();

      if (!texto) {
        return true;
      }

      return (
        tipo.nombre_tipo
          ?.toLowerCase()
          .includes(texto) ||
        tipo.descripcion
          ?.toLowerCase()
          .includes(texto)
      );

    });


  // =========================================================
  // ABRIR REGISTRO
  // =========================================================

  const abrirRegistro = () => {

    setModoEdicion(false);

    setTipoEditando(null);

    setFormulario({
      nombre_tipo: '',
      descripcion: ''
    });

    setMensaje('');

    setMostrarFormulario(true);

  };


  // =========================================================
  // ABRIR EDICIÓN
  // =========================================================

  const abrirEdicion = (tipo) => {

    setModoEdicion(true);

    setTipoEditando(tipo);

    setFormulario({
      nombre_tipo:
        tipo.nombre_tipo || '',
      descripcion:
        tipo.descripcion || ''
    });

    setMensaje('');

    setMostrarFormulario(true);

  };


  // =========================================================
  // CANCELAR
  // =========================================================

  const cancelarFormulario = () => {

    setMostrarFormulario(false);

    setModoEdicion(false);

    setTipoEditando(null);

    setMensaje('');

    setFormulario({
      nombre_tipo: '',
      descripcion: ''
    });

  };


  // =========================================================
  // CAMBIOS FORMULARIO
  // =========================================================

  const manejarCambio = (event) => {

    const {
      name,
      value
    } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));

  };


  // =========================================================
  // GUARDAR
  // =========================================================

  const guardarTipoCurso = async (event) => {

    event.preventDefault();

    if (
      !formulario.nombre_tipo.trim()
    ) {

      setMensaje(
        'Debe ingresar el nombre del tipo de curso.'
      );

      return;

    }


    try {

      setGuardando(true);

      setMensaje('');


      const url =
        modoEdicion
          ? `https://sistema-gestion-cursos-pm.onrender.com/api/tipos-cursos/${tipoEditando.id_tipo_curso}`
          : 'https://sistema-gestion-cursos-pm.onrender.com/api/tipos-cursos';


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
              JSON.stringify({
                nombre_tipo:
                  formulario.nombre_tipo.trim(),

                descripcion:
                  formulario.descripcion.trim()
              })
          }
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible guardar el tipo de curso'
        );

      }


      setMostrarFormulario(false);

      setModoEdicion(false);

      setTipoEditando(null);

      setFormulario({
        nombre_tipo: '',
        descripcion: ''
      });


      await obtenerTiposCursos();


    } catch (error) {

      console.error(error);

      setMensaje(
        error.message
      );

    } finally {

      setGuardando(false);

    }

  };


  // =========================================================
  // ELIMINAR
  // =========================================================

  const eliminarTipoCurso =
    async (tipo) => {

      const confirmar =
        window.confirm(
          `¿Desea eliminar el tipo de curso "${tipo.nombre_tipo}"?`
        );


      if (!confirmar) {
        return;
      }


      try {

        setMensaje('');


        const respuesta =
          await fetch(
            `https://sistema-gestion-cursos-pm.onrender.com/api/tipos-cursos/${tipo.id_tipo_curso}`,
            {
              method: 'DELETE',

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
            'No fue posible eliminar el tipo de curso'
          );

        }


        await obtenerTiposCursos();


      } catch (error) {

        console.error(error);

        alert(
          error.message
        );

      }

    };


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (

    <section className="panel-inicio tipos-cursos-admin">

      <h2>
        Administración de Tipos de Cursos
      </h2>

      <p>
        Permite registrar, editar y eliminar los tipos
        utilizados para clasificar los cursos del sistema.
      </p>


      {/* =====================================================
          BUSCADOR Y BOTÓN REGISTRAR
      ===================================================== */}

      <div className="tipos-cursos-admin-acciones">

        <input
          type="text"
          className="buscador-tipos-cursos"
          placeholder="Buscar por nombre o descripción..."
          value={buscar}
          onChange={(event) =>
            setBuscar(event.target.value)
          }
        />


        <button
          type="button"
          className="boton-buscar boton-registrar-tipo"
          onClick={abrirRegistro}
        >
          Registrar Tipo de Curso
        </button>

      </div>


      {/* =====================================================
          MENSAJE
      ===================================================== */}

      {mensaje && (

        <p className="mensaje-registro">
          {mensaje}
        </p>

      )}


      {/* =====================================================
          FORMULARIO
      ===================================================== */}

      {mostrarFormulario && (

        <section className="panel-filtros">

          <h3>

            {modoEdicion
              ? 'Editar Tipo de Curso'
              : 'Registrar Tipo de Curso'}

          </h3>


          <form
            onSubmit={guardarTipoCurso}
          >

            <div className="campo">

              <label>
                Nombre del tipo de curso
              </label>

              <input
                type="text"
                name="nombre_tipo"
                value={
                  formulario.nombre_tipo
                }
                onChange={manejarCambio}
                maxLength="100"
                required
              />

            </div>


            <div
              className="campo"
              style={{
                marginTop: '16px'
              }}
            >

              <label>
                Descripción
              </label>

              <input
                type="text"
                name="descripcion"
                value={
                  formulario.descripcion
                }
                onChange={manejarCambio}
                maxLength="255"
              />

            </div>


            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '4px'
              }}
            >

              <button
                type="submit"
                className="boton-buscar"
                disabled={guardando}
              >

                {guardando
                  ? 'Guardando...'
                  : modoEdicion
                    ? 'Guardar Cambios'
                    : 'Registrar'}

              </button>


              <button
                type="button"
                className="boton-cancelar"
                onClick={cancelarFormulario}
                disabled={guardando}
              >
                Cancelar
              </button>

            </div>

          </form>

        </section>

      )}


      {/* =====================================================
          LISTADO
      ===================================================== */}

      <section className="panel-resultados">

        <h3>
          Tipos de Cursos registrados
        </h3>


        {cargando ? (

          <p>
            Cargando tipos de cursos...
          </p>

        ) : tiposFiltrados.length === 0 ? (

          <p className="sin-resultados">
            No se encontraron tipos de cursos.
          </p>

        ) : (

          <div className="tabla-contenedor tabla-tipos-cursos">

            <table>

              <thead>

                <tr>

                  <th>
                    Tipo de Curso
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

                {tiposFiltrados.map(
                  (tipo) => (

                    <tr
                      key={
                        tipo.id_tipo_curso
                      }
                    >

                      <td>
                        {tipo.nombre_tipo}
                      </td>

                      <td>
                        {tipo.descripcion || '-'}
                      </td>

                      <td>

                        <div className="acciones-tabla">

                          <button
                            type="button"
                            className="boton-editar"
                            onClick={() =>
                              abrirEdicion(tipo)
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="boton-eliminar"
                            onClick={() =>
                              eliminarTipoCurso(tipo)
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


export default TiposCursosAdmin;
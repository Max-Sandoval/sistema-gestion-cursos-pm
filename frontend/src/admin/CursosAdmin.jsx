import {
  useEffect,
  useState
} from 'react';


function CursosAdmin() {

  // =========================================================
  // ESTADOS
  // =========================================================

  const [
    cursos,
    setCursos
  ] = useState([]);


  const [
    tiposCursos,
    setTiposCursos
  ] = useState([]);


  const [
    instituciones,
    setInstituciones
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
    mostrarFormulario,
    setMostrarFormulario
  ] = useState(false);


  const [
    modoEdicion,
    setModoEdicion
  ] = useState(false);


  const [
    cursoEditando,
    setCursoEditando
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
    textoBusqueda,
    setTextoBusqueda
  ] = useState('');


  const [
    formulario,
    setFormulario
  ] = useState({

    nombre_curso: '',

    duracion_horas: '',

    vigencia_meses: '',

    id_tipo_curso: '',

    id_institucion: ''

  });


  // =========================================================
  // OBTENER CURSOS
  // =========================================================

  const obtenerCursos = async () => {

    try {

      setCargando(true);

      setMensaje('');


      const respuesta =
        await fetch(
          'https://sistema-gestion-cursos-pm.onrender.com/api/cursos'
        );


      const data =
        await respuesta.json();


      if (!respuesta.ok) {

        setMensaje(
          data.mensaje ||
          'No fue posible cargar los cursos.'
        );

        return;

      }


      setCursos(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        'Error al obtener cursos:',
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
  // OBTENER TIPOS DE CURSO
  // =========================================================

  const obtenerTiposCursos =
    async () => {

      try {

        const respuesta =
          await fetch(
            'https://sistema-gestion-cursos-pm.onrender.com/api/tipos-cursos'
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          console.error(
            'Error al obtener tipos de curso:',
            data
          );

          return;

        }


        setTiposCursos(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          'Error al cargar tipos de curso:',
          error
        );

      }

    };


  // =========================================================
  // OBTENER INSTITUCIONES
  // =========================================================

  const obtenerInstituciones =
    async () => {

      try {

        const respuesta =
          await fetch(
            'https://sistema-gestion-cursos-pm.onrender.com/api/instituciones'
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          console.error(
            'Error al obtener instituciones:',
            data
          );

          return;

        }


        setInstituciones(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          'Error al cargar instituciones:',
          error
        );

      }

    };


  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {

    obtenerCursos();

    obtenerTiposCursos();

    obtenerInstituciones();

  }, []);


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {

    setFormulario({

      nombre_curso: '',

      duracion_horas: '',

      vigencia_meses: '',

      id_tipo_curso: '',

      id_institucion: ''

    });

  };


  // =========================================================
  // ABRIR FORMULARIO REGISTRO
  // =========================================================

  const abrirFormulario = () => {

    setModoEdicion(false);

    setCursoEditando(null);

    setMensajeFormulario('');

    limpiarFormulario();

    setMostrarFormulario(true);

  };


  // =========================================================
  // ABRIR FORMULARIO EDICIÓN
  // =========================================================

  const abrirEdicion = (curso) => {

    setModoEdicion(true);

    setCursoEditando(
      curso.id_curso
    );


    setFormulario({

      nombre_curso:
        curso.nombre_curso || '',

      duracion_horas:
        curso.duracion_horas ?? '',

      vigencia_meses:
        curso.vigencia_meses ?? '',

      id_tipo_curso:
        String(
          curso.id_tipo_curso ?? ''
        ),

      id_institucion:
        String(
          curso.id_institucion ?? ''
        )

    });


    setMensajeFormulario('');

    setMostrarFormulario(true);

  };


  // =========================================================
  // CANCELAR FORMULARIO
  // =========================================================

  const cancelarFormulario = () => {

    setMostrarFormulario(false);

    setModoEdicion(false);

    setCursoEditando(null);

    setMensajeFormulario('');

    limpiarFormulario();

  };


  // =========================================================
  // VALIDAR FORMULARIO
  // =========================================================

  const validarFormulario = () => {

    if (
      !formulario.nombre_curso.trim()
    ) {

      setMensajeFormulario(
        'Debe ingresar el nombre del curso.'
      );

      return false;

    }


    if (
      !formulario.id_tipo_curso
    ) {

      setMensajeFormulario(
        'Debe seleccionar un tipo de curso.'
      );

      return false;

    }


    if (
      !formulario.id_institucion
    ) {

      setMensajeFormulario(
        'Debe seleccionar una institución.'
      );

      return false;

    }


    if (
      formulario.duracion_horas !== '' &&
      Number(
        formulario.duracion_horas
      ) <= 0
    ) {

      setMensajeFormulario(
        'La duración debe ser mayor que cero.'
      );

      return false;

    }


    if (
      formulario.vigencia_meses !== '' &&
      Number(
        formulario.vigencia_meses
      ) <= 0
    ) {

      setMensajeFormulario(
        'La vigencia debe ser mayor que cero.'
      );

      return false;

    }


    return true;

  };


  // =========================================================
  // PREPARAR DATOS
  // =========================================================

  const prepararDatos = () => {

    return {

      nombre_curso:
        formulario.nombre_curso.trim(),

      duracion_horas:
        formulario.duracion_horas === ''
          ? null
          : Number(
              formulario.duracion_horas
            ),

      vigencia_meses:
        formulario.vigencia_meses === ''
          ? null
          : Number(
              formulario.vigencia_meses
            ),

      id_tipo_curso:
        Number(
          formulario.id_tipo_curso
        ),

      id_institucion:
        Number(
          formulario.id_institucion
        )

    };

  };


  // =========================================================
  // REGISTRAR CURSO
  // =========================================================

  const registrarCurso =
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
            'https://sistema-gestion-cursos-pm.onrender.com/api/cursos',
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
                  prepararDatos()
                )

            }
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          setMensajeFormulario(
            data.mensaje ||
            'No fue posible registrar el curso.'
          );

          return;

        }


        window.alert(
          data.mensaje ||
          'Curso registrado correctamente.'
        );


        setMostrarFormulario(false);

        limpiarFormulario();

        await obtenerCursos();


      } catch (error) {

        console.error(
          'Error al registrar curso:',
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
  // ACTUALIZAR CURSO
  // =========================================================

  const actualizarCurso =
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
            `https://sistema-gestion-cursos-pm.onrender.com/api/cursos/${cursoEditando}`,
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
                  prepararDatos()
                )

            }
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          setMensajeFormulario(
            data.mensaje ||
            'No fue posible actualizar el curso.'
          );

          return;

        }


        window.alert(
          data.mensaje ||
          'Curso actualizado correctamente.'
        );


        setMostrarFormulario(false);

        setModoEdicion(false);

        setCursoEditando(null);

        limpiarFormulario();

        await obtenerCursos();


      } catch (error) {

        console.error(
          'Error al actualizar curso:',
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
  // ELIMINAR CURSO
  // =========================================================

  const eliminarCurso =
    async (curso) => {

      const confirmar =
        window.confirm(
          `¿Está seguro de que desea eliminar el curso "${curso.nombre_curso}"?`
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
            `https://sistema-gestion-cursos-pm.onrender.com/api/cursos/${curso.id_curso}`,
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
            'No fue posible eliminar el curso.'
          );

          return;

        }


        window.alert(
          data.mensaje ||
          'Curso eliminado correctamente.'
        );


        await obtenerCursos();


      } catch (error) {

        console.error(
          'Error al eliminar curso:',
          error
        );


        window.alert(
          'No fue posible conectarse con el servidor.'
        );

      }

    };


  // =========================================================
  // BÚSQUEDA LOCAL
  // =========================================================

  const cursosFiltrados =
    cursos.filter((curso) => {

      const texto =
        textoBusqueda
          .trim()
          .toLowerCase();


      if (!texto) {
        return true;
      }


      return (

        curso.nombre_curso
          ?.toLowerCase()
          .includes(texto) ||

        curso.codigo_curso
          ?.toLowerCase()
          .includes(texto) ||

        curso.nombre_tipo
          ?.toLowerCase()
          .includes(texto) ||

        curso.nombre_institucion
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
        Administración de Cursos
      </h2>


      <p>
        Desde esta sección puede registrar,
        modificar y eliminar cursos del
        catálogo del sistema.
      </p>


      {/* =====================================================
          BÚSQUEDA
      ===================================================== */}

      <div className="acciones-admin cursos-admin-acciones">

        <input
          type="text"
          className="buscador-cursos"
          value={textoBusqueda}
          onChange={(e) =>
            setTextoBusqueda(
              e.target.value
            )
          }
          placeholder="Buscar por nombre, código, tipo o institución"
        />


        <button
          type="button"
          className="boton-buscar boton-registrar-curso"
          onClick={
            abrirFormulario
          }
        >
          Registrar curso
        </button>

      </div>


      {/* =====================================================
          FORMULARIO
      ===================================================== */}

      {mostrarFormulario && (

        <div className="panel-resultados">

          <h3>

            {
              modoEdicion
                ? 'Editar curso'
                : 'Registrar curso'
            }

          </h3>


          {!modoEdicion && (

            <p className="texto-codigo-automatico">
              El código del curso será generado
              automáticamente por el sistema.
            </p>

          )}


          <form
            onSubmit={
              modoEdicion
                ? actualizarCurso
                : registrarCurso
            }
          >

            <div className="filtros">


              {/* NOMBRE */}

              <div className="campo">

                <label>
                  Nombre del curso *
                </label>


                <input
                  type="text"
                  value={
                    formulario.nombre_curso
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      nombre_curso:
                        e.target.value

                    })
                  }
                  placeholder="Ej: Buceo Profesional"
                  required
                />

              </div>


              {/* DURACIÓN */}

              <div className="campo">

                <label>
                  Duración (horas)
                </label>


                <input
                  type="number"
                  min="1"
                  value={
                    formulario.duracion_horas
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      duracion_horas:
                        e.target.value

                    })
                  }
                  placeholder="Ej: 40"
                />

              </div>


              {/* VIGENCIA */}

              <div className="campo">

                <label>
                  Vigencia (meses)
                </label>


                <input
                  type="number"
                  min="1"
                  value={
                    formulario.vigencia_meses
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      vigencia_meses:
                        e.target.value

                    })
                  }
                  placeholder="Vacío = indefinida"
                />

              </div>


              {/* TIPO DE CURSO */}

              <div className="campo">

                <label>
                  Tipo de curso *
                </label>


                <select
                  value={
                    formulario.id_tipo_curso
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      id_tipo_curso:
                        e.target.value

                    })
                  }
                  required
                >

                  <option value="">
                    Seleccione un tipo
                  </option>


                  {tiposCursos.map(
                    (tipo) => (

                      <option
                        key={
                          tipo.id_tipo_curso
                        }
                        value={
                          tipo.id_tipo_curso
                        }
                      >

                        {tipo.nombre_tipo}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* INSTITUCIÓN */}

              <div className="campo">

                <label>
                  Institución *
                </label>


                <select
                  value={
                    formulario.id_institucion
                  }
                  onChange={(e) =>
                    setFormulario({

                      ...formulario,

                      id_institucion:
                        e.target.value

                    })
                  }
                  required
                >

                  <option value="">
                    Seleccione una institución
                  </option>


                  {instituciones.map(
                    (institucion) => (

                      <option
                        key={
                          institucion.id_institucion
                        }
                        value={
                          institucion.id_institucion
                        }
                      >

                        {
                          institucion.nombre_institucion
                        }

                      </option>

                    )
                  )}

                </select>

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
              disabled={guardando}
            >

              {
                guardando
                  ? 'Guardando...'
                  : modoEdicion
                    ? 'Guardar cambios'
                    : 'Guardar curso'
              }

            </button>


            <button
              type="button"
              className="boton-cancelar"
              onClick={
                cancelarFormulario
              }
              disabled={guardando}
            >

              Cancelar

            </button>

          </form>

        </div>

      )}


      {/* =====================================================
          TABLA DE CURSOS
      ===================================================== */}

      <div className="panel-resultados">

        <h3>
          Cursos registrados
        </h3>


        {cargando ? (

          <p className="sin-resultados">
            Cargando cursos...
          </p>

        ) : mensaje ? (

          <p className="sin-resultados">
            {mensaje}
          </p>

        ) : cursosFiltrados.length === 0 ? (

          <p className="sin-resultados">
            No se encontraron cursos.
          </p>

        ) : (

          <div className="tabla-contenedor">

            <table>

              <thead>

                <tr>

                  <th>Curso</th>

                  <th>Código</th>

                  <th>Duración</th>

                  <th>Vigencia</th>

                  <th>Tipo</th>

                  <th>Institución</th>

                  <th>Acciones</th>

                </tr>

              </thead>


              <tbody>

                {cursosFiltrados.map(
                  (curso) => (

                    <tr
                      key={
                        curso.id_curso
                      }
                    >

                      <td>

                        {
                          curso.nombre_curso
                        }

                      </td>


                      <td>

                        {
                          curso.codigo_curso ||
                          '-'
                        }

                      </td>


                      <td>

                        {
                          curso.duracion_horas
                            ? `${curso.duracion_horas} horas`
                            : '-'
                        }

                      </td>


                      <td>

                        {
                          curso.vigencia_meses === null ||
                          curso.vigencia_meses === undefined
                            ? 'Indefinida'
                            : `${curso.vigencia_meses} meses`
                        }

                      </td>


                      <td>

                        {
                          curso.nombre_tipo ||
                          '-'
                        }

                      </td>


                      <td>

                        {
                          curso.nombre_institucion ||
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
                                curso
                              )
                            }
                          >
                            Editar
                          </button>


                          <button
                            type="button"
                            className="boton-eliminar"
                            onClick={() =>
                              eliminarCurso(
                                curso
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


export default CursosAdmin;
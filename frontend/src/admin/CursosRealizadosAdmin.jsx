import {
  useEffect,
  useState
} from 'react';


function CursosRealizadosAdmin({
  funcionario
}) {

  const [
    cursosRealizados,
    setCursosRealizados
  ] = useState([]);


  const [
    cursosDisponibles,
    setCursosDisponibles
  ] = useState([]);


  const [
    estadosCurso,
    setEstadosCurso
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
    mensajeFormulario,
    setMensajeFormulario
  ] = useState('');


  const [
    guardando,
    setGuardando
  ] = useState(false);


  const [
    nuevoCurso,
    setNuevoCurso
  ] = useState({

    id_curso: '',

    fecha_inicio: '',

    fecha_termino: '',

    id_estado: '',

    nota: '',

    puesto: '',

    total_participantes: ''

  });


  // =========================================================
  // OBTENER CURSOS DEL FUNCIONARIO
  // =========================================================

  const obtenerCursosFuncionario = async () => {

    try {

      setCargando(true);

      setMensaje('');


      const token =
        localStorage.getItem('token');


      if (!token) {

        setMensaje(
          'No existe una sesión válida.'
        );

        return;
      }


      const respuesta =
        await fetch(
          `http://localhost:3000/api/funcionarios/${funcionario.id_funcionario}/cursos`,
          {
            headers: {

              Authorization:
                `Bearer ${token}`

            }
          }
        );


      const data =
        await respuesta.json();


      if (!respuesta.ok) {

        setMensaje(
          data.mensaje ||
          'No fue posible cargar los cursos realizados.'
        );

        return;
      }


      setCursosRealizados(
        data.cursos || []
      );


    } catch (error) {

      console.error(
        'Error al obtener cursos realizados:',
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
  // OBTENER CATÁLOGO DE CURSOS
  // =========================================================

  const obtenerCursosDisponibles =
    async () => {

      try {

        const respuesta =
          await fetch(
            'http://localhost:3000/api/cursos'
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          console.error(
            'Error al obtener cursos:',
            data
          );

          return;
        }


        setCursosDisponibles(
          data || []
        );


      } catch (error) {

        console.error(
          'Error al cargar cursos:',
          error
        );

      }

    };


  // =========================================================
  // OBTENER ESTADOS DE CURSO
  // =========================================================

  const obtenerEstadosCurso =
    async () => {

      try {

        const respuesta =
          await fetch(
            'http://localhost:3000/api/estados'
          );


        const data =
          await respuesta.json();


        if (!respuesta.ok) {

          console.error(
            'Error al obtener estados:',
            data
          );

          return;
        }


        setEstadosCurso(
          data || []
        );


      } catch (error) {

        console.error(
          'Error al cargar estados:',
          error
        );

      }

    };


  // =========================================================
  // CARGAR INFORMACIÓN
  // =========================================================

  useEffect(() => {

    obtenerCursosFuncionario();

    obtenerCursosDisponibles();

    obtenerEstadosCurso();

  }, [funcionario.id_funcionario]);


  // =========================================================
  // FORMATEAR FECHA PARA TABLA
  // =========================================================

  const formatearFecha = (fecha) => {

    if (!fecha) {
      return '-';
    }


    const soloFecha =
      fecha.split('T')[0];


    const [
      anio,
      mes,
      dia
    ] =
      soloFecha.split('-');


    return `${dia}-${mes}-${anio}`;

  };


  // =========================================================
  // FORMATEAR FECHA PARA INPUT
  // =========================================================

  const fechaParaInput = (fecha) => {

    if (!fecha) {
      return '';
    }

    return fecha.split('T')[0];

  };


  // =========================================================
  // MOSTRAR LUGAR
  // =========================================================

  const obtenerLugar = (curso) => {

    if (
      curso.puesto !== null &&
      curso.puesto !== undefined &&
      curso.total_participantes !== null &&
      curso.total_participantes !== undefined
    ) {

      return (
        `${curso.puesto} / ${curso.total_participantes}`
      );

    }


    if (
      curso.puesto !== null &&
      curso.puesto !== undefined
    ) {

      return `${curso.puesto}`;

    }


    return '-';

  };


  // =========================================================
  // CLASE DEL ESTADO
  // =========================================================

  const obtenerClaseEstado = (
    estado
  ) => {

    if (estado === 'Vigente') {

      return 'estado-vigente';

    }


    if (estado === 'Vencido') {

      return 'estado-vencido';

    }


    return 'estado-proceso';

  };


  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {

    setNuevoCurso({

      id_curso: '',

      fecha_inicio: '',

      fecha_termino: '',

      id_estado: '',

      nota: '',

      puesto: '',

      total_participantes: ''

    });

  };


  // =========================================================
  // ABRIR REGISTRO
  // =========================================================

  const abrirFormulario = () => {

    setModoEdicion(false);

    setCursoEditando(null);

    limpiarFormulario();

    setMensajeFormulario('');

    setMostrarFormulario(true);

  };


  // =========================================================
  // ABRIR EDICIÓN
  // =========================================================

  const abrirEdicion = (curso) => {

    setModoEdicion(true);

    setCursoEditando(
      curso.id_curso_realizado
    );


    setNuevoCurso({

      id_curso:
        String(
          curso.id_curso ?? ''
        ),

      fecha_inicio:
        fechaParaInput(
          curso.fecha_inicio
        ),

      fecha_termino:
        fechaParaInput(
          curso.fecha_termino
        ),

      id_estado:
        String(
          curso.id_estado ?? ''
        ),

      nota:
        curso.nota ?? '',

      puesto:
        curso.puesto ?? '',

      total_participantes:
        curso.total_participantes ?? ''

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

    if (!nuevoCurso.id_curso) {

      setMensajeFormulario(
        'Debe seleccionar un curso.'
      );

      return false;

    }


    if (!nuevoCurso.id_estado) {

      setMensajeFormulario(
        'Debe seleccionar un estado.'
      );

      return false;

    }


    if (
      nuevoCurso.fecha_inicio &&
      nuevoCurso.fecha_termino &&
      nuevoCurso.fecha_termino <
        nuevoCurso.fecha_inicio
    ) {

      setMensajeFormulario(
        'La fecha de término no puede ser anterior a la fecha de inicio.'
      );

      return false;

    }


    if (
      nuevoCurso.nota !== '' &&
      Number(nuevoCurso.nota) < 0
    ) {

      setMensajeFormulario(
        'La nota no puede ser negativa.'
      );

      return false;

    }


    if (
      nuevoCurso.puesto !== '' &&
      Number(nuevoCurso.puesto) <= 0
    ) {

      setMensajeFormulario(
        'El lugar obtenido debe ser mayor que cero.'
      );

      return false;

    }


    if (
      nuevoCurso.total_participantes !== '' &&
      Number(
        nuevoCurso.total_participantes
      ) <= 0
    ) {

      setMensajeFormulario(
        'El total de participantes debe ser mayor que cero.'
      );

      return false;

    }


    if (
      nuevoCurso.puesto !== '' &&
      nuevoCurso.total_participantes !== '' &&
      Number(nuevoCurso.puesto) >
        Number(
          nuevoCurso.total_participantes
        )
    ) {

      setMensajeFormulario(
        'El lugar obtenido no puede ser mayor que el total de participantes.'
      );

      return false;

    }


    return true;

  };


  // =========================================================
  // PREPARAR BODY
  // =========================================================

  const prepararDatosCurso = () => {

    return {

      id_curso:
        Number(
          nuevoCurso.id_curso
        ),

      fecha_inicio:
        nuevoCurso.fecha_inicio ||
        null,

      fecha_termino:
        nuevoCurso.fecha_termino ||
        null,

      id_estado:
        Number(
          nuevoCurso.id_estado
        ),

      nota:
        nuevoCurso.nota === ''
          ? null
          : Number(
              nuevoCurso.nota
            ),

      puesto:
        nuevoCurso.puesto === ''
          ? null
          : Number(
              nuevoCurso.puesto
            ),

      total_participantes:
        nuevoCurso
          .total_participantes === ''
          ? null
          : Number(
              nuevoCurso
                .total_participantes
            )

    };

  };


  // =========================================================
  // REGISTRAR CURSO REALIZADO
  // =========================================================

  const registrarCursoRealizado =
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
            `http://localhost:3000/api/funcionarios/${funcionario.id_funcionario}/cursos`,
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
                  prepararDatosCurso()
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

        await obtenerCursosFuncionario();


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
  // ACTUALIZAR CURSO REALIZADO
  // =========================================================

  const actualizarCursoRealizado =
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
            `http://localhost:3000/api/cursos-realizados/${cursoEditando}`,
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
                  prepararDatosCurso()
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

        await obtenerCursosFuncionario();


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
  // ELIMINAR CURSO REALIZADO
  // =========================================================

  const eliminarCursoRealizado =
    async (curso) => {

      const confirmar =
        window.confirm(
          `¿Está seguro de que desea eliminar el curso "${curso.nombre_curso}" del historial de este funcionario?`
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
            `http://localhost:3000/api/cursos-realizados/${curso.id_curso_realizado}`,
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


        if (
          cursoEditando ===
          curso.id_curso_realizado
        ) {

          setMostrarFormulario(false);

          setModoEdicion(false);

          setCursoEditando(null);

          limpiarFormulario();

        }


        await obtenerCursosFuncionario();


      } catch (error) {

        console.error(
          'Error al eliminar curso realizado:',
          error
        );


        window.alert(
          'No fue posible conectarse con el servidor.'
        );

      }

    };


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (

    <section className="panel-filtros">

      <h2>
        Cursos realizados
      </h2>


      {/* =====================================================
          DATOS DEL FUNCIONARIO
      ===================================================== */}

      <div className="datos-perfil">

        <p>

          <strong>
            Funcionario:
          </strong>{' '}

          {funcionario.grado}{' '}

          {funcionario.nombres}{' '}

          {funcionario.apellidos}

        </p>


        <p>

          <strong>
            NPI:
          </strong>{' '}

          {funcionario.npi}

        </p>


        <p>

          <strong>
            Zona Naval:
          </strong>{' '}

          {funcionario.nombre_zona}

        </p>


        <p>

          <strong>
            Repartición:
          </strong>{' '}

          {
            funcionario.nombre_reparticion
          }

        </p>


        <p>

          <strong>
            Estado:
          </strong>{' '}


          <span
            className={
              funcionario.activo
                ? 'estado-activo'
                : 'estado-inactivo'
            }
          >

            {
              funcionario.activo
                ? 'Activo'
                : 'Inactivo'
            }

          </span>

        </p>

      </div>


      {/* =====================================================
          BOTÓN REGISTRAR
      ===================================================== */}

      {!mostrarFormulario && (

        <div className="acciones-admin">

          <button
            type="button"
            className="boton-buscar"
            onClick={
              abrirFormulario
            }
          >

            Registrar curso realizado

          </button>

        </div>

      )}


      {/* =====================================================
          FORMULARIO REGISTRO / EDICIÓN
      ===================================================== */}

      {mostrarFormulario && (

        <div className="panel-resultados">

          <h3>

            {
              modoEdicion
                ? 'Editar curso realizado'
                : 'Registrar curso realizado'
            }

          </h3>


          <form
            onSubmit={
              modoEdicion
                ? actualizarCursoRealizado
                : registrarCursoRealizado
            }
          >

            <div className="filtros">


              {/* CURSO */}

              <div className="campo">

                <label>
                  Curso *
                </label>


                <select
                  value={
                    nuevoCurso.id_curso
                  }
                  onChange={(e) =>
                    setNuevoCurso({

                      ...nuevoCurso,

                      id_curso:
                        e.target.value

                    })
                  }
                  required
                >

                  <option value="">
                    Seleccione un curso
                  </option>


                  {cursosDisponibles.map(
                    (curso) => (

                      <option
                        key={
                          curso.id_curso
                        }
                        value={
                          curso.id_curso
                        }
                      >

                        {
                          curso.nombre_curso
                        }

                        {
                          curso.codigo_curso
                            ? ` - ${curso.codigo_curso}`
                            : ''
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* FECHA INICIO */}

              <div className="campo">

                <label>
                  Fecha inicio
                </label>


                <input
                  type="date"
                  value={
                    nuevoCurso.fecha_inicio
                  }
                  onChange={(e) =>
                    setNuevoCurso({

                      ...nuevoCurso,

                      fecha_inicio:
                        e.target.value

                    })
                  }
                />

              </div>


              {/* FECHA TÉRMINO */}

              <div className="campo">

                <label>
                  Fecha término
                </label>


                <input
                  type="date"
                  value={
                    nuevoCurso.fecha_termino
                  }
                  onChange={(e) =>
                    setNuevoCurso({

                      ...nuevoCurso,

                      fecha_termino:
                        e.target.value

                    })
                  }
                />

              </div>


              {/* ESTADO */}

              <div className="campo">

                <label>
                  Estado *
                </label>


                <select
                  value={
                    nuevoCurso.id_estado
                  }
                  onChange={(e) =>
                    setNuevoCurso({

                      ...nuevoCurso,

                      id_estado:
                        e.target.value

                    })
                  }
                  required
                >

                  <option value="">
                    Seleccione un estado
                  </option>


                  {estadosCurso.map(
                    (estado) => (

                      <option
                        key={
                          estado.id_estado
                        }
                        value={
                          estado.id_estado
                        }
                      >

                        {
                          estado.nombre_estado
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* NOTA */}

              <div className="campo">

                <label>
                  Nota
                </label>


                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={
                    nuevoCurso.nota
                  }
                  onChange={(e) =>
                    setNuevoCurso({

                      ...nuevoCurso,

                      nota:
                        e.target.value

                    })
                  }
                  placeholder="Ej: 6.50"
                />

              </div>


              {/* LUGAR */}

              <div className="campo">

                <label>
                  Lugar obtenido
                </label>


                <input
                  type="number"
                  min="1"
                  value={
                    nuevoCurso.puesto
                  }
                  onChange={(e) =>
                    setNuevoCurso({

                      ...nuevoCurso,

                      puesto:
                        e.target.value

                    })
                  }
                  placeholder="Ej: 1"
                />

              </div>


              {/* TOTAL PARTICIPANTES */}

              <div className="campo">

                <label>
                  Total participantes
                </label>


                <input
                  type="number"
                  min="1"
                  value={
                    nuevoCurso
                      .total_participantes
                  }
                  onChange={(e) =>
                    setNuevoCurso({

                      ...nuevoCurso,

                      total_participantes:
                        e.target.value

                    })
                  }
                  placeholder="Ej: 20"
                />

              </div>

            </div>


            {/* MENSAJE */}

            {mensajeFormulario && (

              <p className="mensaje-registro">

                {
                  mensajeFormulario
                }

              </p>

            )}


            {/* GUARDAR */}

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


            {/* CANCELAR */}

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
          HISTORIAL
      ===================================================== */}

      <div className="panel-resultados">

        <h3>
          Historial de cursos
        </h3>


        {cargando ? (

          <p className="sin-resultados">

            Cargando cursos realizados...

          </p>

        ) : mensaje ? (

          <p className="sin-resultados">

            {mensaje}

          </p>

        ) : cursosRealizados.length === 0 ? (

          <p className="sin-resultados">

            Este funcionario no registra cursos realizados.

          </p>

        ) : (

          <div className="tabla-contenedor">

            <table>

              <thead>

                <tr>

                  <th>Curso</th>

                  <th>Código</th>

                  <th>Institución</th>

                  <th>Tipo</th>

                  <th>Fecha inicio</th>

                  <th>Fecha término</th>

                  <th>Estado</th>

                  <th>Vencimiento</th>

                  <th>Nota</th>

                  <th>Lugar</th>

                  <th>Acciones</th>

                </tr>

              </thead>


              <tbody>

                {cursosRealizados.map(
                  (curso) => (

                    <tr
                      key={
                        curso.id_curso_realizado
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
                          curso.nombre_institucion ||
                          '-'
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
                          formatearFecha(
                            curso.fecha_inicio
                          )
                        }

                      </td>


                      <td>

                        {
                          formatearFecha(
                            curso.fecha_termino
                          )
                        }

                      </td>


                      <td>

                        <span
                          className={
                            obtenerClaseEstado(
                              curso.nombre_estado
                            )
                          }
                        >

                          {
                            curso.nombre_estado
                          }

                        </span>

                      </td>


                      <td>

                        {
                          curso
                            .vigencia_meses ===
                          null
                            ? 'Indefinida'
                            : curso
                                .fecha_vencimiento
                              ? formatearFecha(
                                  curso
                                    .fecha_vencimiento
                                )
                              : '-'
                        }

                      </td>


                      <td>

                        {
                          curso.nota ??
                          '-'
                        }

                      </td>


                      <td>

                        {
                          obtenerLugar(
                            curso
                          )
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
                              eliminarCursoRealizado(
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


export default CursosRealizadosAdmin;
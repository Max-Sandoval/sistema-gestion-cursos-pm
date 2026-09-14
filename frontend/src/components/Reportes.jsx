import { useEffect, useState } from 'react';


function Reportes({ irA }) {

  const [reporteSeleccionado, setReporteSeleccionado] =
    useState('');

  const [cursos, setCursos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState('');

  const [cargando, setCargando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState('');

  const [resumenCapacitacion, setResumenCapacitacion] =
    useState(null);

  const [cursosResumen, setCursosResumen] =
    useState([]);


  // =========================================================
  // ESTADOS - REPORTE POR REPARTICIÓN
  // =========================================================

  const [zonas, setZonas] =
    useState([]);

  const [reparticiones, setReparticiones] =
    useState([]);

  const [zonaSeleccionada, setZonaSeleccionada] =
    useState('');

  const [
    reparticionSeleccionada,
    setReparticionSeleccionada
  ] = useState('');

  const [
    datosReparticion,
    setDatosReparticion
  ] = useState(null);

  const [
    resumenReparticion,
    setResumenReparticion
  ] = useState(null);

  const [
    cursosReparticion,
    setCursosReparticion
  ] = useState([]);


  // =========================================================
  // ESTADOS - REPORTE POR ZONA NAVAL
  // =========================================================

  const [
    zonaReporteSeleccionada,
    setZonaReporteSeleccionada
  ] = useState('');

  const [
    datosZona,
    setDatosZona
  ] = useState(null);

  const [
    resumenZona,
    setResumenZona
  ] = useState(null);

  const [
    reparticionesZona,
    setReparticionesZona
  ] = useState([]);


  // =========================================================
  // OBTENER CURSOS
  // =========================================================

  const obtenerCursos = async () => {

    try {

      setCargando(true);
      setMensaje('');


      const respuesta =
        await fetch(
          'http://localhost:3000/api/cursos'
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible obtener los cursos'
        );

      }


      setCursos(
        Array.isArray(datos)
          ? datos
          : []
      );


    } catch (error) {

      console.error(
        'Error al obtener cursos:',
        error
      );


      setMensaje(
        error.message ||
        'No fue posible conectarse con el servidor'
      );


    } finally {

      setCargando(false);

    }

  };


  // =========================================================
  // OBTENER RESUMEN DE CAPACITACIÓN
  // =========================================================

  const obtenerResumenCapacitacion = async () => {

    try {

      setCargando(true);
      setMensaje('');


      const token =
        localStorage.getItem('token');


      if (!token) {

        throw new Error(
          'No existe una sesión activa'
        );

      }


      const respuesta =
        await fetch(
          'http://localhost:3000/api/reportes/resumen-capacitacion',
          {
            method: 'GET',

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
          'No fue posible obtener el resumen de capacitación'
        );

      }


      setResumenCapacitacion(
        datos.resumen || null
      );


      setCursosResumen(
        Array.isArray(datos.cursos)
          ? datos.cursos
          : []
      );


    } catch (error) {

      console.error(
        'Error al obtener resumen de capacitación:',
        error
      );


      setMensaje(
        error.message ||
        'No fue posible conectarse con el servidor'
      );


      setResumenCapacitacion(null);
      setCursosResumen([]);


    } finally {

      setCargando(false);

    }

  };


  // =========================================================
  // OBTENER ZONAS NAVALES
  // =========================================================

  const obtenerZonas = async () => {

    try {

      setMensaje('');


      const respuesta =
        await fetch(
          'http://localhost:3000/api/zonas'
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible obtener las Zonas Navales'
        );

      }


      setZonas(
        Array.isArray(datos)
          ? datos
          : []
      );


    } catch (error) {

      console.error(
        'Error al obtener Zonas Navales:',
        error
      );


      setMensaje(
        error.message ||
        'No fue posible conectarse con el servidor'
      );


      setZonas([]);

    }

  };


  // =========================================================
  // OBTENER REPARTICIONES SEGÚN ZONA
  // =========================================================

  const obtenerReparticiones = async (idZona) => {

    try {

      setMensaje('');


      const respuesta =
        await fetch(
          `http://localhost:3000/api/reparticiones?zona=${idZona}`
        );


      const datos =
        await respuesta.json();


      if (!respuesta.ok) {

        throw new Error(
          datos.mensaje ||
          'No fue posible obtener las reparticiones'
        );

      }


      setReparticiones(
        Array.isArray(datos)
          ? datos
          : []
      );


    } catch (error) {

      console.error(
        'Error al obtener reparticiones:',
        error
      );


      setMensaje(
        error.message ||
        'No fue posible conectarse con el servidor'
      );


      setReparticiones([]);

    }

  };


  // =========================================================
  // CONSULTAR CURSOS POR REPARTICIÓN
  // =========================================================

  const consultarCursosPorReparticion =
    async (event) => {

      event.preventDefault();


      if (!zonaSeleccionada) {

        setMensaje(
          'Debe seleccionar una Zona Naval'
        );

        return;

      }


      if (!reparticionSeleccionada) {

        setMensaje(
          'Debe seleccionar una repartición'
        );

        return;

      }


      try {

        setCargando(true);
        setMensaje('');

        setDatosReparticion(null);
        setResumenReparticion(null);
        setCursosReparticion([]);


        const token =
          localStorage.getItem('token');


        if (!token) {

          throw new Error(
            'No existe una sesión activa'
          );

        }


        const respuesta =
          await fetch(
            `http://localhost:3000/api/reportes/cursos-por-reparticion?zona=${zonaSeleccionada}&reparticion=${reparticionSeleccionada}`,
            {
              method: 'GET',

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
            'No fue posible obtener el reporte por repartición'
          );

        }


        setDatosReparticion(
          datos.reparticion || null
        );


        setResumenReparticion(
          datos.resumen || null
        );


        setCursosReparticion(
          Array.isArray(datos.cursos)
            ? datos.cursos
            : []
        );


      } catch (error) {

        console.error(
          'Error al obtener reporte por repartición:',
          error
        );


        setMensaje(
          error.message ||
          'No fue posible conectarse con el servidor'
        );


      } finally {

        setCargando(false);

      }

    };


  // =========================================================
  // CONSULTAR CURSOS POR ZONA NAVAL
  // =========================================================

  const consultarCursosPorZona =
    async (event) => {

      event.preventDefault();


      if (!zonaReporteSeleccionada) {

        setMensaje(
          'Debe seleccionar una Zona Naval'
        );

        return;

      }


      try {

        setCargando(true);
        setMensaje('');

        setDatosZona(null);
        setResumenZona(null);
        setReparticionesZona([]);


        const token =
          localStorage.getItem('token');


        if (!token) {

          throw new Error(
            'No existe una sesión activa'
          );

        }


        const respuesta =
          await fetch(
            `http://localhost:3000/api/reportes/cursos-por-zona?zona=${zonaReporteSeleccionada}`,
            {
              method: 'GET',

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
            'No fue posible obtener el reporte por Zona Naval'
          );

        }


        setDatosZona(
          datos.zona || null
        );


        setResumenZona(
          datos.resumen || null
        );


        setReparticionesZona(
          Array.isArray(datos.reparticiones)
            ? datos.reparticiones
            : []
        );


      } catch (error) {

        console.error(
          'Error al obtener reporte por Zona Naval:',
          error
        );


        setMensaje(
          error.message ||
          'No fue posible conectarse con el servidor'
        );


      } finally {

        setCargando(false);

      }

    };


  // =========================================================
  // CARGAR REPORTES
  // =========================================================

  useEffect(() => {

    if (
      reporteSeleccionado ===
      'Listado de Cursos'
    ) {

      obtenerCursos();

    }


    if (
      reporteSeleccionado ===
      'Resumen de Capacitación'
    ) {

      obtenerResumenCapacitacion();

    }


    if (
      reporteSeleccionado ===
      'Cursos por Repartición'
    ) {

      obtenerZonas();

    }


    if (
      reporteSeleccionado ===
      'Cursos por Zona Naval'
    ) {

      obtenerZonas();

    }

  }, [reporteSeleccionado]);


  // =========================================================
  // CARGAR REPARTICIONES AL CAMBIAR ZONA
  // =========================================================

  useEffect(() => {

    setReparticionSeleccionada('');

    setDatosReparticion(null);
    setResumenReparticion(null);
    setCursosReparticion([]);


    if (zonaSeleccionada) {

      obtenerReparticiones(
        zonaSeleccionada
      );

    } else {

      setReparticiones([]);

    }

  }, [zonaSeleccionada]);


  // =========================================================
  // VOLVER
  // =========================================================

  const volver = () => {

    if (reporteSeleccionado) {

      setReporteSeleccionado('');
      setBusqueda('');
      setMensaje('');

      setZonaSeleccionada('');
      setReparticionSeleccionada('');

      setReparticiones([]);

      setDatosReparticion(null);
      setResumenReparticion(null);
      setCursosReparticion([]);

      setZonaReporteSeleccionada('');
      setDatosZona(null);
      setResumenZona(null);
      setReparticionesZona([]);

      return;

    }


    irA('inicio');

  };


  // =========================================================
  // FILTRAR CURSOS
  // =========================================================

  const cursosFiltrados =
    cursos.filter(
      (curso) => {

        const texto =
          busqueda
            .trim()
            .toLowerCase();


        if (!texto) {
          return true;
        }


        return (

          curso.codigo_curso
            ?.toLowerCase()
            .includes(texto)

          ||

          curso.nombre_curso
            ?.toLowerCase()
            .includes(texto)

          ||

          curso.nombre_tipo
            ?.toLowerCase()
            .includes(texto)

          ||

          curso.nombre_institucion
            ?.toLowerCase()
            .includes(texto)

        );

      }
    );


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (
    <>

      <div className="barra-navegacion-interna">

        <span>

          Inicio &gt; Reportes

          {reporteSeleccionado &&
            ` > ${reporteSeleccionado}`}

        </span>


        <button
          type="button"
          onClick={volver}
          className="boton-volver"
        >

          ← Volver

        </button>

      </div>


      {/* =====================================================
          MENÚ DE REPORTES
      ===================================================== */}

      {!reporteSeleccionado && (

        <section className="panel-inicio">

          <h2>
            Reportes
          </h2>


          <p>
            Seleccione el tipo de reporte que desea consultar.
          </p>


          <div className="tarjetas-inicio">


            {/* LISTADO DE CURSOS */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={
                () =>
                  setReporteSeleccionado(
                    'Listado de Cursos'
                  )
              }
            >

              <h3>
                Listado de Cursos
              </h3>

              <p>
                Visualizar los cursos registrados
                en el sistema.
              </p>

            </button>


            {/* RESUMEN DE CAPACITACIÓN */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={
                () =>
                  setReporteSeleccionado(
                    'Resumen de Capacitación'
                  )
              }
            >

              <h3>
                Resumen de Capacitación
              </h3>

              <p>
                Visualizar un resumen general
                de la capacitación del personal.
              </p>

            </button>


            {/* CURSOS POR REPARTICIÓN */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={
                () =>
                  setReporteSeleccionado(
                    'Cursos por Repartición'
                  )
              }
            >

              <h3>
                Cursos por Repartición
              </h3>

              <p>
                Consultar los cursos según repartición.
              </p>

            </button>


            {/* CURSOS POR ZONA NAVAL */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={
                () =>
                  setReporteSeleccionado(
                    'Cursos por Zona Naval'
                  )
              }
            >

              <h3>
                Cursos por Zona Naval
              </h3>

              <p>
                Consultar los cursos según Zona Naval.
              </p>

            </button>

          </div>

        </section>

      )}


      {/* =====================================================
          REPORTE: LISTADO DE CURSOS
      ===================================================== */}

      {reporteSeleccionado ===
        'Listado de Cursos' && (

        <section className="panel-inicio">

          <h2>
            Listado de Cursos
          </h2>


          <p>
            Cursos registrados actualmente
            en el sistema.
          </p>


          <div className="cursos-admin-acciones">

            <input
              type="text"
              className="buscador-cursos"
              placeholder="Buscar por código, curso, tipo o institución..."
              value={busqueda}
              onChange={
                (event) =>
                  setBusqueda(
                    event.target.value
                  )
              }
            />

          </div>


          {mensaje && (

            <div className="mensaje-error">
              {mensaje}
            </div>

          )}


          <section className="panel-resultados">

            <h3>
              Cursos registrados
            </h3>


            {cargando ? (

              <p>
                Cargando cursos...
              </p>

            ) : cursosFiltrados.length === 0 ? (

              <p>
                No se encontraron cursos.
              </p>

            ) : (

              <div className="tabla-contenedor">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Código
                      </th>

                      <th>
                        Curso
                      </th>

                      <th>
                        Tipo
                      </th>

                      <th>
                        Institución
                      </th>

                      <th>
                        Duración
                      </th>

                      <th>
                        Vigencia
                      </th>

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
                            {curso.codigo_curso ||
                              '-'}
                          </td>


                          <td>
                            {curso.nombre_curso}
                          </td>


                          <td>
                            {curso.nombre_tipo}
                          </td>


                          <td>
                            {curso.nombre_institucion}
                          </td>


                          <td>

                            {curso.duracion_horas
                              ? `${curso.duracion_horas} horas`
                              : 'No especificada'}

                          </td>


                          <td>

                            {curso.vigencia_meses
                              ? `${curso.vigencia_meses} meses`
                              : 'Indefinida'}

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

      )}


      {/* =====================================================
          REPORTE: RESUMEN DE CAPACITACIÓN
      ===================================================== */}

      {reporteSeleccionado ===
        'Resumen de Capacitación' && (

        <section className="panel-inicio">

          <h2>
            Resumen de Capacitación
          </h2>


          <p>
            Resumen general de los funcionarios,
            cursos y estados de capacitación
            registrados en el sistema.
          </p>


          {mensaje && (

            <div className="mensaje-error">
              {mensaje}
            </div>

          )}


          {cargando ? (

            <p>
              Cargando resumen...
            </p>

          ) : resumenCapacitacion ? (

            <>

              <div className="tarjetas-inicio">


                <div className="tarjeta-menu">

                  <h3>
                    Funcionarios activos
                  </h3>

                  <p>
                    {
                      resumenCapacitacion
                        .funcionarios_activos
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos registrados
                  </h3>

                  <p>
                    {
                      resumenCapacitacion
                        .cursos_registrados
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos realizados
                  </h3>

                  <p>
                    {
                      resumenCapacitacion
                        .cursos_realizados
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos vigentes
                  </h3>

                  <p>
                    {
                      resumenCapacitacion
                        .cursos_vigentes
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos vencidos
                  </h3>

                  <p>
                    {
                      resumenCapacitacion
                        .cursos_vencidos
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos en proceso
                  </h3>

                  <p>
                    {
                      resumenCapacitacion
                        .cursos_en_proceso
                    }
                  </p>

                </div>

              </div>


              <section className="panel-resultados">

                <h3>
                  Cursos realizados por curso
                </h3>


                {cursosResumen.length === 0 ? (

                  <p>
                    No existen cursos registrados.
                  </p>

                ) : (

                  <div className="tabla-contenedor">

                    <table>

                      <thead>

                        <tr>

                          <th>
                            Código
                          </th>

                          <th>
                            Curso
                          </th>

                          <th>
                            Cantidad de registros
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {cursosResumen.map(
                          (curso) => (

                            <tr
                              key={
                                curso.id_curso
                              }
                            >

                              <td>
                                {
                                  curso.codigo_curso ||
                                  '-'
                                }
                              </td>


                              <td>
                                {
                                  curso.nombre_curso
                                }
                              </td>


                              <td>
                                {
                                  curso.cantidad
                                }
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>

            </>

          ) : (

            !mensaje && (

              <p>
                No fue posible obtener
                información del resumen.
              </p>

            )

          )}

        </section>

      )}


      {/* =====================================================
          REPORTE: CURSOS POR REPARTICIÓN
      ===================================================== */}

      {reporteSeleccionado ===
        'Cursos por Repartición' && (

        <section className="panel-inicio">

          <h2>
            Cursos por Repartición
          </h2>


          <p>
            Seleccione una Zona Naval y una
            repartición para consultar el resumen
            de capacitación correspondiente.
          </p>


          <section className="panel-filtros">

            <form
              onSubmit={
                consultarCursosPorReparticion
              }
            >

              <div className="filtros">

                <div className="campo">

                  <label>
                    Zona Naval
                </label>

                <select
                  value={
                    zonaSeleccionada
                  }
                  onChange={
                    (event) =>
                      setZonaSeleccionada(
                        event.target.value
                      )
                  }
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


              <div className="campo">

                <label>
                  Repartición
                </label>

                <select
                  value={
                    reparticionSeleccionada
                  }
                  onChange={
                    (event) =>
                      setReparticionSeleccionada(
                        event.target.value
                      )
                  }
                  disabled={
                    !zonaSeleccionada
                  }
                >

                  <option value="">

                    {zonaSeleccionada
                      ? 'Seleccione una repartición'
                      : 'Seleccione primero una Zona Naval'}

                  </option>


                  {reparticiones.map(
                    (reparticion) => (

                      <option
                        key={
                          reparticion
                            .id_reparticion
                        }
                        value={
                          reparticion
                            .id_reparticion
                        }
                      >

                        {
                          reparticion
                            .nombre_reparticion
                        }

                      </option>

                    )
                  )}

                  </select>

                </div>

              </div>


              <button
                type="submit"
                className="boton-buscar"
                disabled={
                  cargando ||
                  !zonaSeleccionada ||
                  !reparticionSeleccionada
                }
              >

                {cargando
                  ? 'Consultando...'
                  : 'Consultar'}

              </button>

            </form>

          </section>


          {mensaje && (

            <div className="mensaje-error">
              {mensaje}
            </div>

          )}


          {datosReparticion &&
            resumenReparticion && (

            <>

              <section className="panel-resultados">

                <h3>
                  {
                    datosReparticion
                      .nombre_reparticion
                  }
                </h3>

                <p>
                  {
                    datosReparticion
                      .nombre_zona
                  }
                </p>

              </section>


              <div className="tarjetas-inicio">


                <div className="tarjeta-menu">

                  <h3>
                    Funcionarios con cursos
                  </h3>

                  <p>
                    {
                      resumenReparticion
                        .funcionarios_con_cursos
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos realizados
                  </h3>

                  <p>
                    {
                      resumenReparticion
                        .cursos_realizados
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos vigentes
                  </h3>

                  <p>
                    {
                      resumenReparticion
                        .cursos_vigentes
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos vencidos
                  </h3>

                  <p>
                    {
                      resumenReparticion
                        .cursos_vencidos
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos en proceso
                  </h3>

                  <p>
                    {
                      resumenReparticion
                        .cursos_en_proceso
                    }
                  </p>

                </div>

              </div>


              <section className="panel-resultados">

                <h3>
                  Cursos realizados
                </h3>


                {cursosReparticion.length ===
                0 ? (

                  <p>
                    Esta repartición no posee
                    cursos realizados registrados.
                  </p>

                ) : (

                  <div className="tabla-contenedor">

                    <table>

                      <thead>

                        <tr>

                          <th>
                            Código
                          </th>

                          <th>
                            Curso
                          </th>

                          <th>
                            Cantidad de registros
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {cursosReparticion.map(
                          (curso) => (

                            <tr
                              key={
                                curso.id_curso
                              }
                            >

                              <td>
                                {
                                  curso.codigo_curso ||
                                  '-'
                                }
                              </td>


                              <td>
                                {
                                  curso.nombre_curso
                                }
                              </td>


                              <td>
                                {
                                  curso.cantidad
                                }
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>

            </>

          )}

        </section>

      )}


      {/* =====================================================
          REPORTE: CURSOS POR ZONA NAVAL
      ===================================================== */}

      {reporteSeleccionado ===
        'Cursos por Zona Naval' && (

        <section className="panel-inicio">

          <h2>
            Cursos por Zona Naval
          </h2>


          <p>
            Seleccione una Zona Naval para consultar
            el resumen general de capacitación y los
            registros de cursos por repartición.
          </p>


          <section className="panel-filtros">

            <form
              onSubmit={
                consultarCursosPorZona
              }
            >

              <div className="filtros filtros-reporte-zona">

                <div className="campo">

                  <label>
                    Zona Naval
                  </label>

                  <select
                    value={
                      zonaReporteSeleccionada
                    }
                    onChange={
                      (event) => {

                        setZonaReporteSeleccionada(
                          event.target.value
                        );

                        setDatosZona(null);
                        setResumenZona(null);
                        setReparticionesZona([]);
                        setMensaje('');

                      }
                    }
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


              <button
                type="submit"
                className="boton-buscar"
                disabled={
                  cargando ||
                  !zonaReporteSeleccionada
                }
              >

                {cargando
                  ? 'Consultando...'
                  : 'Consultar'}

              </button>

            </form>

          </section>


          {mensaje && (

            <div className="mensaje-error">
              {mensaje}
            </div>

          )}


          {datosZona &&
            resumenZona && (

            <>

              <section className="panel-resultados">

                <h3>
                  {
                    datosZona.nombre_zona
                  }
                </h3>


                {datosZona.descripcion && (

                  <p>
                    {
                      datosZona.descripcion
                    }
                  </p>

                )}

              </section>


              <div className="tarjetas-inicio">


                <div className="tarjeta-menu">

                  <h3>
                    Funcionarios con cursos
                  </h3>

                  <p>
                    {
                      resumenZona
                        .funcionarios_con_cursos
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos realizados
                  </h3>

                  <p>
                    {
                      resumenZona
                        .cursos_realizados
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos vigentes
                  </h3>

                  <p>
                    {
                      resumenZona
                        .cursos_vigentes
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos vencidos
                  </h3>

                  <p>
                    {
                      resumenZona
                        .cursos_vencidos
                    }
                  </p>

                </div>


                <div className="tarjeta-menu">

                  <h3>
                    Cursos en proceso
                  </h3>

                  <p>
                    {
                      resumenZona
                        .cursos_en_proceso
                    }
                  </p>

                </div>

              </div>


              <section className="panel-resultados">

                <h3>
                  Cursos realizados por repartición
                </h3>


                {reparticionesZona.length ===
                0 ? (

                  <p>
                    No existen reparticiones
                    registradas para esta Zona Naval.
                  </p>

                ) : (

                  <div className="tabla-contenedor">

                    <table>

                      <thead>

                        <tr>

                          <th>
                            Repartición
                          </th>

                          <th>
                            Cantidad de registros
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {reparticionesZona.map(
                          (reparticion) => (

                            <tr
                              key={
                                reparticion
                                  .id_reparticion
                              }
                            >

                              <td>
                                {
                                  reparticion
                                    .nombre_reparticion
                                }
                              </td>


                              <td>
                                {
                                  reparticion
                                    .cantidad
                                }
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>

            </>

          )}

        </section>

      )}


      {/* =====================================================
          REPORTES PENDIENTES
      ===================================================== */}

      {reporteSeleccionado &&
        reporteSeleccionado !==
          'Listado de Cursos' &&
        reporteSeleccionado !==
          'Resumen de Capacitación' &&
        reporteSeleccionado !==
          'Cursos por Repartición' &&
        reporteSeleccionado !==
          'Cursos por Zona Naval' && (

        <section className="panel-inicio">

          <h2>
            {reporteSeleccionado}
          </h2>


          <p>
            Este reporte será implementado
            en la siguiente etapa.
          </p>


          <p className="modulo-desarrollo">
            Reporte en desarrollo.
          </p>

        </section>

      )}

    </>
  );

}


export default Reportes;
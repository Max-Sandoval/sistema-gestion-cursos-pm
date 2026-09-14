import { useEffect, useState } from 'react';


function FuncionariosAdmin({
  mostrarRegistro,
  setMostrarRegistro,
  nuevoFuncionario,
  setNuevoFuncionario,
  registrarFuncionario,
  actualizarFuncionario,
  eliminarFuncionario,
  cambiarEstadoFuncionario,
  mensajeRegistro,
  setMensajeRegistro,
  zonas,
  zonaRegistro,
  setZonaRegistro,
  reparticionesRegistro,
  setReparticionesRegistro,
  funcionariosAdmin = [],
  obtenerFuncionariosAdmin,
  onVerCursos
}) {

  const [
    modoEdicion,
    setModoEdicion
  ] = useState(false);


  const [
    funcionarioEditando,
    setFuncionarioEditando
  ] = useState(null);


  const [
    busquedaFuncionario,
    setBusquedaFuncionario
  ] = useState('');


  const [
    zonaFiltro,
    setZonaFiltro
  ] = useState('');


  const [
    reparticionFiltro,
    setReparticionFiltro
  ] = useState('');


  const [
    reparticionesFiltro,
    setReparticionesFiltro
  ] = useState([]);


  // =========================================================
  // CARGAR REPARTICIONES PARA FILTRO DE UBICACIÓN
  // =========================================================

  useEffect(() => {

    setReparticionFiltro('');


    if (!zonaFiltro) {

      setReparticionesFiltro([]);

      return;
    }


    const cargarReparticionesFiltro =
      async () => {

        try {

          const respuesta =
            await fetch(
              `http://localhost:3000/api/reparticiones?zona=${zonaFiltro}`
            );


          const datos =
            await respuesta.json();


          if (!respuesta.ok) {

            console.error(
              'Error al cargar reparticiones para filtro:',
              datos
            );


            setReparticionesFiltro([]);

            return;
          }


          setReparticionesFiltro(
            Array.isArray(datos)
              ? datos
              : []
          );

        } catch (error) {

          console.error(
            'Error al cargar reparticiones para filtro:',
            error
          );


          setReparticionesFiltro([]);

        }

      };


    cargarReparticionesFiltro();


  }, [zonaFiltro]);


  // =========================================================
  // ABRIR REGISTRO
  // =========================================================

  const abrirRegistro = () => {

    setModoEdicion(false);

    setFuncionarioEditando(null);

    setMostrarRegistro(true);

    setMensajeRegistro('');

    setZonaRegistro('');

    setReparticionesRegistro([]);


    setNuevoFuncionario({

      npi: '',

      grado: '',

      especialidad: '',

      apellidos: '',

      nombres: '',

      rut: '',

      id_reparticion: ''

    });

  };


  // =========================================================
  // ABRIR EDICIÓN
  // =========================================================

  const abrirEdicion = (funcionario) => {

    setModoEdicion(true);


    setFuncionarioEditando(
      funcionario.id_funcionario
    );


    setMensajeRegistro('');


    setZonaRegistro(
      String(
        funcionario.id_zona
      )
    );


    setNuevoFuncionario({

      npi:
        funcionario.npi || '',


      grado:
        funcionario.grado || '',


      especialidad:
        funcionario.especialidad || '',


      apellidos:
        funcionario.apellidos || '',


      nombres:
        funcionario.nombres || '',


      rut:
        funcionario.rut || '',


      id_reparticion:
        String(
          funcionario.id_reparticion
        )

    });


    setMostrarRegistro(true);

  };


  // =========================================================
  // CANCELAR FORMULARIO
  // =========================================================

  const cancelarFormulario = () => {

    setMostrarRegistro(false);

    setModoEdicion(false);

    setFuncionarioEditando(null);

    setMensajeRegistro('');

    setZonaRegistro('');

    setReparticionesRegistro([]);


    setNuevoFuncionario({

      npi: '',

      grado: '',

      especialidad: '',

      apellidos: '',

      nombres: '',

      rut: '',

      id_reparticion: ''

    });

  };


  // =========================================================
  // GUARDAR CAMBIOS
  // =========================================================

  const guardarCambios = async (e) => {

    e.preventDefault();


    setMensajeRegistro('');


    const resultado =
      await actualizarFuncionario(
        funcionarioEditando,
        nuevoFuncionario
      );


    if (!resultado.ok) {

      setMensajeRegistro(
        resultado.mensaje
      );


      return;

    }


    setMensajeRegistro(
      resultado.mensaje
    );


    setModoEdicion(false);


    setFuncionarioEditando(null);


    setNuevoFuncionario({

      npi: '',

      grado: '',

      especialidad: '',

      apellidos: '',

      nombres: '',

      rut: '',

      id_reparticion: ''

    });


    setZonaRegistro('');


    setReparticionesRegistro([]);


    setMostrarRegistro(false);

  };


  // =========================================================
  // ELIMINAR FUNCIONARIO
  // =========================================================

  const confirmarEliminacion =
    async (funcionario) => {

      const nombreCompleto =
        `${funcionario.grado} ${funcionario.nombres} ${funcionario.apellidos}`;


      const confirmar =
        window.confirm(
          `¿Está seguro de que desea eliminar al funcionario ${nombreCompleto}?`
        );


      if (!confirmar) {

        return;

      }


      const resultado =
        await eliminarFuncionario(
          funcionario.id_funcionario
        );


      if (!resultado.ok) {

        window.alert(
          resultado.mensaje
        );


        return;

      }


      window.alert(
        resultado.mensaje
      );

    };


  // =========================================================
  // DAR DE BAJA / REACTIVAR FUNCIONARIO
  // =========================================================

  const confirmarCambioEstado =
    async (funcionario) => {

      const nuevoEstado =
        !funcionario.activo;


      const nombreCompleto =
        `${funcionario.grado} ${funcionario.nombres} ${funcionario.apellidos}`;


      const accion =
        nuevoEstado
          ? 'reactivar'
          : 'dar de baja';


      const confirmar =
        window.confirm(
          `¿Está seguro de que desea ${accion} al funcionario ${nombreCompleto}?`
        );


      if (!confirmar) {

        return;

      }


      const resultado =
        await cambiarEstadoFuncionario(
          funcionario.id_funcionario,
          nuevoEstado
        );


      if (!resultado.ok) {

        window.alert(
          resultado.mensaje
        );


        return;

      }


      window.alert(
        resultado.mensaje
      );

    };


  // =========================================================
  // BUSCAR FUNCIONARIO
  // =========================================================

  const buscarFuncionario = async (e) => {

    e.preventDefault();


    await obtenerFuncionariosAdmin(
      busquedaFuncionario,
      zonaFiltro,
      reparticionFiltro
    );

  };


  // =========================================================
  // LIMPIAR BÚSQUEDA
  // =========================================================

  const limpiarBusqueda = async () => {

    setBusquedaFuncionario('');


    await obtenerFuncionariosAdmin(
      '',
      zonaFiltro,
      reparticionFiltro
    );

  };


  // =========================================================
  // FILTRAR POR UBICACIÓN
  // =========================================================

  const filtrarPorUbicacion = async (e) => {

    e.preventDefault();


    await obtenerFuncionariosAdmin(
      busquedaFuncionario,
      zonaFiltro,
      reparticionFiltro
    );

  };


  // =========================================================
  // LIMPIAR FILTRO DE UBICACIÓN
  // =========================================================

  const limpiarFiltroUbicacion =
    async () => {

      setZonaFiltro('');

      setReparticionFiltro('');

      setReparticionesFiltro([]);


      await obtenerFuncionariosAdmin(
        busquedaFuncionario,
        '',
        ''
      );

    };


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (

    <section className="panel-filtros">


      <h2>
        Gestión de Funcionarios
      </h2>


      {!mostrarRegistro ? (

        <>


          {/* =================================================
              BUSCADOR
          ================================================= */}

          <form
            className="buscador-funcionarios"
            onSubmit={buscarFuncionario}
          >


            <div
              className="campo-buscador-funcionario"
            >


              <input
                type="text"
                value={
                  busquedaFuncionario
                }
                onChange={(e) =>
                  setBusquedaFuncionario(
                    e.target.value
                  )
                }
                placeholder="Buscar por NPI, apellido o nombre..."
                autoComplete="off"
              />


            </div>


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


          {/* =================================================
              FILTRO POR UBICACIÓN
          ================================================= */}

          <form
            onSubmit={
              filtrarPorUbicacion
            }
          >


            <h3>
              Filtrar por ubicación
            </h3>


            <div className="filtros">


              {/* ZONA NAVAL */}

              <div className="campo">


                <label>
                  Zona Naval
                </label>


                <select
                  value={
                    zonaFiltro
                  }
                  onChange={(e) =>
                    setZonaFiltro(
                      e.target.value
                    )
                  }
                >


                  <option value="">
                    Todas las Zonas Navales
                  </option>


                  {zonas.map(
                    (item) => (

                      <option
                        key={
                          item.id_zona
                        }
                        value={
                          item.id_zona
                        }
                      >

                        {
                          item.nombre_zona
                        }

                      </option>

                    )
                  )}


                </select>


              </div>


              {/* REPARTICIÓN */}

              <div className="campo">


                <label>
                  Repartición
                </label>


                <select
                  value={
                    reparticionFiltro
                  }
                  onChange={(e) =>
                    setReparticionFiltro(
                      e.target.value
                    )
                  }
                  disabled={
                    !zonaFiltro
                  }
                >


                  <option value="">

                    {zonaFiltro
                      ? 'Todas las Reparticiones'
                      : 'Seleccione primero una Zona Naval'}

                  </option>


                  {reparticionesFiltro.map(
                    (item) => (

                      <option
                        key={
                          item.id_reparticion
                        }
                        value={
                          item.id_reparticion
                        }
                      >

                        {
                          item.nombre_reparticion
                        }

                      </option>

                    )
                  )}


                </select>


              </div>


            </div>


            <div className="acciones-filtro-funcionarios">

              <button
                type="submit"
                className="boton-buscar"
                disabled={!zonaFiltro}
              >
                Aplicar filtro
              </button>

              <button
                type="button"
                className="boton-limpiar"
                onClick={limpiarFiltroUbicacion}
              >
                Limpiar filtro
              </button>

            </div>


          </form>


          {/* =================================================
              REGISTRAR
          ================================================= */}

          <div className="acciones-admin">


            <button
              type="button"
              className="boton-buscar"
              onClick={
                abrirRegistro
              }
            >
              Registrar nuevo funcionario
            </button>


          </div>


          {/* =================================================
              RESULTADOS
          ================================================= */}

          <div className="panel-resultados">


            <h3>
              Funcionarios registrados
            </h3>


            {funcionariosAdmin.length === 0 ? (


              <p className="sin-resultados">


                {busquedaFuncionario ||
                zonaFiltro ||
                reparticionFiltro

                  ? 'No se encontraron funcionarios que coincidan con los criterios seleccionados.'

                  : 'No existen funcionarios registrados.'}


              </p>


            ) : (


              <div className="tabla-contenedor">


                <table>


                  <thead>


                    <tr>


                      <th>
                        NPI
                      </th>


                      <th>
                        Grado
                      </th>


                      <th>
                        Apellidos
                      </th>


                      <th>
                        Nombres
                      </th>


                      <th>
                        Especialidad
                      </th>


                      <th>
                        RUT
                      </th>


                      <th>
                        Zona Naval
                      </th>


                      <th>
                        Repartición
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


                    {funcionariosAdmin.map(
                      (funcionario) => (


                        <tr
                          key={
                            funcionario
                              .id_funcionario
                          }
                        >


                          <td>

                            {
                              funcionario.npi
                            }

                          </td>


                          <td>

                            {
                              funcionario.grado
                            }

                          </td>


                          <td>

                            {
                              funcionario.apellidos
                            }

                          </td>


                          <td>

                            {
                              funcionario.nombres
                            }

                          </td>


                          <td>

                            {
                              funcionario
                                .especialidad ||
                              '-'
                            }

                          </td>


                          <td>

                            {
                              funcionario.rut ||
                              '-'
                            }

                          </td>


                          <td>

                            {
                              funcionario
                                .nombre_zona
                            }

                          </td>


                          <td>

                            {
                              funcionario
                                .nombre_reparticion
                            }

                          </td>


                          <td>


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


                          </td>


                          <td>


                            <div
                              className="acciones-tabla"
                            >


                              <button
                                type="button"
                                className="boton-cursos-realizados"
                                onClick={() =>
                                  onVerCursos(
                                    funcionario
                                  )
                                }
                              >
                                Cursos realizados
                              </button>


                              <button
                                type="button"
                                className="boton-editar"
                                onClick={() =>
                                  abrirEdicion(
                                    funcionario
                                  )
                                }
                              >
                                Editar
                              </button>


                              {funcionario.activo ? (

                                <>


                                  <button
                                    type="button"
                                    className="boton-baja"
                                    onClick={() =>
                                      confirmarCambioEstado(
                                        funcionario
                                      )
                                    }
                                  >
                                    Dar de baja
                                  </button>


                                  <button
                                    type="button"
                                    className="boton-eliminar"
                                    onClick={() =>
                                      confirmarEliminacion(
                                        funcionario
                                      )
                                    }
                                  >
                                    Eliminar
                                  </button>


                                </>

                              ) : (


                                <button
                                  type="button"
                                  className="boton-reactivar"
                                  onClick={() =>
                                    confirmarCambioEstado(
                                      funcionario
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


      ) : (


        /* ===================================================
           FORMULARIO REGISTRO / EDICIÓN
        =================================================== */

        <form
          onSubmit={
            modoEdicion
              ? guardarCambios
              : registrarFuncionario
          }
        >


          <h3>

            {modoEdicion
              ? 'Editar funcionario'
              : 'Registrar funcionario'}

          </h3>


          <div className="filtros">


            {/* NPI */}

            <div className="campo">


              <label>
                NPI *
              </label>


              <input
                type="text"
                value={
                  nuevoFuncionario.npi
                }
                onChange={(e) =>
                  setNuevoFuncionario({

                    ...nuevoFuncionario,

                    npi:
                      e.target.value

                  })
                }
                required
              />


            </div>


            {/* GRADO */}

            <div className="campo">


              <label>
                Grado *
              </label>


              <input
                type="text"
                value={
                  nuevoFuncionario.grado
                }
                onChange={(e) =>
                  setNuevoFuncionario({

                    ...nuevoFuncionario,

                    grado:
                      e.target.value

                  })
                }
                required
              />


            </div>


            {/* ESPECIALIDAD */}

            <div className="campo">


              <label>
                Especialidad
              </label>


              <input
                type="text"
                value={
                  nuevoFuncionario
                    .especialidad
                }
                onChange={(e) =>
                  setNuevoFuncionario({

                    ...nuevoFuncionario,

                    especialidad:
                      e.target.value

                  })
                }
              />


            </div>


            {/* APELLIDOS */}

            <div className="campo">


              <label>
                Apellidos *
              </label>


              <input
                type="text"
                value={
                  nuevoFuncionario.apellidos
                }
                onChange={(e) =>
                  setNuevoFuncionario({

                    ...nuevoFuncionario,

                    apellidos:
                      e.target.value

                  })
                }
                required
              />


            </div>


            {/* NOMBRES */}

            <div className="campo">


              <label>
                Nombres *
              </label>


              <input
                type="text"
                value={
                  nuevoFuncionario.nombres
                }
                onChange={(e) =>
                  setNuevoFuncionario({

                    ...nuevoFuncionario,

                    nombres:
                      e.target.value

                  })
                }
                required
              />


            </div>


            {/* RUT */}

            <div className="campo">


              <label>
                RUT
              </label>


              <input
                type="text"
                value={
                  nuevoFuncionario.rut
                }
                onChange={(e) =>
                  setNuevoFuncionario({

                    ...nuevoFuncionario,

                    rut:
                      e.target.value

                  })
                }
              />


            </div>


            {/* ZONA NAVAL */}

            <div className="campo">


              <label>
                Zona Naval *
              </label>


              <select
                value={
                  zonaRegistro
                }
                onChange={(e) =>
                  setZonaRegistro(
                    e.target.value
                  )
                }
                required
              >


                <option value="">
                  Seleccione una Zona Naval
                </option>


                {zonas.map(
                  (item) => (

                    <option
                      key={
                        item.id_zona
                      }
                      value={
                        item.id_zona
                      }
                    >

                      {
                        item.nombre_zona
                      }

                    </option>

                  )
                )}


              </select>


            </div>


            {/* REPARTICIÓN */}

            <div className="campo">


              <label>
                Repartición *
              </label>


              <select
                value={
                  nuevoFuncionario
                    .id_reparticion
                }
                onChange={(e) =>
                  setNuevoFuncionario({

                    ...nuevoFuncionario,

                    id_reparticion:
                      e.target.value

                  })
                }
                disabled={
                  !zonaRegistro
                }
                required
              >


                <option value="">
                  Seleccione una repartición
                </option>


                {reparticionesRegistro.map(
                  (item) => (

                    <option
                      key={
                        item.id_reparticion
                      }
                      value={
                        item.id_reparticion
                      }
                    >

                      {
                        item.nombre_reparticion
                      }

                    </option>

                  )
                )}


              </select>


            </div>


          </div>


          {/* MENSAJE */}

          {mensajeRegistro && (


            <p className="mensaje-registro">

              {
                mensajeRegistro
              }

            </p>


          )}


          {/* GUARDAR */}

          <button
            type="submit"
            className="boton-buscar"
          >

            {modoEdicion
              ? 'Guardar cambios'
              : 'Guardar funcionario'}

          </button>


          {/* CANCELAR */}

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


      )}


    </section>

  );

}


export default FuncionariosAdmin;
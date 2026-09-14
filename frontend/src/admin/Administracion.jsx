import { useState } from 'react';

import FuncionariosAdmin from './FuncionariosAdmin';
import CursosRealizadosAdmin from './CursosRealizadosAdmin';
import CursosAdmin from './CursosAdmin';
import ZonasNavalesAdmin from './ZonasNavalesAdmin';
import ReparticionesAdmin from './ReparticionesAdmin';
import InstitucionesAdmin from './InstitucionesAdmin';
import TiposCursosAdmin from './TiposCursosAdmin';
import EstadosCursosAdmin from './EstadosCursosAdmin';
import UsuariosAdmin from './UsuariosAdmin';


function Administracion({
  irA,
  seccionAdmin,
  setSeccionAdmin,
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
  funcionariosAdmin,
  obtenerFuncionariosAdmin
}) {

  const [
    funcionarioSeleccionado,
    setFuncionarioSeleccionado
  ] = useState(null);


  // =========================================================
  // VER CURSOS REALIZADOS
  // =========================================================

  const verCursosFuncionario = (funcionario) => {

    setFuncionarioSeleccionado(
      funcionario
    );

    setSeccionAdmin(
      'Cursos realizados'
    );

  };


  // =========================================================
  // VOLVER
  // =========================================================

  const volver = () => {

    if (
      seccionAdmin === 'Cursos realizados'
    ) {

      setFuncionarioSeleccionado(
        null
      );

      setSeccionAdmin(
        'Funcionarios'
      );

      return;

    }


    if (seccionAdmin) {

      setSeccionAdmin('');

      setMostrarRegistro(false);

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

      return;

    }


    irA('inicio');

  };


  // =========================================================
  // INTERFAZ
  // =========================================================

  return (
    <>

      <div className="barra-navegacion-interna">

        <span>

          Inicio &gt; Administración

          {seccionAdmin &&
            ` > ${seccionAdmin}`}

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
          MENÚ PRINCIPAL DE ADMINISTRACIÓN
      ===================================================== */}

      {!seccionAdmin && (

        <section className="panel-inicio">

          <h2>
            Administración
          </h2>

          <p>
            Seleccione el elemento que desea administrar.
          </p>


          <div className="tarjetas-inicio">


            {/* FUNCIONARIOS */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Funcionarios'
                )
              }
            >

              <h3>
                Funcionarios
              </h3>

              <p>
                Registrar y administrar funcionarios.
              </p>

            </button>


            {/* CURSOS */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Cursos'
                )
              }
            >

              <h3>
                Cursos
              </h3>

              <p>
                Registrar y administrar cursos.
              </p>

            </button>


            {/* ZONAS NAVALES */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Zonas Navales'
                )
              }
            >

              <h3>
                Zonas Navales
              </h3>

              <p>
                Administrar las Zonas Navales.
              </p>

            </button>


            {/* REPARTICIONES */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Reparticiones'
                )
              }
            >

              <h3>
                Reparticiones
              </h3>

              <p>
                Registrar y administrar reparticiones.
              </p>

            </button>


            {/* INSTITUCIONES */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Instituciones'
                )
              }
            >

              <h3>
                Instituciones
              </h3>

              <p>
                Administrar instituciones que imparten cursos.
              </p>

            </button>


            {/* TIPOS DE CURSOS */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Tipos de Cursos'
                )
              }
            >

              <h3>
                Tipos de Cursos
              </h3>

              <p>
                Administrar los tipos de cursos.
              </p>

            </button>


            {/* ESTADOS DE CURSOS */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Estados de Cursos'
                )
              }
            >

              <h3>
                Estados de Cursos
              </h3>

              <p>
                Administrar los estados de los cursos.
              </p>

            </button>


            {/* USUARIOS */}

            <button
              type="button"
              className="tarjeta-menu"
              onClick={() =>
                setSeccionAdmin(
                  'Usuarios'
                )
              }
            >

              <h3>
                Usuarios
              </h3>

              <p>
                Registrar y administrar usuarios del sistema.
              </p>

            </button>


          </div>

        </section>

      )}


      {/* =====================================================
          GESTIÓN DE FUNCIONARIOS
      ===================================================== */}

      {seccionAdmin === 'Funcionarios' && (

        <FuncionariosAdmin

          mostrarRegistro={
            mostrarRegistro
          }

          setMostrarRegistro={
            setMostrarRegistro
          }


          nuevoFuncionario={
            nuevoFuncionario
          }

          setNuevoFuncionario={
            setNuevoFuncionario
          }


          registrarFuncionario={
            registrarFuncionario
          }

          actualizarFuncionario={
            actualizarFuncionario
          }

          eliminarFuncionario={
            eliminarFuncionario
          }

          cambiarEstadoFuncionario={
            cambiarEstadoFuncionario
          }


          mensajeRegistro={
            mensajeRegistro
          }

          setMensajeRegistro={
            setMensajeRegistro
          }


          zonas={
            zonas
          }


          zonaRegistro={
            zonaRegistro
          }

          setZonaRegistro={
            setZonaRegistro
          }


          reparticionesRegistro={
            reparticionesRegistro
          }

          setReparticionesRegistro={
            setReparticionesRegistro
          }


          funcionariosAdmin={
            funcionariosAdmin
          }


          obtenerFuncionariosAdmin={
            obtenerFuncionariosAdmin
          }


          onVerCursos={
            verCursosFuncionario
          }

        />

      )}


      {/* =====================================================
          CURSOS REALIZADOS DEL FUNCIONARIO
      ===================================================== */}

      {seccionAdmin ===
        'Cursos realizados' &&
        funcionarioSeleccionado && (

          <CursosRealizadosAdmin
            funcionario={
              funcionarioSeleccionado
            }
          />

        )}


      {/* =====================================================
          ADMINISTRACIÓN DE CURSOS
      ===================================================== */}

      {seccionAdmin === 'Cursos' && (

        <CursosAdmin />

      )}


      {/* =====================================================
          ADMINISTRACIÓN DE ZONAS NAVALES
      ===================================================== */}

      {seccionAdmin === 'Zonas Navales' && (

        <ZonasNavalesAdmin />

      )}


      {/* =====================================================
          ADMINISTRACIÓN DE REPARTICIONES
      ===================================================== */}

      {seccionAdmin === 'Reparticiones' && (

        <ReparticionesAdmin />

      )}


      {/* =====================================================
          ADMINISTRACIÓN DE INSTITUCIONES
      ===================================================== */}

      {seccionAdmin === 'Instituciones' && (

        <InstitucionesAdmin />

      )}


      {/* =====================================================
          ADMINISTRACIÓN DE TIPOS DE CURSOS
      ===================================================== */}

      {seccionAdmin === 'Tipos de Cursos' && (

        <TiposCursosAdmin />

      )}


      {/* =====================================================
          ADMINISTRACIÓN DE ESTADOS DE CURSOS
      ===================================================== */}

      {seccionAdmin === 'Estados de Cursos' && (

        <EstadosCursosAdmin />

      )}


      {/* =====================================================
          ADMINISTRACIÓN DE USUARIOS
      ===================================================== */}

      {seccionAdmin === 'Usuarios' && (

        <UsuariosAdmin />

      )}


      {/* =====================================================
          OTROS MÓDULOS
      ===================================================== */}

      {seccionAdmin &&
        seccionAdmin !==
          'Funcionarios' &&
        seccionAdmin !==
          'Cursos realizados' &&
        seccionAdmin !==
          'Cursos' &&
        seccionAdmin !==
          'Zonas Navales' &&
        seccionAdmin !==
          'Reparticiones' &&
        seccionAdmin !==
          'Instituciones' &&
        seccionAdmin !==
          'Tipos de Cursos' &&
        seccionAdmin !==
          'Estados de Cursos' &&
        seccionAdmin !==
          'Usuarios' && (

          <section className="panel-inicio">

            <h2>
              Gestión de {seccionAdmin}
            </h2>

            <p>
              Este módulo será implementado en las siguientes
              etapas del desarrollo.
            </p>

            <p className="modulo-desarrollo">
              Módulo en desarrollo.
            </p>

          </section>

        )}

    </>
  );

}


export default Administracion;
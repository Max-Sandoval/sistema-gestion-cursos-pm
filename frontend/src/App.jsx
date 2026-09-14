import { useEffect, useState } from 'react';
import './App.css';

import Login from './components/Login';
import Header from './components/Header';
import Inicio from './components/Inicio';
import Consultas from './components/Consultas';
import Reportes from './components/Reportes';
import MiPerfil from './components/MiPerfil';

import Administracion from './admin/Administracion';


function App() {

  // =========================================================
  // SESIÓN
  // =========================================================

  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      try {
        return JSON.parse(usuarioGuardado);
      } catch {
        localStorage.removeItem('usuario');
      }
    }

    return null;
  });

  const [vistaActual, setVistaActual] = useState('inicio');


  // =========================================================
  // LOGIN
  // =========================================================

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeLogin, setMensajeLogin] = useState('');


  // =========================================================
  // DATOS GENERALES
  // =========================================================

  const [zonas, setZonas] = useState([]);
  const [reparticiones, setReparticiones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [resultados, setResultados] = useState([]);


  // =========================================================
  // CONSULTAS
  // =========================================================

  const [zona, setZona] = useState('');
  const [reparticion, setReparticion] = useState('');
  const [curso, setCurso] = useState('');
  const [estado, setEstado] = useState('');


  // =========================================================
  // ADMINISTRACIÓN
  // =========================================================

  const [seccionAdmin, setSeccionAdmin] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const [zonaRegistro, setZonaRegistro] = useState('');
  const [reparticionesRegistro, setReparticionesRegistro] = useState([]);

  const [funcionariosAdmin, setFuncionariosAdmin] = useState([]);

  const [nuevoFuncionario, setNuevoFuncionario] = useState({
    npi: '',
    grado: '',
    especialidad: '',
    apellidos: '',
    nombres: '',
    rut: '',
    id_reparticion: ''
  });

  const [mensajeRegistro, setMensajeRegistro] = useState('');


  // =========================================================
  // CARGAR DATOS GENERALES
  // =========================================================

  useEffect(() => {

    if (!usuario) return;

    fetch('http://localhost:3000/api/zonas')
      .then((res) => res.json())
      .then((data) => setZonas(data))
      .catch((error) =>
        console.error('Error al cargar zonas:', error)
      );

    fetch('http://localhost:3000/api/cursos')
      .then((res) => res.json())
      .then((data) => setCursos(data))
      .catch((error) =>
        console.error('Error al cargar cursos:', error)
      );

    fetch('http://localhost:3000/api/estados')
      .then((res) => res.json())
      .then((data) => setEstados(data))
      .catch((error) =>
        console.error('Error al cargar estados:', error)
      );

  }, [usuario]);


  // =========================================================
  // REPARTICIONES DE CONSULTAS
  // =========================================================

  useEffect(() => {

    setReparticion('');
    setReparticiones([]);

    if (!usuario) return;

    let url = 'http://localhost:3000/api/reparticiones';

    if (zona) {
      url += `?zona=${zona}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setReparticiones(data))
      .catch((error) =>
        console.error(
          'Error al cargar reparticiones:',
          error
        )
      );

  }, [zona, usuario]);


  // =========================================================
  // REPARTICIONES PARA REGISTRAR FUNCIONARIO
  // =========================================================

  useEffect(() => {

    setReparticionesRegistro([]);

    setNuevoFuncionario((prev) => ({
      ...prev,
      id_reparticion: ''
    }));

    if (!zonaRegistro) return;

    fetch(
      `http://localhost:3000/api/reparticiones?zona=${zonaRegistro}`
    )
      .then((res) => res.json())
      .then((data) =>
        setReparticionesRegistro(data)
      )
      .catch((error) =>
        console.error(
          'Error al cargar reparticiones para registro:',
          error
        )
      );

  }, [zonaRegistro]);


  // =========================================================
  // OBTENER FUNCIONARIOS PARA ADMINISTRACIÓN
  // BUSCAR POR NPI, APELLIDO O NOMBRE
  // FILTRAR POR ZONA NAVAL Y REPARTICIÓN
  // =========================================================

  const obtenerFuncionariosAdmin = async (
    textoBusqueda = '',
    zonaFiltro = '',
    reparticionFiltro = ''
  ) => {

    try {

      const token = localStorage.getItem('token');

      if (!token) {
        return;
      }


      const parametros =
        new URLSearchParams();


      const textoLimpio =
        textoBusqueda.trim();


      if (textoLimpio) {

        parametros.append(
          'buscar',
          textoLimpio
        );
      }


      if (zonaFiltro) {

        parametros.append(
          'zona',
          zonaFiltro
        );
      }


      if (reparticionFiltro) {

        parametros.append(
          'reparticion',
          reparticionFiltro
        );
      }


      let url =
        'http://localhost:3000/api/funcionarios';


      const queryString =
        parametros.toString();


      if (queryString) {

        url += `?${queryString}`;
      }


      console.log(
        'URL funcionarios:',
        url
      );


      const respuesta = await fetch(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await respuesta.json();


      if (!respuesta.ok) {

        console.error(
          'Error al cargar funcionarios:',
          data
        );

        return;
      }


      setFuncionariosAdmin(data);

    } catch (error) {

      console.error(
        'Error al cargar funcionarios:',
        error
      );
    }
  };


  // =========================================================
  // CARGAR FUNCIONARIOS AL ENTRAR A ADMINISTRACIÓN
  // =========================================================

  useEffect(() => {

    if (
      usuario &&
      usuario.nombre_rol === 'Administrador' &&
      vistaActual === 'administracion'
    ) {
      obtenerFuncionariosAdmin();
    }

  }, [usuario, vistaActual]);


  // =========================================================
  // INICIAR SESIÓN
  // =========================================================

  const iniciarSesion = async (e) => {

    e.preventDefault();

    setMensajeLogin('');

    try {

      const respuesta = await fetch(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            nombre_usuario: nombreUsuario,
            password
          })
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {

        setMensajeLogin(
          data.mensaje ||
          'No fue posible iniciar sesión'
        );

        return;
      }

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'usuario',
        JSON.stringify(data.usuario)
      );

      setUsuario(data.usuario);

      setVistaActual('inicio');

      setNombreUsuario('');
      setPassword('');
      setMensajeLogin('');

    } catch (error) {

      console.error(
        'Error de conexión:',
        error
      );

      setMensajeLogin(
        'No fue posible conectarse con el servidor'
      );
    }
  };


  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  const cerrarSesion = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    setUsuario(null);

    setVistaActual('inicio');

    setResultados([]);

    setZona('');
    setReparticion('');
    setCurso('');
    setEstado('');

    setSeccionAdmin('');
    setMostrarRegistro(false);

    setZonaRegistro('');
    setReparticionesRegistro([]);

    setFuncionariosAdmin([]);

    setMensajeRegistro('');

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
  // NAVEGACIÓN
  // =========================================================

  const irA = (vista) => {

    setVistaActual(vista);

    if (vista !== 'administracion') {

      setSeccionAdmin('');
      setMostrarRegistro(false);

    }

    window.scrollTo(0, 0);
  };


  // =========================================================
  // BUSCAR FUNCIONARIOS
  // =========================================================

  const buscarFuncionarios = async () => {

    const parametros = new URLSearchParams();

    if (zona) {
      parametros.append('zona', zona);
    }

    if (reparticion) {
      parametros.append(
        'reparticion',
        reparticion
      );
    }

    if (curso) {
      parametros.append('curso', curso);
    }

    if (estado) {
      parametros.append('estado', estado);
    }

    let url =
      'http://localhost:3000/api/funcionarios/buscar';

    const queryString = parametros.toString();

    if (queryString) {
      url += `?${queryString}`;
    }

    try {

      const respuesta = await fetch(url);

      const data = await respuesta.json();

      if (!respuesta.ok) {

        alert(
          data.mensaje ||
          'No fue posible realizar la búsqueda.'
        );

        return;
      }

      setResultados(data);

    } catch (error) {

      console.error(
        'Error al realizar la búsqueda:',
        error
      );

      alert(
        'No fue posible realizar la búsqueda.'
      );
    }
  };


  // =========================================================
  // REGISTRAR FUNCIONARIO
  // =========================================================

  const registrarFuncionario = async (e) => {

    e.preventDefault();

    setMensajeRegistro('');

    const token =
      localStorage.getItem('token');

    try {

      const respuesta = await fetch(
        'http://localhost:3000/api/funcionarios',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(
            nuevoFuncionario
          )
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {

        setMensajeRegistro(
          data.mensaje ||
          'No fue posible registrar el funcionario'
        );

        return;
      }

      setMensajeRegistro(
        'Funcionario registrado correctamente'
      );

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

      await obtenerFuncionariosAdmin();

    } catch (error) {

      console.error(
        'Error al registrar funcionario:',
        error
      );

      setMensajeRegistro(
        'No fue posible conectarse con el servidor'
      );
    }
  };


  // =========================================================
  // ACTUALIZAR FUNCIONARIO
  // =========================================================

  const actualizarFuncionario = async (
    idFuncionario,
    datosFuncionario
  ) => {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return {
        ok: false,
        mensaje: 'No existe una sesión válida'
      };
    }

    try {

      const respuesta = await fetch(
        `http://localhost:3000/api/funcionarios/${idFuncionario}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(
            datosFuncionario
          )
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {

        return {
          ok: false,
          mensaje:
            data.mensaje ||
            'No fue posible actualizar el funcionario'
        };
      }

      await obtenerFuncionariosAdmin();

      return {
        ok: true,
        mensaje:
          data.mensaje ||
          'Funcionario actualizado correctamente'
      };

    } catch (error) {

      console.error(
        'Error al actualizar funcionario:',
        error
      );

      return {
        ok: false,
        mensaje:
          'No fue posible conectarse con el servidor'
      };
    }
  };


  // =========================================================
  // ELIMINAR FUNCIONARIO
  // =========================================================

  const eliminarFuncionario = async (
    idFuncionario
  ) => {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return {
        ok: false,
        mensaje: 'No existe una sesión válida'
      };
    }

    try {

      const respuesta = await fetch(
        `http://localhost:3000/api/funcionarios/${idFuncionario}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {

        return {
          ok: false,
          mensaje:
            data.mensaje ||
            'No fue posible eliminar el funcionario'
        };
      }

      await obtenerFuncionariosAdmin();

      return {
        ok: true,
        mensaje:
          data.mensaje ||
          'Funcionario eliminado correctamente'
      };

    } catch (error) {

      console.error(
        'Error al eliminar funcionario:',
        error
      );

      return {
        ok: false,
        mensaje:
          'No fue posible conectarse con el servidor'
      };
    }
  };


  // =========================================================
  // CAMBIAR ESTADO FUNCIONARIO
  // DAR DE BAJA / REACTIVAR
  // =========================================================

  const cambiarEstadoFuncionario = async (
    idFuncionario,
    activo
  ) => {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return {
        ok: false,
        mensaje: 'No existe una sesión válida'
      };
    }

    try {

      const respuesta = await fetch(
        `http://localhost:3000/api/funcionarios/${idFuncionario}/estado`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            activo
          })
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {

        return {
          ok: false,
          mensaje:
            data.mensaje ||
            'No fue posible cambiar el estado del funcionario'
        };
      }

      await obtenerFuncionariosAdmin();

      return {
        ok: true,
        mensaje:
          data.mensaje ||
          'Estado del funcionario actualizado correctamente'
      };

    } catch (error) {

      console.error(
        'Error al cambiar estado del funcionario:',
        error
      );

      return {
        ok: false,
        mensaje:
          'No fue posible conectarse con el servidor'
      };
    }
  };


  // =========================================================
  // LOGIN
  // =========================================================

  if (!usuario) {

    return (
      <Login
        nombreUsuario={nombreUsuario}
        setNombreUsuario={setNombreUsuario}
        password={password}
        setPassword={setPassword}
        mensajeLogin={mensajeLogin}
        iniciarSesion={iniciarSesion}
      />
    );
  }


  // =========================================================
  // APLICACIÓN
  // =========================================================

  return (

    <div className="app">

      <Header
        usuario={usuario}
        vistaActual={vistaActual}
        irA={irA}
        cerrarSesion={cerrarSesion}
      />

      <main className="contenido">

        {vistaActual === 'inicio' && (

          <Inicio
            usuario={usuario}
            irA={irA}
          />

        )}


        {vistaActual === 'consultas' && (

          <Consultas
            irA={irA}

            zonas={zonas}
            reparticiones={reparticiones}
            cursos={cursos}
            estados={estados}

            resultados={resultados}

            zona={zona}
            setZona={setZona}

            reparticion={reparticion}
            setReparticion={setReparticion}

            curso={curso}
            setCurso={setCurso}

            estado={estado}
            setEstado={setEstado}

            buscarFuncionarios={
              buscarFuncionarios
            }
          />

        )}


        {vistaActual === 'reportes' && (

          <Reportes
            irA={irA}
          />

        )}


        {vistaActual === 'administracion' &&
          usuario.nombre_rol === 'Administrador' && (

            <Administracion

              irA={irA}

              seccionAdmin={seccionAdmin}
              setSeccionAdmin={setSeccionAdmin}

              mostrarRegistro={mostrarRegistro}
              setMostrarRegistro={setMostrarRegistro}

              nuevoFuncionario={nuevoFuncionario}
              setNuevoFuncionario={setNuevoFuncionario}

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

              mensajeRegistro={mensajeRegistro}
              setMensajeRegistro={
                setMensajeRegistro
              }

              zonas={zonas}

              zonaRegistro={zonaRegistro}
              setZonaRegistro={setZonaRegistro}

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

            />

          )}


        {vistaActual === 'perfil' && (

          <MiPerfil
            usuario={usuario}
            irA={irA}
          />

        )}

      </main>

    </div>
  );
}

export default App;
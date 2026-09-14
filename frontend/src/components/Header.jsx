import placaPoliciaMaritima from '../assets/foto-placa-policia-maritima.png';

function Header({
  usuario,
  vistaActual,
  irA,
  cerrarSesion
}) {
  return (
    <header className="encabezado">

      <div className="placa-header">
        <img
          src={placaPoliciaMaritima}
          alt="Policía Marítima"
        />
      </div>

      <button
        type="button"
        onClick={cerrarSesion}
        className="boton-salir boton-salir-superior"
      >
        Cerrar sesión
      </button>

      <h1>
        Sistema de Gestión de Cursos del Personal de Policía Marítima
      </h1>

      <nav className="menu-principal">

        <button
          type="button"
          onClick={() => irA('inicio')}
          className={
            vistaActual === 'inicio'
              ? 'activo'
              : ''
          }
        >
          Inicio
        </button>

        <button
          type="button"
          onClick={() => irA('consultas')}
          className={
            vistaActual === 'consultas'
              ? 'activo'
              : ''
          }
        >
          Consultas
        </button>

        <button
          type="button"
          onClick={() => irA('reportes')}
          className={
            vistaActual === 'reportes'
              ? 'activo'
              : ''
          }
        >
          Reportes
        </button>

        {usuario.nombre_rol === 'Administrador' && (
          <button
            type="button"
            onClick={() => irA('administracion')}
            className={
              vistaActual === 'administracion'
                ? 'activo'
                : ''
            }
          >
            Administración
          </button>
        )}

        <button
          type="button"
          onClick={() => irA('perfil')}
          className={
            vistaActual === 'perfil'
              ? 'activo'
              : ''
          }
        >
          Mi Perfil
        </button>

      </nav>

      <div className="usuario-barra">

        <span>
          Usuario:{' '}
          <strong>{usuario.nombre_usuario}</strong>
        </span>

        <span>
          Perfil:{' '}
          <strong>{usuario.nombre_rol}</strong>
        </span>

      </div>

    </header>
  );
}

export default Header;
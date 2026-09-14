import logoPoliciaMaritima from '../assets/logo-policiamaritima.png';

function Login({
  nombreUsuario,
  setNombreUsuario,
  password,
  setPassword,
  mensajeLogin,
  iniciarSesion
}) {
  return (
    <div className="login-pagina">
      <div className="login-contenedor">

        <div className="logo-login">
          <img
            src={logoPoliciaMaritima}
            alt="Policía Marítima"
          />
        </div>

        <h1>
          Sistema de Gestión de Cursos del Personal de Policía Marítima
        </h1>

        <h2>Inicio de sesión</h2>

        <form onSubmit={iniciarSesion}>

          <div className="campo-login">
            <label>Nombre de usuario</label>

            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>

          <div className="campo-login">
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mensajeLogin && (
            <p className="mensaje-error">
              {mensajeLogin}
            </p>
          )}

          <button
            type="submit"
            className="boton-login"
          >
            Ingresar
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
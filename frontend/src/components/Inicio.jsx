function Inicio({ usuario, irA }) {
  return (
    <section className="panel-inicio">

      <h2>Inicio</h2>

      <p className="texto-bienvenida">
        Bienvenido al Sistema de Gestión de Cursos del
        Personal de Policía Marítima.
      </p>

      <p>
        Seleccione una de las opciones disponibles para
        acceder a las funciones del sistema.
      </p>

      <div className="tarjetas-inicio">

        <button
          className="tarjeta-menu"
          onClick={() => irA('consultas')}
        >
          <h3>Consultas</h3>

          <p>
            Consultar funcionarios, cursos y antecedentes
            de capacitación.
          </p>
        </button>

        <button
          className="tarjeta-menu"
          onClick={() => irA('reportes')}
        >
          <h3>Reportes</h3>

          <p>
            Acceder a los diferentes listados y reportes
            disponibles.
          </p>
        </button>

        {usuario.nombre_rol === 'Administrador' && (
          <button
            className="tarjeta-menu"
            onClick={() => irA('administracion')}
          >
            <h3>Administración</h3>

            <p>
              Administrar funcionarios, cursos y datos
              generales del sistema.
            </p>
          </button>
        )}

        <button
          className="tarjeta-menu"
          onClick={() => irA('perfil')}
        >
          <h3>Mi Perfil</h3>

          <p>
            Consultar la información de la cuenta y
            cambiar la contraseña.
          </p>
        </button>

      </div>

    </section>
  );
}

export default Inicio;
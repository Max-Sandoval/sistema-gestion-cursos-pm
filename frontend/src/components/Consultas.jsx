import EstadoCurso from './EstadoCurso';

function Consultas({
  irA,
  zonas,
  reparticiones,
  cursos,
  estados,
  resultados,
  zona,
  setZona,
  reparticion,
  setReparticion,
  curso,
  setCurso,
  estado,
  setEstado,
  buscarFuncionarios
}) {
  return (
    <>
      <div className="barra-navegacion-interna">
        <span>
          Inicio &gt; Consultas
        </span>

        <button
          onClick={() => irA('inicio')}
          className="boton-volver"
        >
          ← Volver al inicio
        </button>
      </div>

      <section className="panel-filtros">
        <h2>Consulta de funcionarios y cursos</h2>

        <div className="filtros">
          <div className="campo">
            <label>Zona Naval</label>

            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
            >
              <option value="">
                Todas las Zonas Navales
              </option>

              {zonas.map((item) => (
                <option
                  key={item.id_zona}
                  value={item.id_zona}
                >
                  {item.nombre_zona}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Repartición</label>

            <select
              value={reparticion}
              onChange={(e) => setReparticion(e.target.value)}
            >
              <option value="">
                Todas las Reparticiones
              </option>

              {reparticiones.map((item) => (
                <option
                  key={item.id_reparticion}
                  value={item.id_reparticion}
                >
                  {item.nombre_reparticion}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Curso</label>

            <select
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
            >
              <option value="">
                Todos los Cursos
              </option>

              {cursos.map((item) => (
                <option
                  key={item.id_curso}
                  value={item.id_curso}
                >
                  {item.nombre_curso}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Estado</label>

            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">
                Todos los Estados
              </option>

              {estados.map((item) => (
                <option
                  key={item.id_estado}
                  value={item.id_estado}
                >
                  {item.nombre_estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="boton-buscar"
          onClick={buscarFuncionarios}
        >
          Buscar
        </button>
      </section>

      <section className="panel-resultados">
        <h2>Resultados</h2>

        {resultados.length === 0 ? (
          <p className="sin-resultados">
            No existen resultados para mostrar o todavía no se ha realizado una búsqueda.
          </p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>NPI</th>
                  <th>Grado</th>
                  <th>Apellidos</th>
                  <th>Nombres</th>
                  <th>Especialidad</th>
                  <th>Zona Naval</th>
                  <th>Repartición</th>
                  <th>Curso</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {resultados.map((funcionario) => (
                  <tr key={funcionario.id_curso_realizado}>
                    <td>{funcionario.npi}</td>
                    <td>{funcionario.grado}</td>
                    <td>{funcionario.apellidos}</td>
                    <td>{funcionario.nombres}</td>
                    <td>{funcionario.especialidad || '-'}</td>
                    <td>{funcionario.nombre_zona}</td>
                    <td>{funcionario.nombre_reparticion}</td>
                    <td>{funcionario.nombre_curso}</td>

                    <td>
                      <EstadoCurso funcionario={funcionario} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default Consultas;
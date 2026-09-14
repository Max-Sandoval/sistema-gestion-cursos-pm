function EstadoCurso({ funcionario }) {

  if (!funcionario) {
    return null;
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return '';

    const fechaTexto = String(fecha).substring(0, 10);
    const fechaObj = new Date(`${fechaTexto}T00:00:00`);

    return fechaObj.toLocaleDateString('es-CL');
  };

  const estadoCurso = funcionario.nombre_estado;
  const fechaVencimiento = funcionario.fecha_vencimiento;

  if (estadoCurso === 'Vigente') {
    return (
      <div className="estado-curso estado-vigente">
        <strong>Vigente</strong>

        <span>
          {fechaVencimiento
            ? `Hasta: ${formatearFecha(fechaVencimiento)}`
            : 'Vigencia indefinida'}
        </span>
      </div>
    );
  }

  if (estadoCurso === 'Vencido') {
    return (
      <div className="estado-curso estado-vencido">
        <strong>Vencido</strong>

        {fechaVencimiento ? (
          <span>
            Venció: {formatearFecha(fechaVencimiento)}
          </span>
        ) : (
          <span>
            Fecha de vencimiento no registrada
          </span>
        )}
      </div>
    );
  }

  if (estadoCurso === 'En proceso') {
    return (
      <div className="estado-curso estado-proceso">
        <strong>En proceso</strong>
      </div>
    );
  }

  return (
    <div className="estado-curso">
      <strong>{estadoCurso || 'Sin estado'}</strong>
    </div>
  );
}

export default EstadoCurso;
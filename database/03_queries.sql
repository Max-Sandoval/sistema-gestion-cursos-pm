-- Consulta de reparticiones por Zona Naval
SELECT
    r.nombre_reparticion,
    r.tipo_reparticion
FROM reparticiones r
WHERE r.id_zona = 4
ORDER BY r.nombre_reparticion;


-- Consulta principal por Zona Naval, Repartición, Curso y Estado
SELECT
    f.npi,
    f.grado,
    f.apellidos,
    f.nombres,
    f.especialidad,
    r.nombre_reparticion,
    c.nombre_curso,
    e.nombre_estado
FROM funcionarios f
JOIN reparticiones r
    ON f.id_reparticion = r.id_reparticion
JOIN zonas_navales z
    ON r.id_zona = z.id_zona
JOIN cursos_realizados cr
    ON f.id_funcionario = cr.id_funcionario
JOIN cursos c
    ON cr.id_curso = c.id_curso
JOIN estado_curso e
    ON cr.id_estado = e.id_estado
WHERE z.nombre_zona = 'Cuarta Zona Naval'
  AND r.nombre_reparticion = 'Gobernación Marítima de Iquique'
  AND c.nombre_curso = 'Inspector de Naves'
  AND e.nombre_estado = 'Vigente'
ORDER BY f.apellidos, f.nombres;


-- Consulta de todos los cursos agrupados por funcionario
SELECT
    f.npi,
    f.grado,
    f.apellidos,
    f.nombres,
    STRING_AGG(
        c.nombre_curso || ' (' || e.nombre_estado || ')',
        ', '
        ORDER BY c.nombre_curso
    ) AS cursos
FROM funcionarios f
JOIN cursos_realizados cr
    ON f.id_funcionario = cr.id_funcionario
JOIN cursos c
    ON cr.id_curso = c.id_curso
JOIN estado_curso e
    ON cr.id_estado = e.id_estado
GROUP BY
    f.id_funcionario,
    f.npi,
    f.grado,
    f.apellidos,
    f.nombres
ORDER BY f.npi;
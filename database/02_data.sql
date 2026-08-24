INSERT INTO zonas_navales (nombre_zona, descripcion)
VALUES
('Primera Zona Naval', 'Zona Naval de prueba para el proyecto'),
('Segunda Zona Naval', 'Zona Naval de prueba para el proyecto'),
('Tercera Zona Naval', 'Zona Naval de prueba para el proyecto'),
('Cuarta Zona Naval', 'Zona Naval de prueba para el proyecto'),
('Quinta Zona Naval', 'Zona Naval de prueba para el proyecto');


INSERT INTO reparticiones (nombre_reparticion, tipo_reparticion, id_zona)
VALUES
-- Primera Zona Naval
('Gobernación Marítima de Valparaiso', 'Gobernación Marítima', 1),
('Capitanía de Puerto de Valparaiso', 'Capitanía de Puerto', 1),

-- Segunda Zona Naval
('Gobernación Marítima de Talcahuano', 'Gobernación Marítima', 2),
('Capitanía de Puerto de Talcahuano', 'Capitanía de Puerto', 2),

-- Tercera Zona Naval
('Gobernación Marítima de Punta Arenas', 'Gobernación Marítima', 3),
('Capitanía de Puerto de Punta Arenas', 'Capitanía de Puerto', 3),

-- Cuarta Zona Naval
('Gobernación Marítima de Iquique', 'Gobernación Marítima', 4),
('Capitanía de Puerto de Iquique', 'Capitanía de Puerto', 4),
('Capitanía de Puerto de Patache', 'Capitanía de Puerto', 4),
('LSG Iquique', 'Unidad Marítima', 4),

-- Quinta Zona Naval
('Gobernación Marítima de Puerto Montt', 'Gobernación Marítima', 5),
('Capitanía de Puerto de Puerto Montt', 'Capitanía de Puerto', 5);


INSERT INTO tipo_curso (nombre_tipo, descripcion)
VALUES
('Institucional', 'Curso desarrollado en el ámbito institucional'),
('Externo', 'Curso realizado en una institución externa'),
('Especialización', 'Curso orientado a una función o especialidad específica');


INSERT INTO instituciones (nombre_institucion, tipo_institucion)
VALUES
('Centro de Capacitación Institucional', 'Institucional'),
('Centro de Formación Marítima', 'Institucional'),
('Institución Externa de Capacitación', 'Externa');


INSERT INTO estado_curso (nombre_estado, descripcion)
VALUES
('Vigente', 'Curso o habilitación actualmente vigente'),
('Vencido', 'Curso o habilitación cuya vigencia ha finalizado'),
('En proceso', 'Curso que actualmente se encuentra en desarrollo');


INSERT INTO cursos
(nombre_curso, codigo_curso, duracion_horas, vigencia_meses, id_tipo_curso, id_institucion)
VALUES
('Inspector de Naves', 'CUR-001', 40, 24, 3, 1),
('Fiscalización Marítima', 'CUR-002', 32, 24, 3, 1),
('Seguridad Marítima', 'CUR-003', 24, 12, 1, 2),
('Control de Fronteras Marítimas', 'CUR-004', 30, 24, 1, 2),
('Primeros Auxilios', 'CUR-005', 16, 12, 2, 3);


INSERT INTO funcionarios
(npi, grado, especialidad, apellidos, nombres, rut, id_reparticion)
VALUES
('100001', 'Sargento 1°', 'L.', 'Pérez Soto', 'Juan Carlos', '11.111.111-1', 7),
('100002', 'Cabo 1°', 'L. (Com.)', 'Rojas Silva', 'Carlos Eduardo', '13.333.333-3', 7),
('100003', 'Cabo 2°', 'L.', 'Rojas Silva', 'Carlos Eduardo', '13.333.333-3', 7),

('100004', 'Sargento 2°', 'L (Com-Op.GRI.)', 'Oconer López', 'Brian Moises', '14.444.444-4', 8),
('100005', 'Cabo 1°', 'L. (Nv.)', 'Torres Vargas', 'Luis Alberto', '15.555.555-5', 8),

('100006', 'Cabo 1°', 'L. (Mc.C.I.)', 'Ramírez Soto', 'Miguel Ángel', '16.666.666-6', 9),
('100007', 'Cabo 2°', 'L. (Rd.C.I.C.)', 'Castro Pérez', 'Diego Fernando', '17.777.777-7', 9),

('100008', 'Sargento 1°', 'L.', 'Vega Morales', 'Felipe Ignacio', '18.888.888-8', 10),

('100009', 'Cabo 1°', 'L. (Ec.)', 'Navarro Rojas', 'Matías Alejandro', '19.999.999-9', 1),
('100010', 'Sargento 2°', 'L.', 'Contreras Silva', 'Jorge Antonio', '20.000.000-0', 11);


INSERT INTO cursos_realizados
(id_funcionario, id_curso, fecha_inicio, fecha_termino, fecha_vencimiento, id_estado, nota)
VALUES

-- Gobernación Marítima de Iquique
-- Inspector de Naves - Vigentes
(1, 1, '2025-01-10', '2025-02-10', '2027-02-10', 1, 6.5),
(2, 1, '2025-03-15', '2025-04-15', '2027-04-15', 1, 6.2),

-- Inspector de Naves - Vencido
(11, 1, '2022-01-10', '2022-02-10', '2024-02-10', 2, 5.8),

-- Otros cursos de la Gobernación Marítima de Iquique
(1, 2, '2025-05-01', '2025-05-30', '2027-05-30', 1, 6.0),
(2, 3, '2025-06-01', '2025-06-20', '2026-06-20', 1, 6.3),
(11, 5, '2025-07-01', '2025-07-10', '2026-07-10', 1, 6.6),

-- Capitanía de Puerto de Iquique
(3, 1, '2025-02-01', '2025-03-01', '2027-03-01', 1, 6.4),
(3, 4, '2025-04-01', '2025-04-25', '2027-04-25', 1, 6.1),
(4, 2, '2025-05-10', '2025-06-10', '2027-06-10', 1, 5.9),

-- Capitanía de Puerto de Patache
(5, 1, '2024-02-01', '2024-03-01', '2026-03-01', 2, 6.2),
(5, 3, '2025-01-15', '2025-02-05', '2026-02-05', 1, 6.0),
(6, 4, '2025-08-01', NULL, NULL, 3, NULL),

-- LSG Iquique
(7, 1, '2025-03-01', '2025-04-01', '2027-04-01', 1, 6.7),
(7, 5, '2025-06-01', '2025-06-10', '2026-06-10', 1, 6.4),

-- Funcionarios de otras Zonas Navales
(8, 1, '2025-01-20', '2025-02-20', '2027-02-20', 1, 6.1),
(9, 3, '2025-03-01', '2025-03-20', '2026-03-20', 1, 6.0);



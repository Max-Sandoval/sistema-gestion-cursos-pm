-- =====================================================
-- DATOS INICIALES
-- Sistema de Gestión de Cursos Policía Marítima
-- =====================================================


-- =====================================================
-- ZONAS NAVALES
-- =====================================================

INSERT INTO zonas_navales (nombre_zona, descripcion)
VALUES
('Primera Zona Naval', 'Primera Zona Naval'),
('Segunda Zona Naval', 'Segunda Zona Naval'),
('Tercera Zona Naval', 'Tercera Zona Naval'),
('Cuarta Zona Naval', 'Cuarta Zona Naval'),
('Quinta Zona Naval', 'Quinta Zona Naval');


-- =====================================================
-- REPARTICIONES
-- =====================================================

INSERT INTO reparticiones
(nombre_reparticion, tipo_reparticion, id_zona)
VALUES

-- Primera Zona Naval
('Gobernación Marítima de Valparaíso', 'Gobernación Marítima', 1),
('Capitanía de Puerto de Valparaíso', 'Capitanía de Puerto', 1),

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


-- =====================================================
-- TIPOS DE CURSO
-- =====================================================

INSERT INTO tipo_curso (nombre_tipo, descripcion)
VALUES
(
    'Institucional',
    'Curso desarrollado en el ámbito institucional'
),
(
    'Externo',
    'Curso realizado en una institución externa'
),
(
    'Especialización',
    'Curso orientado a una función o especialidad específica'
);


-- =====================================================
-- INSTITUCIONES
-- =====================================================

INSERT INTO instituciones
(nombre_institucion, tipo_institucion)
VALUES
(
    'Centro de Capacitación Institucional',
    'Institucional'
),
(
    'Centro de Formación Marítima',
    'Institucional'
),
(
    'Institución Externa de Capacitación',
    'Externa'
);


-- =====================================================
-- ESTADOS DE CURSO
-- =====================================================

INSERT INTO estado_curso
(nombre_estado, descripcion)
VALUES
(
    'Vigente',
    'Curso o habilitación actualmente vigente'
),
(
    'Vencido',
    'Curso o habilitación cuya vigencia ha finalizado'
),
(
    'En proceso',
    'Curso que actualmente se encuentra en desarrollo'
);


-- =====================================================
-- CURSOS
-- =====================================================

INSERT INTO cursos
(
    nombre_curso,
    codigo_curso,
    duracion_horas,
    vigencia_meses,
    id_tipo_curso,
    id_institucion
)
VALUES
(
    'Inspector de Naves',
    'CUR-001',
    40,
    24,
    3,
    1
),
(
    'Fiscalización Marítima',
    'CUR-002',
    32,
    24,
    3,
    1
),
(
    'Seguridad Marítima',
    'CUR-003',
    24,
    12,
    1,
    2
),
(
    'Control de Fronteras Marítimas',
    'CUR-004',
    30,
    24,
    1,
    2
),
(
    'Primeros Auxilios',
    'CUR-005',
    16,
    12,
    2,
    3
);


-- =====================================================
-- FUNCIONARIOS
-- =====================================================

INSERT INTO funcionarios
(
    npi,
    grado,
    especialidad,
    apellidos,
    nombres,
    rut,
    activo,
    id_reparticion
)
VALUES
(
    '100001',
    'Sargento 1°',
    'L.',
    'Pérez Soto',
    'Juan Carlos',
    '11.111.111-1',
    TRUE,
    7
),
(
    '100002',
    'Cabo 1°',
    'L. (Com.)',
    'Rojas Silva',
    'Carlos Eduardo',
    '13.333.333-3',
    TRUE,
    7
),
(
    '100003',
    'Sargento 2°',
    'L.',
    'Añiñir Silva',
    'Javier Eduardo',
    '12.345.678-0',
    TRUE,
    7
),
(
    '100004',
    'Sargento 2°',
    'L. (Com-Op.GRI.)',
    'Oconer López',
    'Brian Moisés',
    '14.444.444-4',
    TRUE,
    8
),
(
    '100005',
    'Cabo 1°',
    'L. (Nv.)',
    'Torres Vargas',
    'Luis Alberto',
    '15.555.555-5',
    TRUE,
    8
),
(
    '100006',
    'Cabo 1°',
    'L. (Mc.C.I.)',
    'Ramírez Soto',
    'Miguel Ángel',
    '16.666.666-6',
    TRUE,
    9
),
(
    '100007',
    'Cabo 2°',
    'L. (Rd.C.I.C.)',
    'Castro Pérez',
    'Diego Fernando',
    '17.777.777-7',
    TRUE,
    9
),
(
    '100008',
    'Sargento 1°',
    'L.',
    'Vega Morales',
    'Felipe Ignacio',
    '18.888.888-8',
    TRUE,
    10
),
(
    '100009',
    'Cabo 1°',
    'L. (Ec.)',
    'Navarro Rojas',
    'Matías Alejandro',
    '19.999.999-9',
    TRUE,
    1
),
(
    '100010',
    'Sargento 2°',
    'L.',
    'Contreras Silva',
    'Jorge Antonio',
    '20.000.000-0',
    TRUE,
    11
),
(
    '100011',
    'Cabo 1°',
    'L.',
    'González Díaz',
    'Andrés Felipe',
    '21.111.111-1',
    TRUE,
    7
),
(
    '100012',
    'Cabo 2°',
    'L.',
    'Muñoz Herrera',
    'Sebastián Ignacio',
    '22.222.222-2',
    TRUE,
    8
);


-- =====================================================
-- CURSOS REALIZADOS
-- =====================================================

INSERT INTO cursos_realizados
(
    id_funcionario,
    id_curso,
    fecha_inicio,
    fecha_termino,
    fecha_vencimiento,
    id_estado,
    nota,
    puesto,
    total_participantes
)
VALUES

-- =====================================================
-- GOBERNACIÓN MARÍTIMA DE IQUIQUE
-- =====================================================

-- Inspector de Naves - Vigente
(
    1,
    1,
    '2025-01-10',
    '2025-02-10',
    '2027-02-10',
    1,
    6.50,
    NULL,
    NULL
),

-- Inspector de Naves - Vigente
(
    2,
    1,
    '2025-03-15',
    '2025-04-15',
    '2027-04-15',
    1,
    6.20,
    NULL,
    NULL
),

-- Inspector de Naves - Vencido
(
    3,
    1,
    '2022-01-10',
    '2022-02-10',
    '2024-02-10',
    2,
    5.80,
    NULL,
    NULL
),

-- Fiscalización Marítima
(
    1,
    2,
    '2025-05-01',
    '2025-05-30',
    '2027-05-30',
    1,
    6.00,
    NULL,
    NULL
),

-- Seguridad Marítima
(
    2,
    3,
    '2025-06-01',
    '2025-06-20',
    '2026-06-20',
    1,
    6.30,
    NULL,
    NULL
),

-- Primeros Auxilios
(
    3,
    5,
    '2025-07-01',
    '2025-07-10',
    '2026-07-10',
    1,
    6.60,
    NULL,
    NULL
),


-- =====================================================
-- CAPITANÍA DE PUERTO DE IQUIQUE
-- =====================================================

-- Inspector de Naves
(
    4,
    1,
    '2025-02-01',
    '2025-03-01',
    '2027-03-01',
    1,
    6.40,
    NULL,
    NULL
),

-- Control de Fronteras Marítimas
(
    4,
    4,
    '2025-04-01',
    '2025-04-25',
    '2027-04-25',
    1,
    6.10,
    NULL,
    NULL
),

-- Fiscalización Marítima
(
    5,
    2,
    '2025-05-10',
    '2025-06-10',
    '2027-06-10',
    1,
    5.90,
    NULL,
    NULL
),


-- =====================================================
-- CAPITANÍA DE PUERTO DE PATACHE
-- =====================================================

-- Inspector de Naves - Vencido
(
    6,
    1,
    '2024-02-01',
    '2024-03-01',
    '2026-03-01',
    2,
    6.20,
    NULL,
    NULL
),

-- Seguridad Marítima
(
    6,
    3,
    '2025-01-15',
    '2025-02-05',
    '2026-02-05',
    1,
    6.00,
    NULL,
    NULL
),

-- Control de Fronteras Marítimas - En proceso
(
    7,
    4,
    '2026-08-01',
    NULL,
    NULL,
    3,
    NULL,
    NULL,
    NULL
),


-- =====================================================
-- LSG IQUIQUE
-- =====================================================

-- Inspector de Naves
(
    8,
    1,
    '2025-03-01',
    '2025-04-01',
    '2027-04-01',
    1,
    6.70,
    NULL,
    NULL
),

-- Primeros Auxilios
(
    8,
    5,
    '2025-06-01',
    '2025-06-10',
    '2026-06-10',
    1,
    6.40,
    NULL,
    NULL
),


-- =====================================================
-- OTRAS ZONAS NAVALES
-- =====================================================

-- Primera Zona Naval
(
    9,
    1,
    '2025-01-20',
    '2025-02-20',
    '2027-02-20',
    1,
    6.10,
    3,
    10
),

-- Quinta Zona Naval
(
    10,
    3,
    '2025-03-01',
    '2025-03-20',
    '2026-03-20',
    1,
    6.00,
    NULL,
    NULL
),

-- Gobernación Marítima de Iquique
(
    11,
    2,
    '2026-01-12',
    '2026-02-12',
    '2028-02-12',
    1,
    6.80,
    2,
    20
);


-- =====================================================
-- ROLES
-- =====================================================

INSERT INTO roles
(nombre_rol, descripcion)
VALUES
(
    'Administrador',
    'Usuario con acceso a funciones de administración y consulta'
),
(
    'Consulta',
    'Usuario con acceso a funciones de consulta y reportes'
);


-- =====================================================
-- USUARIOS DE EVALUACIÓN
-- =====================================================

INSERT INTO usuarios
(
    nombre_usuario,
    password_hash,
    correo,
    activo,
    id_rol
)
VALUES
(
    'admin',
    '$2b$10$RRJCs80GSpueYi/9aXmZlOyEQj5Ojv8s./KE3URJmb/uZGEiTaj/C',
    'admin@cursospm.cl',
    TRUE,
    1
),
(
    'consulta',
    '$2b$10$B0b690RwuNjEBrOMZxpKsOvzUG5EvIwpYR91rWycWTqxnWEmJmk8y',
    'consulta@cursospm.cl',
    TRUE,
    2
);
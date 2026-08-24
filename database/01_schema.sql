CREATE TABLE zonas_navales (
    id_zona SERIAL PRIMARY KEY,
    nombre_zona VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);


CREATE TABLE reparticiones (
    id_reparticion SERIAL PRIMARY KEY,
    nombre_reparticion VARCHAR(150) NOT NULL,
    tipo_reparticion VARCHAR(100),
    id_zona INTEGER NOT NULL,

    CONSTRAINT fk_reparticion_zona
        FOREIGN KEY (id_zona)
        REFERENCES zonas_navales(id_zona)
);

CREATE TABLE funcionarios (
    id_funcionario SERIAL PRIMARY KEY,
    npi VARCHAR(20) NOT NULL UNIQUE,
    grado VARCHAR(50) NOT NULL,
    especialidad VARCHAR(100),
    apellidos VARCHAR(100) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    rut VARCHAR(12) UNIQUE,
    id_reparticion INTEGER NOT NULL,

    CONSTRAINT fk_funcionario_reparticion
        FOREIGN KEY (id_reparticion)
        REFERENCES reparticiones(id_reparticion)
);

CREATE TABLE tipo_curso (
    id_tipo_curso SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE instituciones (
    id_institucion SERIAL PRIMARY KEY,
    nombre_institucion VARCHAR(150) NOT NULL UNIQUE,
    tipo_institucion VARCHAR(100)
);

CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    nombre_curso VARCHAR(150) NOT NULL,
    codigo_curso VARCHAR(50) UNIQUE,
    duracion_horas INTEGER,
    vigencia_meses INTEGER,
    id_tipo_curso INTEGER NOT NULL,
    id_institucion INTEGER NOT NULL,

    CONSTRAINT fk_curso_tipo
        FOREIGN KEY (id_tipo_curso)
        REFERENCES tipo_curso(id_tipo_curso),

    CONSTRAINT fk_curso_institucion
        FOREIGN KEY (id_institucion)
        REFERENCES instituciones(id_institucion)
);

CREATE TABLE estado_curso (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE cursos_realizados (
    id_curso_realizado SERIAL PRIMARY KEY,
    id_funcionario INTEGER NOT NULL,
    id_curso INTEGER NOT NULL,
    fecha_inicio DATE,
    fecha_termino DATE,
    fecha_vencimiento DATE,
    id_estado INTEGER NOT NULL,
    nota DECIMAL(5,2),

    CONSTRAINT fk_curso_realizado_funcionario
        FOREIGN KEY (id_funcionario)
        REFERENCES funcionarios(id_funcionario),

    CONSTRAINT fk_curso_realizado_curso
        FOREIGN KEY (id_curso)
        REFERENCES cursos(id_curso),

    CONSTRAINT fk_curso_realizado_estado
        FOREIGN KEY (id_estado)
        REFERENCES estado_curso(id_estado)
);

CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    id_rol INTEGER NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    id_rol INTEGER NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
);
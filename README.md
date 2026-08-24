# Sistema de Gestión de Cursos del Personal de Policía Marítima

Proyecto desarrollado como parte de la asignatura Proyecto de Título de Ingeniería en Informática.

## Descripción

El proyecto propone el desarrollo de un sistema web para apoyar la gestión y consulta de los cursos realizados por el personal de Policía Marítima.

El sistema permitirá realizar consultas mediante filtros como Zona Naval, repartición, curso y estado, facilitando la búsqueda de funcionarios que cumplen determinados criterios de capacitación.

## Tecnologías propuestas

- PostgreSQL
- React
- JavaScript
- CSS
- Node.js
- Express
- API REST

## Estructura del proyecto

- `frontend/`: interfaz web del sistema.
- `backend/`: lógica de negocio y API REST.
- `database/`: estructura, datos de prueba y consultas SQL.
- `docs/`: documentación técnica y diagramas.


## Base de datos

Actualmente se encuentra implementada la base de datos relacional en PostgreSQL.

El modelo contempla información relacionada con Zonas Navales, reparticiones, funcionarios, cursos, tipos de curso, instituciones, estados de cursos, cursos realizados, usuarios y roles.

La estructura fue diseñada aplicando normalización hasta Tercera Forma Normal (3FN).


## Estado actual

Actualmente el proyecto se encuentra en etapa de modelado e implementación de la base de datos y definición de la arquitectura del sistema.

La interfaz web y la API REST corresponden a etapas posteriores del desarrollo.
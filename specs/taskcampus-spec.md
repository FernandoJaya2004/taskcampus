# Especificación del sistema TaskCampus

## Problema
Los estudiantes universitarios carecen de una herramienta centralizada y simple para organizar sus tareas de diferentes asignaturas, lo que genera olvidos y entregas tardías.

## Objetivo
Desarrollar una aplicación web ligera que permita registrar, consultar, actualizar y eliminar tareas académicas con prioridades y estados de avance.

## Usuarios
Estudiantes universitarios de cualquier carrera.

## Historias de usuario
- Como estudiante, quiero registrar tareas con su fecha de entrega para organizar mis actividades.
- Como estudiante, quiero filtrar mis tareas por estado para identificar rápidamente mis pendientes.
- Como estudiante, quiero marcar tareas como finalizadas para controlar mi avance académico.

## Requisitos funcionales
- RF01. Registrar tareas (Título, Descripción, Asignatura, Fecha, Prioridad, Estado).
- RF02. Listar y visualizar todas las tareas en una interfaz clara.
- RF03. Editar los campos de una tarea ya existente.
- RF04. Eliminar tareas del sistema.
- RF05. Filtrar tareas por estado (pendiente, en proceso, finalizada) y prioridad.
- RF06. Mostrar un resumen estadístico (total de tareas, completadas, pendientes).

## Requisitos no funcionales
- RNF01. La interfaz web debe ser responsiva y limpia (Tailwind CSS).
- RNF02. El backend debe exponer una API REST utilizando Python y FastAPI.
- RNF03. Los datos deben persistir de forma local en un archivo JSON.
- RNF04. El código debe estar versionado mediante Git con ramas independientes.

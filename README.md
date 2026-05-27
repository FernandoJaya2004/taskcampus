# TaskCampus - Sistema de Gestión de Tareas Universitarias

Este proyecto consiste en una aplicación web ligera diseñada bajo el enfoque **Spec Driven Development (SDD)** para ayudar a los estudiantes a organizar sus actividades académicas pendientes de forma eficiente.

## 🚀 Características del Proyecto
- **Frontend:** Construido con HTML y TypeScript para una lógica robusta y reactiva de filtros y renderizado.
- **Backend:** Desarrollado en Python utilizando el framework **FastAPI**, exponiendo una API REST robusta.
- **Persistencia:** Almacenamiento local mediante un archivo estructurado en formato JSON.
- **Control de Versiones:** Historial de desarrollo administrado mediante Git bajo una metodología de ramas independientes (`feature-backend`, `feature-frontend`).

## 🛠️ Instrucciones de Ejecución

### 1. Iniciar el Servidor Backend
Asegúrate de tener Python instalado y ejecuta los siguientes comandos en tu terminal desde la raíz del proyecto:
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```
El backend estará disponible en: `http://localhost:8000` y su documentación interactiva en `http://localhost:8000/docs`.

### 2. Ejecutar la Interfaz Frontend
1. Ve a la carpeta `Interfaz`.
2. Compila el archivo TypeScript en caso de modificaciones ejecutando `tsc app.ts`.
3. Abre el archivo `index.html` en cualquier navegador web moderno.

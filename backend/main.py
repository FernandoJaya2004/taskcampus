from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="TaskCampus API")

# Esto permite que tu Frontend del navegador se conecte con este Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "tasks.json"

# Estructura que debe cumplir cada tarea obligatoriamente
class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    subject: str
    due_date: str
    priority: str  # baja, media, alta
    status: str    # pendiente, en proceso, finalizada

# Función para leer las tareas guardadas en el archivo JSON
def load_tasks() -> List[dict]:
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

# Función para sobrescribir y guardar las tareas en el archivo JSON
def save_tasks(tasks: List[dict]):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=4, ensure_ascii=False)

# 1. Obtener todas las tareas
@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return load_tasks()

# 2. Obtener una sola tarea por su ID
@app.get("/tasks/{id}", response_model=Task)
def get_task(id: int):
    tasks = load_tasks()
    task = next((t for t in tasks if t["id"] == id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return task

# 3. Crear una nueva tarea
@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    tasks = load_tasks()
    new_id = max([t["id"] for t in tasks], default=0) + 1
    task_dict = task.dict()
    task_dict["id"] = new_id
    tasks.append(task_dict)
    save_tasks(tasks)
    return task_dict

# 4. Modificar una tarea existente
@app.put("/tasks/{id}", response_model=Task)
def update_task(id: int, updated_task: Task):
    tasks = load_tasks()
    for idx, t in enumerate(tasks):
        if t["id"] == id:
            task_dict = updated_task.dict()
            task_dict["id"] = id
            tasks[idx] = task_dict
            save_tasks(tasks)
            return task_dict
    raise HTTPException(status_code=404, detail="Tarea no encontrada")

# 5. Eliminar una tarea
@app.delete("/tasks/{id}")
def delete_task(id: int):
    tasks = load_tasks()
    filtered_tasks = [t for t in tasks if t["id"] != id]
    if len(filtered_tasks) == len(tasks):
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    save_tasks(filtered_tasks)
    return {"message": "Tarea eliminada con éxito"}

# 6. Estadísticas automáticas
@app.get("/tasks/summary")
def get_summary():
    tasks = load_tasks()
    total = len(tasks)
    pendiente = sum(1 for t in tasks if t["status"] == "pendiente")
    finalizada = sum(1 for t in tasks if t["status"] == "finalizada")
    alta_prioridad = sum(1 for t in tasks if t["priority"] == "alta")
    
    return {
        "total": total,
        "pendiente": pendiente,
        "finalizada": finalizada,
        "alta_prioridad": alta_prioridad
    }

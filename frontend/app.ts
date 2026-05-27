// Estructura que debe tener un objeto de tarea
interface Task {
    id?: number;
    title: string;
    description: string;
    subject: string;
    due_date: string;
    priority: string;
    status: string;
}

const API_URL = "http://127.0.0";
let allTasks: Task[] = []; // Aquí guardaremos temporalmente la lista de tareas del servidor

// Se ejecuta automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
    setupEventListeners();
});

// Obtener todas las tareas desde el Backend
async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        allTasks = await res.json();
        renderTasks(allTasks);
        fetchSummary();
    } catch (error) {
        console.error("Error al conectar con el servidor backend:", error);
    }
}

// Obtener el resumen estadístico desde el Backend
async function fetchSummary() {
    try {
        const res = await fetch(`${API_URL}/summary`);
        const data = await res.json();
        document.getElementById("stat-total")!.innerText = data.total;
        document.getElementById("stat-pending")!.innerText = data.pendiente;
        document.getElementById("stat-completed")!.innerText = data.finalizada;
        document.getElementById("stat-high")!.innerText = data.alta_prioridad;
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
    }
}

// Dibujar las tareas en pantalla en forma de tarjetas atractivas
function renderTasks(tasks: Task[]) {
    const container = document.getElementById("tasks-container")!;
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-4 bg-white rounded shadow">No hay tareas que mostrar.</p>`;
        return;
    }

    tasks.forEach(task => {
        const div = document.createElement("div");
        // Cambiar el color del borde izquierdo según la prioridad
        let borderColor = 'border-green-500';
        if (task.priority === 'alta') borderColor = 'border-red-500';
        else if (task.priority === 'media') borderColor = 'border-yellow-500';

        div.className = `bg-white p-4 rounded shadow flex justify-between items-center border-l-4 ${borderColor}`;
        
        div.innerHTML = `
            <div>
                <h3 class="text-lg font-bold text-gray-800">${task.title} 
                    <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-medium ml-2">${task.status}</span>
                </h3>
                <p class="text-sm text-gray-600 mt-1">${task.description}</p>
                <p class="text-xs text-gray-400 mt-2"><strong>Materia:</strong> ${task.subject} | <strong>Entrega:</strong> ${task.due_date}</p>
            </div>
            <div class="space-x-3 flex items-center">
                <button onclick="editTask(${task.id})" class="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition">Editar</button>
                <button onclick="deleteTask(${task.id})" class="text-red-600 hover:text-red-900 font-medium text-sm transition">Eliminar</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Configurar los formularios y los filtros de búsqueda
function setupEventListeners() {
    const form = document.getElementById("task-form") as HTMLFormElement;
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = (document.getElementById("task-id") as HTMLInputElement).value;
        
        const taskData: Task = {
            title: (document.getElementById("title") as HTMLInputElement).value,
            description: (document.getElementById("description") as HTMLTextAreaElement).value,
            subject: (document.getElementById("subject") as HTMLInputElement).value,
            due_date: (document.getElementById("due_date") as HTMLInputElement).value,
            priority: (document.getElementById("priority") as HTMLSelectElement).value,
            status: (document.getElementById("status") as HTMLSelectElement).value,
        };

        // Si hay un ID en el campo oculto, editamos; si no, creamos una nueva tarea
        if (id) {
            await fetch(`${API_URL}/${id}`, { 
                method: "PUT", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(taskData) 
            });
        } else {
            await fetch(API_URL, { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(taskData) 
            });
        }
        
        form.reset();
        resetFormState();
        fetchTasks();
    });

    document.getElementById("cancel-btn")!.addEventListener("click", () => {
        form.reset();
        resetFormState();
    });

    // Escuchar cuando el usuario cambia o escribe en los filtros
    ["filter-status", "filter-priority", "filter-subject"].forEach(id => {
        document.getElementById(id)!.addEventListener("input", applyFilters);
    });
}

// Lógica para filtrar tareas en tiempo real sin recargar la página
function applyFilters() {
    const status = (document.getElementById("filter-status") as HTMLSelectElement).value;
    const priority = (document.getElementById("filter-priority") as HTMLSelectElement).value;
    const subject = (document.getElementById("filter-subject") as HTMLInputElement).value.toLowerCase();

    const filtered = allTasks.filter(t => {
        return (!status || t.status === status) &&
               (!priority || t.priority === priority) &&
               (!subject || t.subject.toLowerCase().includes(subject));
    });
    renderTasks(filtered);
}

// Ventana global para hacer accesibles estas funciones desde los botones del HTML
(window as any).editTask = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`);
    const task: Task = await res.json();
    
    (document.getElementById("task-id") as HTMLInputElement).value = task.id!.toString();
    (document.getElementById("title") as HTMLInputElement).value = task.title;
    (document.getElementById("description") as HTMLTextAreaElement).value = task.description;
    (document.getElementById("subject") as HTMLInputElement).value = task.subject;
    (document.getElementById("due_date") as HTMLInputElement).value = task.due_date;
    (document.getElementById("priority") as HTMLSelectElement).value = task.priority;
    (document.getElementById("status") as HTMLSelectElement).value = task.status;

    document.getElementById("form-title")!.innerText = "Editar Tarea";
    document.getElementById("cancel-btn")!.classList.remove("hidden");
};

(window as any).deleteTask = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea permanentemente?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchTasks();
    }
};

function resetFormState() {
    (document.getElementById("task-id") as HTMLInputElement).value = "";
    document.getElementById("form-title")!.innerText = "Registrar Nueva Tarea";
    document.getElementById("cancel-btn")!.classList.add("hidden");
}

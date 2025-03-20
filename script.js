// Clase para manejar las tareas
class Task {
    constructor(id, text, dueDate = null, priority = 'baja', completed = false) {
        this.id = id;
        this.text = text;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.createdAt = new Date();
    }
}

// Clase principal de la aplicación
class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        this.searchInput = document.getElementById('searchTask');
        this.filterStatus = document.getElementById('filterStatus');
        this.pendingTasksCount = document.getElementById('pendingTasks');
        
        this.initializeEventListeners();
        this.renderTasks();
        this.updatePendingCount();
    }

    initializeEventListeners() {
        // Evento para agregar tarea
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Evento para búsqueda
        this.searchInput.addEventListener('input', () => this.filterTasks());

        // Evento para filtrado
        this.filterStatus.addEventListener('change', () => this.filterTasks());
    }

    addTask() {
        const text = this.taskInput.value.trim();
        const dueDate = document.getElementById('dueDate').value;
        const priority = document.getElementById('priority').value;

        if (text === '') return;

        const newTask = new Task(
            Date.now(),
            text,
            dueDate,
            priority
        );

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTask(newTask);
        this.updatePendingCount();

        this.taskInput.value = '';
        document.getElementById('dueDate').value = '';
    }

    renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;

        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                ${task.dueDate ? `<span class="due-date">Fecha límite: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                <span class="priority-badge">${task.priority}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Eventos para los botones
        li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            this.toggleTaskStatus(task.id);
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTask(task.id);
        });

        li.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.editTask(task.id);
        });

        this.taskList.appendChild(li);
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        this.filterTasks();
    }

    filterTasks() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filterValue = this.filterStatus.value;

        const filteredTasks = this.tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(searchTerm);
            const matchesFilter = filterValue === 'todas' || 
                (filterValue === 'completadas' && task.completed) ||
                (filterValue === 'pendientes' && !task.completed);

            return matchesSearch && matchesFilter;
        });

        this.taskList.innerHTML = '';
        filteredTasks.forEach(task => this.renderTask(task));
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updatePendingCount();
        }
    }

    deleteTask(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updatePendingCount();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const newText = prompt('Editar tarea:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    updatePendingCount() {
        const pendingCount = this.tasks.filter(task => !task.completed).length;
        this.pendingTasksCount.textContent = pendingCount;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
});
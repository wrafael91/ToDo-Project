class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.initializeElements();
        this.initializeEventListeners();
        this.loadDarkModePreference();
        this.renderTasks();
        this.updateTaskCounts();
    }

    initializeElements() {
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        this.prioritySelect = document.getElementById('priority');
        this.darkModeToggle = document.getElementById('toggleDarkMode');
        this.exportBtn = document.getElementById('exportTasksBtn');
        this.importInput = document.getElementById('importTasksInput');
    }

    initializeEventListeners() {
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        this.exportBtn.addEventListener('click', () => this.exportTasks());
        this.importInput.addEventListener('change', (e) => this.importTasks(e));
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text === '') return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: this.prioritySelect.value,
            createdAt: new Date()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task);
        this.updateTaskCounts();
        this.showNotification('Tarea agregada');

        this.taskInput.value = '';
    }

    renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = task.completed ? 'completed' : '';

        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-actions">
                <button class="complete-btn">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        li.querySelector('.complete-btn').addEventListener('click', () => {
            this.toggleTaskStatus(task.id);
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            this.deleteTask(task.id);
        });

        this.taskList.appendChild(li);
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => this.renderTask(task));
    }

    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounts();
            this.showNotification(task.completed ? 'Tarea completada' : 'Tarea pendiente');
        }
    }

    deleteTask(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
            taskElement.classList.add('removing');
            
            setTimeout(() => {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.saveTasks();
                this.renderTasks();
                this.updateTaskCounts();
                this.showNotification('Tarea eliminada');
            }, 300);
        }
    }

    updateTaskCounts() {
        const pendingCount = this.tasks.filter(task => !task.completed).length;
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        document.getElementById('pendingTasks').textContent = pendingCount;
        document.getElementById('completedTasks').textContent = completedCount;
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        this.darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    loadDarkModePreference() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            this.darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tareas.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Tareas exportadas');
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                this.tasks = [...this.tasks, ...importedTasks];
                this.saveTasks();
                this.renderTasks();
                this.updateTaskCounts();
                this.showNotification('Tareas importadas');
            } catch (error) {
                this.showNotification('Error al importar tareas', true);
            }
        };
        reader.readAsText(file);
    }

    showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : ''}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
});
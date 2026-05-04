const API_BASE = '/api/tasks';

class KanbanBoard {
    constructor() {
        this.tasks = [];
        this.draggedTask = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadTasks();
        this.render();
    }

    setupEventListeners() {
        // Add task button
        const addBtn = document.getElementById('addBtn');
        const taskInput = document.getElementById('taskInput');

        addBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Setup containers for drag and drop
        const containers = document.querySelectorAll('.tasks-container');
        containers.forEach(container => {
            container.addEventListener('dragover', this.handleDragOver.bind(this));
            container.addEventListener('drop', this.handleDrop.bind(this));
            container.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    async loadTasks() {
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) throw new Error('Failed to load tasks');
            this.tasks = await response.json();
            this.render();
        } catch (error) {
            console.error('Error loading tasks:', error);
            alert('Erro ao carregar tarefas. Tente recarregar a página.');
        }
    }

    async addTask() {
        const input = document.getElementById('taskInput');
        const title = input.value.trim();

        if (!title) {
            alert('Digite uma tarefa!');
            return;
        }

        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description: '' })
            });

            if (!response.ok) throw new Error('Failed to create task');
            
            const newTask = await response.json();
            this.tasks.push(newTask);
            input.value = '';
            this.render();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Erro ao criar tarefa.');
        }
    }

    async deleteTask(id) {
        if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete task');
            
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.render();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Erro ao deletar tarefa.');
        }
    }

    async updateTaskStatus(id, newStatus) {
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update task');
            
            const updatedTask = await response.json();
            const taskIndex = this.tasks.findIndex(t => t.id === id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = updatedTask;
            }
            this.render();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Erro ao mover tarefa.');
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const container = e.currentTarget;
        container.classList.add('drag-over-container');
    }

    handleDragLeave(e) {
        if (e.currentTarget === e.target) {
            e.currentTarget.classList.remove('drag-over-container');
        }
    }

    async handleDrop(e) {
        e.preventDefault();
        const container = e.currentTarget;
        container.classList.remove('drag-over-container');

        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = container.dataset.status;
        
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            await this.updateTaskStatus(taskId, newStatus);
        }
    }

    createTaskElement(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.id = task.id;

        const createdAt = new Date(task.createdAt).toLocaleDateString('pt-BR', {
            month: 'short',
            day: 'numeric',
            year: '2-digit'
        });

        card.innerHTML = `
            <div class="task-content">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <div class="task-time">${createdAt}</div>
            </div>
            <button class="task-delete-btn">🗑️</button>
        `;

        // Drag events
        card.addEventListener('dragstart', (e) => {
            this.draggedTask = task.id;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', task.id);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        // Delete button
        card.querySelector('.task-delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteTask(task.id);
        });

        return card;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    render() {
        const statuses = ['todo', 'in-progress', 'completed'];
        
        statuses.forEach(status => {
            const container = document.getElementById(`${status.replace('-', '-')}-tasks`);
            const tasksByStatus = this.tasks.filter(task => task.status === status);
            const countElement = document.getElementById(`count-${status}`);

            container.innerHTML = '';
            countElement.textContent = tasksByStatus.length;

            if (tasksByStatus.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhuma tarefa aqui</div>';
            } else {
                tasksByStatus.forEach(task => {
                    const taskElement = this.createTaskElement(task);
                    container.appendChild(taskElement);
                });
            }
        });
    }
}

// Initialize the Kanban board when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new KanbanBoard();
});

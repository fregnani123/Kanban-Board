const API_BASE = '/api/tasks';

const STATUS_LABELS = {
    todo: 'A fazer',
    'in-progress': 'Em andamento',
    completed: 'Concluida',
};

const PRIORITY_LABELS = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baixa',
};

const PRIORITY_WEIGHT = {
    high: 3,
    medium: 2,
    low: 1,
};

class KanbanBoard {
    constructor() {
        this.tasks = [];
        this.draggedTask = null;
        this.editingTaskId = null;
        this.init();
    }

    async init() {
        this.cacheElements();
        this.setupEventListeners();
        await this.loadTasks();
    }

    cacheElements() {
        this.elements = {
            addBtn: document.getElementById('addBtn'),
            taskInput: document.getElementById('taskInput'),
            quickPriority: document.getElementById('quickPriority'),
            searchInput: document.getElementById('searchInput'),
            priorityFilter: document.getElementById('priorityFilter'),
            sortSelect: document.getElementById('sortSelect'),
            newTaskBtn: document.getElementById('newTaskBtn'),
            modal: document.getElementById('taskModal'),
            taskForm: document.getElementById('taskForm'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            deleteModalBtn: document.getElementById('deleteModalBtn'),
            modalTitle: document.getElementById('modalTitle'),
            modalTitleInput: document.getElementById('modalTitleInput'),
            modalDescriptionInput: document.getElementById('modalDescriptionInput'),
            modalAssigneeInput: document.getElementById('modalAssigneeInput'),
            modalPriorityInput: document.getElementById('modalPriorityInput'),
            modalDueDateInput: document.getElementById('modalDueDateInput'),
            modalStatusInput: document.getElementById('modalStatusInput'),
            toast: document.getElementById('toast'),
        };
    }

    setupEventListeners() {
        this.elements.addBtn.addEventListener('click', () => this.addQuickTask());
        this.elements.taskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') this.addQuickTask();
        });

        this.elements.searchInput.addEventListener('input', () => this.render());
        this.elements.priorityFilter.addEventListener('change', () => this.render());
        this.elements.sortSelect.addEventListener('change', () => this.render());
        this.elements.newTaskBtn.addEventListener('click', () => this.openTaskModal());
        this.elements.closeModalBtn.addEventListener('click', () => this.closeTaskModal());
        this.elements.modal.addEventListener('click', (event) => {
            if (event.target === this.elements.modal) this.closeTaskModal();
        });
        this.elements.taskForm.addEventListener('submit', (event) => this.saveTaskFromModal(event));
        this.elements.deleteModalBtn.addEventListener('click', () => this.deleteCurrentTask());

        document.querySelectorAll('.tasks-container').forEach((container) => {
            container.addEventListener('dragover', this.handleDragOver.bind(this));
            container.addEventListener('drop', this.handleDrop.bind(this));
            container.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    async request(path = '', options = {}) {
        const response = await fetch(`${API_BASE}${path}`, {
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    async loadTasks() {
        try {
            this.tasks = await this.request();
            this.render();
        } catch (error) {
            console.error(error);
            this.showToast('Nao foi possivel carregar as tarefas.');
        }
    }

    async addQuickTask() {
        const title = this.elements.taskInput.value.trim();
        if (!title) {
            this.showToast('Digite um titulo para a tarefa.');
            return;
        }

        try {
            const newTask = await this.request('', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    description: '',
                    priority: this.elements.quickPriority.value,
                }),
            });
            this.tasks.unshift(newTask);
            this.elements.taskInput.value = '';
            this.render();
            this.showToast('Tarefa criada.');
        } catch (error) {
            console.error(error);
            this.showToast('Erro ao criar tarefa.');
        }
    }

    async saveTaskFromModal(event) {
        event.preventDefault();
        const payload = {
            title: this.elements.modalTitleInput.value.trim(),
            description: this.elements.modalDescriptionInput.value.trim(),
            assignee: this.elements.modalAssigneeInput.value.trim(),
            priority: this.elements.modalPriorityInput.value,
            dueDate: this.elements.modalDueDateInput.value || null,
            status: this.elements.modalStatusInput.value,
        };

        if (!payload.title) {
            this.showToast('Informe um titulo.');
            return;
        }

        try {
            if (this.editingTaskId) {
                const updatedTask = await this.request(`/${this.editingTaskId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                });
                this.tasks = this.tasks.map((task) => task.id === updatedTask.id ? updatedTask : task);
                this.showToast('Tarefa atualizada.');
            } else {
                const newTask = await this.request('', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                this.tasks.unshift(newTask);
                this.showToast('Tarefa criada.');
            }

            this.closeTaskModal();
            this.render();
        } catch (error) {
            console.error(error);
            this.showToast('Nao foi possivel salvar a tarefa.');
        }
    }

    async updateTaskStatus(id, newStatus) {
        try {
            const updatedTask = await this.request(`/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
            });
            this.tasks = this.tasks.map((task) => task.id === id ? updatedTask : task);
            this.render();
            this.showToast(`Movida para ${STATUS_LABELS[newStatus]}.`);
        } catch (error) {
            console.error(error);
            this.showToast('Erro ao mover tarefa.');
        }
    }

    async deleteTask(id) {
        if (!confirm('Excluir esta tarefa?')) return;

        try {
            await this.request(`/${id}`, { method: 'DELETE' });
            this.tasks = this.tasks.filter((task) => task.id !== id);
            this.render();
            this.showToast('Tarefa excluida.');
        } catch (error) {
            console.error(error);
            this.showToast('Erro ao excluir tarefa.');
        }
    }

    async deleteCurrentTask() {
        if (!this.editingTaskId) {
            this.closeTaskModal();
            return;
        }

        await this.deleteTask(this.editingTaskId);
        this.closeTaskModal();
    }

    openTaskModal(task = null) {
        this.editingTaskId = task?.id || null;
        this.elements.modalTitle.textContent = task ? 'Editar tarefa' : 'Nova tarefa';
        this.elements.deleteModalBtn.classList.toggle('hidden', !task);
        this.elements.modalTitleInput.value = task?.title || '';
        this.elements.modalDescriptionInput.value = task?.description || '';
        this.elements.modalAssigneeInput.value = task?.assignee || '';
        this.elements.modalPriorityInput.value = task?.priority || 'medium';
        this.elements.modalDueDateInput.value = task?.dueDate ? task.dueDate.slice(0, 10) : '';
        this.elements.modalStatusInput.value = task?.status || 'todo';
        this.elements.modal.classList.remove('hidden');
        this.elements.modalTitleInput.focus();
    }

    closeTaskModal() {
        this.elements.modal.classList.add('hidden');
        this.editingTaskId = null;
        this.elements.taskForm.reset();
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        event.currentTarget.classList.add('drag-over-container');
    }

    handleDragLeave(event) {
        if (event.currentTarget === event.target) {
            event.currentTarget.classList.remove('drag-over-container');
        }
    }

    async handleDrop(event) {
        event.preventDefault();
        const container = event.currentTarget;
        container.classList.remove('drag-over-container');

        const taskId = event.dataTransfer.getData('text/plain');
        const newStatus = container.dataset.status;
        const task = this.tasks.find((item) => item.id === taskId);

        if (task && task.status !== newStatus) {
            await this.updateTaskStatus(taskId, newStatus);
        }
    }

    getVisibleTasks(status) {
        const query = this.elements.searchInput.value.trim().toLowerCase();
        const priority = this.elements.priorityFilter.value;
        const sort = this.elements.sortSelect.value;

        return this.tasks
            .filter((task) => task.status === status)
            .filter((task) => priority === 'all' || task.priority === priority)
            .filter((task) => {
                if (!query) return true;
                return [task.title, task.description, task.assignee]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(query));
            })
            .sort((a, b) => this.sortTasks(a, b, sort));
    }

    sortTasks(a, b, sort) {
        if (sort === 'priority') {
            return (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        }

        if (sort === 'due') {
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
            return dateA - dateB;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    createTaskElement(task) {
        const card = document.createElement('article');
        card.className = `task-card priority-${task.priority || 'medium'}`;
        card.draggable = true;
        card.dataset.id = task.id;

        const due = this.formatDueDate(task.dueDate);
        const isOverdue = this.isOverdue(task);
        const assignee = task.assignee ? this.escapeHtml(task.assignee) : 'Sem responsavel';

        card.innerHTML = `
            <div class="task-card-header">
                <span class="priority-pill">${PRIORITY_LABELS[task.priority] || 'Media'}</span>
                <button class="card-menu" type="button" aria-label="Excluir tarefa">x</button>
            </div>
            <h3>${this.escapeHtml(task.title)}</h3>
            ${task.description ? `<p>${this.escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                <span>${assignee}</span>
                <span class="${isOverdue ? 'overdue' : ''}">${due}</span>
            </div>
        `;

        card.addEventListener('click', () => this.openTaskModal(task));
        card.addEventListener('dragstart', (event) => {
            this.draggedTask = task.id;
            card.classList.add('dragging');
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', task.id);
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
        card.querySelector('.card-menu').addEventListener('click', (event) => {
            event.stopPropagation();
            this.deleteTask(task.id);
        });

        return card;
    }

    render() {
        ['todo', 'in-progress', 'completed'].forEach((status) => {
            const container = document.getElementById(`${status}-tasks`);
            const countElement = document.getElementById(`count-${status}`);
            const tasks = this.getVisibleTasks(status);

            container.innerHTML = '';
            countElement.textContent = tasks.length;

            if (tasks.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhuma tarefa encontrada</div>';
                return;
            }

            tasks.forEach((task) => container.appendChild(this.createTaskElement(task)));
        });

        this.renderMetrics();
    }

    renderMetrics() {
        const total = this.tasks.length;
        const progress = this.tasks.filter((task) => task.status === 'in-progress').length;
        const completed = this.tasks.filter((task) => task.status === 'completed').length;
        const overdue = this.tasks.filter((task) => this.isOverdue(task)).length;

        document.getElementById('metric-total').textContent = total;
        document.getElementById('metric-progress').textContent = progress;
        document.getElementById('metric-completed').textContent = completed;
        document.getElementById('metric-overdue').textContent = overdue;
    }

    isOverdue(task) {
        if (!task.dueDate || task.status === 'completed') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.parseDateOnly(task.dueDate).getTime() < today.getTime();
    }

    formatDueDate(value) {
        if (!value) return 'Sem prazo';
        return this.parseDateOnly(value).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
        });
    }

    parseDateOnly(value) {
        const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    showToast(message) {
        this.elements.toast.textContent = message;
        this.elements.toast.classList.remove('hidden');
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.elements.toast.classList.add('hidden');
        }, 2600);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
        };
        return String(text).replace(/[&<>"']/g, (match) => map[match]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KanbanBoard();
});

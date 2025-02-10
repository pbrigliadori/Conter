document.addEventListener('DOMContentLoaded', (event) => {
    const subjectForm = document.getElementById('subjectForm');
    const subjectInput = document.getElementById('subjectInput');
    const subjectList = document.getElementById('subjectList');
    const successAlert = document.getElementById('successAlert');
    const subjectModal = $('#subjectModal'); // Usando jQuery para manipular o modal
    const taskSelect = document.getElementById('taskSelect'); // Seleção de tarefas
    const clearTasksButton = document.getElementById('clearTasksButton'); // Botão para apagar todas as tarefas
    const confirmDeleteButton = document.getElementById('confirmDeleteButton'); // Botão de confirmação de exclusão
    const allTasksList = document.getElementById('allTasksList'); // Lista de todas as tarefas
    const tasksModal = $('#tasksModal'); // Modal para exibir todas as tarefas
    const taskDetailsModal = $('#taskDetailsModal'); // Modal para exibir detalhes da tarefa
    const taskDetailsBody = document.getElementById('taskDetailsBody'); // Corpo do modal de detalhes da tarefa

    // Adicionar tarefa "Tempo Livre" à seleção de tarefas
    addTaskToSelect('Tempo Livre');

    // Carregar tarefas salvas do localStorage
    loadTasks();

    // Adicionar evento de submit ao formulário
    subjectForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addTask(subjectInput.value);
        subjectInput.value = '';
    });

    // Adicionar evento de clique ao botão de apagar todas as tarefas
    clearTasksButton.addEventListener('click', () => {
        $('#deleteConfirmModal').modal('show');
    });

    // Adicionar evento de clique ao botão de confirmação de exclusão
    confirmDeleteButton.addEventListener('click', () => {
        clearAllTasks();
        $('#deleteConfirmModal').modal('hide');
    });

    // Adicionar evento de clique ao ícone para abrir o modal de todas as tarefas
    tasksModal.on('show.bs.modal', function () {
        loadAllTasks();
    });

    // Função para adicionar tarefa
    function addTask(task) {
        if (task.trim() === '' || task === 'Tempo Livre') return;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = task;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', function () {
            removeTask(li);
        });

        li.appendChild(removeButton);
        subjectList.appendChild(li);

        saveTask(task);
        addTaskToSelect(task); // Adiciona a tarefa à seleção de tarefas
        showSuccessAlert();
        subjectModal.modal('hide'); // Fechar o modal automaticamente
    }

    // Função para adicionar tarefa à seleção de tarefas
    function addTaskToSelect(task) {
        const option = document.createElement('option');
        option.value = task;
        option.textContent = task;
        taskSelect.appendChild(option);
    }

    // Função para remover tarefa
    function removeTask(taskElement) {
        const task = taskElement.textContent.replace('Remover', '').trim();
        taskElement.remove();
        deleteTask(task);
        removeTaskFromSelect(task); // Remove a tarefa da seleção de tarefas
    }

    // Função para remover tarefa da seleção de tarefas
    function removeTaskFromSelect(task) {
        const options = taskSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === task) {
                taskSelect.remove(i);
                break;
            }
        }
    }

    // Função para salvar tarefa no localStorage
    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ name: task, time: 0 });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para deletar tarefa do localStorage
    function deleteTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.name !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para carregar tarefas do localStorage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.name && task.time !== undefined) {
                displayTask(task.name);
                addTaskToSelect(task.name); // Adiciona a tarefa à seleção de tarefas ao carregar
            }
        });
    }

    // Função para exibir tarefa sem salvar novamente
    function displayTask(task) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = task;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', function () {
            removeTask(li);
        });

        li.appendChild(removeButton);
        subjectList.appendChild(li);
    }

    // Função para apagar todas as tarefas
    function clearAllTasks() {
        subjectList.innerHTML = '';
        taskSelect.innerHTML = '<option value="" disabled selected>Selecione uma tarefa</option>';
        addTaskToSelect('Tempo Livre'); // Adiciona novamente a tarefa "Tempo Livre"
        localStorage.removeItem('tasks');
    }

    // Função para carregar todas as tarefas no modal
    function loadAllTasks() {
        allTasksList.innerHTML = '';
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.name && task.time !== undefined && task.name !== 'Tempo Livre') {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                const span = document.createElement('span');
                span.className = 'list-group-item-text';
                span.textContent = `${task.name} - Tempo: ${formatTime(task.time)}`;
                li.appendChild(span);
                li.addEventListener('click', () => {
                    taskDetailsBody.innerHTML = `Tarefa: ${task.name}<br>Tempo total: ${formatTime(task.time)}`;
                    taskDetailsModal.modal('show');
                });
                allTasksList.appendChild(li);
            }
        });
    }

    // Função para formatar o tempo em horas, minutos e segundos
    function formatTime(time) {
        let hours = Math.floor(time / 3600000);
        let minutes = Math.floor((time % 3600000) / 60000);
        let seconds = Math.floor((time % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    // Função para mostrar o alerta de sucesso
    function showSuccessAlert() {
        successAlert.classList.add('show');
        successAlert.classList.remove('fade');
        setTimeout(() => {
            successAlert.classList.remove('show');
            successAlert.classList.add('fade');
        }, 3000); // Alerta desaparece após 3 segundos
    }
});
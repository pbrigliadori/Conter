document.addEventListener('DOMContentLoaded', (event) => {
    const subjectForm = document.getElementById('subjectForm');
    const subjectInput = document.getElementById('subjectInput');
    const subjectList = document.getElementById('subjectList');
    const successAlert = document.getElementById('successAlert');
    const subjectModal = $('#subjectModal'); // Usando jQuery para manipular o modal
    const taskSelect = document.getElementById('taskSelect'); // Seleção de tarefas
    const clearTasksButton = document.getElementById('clearTasksButton'); // Botão para apagar todas as tarefas

    // Carregar tarefas salvas do localStorage
    loadTasks();

    // Adicionar evento de submit ao formulário
    subjectForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addTask(subjectInput.value);
        subjectInput.value = '';
    });

    // Adicionar evento de clique ao botão de apagar todas as tarefas
    clearTasksButton.addEventListener('click', clearAllTasks);

    // Função para adicionar tarefa
    function addTask(task) {
        if (task.trim() === '') return;

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
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para deletar tarefa do localStorage
    function deleteTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para carregar tarefas do localStorage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            displayTask(task);
            addTaskToSelect(task); // Adiciona a tarefa à seleção de tarefas ao carregar
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
        localStorage.removeItem('tasks');
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
document.addEventListener('DOMContentLoaded', (event) => {
    const subjectForm = document.getElementById('subjectForm');
    const subjectInput = document.getElementById('subjectInput');
    const subjectList = document.getElementById('subjectList');
    const successAlert = document.getElementById('successAlert');
    const subjectModal = $('#subjectModal'); // Usando jQuery para manipular o modal

    // Carregar tarefas salvas do localStorage
    loadTasks();

    // Adicionar evento de submit ao formulário
    subjectForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addTask(subjectInput.value);
        subjectInput.value = '';
    });

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
        showSuccessAlert();
        subjectModal.modal('hide'); // Fechar o modal automaticamente
    }

    // Função para remover tarefa
    function removeTask(taskElement) {
        const task = taskElement.textContent.replace('Remover', '').trim();
        taskElement.remove();
        deleteTask(task);
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
        tasks.forEach(task => displayTask(task));
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
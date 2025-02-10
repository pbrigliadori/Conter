document.addEventListener('DOMContentLoaded', (event) => {
    let timerButton = document.getElementById('timerButton');
    let stopButton = document.getElementById('stopButton');
    let resetButton = document.getElementById('resetButton');
    let confirmResetButton = document.getElementById('confirmResetButton');
    let taskSelect = document.getElementById('taskSelect');

    let timerInterval;
    let startTime;         // Momento em que a sessão atual é iniciada
    let storedTime = 0;    // Tempo total acumulado (obtido do localStorage e atualizado ao pausar)
    let sessionElapsed = 0; // Tempo da sessão atual (em milissegundos)
    let isRunning = false;
    let currentTask = null;

    timerButton.addEventListener('click', () => {
        if (!isRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    stopButton.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        }
        resetTimer();
    });

    resetButton.addEventListener('click', () => {
        $('#resetConfirmModal').modal('show');
    });

    confirmResetButton.addEventListener('click', () => {
        resetTimer();
        $('#resetConfirmModal').modal('hide');
    });

    function startTimer() {
        if (taskSelect.value === "") {
            $('#selectTaskModal').modal('show');
            return;
        }
        currentTask = taskSelect.value;
        // Se é o início de uma nova sessão (sessionElapsed === 0), carregamos o total armazenado
        // Caso contrário, estamos retomando a mesma sessão e não queremos resetar o tempo atual.
        if (sessionElapsed === 0) {
            storedTime = getTaskTime(currentTask);
        }
        // Inicia ou retoma a contagem: a nova sessão continuará a partir de sessionElapsed
        startTime = Date.now();
        timerButton.classList.add('running');
        timerButton.innerText = "PAUSAR";
        timerInterval = setInterval(updateTimer, 1000);
        isRunning = true;
    }

    function pauseTimer() {
        if (!isRunning) return;
        clearInterval(timerInterval);
        // Calcula o tempo decorrido nesta sessão (desde o último start)
        let currentSessionTime = Date.now() - startTime;
        // Acumula esse tempo na sessão atual
        sessionElapsed += currentSessionTime;
        // Atualiza o total armazenado (somando o que já havia em storedTime)
        let newTotal = storedTime + sessionElapsed;
        saveTaskTime(currentTask, newTotal);
        timerButton.classList.remove('running');
        // Exibe no display apenas o tempo desta sessão (para o usuário ver "quanto fez hoje")
        timerButton.innerText = formatTime(sessionElapsed);
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        // Aqui, resetamos somente os dados da sessão atual;
        // o tempo total armazenado no localStorage permanece intacto.
        sessionElapsed = 0;
        timerButton.innerText = 'INICIAR';
        timerButton.classList.remove('running');
        isRunning = false;
    }

    // Enquanto o timer estiver rodando, atualiza o display somando o tempo da sessão atual já acumulado e o tempo decorrido desde o último start.
    function updateTimer() {
        if (isRunning) {
            let currentSessionTime = sessionElapsed + (Date.now() - startTime);
            timerButton.innerText = formatTime(currentSessionTime);
        }
    }

    // Formata o tempo (em ms) para "HH:MM:SS" ou "MM:SS"
    function formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }

    function saveTaskTime(task, totalTime) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let taskIndex = tasks.findIndex(t => t.name === task);
        if (taskIndex !== -1) {
            tasks[taskIndex].time = totalTime;
        } else {
            tasks.push({ name: task, time: totalTime });
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTaskTime(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let foundTask = tasks.find(t => t.name === task);
        return foundTask ? foundTask.time : 0;
    }
});
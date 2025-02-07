document.addEventListener('DOMContentLoaded', (event) => {
    let timerButton = document.getElementById('timerButton');
    let resetButton = document.getElementById('resetButton');
    let timerInterval;
    let startTime;
    let elapsedTime = 0;
    let isRunning = false;

    timerButton.addEventListener('click', () => {
        if (!isRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    resetButton.addEventListener('click', () => {
        resetTimer();
    });

    function startTimer() {
        startTime = Date.now() - elapsedTime;
        timerButton.classList.add('running'); // Adiciona a classe 'running'
        updateTimer(); // Atualiza o temporizador imediatamente
        timerInterval = setInterval(updateTimer, 1000);
        isRunning = true;
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        elapsedTime = Date.now() - startTime;
        updateTimer(); // Atualiza o temporizador imediatamente
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        elapsedTime = 0;
        timerButton.innerText = 'INICIAR';
        timerButton.classList.remove('running'); // Remove a classe 'running'
        isRunning = false;
    }

    function updateTimer() {
        elapsedTime = Date.now() - startTime;
        let hours = Math.floor(elapsedTime / 3600000);
        let minutes = Math.floor((elapsedTime % 3600000) / 60000);
        let seconds = Math.floor((elapsedTime % 60000) / 1000);

        if (hours > 0) {
            timerButton.innerText = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            timerButton.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    const initialTimeInput = document.getElementById('initial-time');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const inputContainer = document.getElementById('input-container');

    let timerInterval;
    let timeLeft;
    let initialTime;

    // Function to update the timer display
    function updateTimerDisplay() {
        const days = Math.floor(timeLeft / 86400);
        const hours = Math.floor((timeLeft % 86400) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = Math.floor(timeLeft % 60);
        timerDisplay.textContent = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            localStorage.setItem('timeLeft', timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "Time's up!";
                resetButton.style.display = 'none';
            }
        }, 1000);
        localStorage.setItem('timerStartTime', Date.now());
    }

    // Load saved time from localStorage
    let timerStartTime = localStorage.getItem('timerStartTime');
    if (localStorage.getItem('timeLeft')) {
        timeLeft = parseInt(localStorage.getItem('timeLeft'));

        if (timerStartTime) {
            let elapsedTime = Date.now() - parseInt(timerStartTime);
            timeLeft -= Math.floor(elapsedTime / 1000);

            if (timeLeft < 0) {
                timeLeft = 0;
            }
        }

        updateTimerDisplay();
        resetButton.style.display = 'block';
        inputContainer.style.display = 'none';
        startTimer();
    } else {
        resetButton.style.display = 'none';
    }

    // Start button click
    startButton.addEventListener('click', () => {
        initialTime = parseInt(initialTimeInput.value);
        const timeUnit = document.getElementById('time-unit').value;
        let timeInSeconds = initialTime;

        if (timeUnit === 'minutes') {
            timeInSeconds = initialTime * 60;
        } else if (timeUnit === 'days') {
            timeInSeconds = initialTime * 86400;
        }

        timeLeft = timeInSeconds;
        localStorage.setItem('timeLeft', timeLeft);
        localStorage.setItem('timeUnit', timeUnit);
        updateTimerDisplay();
        inputContainer.style.display = 'none';
        resetButton.style.display = 'block';
        localStorage.setItem('initialTime', initialTime);
        startTimer();
    });

    // Reset button click
    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        initialTime = parseInt(localStorage.getItem('initialTime'));
        const timeUnit = localStorage.getItem('timeUnit');
        let timeInSeconds = initialTime;

        if (timeUnit === 'minutes') {
            timeInSeconds = initialTime * 60;
        } else if (timeUnit === 'days') {
            timeInSeconds = initialTime * 86400;
        }

        timeLeft = timeInSeconds;
        updateTimerDisplay();
        startTimer();
        localStorage.setItem('timerStartTime', Date.now());
    });

    function restartTimer() {
        clearInterval(timerInterval);
        localStorage.removeItem('timeLeft');
        localStorage.removeItem('timerStartTime');
        timerDisplay.textContent = '00:00:00';
        inputContainer.style.display = 'block';
        resetButton.style.display = 'none';
    }

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', restartTimer);
});
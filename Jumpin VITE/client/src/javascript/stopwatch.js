// DIT GEDEELTE VIA CHATGPT GROTENDEELS

const timerDisplay = document.querySelector('#timer-display');

let startTime;
let timerInterval;

function updateTimerDisplay() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    const milliseconds = elapsedTime % 1000;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);

    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

export function startTimer() {
    clearInterval(timerInterval);

    startTime = new Date().getTime();

    updateTimerDisplay();

    timerInterval = setInterval(updateTimerDisplay, 1);
}

export function stopTimer() {
    clearInterval(timerInterval);
}
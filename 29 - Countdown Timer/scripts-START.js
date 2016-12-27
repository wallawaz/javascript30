//lives in window;
let countdown;

const timerDisplay = document.querySelector('.display__time-left');
const timerEndTime = document.querySelector('.display__end-time');

//any element with data-time set.
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds) {

    //clear any existing timer
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    //run immediately to show time left on first second.
    displayTimeLeft(seconds);
    displayEndTime(then);
    
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    //console.log({minutes, remainderSeconds});
    displayTime = `${minutes}:${remainderSeconds < 10 ? '0'+remainderSeconds : remainderSeconds}`;
    timerDisplay.textContent = displayTime;

    //change <title> tag (tab title);
    document.title = displayTime;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const min = end.getMinutes();
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    const adjustedMin = min < 10 ? '0'+min : min;
    timerEndTime.textContent = `Be Back At ${adjustedHour}:${adjustedMin}`;
}

function startTimer() {
    additionalSeconds = parseInt(this.dataset.time);
    console.log(additionalSeconds);
    timer(additionalSeconds);
}

buttons.forEach(button => {
    button.addEventListener('click', startTimer);
})


//if element has a <name> we can just refer to it from document.
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();

    //`this` is the customForm because we are adding the eventListener on it.
    const mins = parseInt(this.minutes.value);
    this.reset();

    if (mins) {
        timer(mins * 60);
    }
    else {
        alert('Please enter a valid number of minutes')
    }
    
});
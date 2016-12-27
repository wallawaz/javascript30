/* selections */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

console.dir(video);

/* functions */
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updateButton() {
    //update the player button text
    const icon = this.paused ? '►': '❙❙';
    toggle.textContent = icon;
}

function skip() {
    console.log('skipping');
    //console.dir(video);
    const skipValue = parseFloat(this.dataset.skip);
    video.currentTime += skipValue;
}

function handleRangeUpdate() {
    switch (this.name) {
        case 'volume':
            video.volume = parseFloat(this.value);
            break;
        case 'playbackRate':
            video.playbackRate = parseFloat(this.value);
            break;
        default:
            console.error('Implementation Error');
    }
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    //bar is positioned relative..
    //we can use offsetX to get relative position clicked.
    //use offsetWidth to get the width of the parent element.
    console.log(e);
    if (!mouseDown) return;
    const percent = e.offsetX / progress.offsetWidth;
    const newTime = percent * video.duration;
    video.currentTime = newTime;
}

/*===== Hook functions with Event Listeners =====*/
video.addEventListener('click', togglePlay);

//whatever causes the video to pause/play
//might not necessarily be a click event.
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);


toggle.addEventListener('click', togglePlay);

//any element that has a [data-skip] attr.
skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('click', handleRangeUpdate));

let mouseDown = false;
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', scrub);

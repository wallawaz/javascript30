const video = document.querySelector('.player'); //from webcam.
const canvas = document.querySelector('.photo'); //piped to canvas ever n milliseconds.
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let currentFilter;
//const filters = document.querySelector('#filters');
//console.log(filters);

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}) //promise returned.
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.error('oh no!!!', err);
        })
}

//paint video to canvas...
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    //console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height); //gigantic million element array of pixels.

        if (currentFilter && currentFilter != 'clear') {
            pixels = window[currentFilter](pixels);
        }
        ctx.putImageData(pixels, 0, 0);
    }, 16); //every 16 milliseconds
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const photoLink = document.createElement('a');
    photoLink.href = data;
    photoLink.setAttribute('download', 'handsome');
    photoLink.innerHTML = `<img src="${data}" alt="Handsome" />`;
    
    strip.insertBefore(photoLink, strip.firstChild);
}

function redEffect(pixels) {
                                    //rbga
    for (let i=0; i < pixels.data.length; i+=4) {
        //r
        pixels.data[i+0] = pixels.data[i+0] + 100;
        //g
        pixels.data[i+1] = pixels.data[i+1] - 50;
        //b
        pixels.data[i+2] = pixels.data[i+2] - 75;
    }
    return pixels;
}

function rbgSplit(pixels) {
    for (let i=0; i < pixels.data.length; i+=4) {
        //r
        pixels.data[i - 150] = pixels.data[i+0];
        //g
        pixels.data[i + 500] = pixels.data[i+1];
        //b
        pixels.data[i - 150] = pixels.data[i+2];
    }
    return pixels;
}


function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 3) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (i % 33000 === 0) {
        console.log({'red': red, 'green': green, 'blue': blue});
        console.log(levels);
    }

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}


function filterHandler(e) {
    func = e.target.id;
    currentFilter = func;
    console.log(currentFilter);
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
filters.addEventListener('click', filterHandler);
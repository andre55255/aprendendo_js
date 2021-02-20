const menu = document.querySelector('._47KiJ');

const div = document.createElement('div');
div.innerHTML = "2X";
div.classList.add('ico');
menu.insertAdjacentElement('afterbegin', div);

setTimeout(() => {
    document.querySelector('.ico').addEventListener("click", function() {
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            audio.playbackRate = 2;
        });
    })
}, 1200);
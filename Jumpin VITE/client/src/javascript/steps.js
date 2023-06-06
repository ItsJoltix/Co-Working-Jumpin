'use strict';
(function () {
    const steps = document.querySelectorAll('.steps li');
    const contents = document.querySelectorAll('.rulesContent');

    contents[0].classList.add('visible');
    steps[0].classList.add('current');

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {

            // OVERAL VISIBLE TOEVOEGEN
            contents.forEach(content => content.classList.remove('visible'));
            contents.forEach(content => content.classList.add('hidden'));

            // AAN DE GESELECTEERDE STAP DE VISIBLE TERUG TOEVOEGEN
            const selectedContent = document.querySelector(`#${step.firstElementChild.hash.slice(1)}`);
            selectedContent.classList.remove('hidden');
            selectedContent.classList.add('visible');

            steps.forEach(step => step.classList.remove('current'));
            step.classList.add('current');
        });
    });
})();


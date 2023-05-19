'use strict';

// Haal alle elementen op die we nodig hebben
const steps = document.querySelectorAll('.steps li');
const contents = document.querySelectorAll('.rulesContent');

// Toon de inhoud van stap 1 bij het laden van de pagina
contents[0].style.display = 'block';
steps[0].classList.add('current');

// Voeg een click event listener toe aan elke stap
steps.forEach((step, index) => {
    step.addEventListener('click', () => {
        // Verberg alle inhoud
        contents.forEach(content => content.style.display = 'none');
        // Toon alleen de geselecteerde stap
        document.querySelector(`#${step.firstElementChild.hash.slice(1)}`).style.display = 'block';
        // Verwijder de huidige actieve klas van alle stappen
        steps.forEach(step => step.classList.remove('current'));
        // Voeg de huidige actieve klas toe aan de geselecteerde stap
        step.classList.add('current');
    });
});



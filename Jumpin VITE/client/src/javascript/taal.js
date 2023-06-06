'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const langArr = {
        "high_scores": {
            "ne": "Tips",
            "de": "Tips",
            "en": "Tips",
            "fr": "Tips",
        },
        "startgame":{
            "ne": "Welkom bij Jumpin, kies een naam en start",
            "de": "Willkommen bei Jumpin, wählen Sie einen Namen und starten Sie",
            "en": "Welcome to Jumpin, choose a name and start",
            "fr": "Bienvenue sur Jumpin, choisissez un nom et commencez",
        },
        "snelste_tijden": {
            "ne": "Snelste Tijden",
            "de": "Schnellste Zeiten",
            "en": "Fastest Times",
            "fr": "Temps les plus rapides",
        },
        "stap1": {
            "ne": "Stap",
            "de": "Schritt",
            "en": "Step",
            "fr": "Étape",
        },
        "stap2": {
            "ne": "Stap",
            "de": "Schritt",
            "en": "Step",
            "fr": "Étape",
        },
        "stap3": {
            "ne": "Stap",
            "de": "Schritt",
            "en": "Step",
            "fr": "Étape",
        },
        "text_stap1": {
            "ne": "Kies één van de 8 beschikbare levels om te spelen. De moeilijkheid stijgt per level.",
            "de": "Wählen Sie einen der 8 verfügbaren Levels aus, um zu spielen. Der Schwierigkeitsgrad steigt mit jedem Level.",
            "en": "Choose one of the 8 available levels to play. The difficulty increases with each level.",
            "fr": "Choisissez l'un des 8 niveaux disponibles pour jouer. La difficulté augmente à chaque niveau.",
        },
        "text_stap2": {
            "ne": "Verplaats de kikkers en de reigers, totdat alle kikkers veilig in een hol zitten.",
            "de": "Bewege die Frösche und Reiher, bis alle Frösche sicher in einem Loch sind.",
            "en": "Move the frogs and the herons until all the frogs are safely in a burrow.",
            "fr": "Déplacez les grenouilles et les hérons jusqu'à ce que toutes les grenouilles soient en sécurité dans un terrier.",
        },
        "text_stap3": {
            "ne": "Je hebt een oplossing gevonden wanneer alle kikkers veilig in een hol zitten.",
            "de": "Du hast eine Lösung gefunden, wenn alle Frösche sicher in einem Loch sind.",
            "en": "You have found a solution when all the frogs are safely in a hole.",
            "fr": "Vous avez trouvé une solution lorsque toutes les grenouilles sont en sécurité dans un trou.",
        },
    };

    const select = document.querySelector('select');
    const allLang = ['ne', 'de', 'en', 'fr'];

    select.addEventListener('change', changeLanguage);

    function changeLanguage() {
        let lang = select.value;
        localStorage.setItem('selectedLanguage', lang);
        updateTexts(lang);
    }

    function updateTexts(lang) {
        select.value = lang;

        for (let key in langArr) {
            let elem = document.querySelectorAll('.lng-' + key);

            for (let el = 0; el < elem.length; el++) {
                elem[el].innerHTML = langArr[key][lang];
            }
        }
    }

    function initializeLanguage() {
        let storedLang = localStorage.getItem('selectedLanguage');
        let hash = window.location.hash.substr(1, 2);
        let lang = allLang.includes(storedLang) ? storedLang : hash || 'ne';

        if (!allLang.includes(hash)) {
            location.href = window.location.pathname + '#ne';
        }

        updateTexts(lang);
    }
    initializeLanguage();
});

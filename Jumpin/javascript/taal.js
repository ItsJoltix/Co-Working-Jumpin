'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const langArr = {
      "high_scores": {
        "ne": "Hoge Scores",
        "de": "Hohe Punktzahlen",
        "en": "High Score",
        "fr": "Scores élevés",
      },
      "snelste_tijden": {
        "ne": "Snelste Tijden",
        "de": "Schnellste Zeiten",
        "en": "Fastest Times",
        "fr": "Temps les plus rapides",
      },
      "stap1": {
        "ne": "Stap 1",
        "de": "Schritt 1",
        "en": "Step 1",
        "fr": "Étape 1",
      },
      "stap2": {
        "ne": "Stap 2",
        "de": "Schritt 2",
        "en": "Step 2",
        "fr": "Étape 2",
      },
      "stap3": {
        "ne": "Stap 3",
        "de": "Schritt 3",
        "en": "Step 3",
        "fr": "Étape 3",
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

    select.addEventListener('change', changeURLLanguage);

    function changeURLLanguage() {
      let lang = select.value;
      location.href = window.location.pathname + '#' + lang;
      location.reload();
    }

    function changeLanguage() {
      let hash = window.location.hash.substr(1, 2);
      console.log(hash);
      if (!allLang.includes(hash)) {
        location.href = window.location.pathname + '#en';
        location.reload();
      }
      select.value = hash;
      for (let key in langArr) {
        let elem = document.querySelectorAll('.lng-' + key);

        for (let el = 0; el < elem.length; el++) {
          if (elem) {
            elem[el].innerHTML = langArr[key][hash];
          }
        }
      }
    }

    changeLanguage();
  });
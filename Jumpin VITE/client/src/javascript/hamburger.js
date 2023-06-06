'use strict';
(function () {

    const menuBtn = document.querySelector('#menu');
    const nav = document.querySelector('nav');
    const lang = document.querySelector('#languages');

    menuBtn.addEventListener('click', function () {

        const expanded = this.getAttribute('aria-expanded') === "true";
        this.setAttribute('aria-expanded', !expanded);

        if (expanded) {
            nav.classList.remove('visible')
            nav.classList.add('hidden')
            lang.classList.remove('visible')
            lang.classList.add('hidden')
        } else {
            nav.classList.remove('hidden')
            nav.classList.add('visible')
            lang.classList.remove('hidden')
            lang.classList.add('visible')
        }
    });

    const mediaQuery = window.matchMedia('(min-width: 46.875em)');

    function checkMediaQuery() {
        if (mediaQuery.matches) {
            nav.classList.remove('hidden');
            nav.classList.remove('visible');
            lang.classList.remove('hidden');
            lang.classList.remove('visible');
            menuBtn.setAttribute('aria-expanded', "false");
        }
    }

    window.addEventListener("resize", checkMediaQuery);
})();
'use strict';
(function(){
    const langArr = {
        "intro":  {
            "ne": "h,scm=le,dc",
            "de": "emcl,mel=,e",
            "en": "bmù=cql,ùqm,",
            "fr": "dmql,clm,e",
        },
    }

    const select = document.querySelector('select');
    const allLang = ['ne', 'de', 'en', 'fr'];

    select.addEventListener('change', changeURLLanguage);

    function changeURLLanguage() {
        let lang = select.value;
        location.href = window.location.pathname + '#' + lang;
        location.reload();
    }

    function changeLanguage() {
        let hash = window.location.hash.substr(1,2);
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
})();
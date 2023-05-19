'use strict';

const select = document.querySelector('select');
const allLang = ['ne', 'de', 'en', 'fr'];

(function(){
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
})()
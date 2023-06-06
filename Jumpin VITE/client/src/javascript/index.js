import {FormValidator} from './formValidator.js'
const form = document.querySelector('#myVerySpecialForm');

try{
    const formValidator = new FormValidator(form);
    formValidator.addValidator({
        name: 'firstname',
        method: (field) => field.value.trim().length > 0,
        message: 'Voornaam is een verplicht veld en is niet ingevuld'
    })
    formValidator.addValidator({
        name: 'name',
        method: (field) => field.value.trim().length > 0,
        message: 'Naam is een verplicht veld en is niet ingevuld'
    })
    formValidator.addValidator({
        name: 'email',
        method: (field) => field.value.trim().length > 0,
        message: 'E-mail is een verplicht veld en is niet ingevuld'
    })
    formValidator.addValidator({
        name: 'message',
        method: (field) => field.value.trim().length > 0,
        message: 'Bericht is een verplicht veld en is niet ingevuld'
    })
    formValidator.addValidator({
        name: 'score',
        method: (field) => {
            const score = parseFloat(field.value.trim());
            return score >= 1 && score <= 5;
        },
        message: 'Score is een verplicht veld en moet tussen de 1 en 5 liggen'
    })
    formValidator.addValidator({
        name: 'privacy',
        method: (field) => field.checked,
        message: 'Privacy agreement is een verplicht veld en is niet ingevuld'
    })


    form.addEventListener('submit', function(event) {
        event.preventDefault()
    })
}

catch (error){
    console.log(error)
}
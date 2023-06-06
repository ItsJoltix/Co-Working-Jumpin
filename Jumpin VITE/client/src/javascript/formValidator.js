export class FormValidator {

    validators = [];
    errors = [];

    constructor(form) {
        if (!form) {
            throw new Error('Form is undefined');
        }
        this.form = form;
        this.form.addEventListener('submit', (event) => {
            this.errors = [];
            if (this.validate()) {
                this.onSubmit(event);
            }
        });
    }

    addValidator(validator) {
        this.validators.push({
            // spread de validator,
            ...validator,
            field: this.form.elements[validator.name]
        })
    }

    validate() {
        this.removeInlineError();

        for (let i = 0; i < this.validators.length; i++) {
            if (!this.validators[i].method(this.validators[i].field)) {
                if (this.errors.includes(this.validators[i])) {
                    return;
                }
                this.errors.push(this.validators[i]);
            }
        }
        this.showInlineError();

        return this.errors.length === 0;
    }

    createInlineError(error) {
        const span = document.createElement("span");
        span.classList.add('field-error');
        span.innerHTML = error.message;
        span.setAttribute('id', `${error.name}-error`);
        return span;
    }

    showInlineError() {
        for (let i = 0; i < this.errors.length; i++) {
            const error = this.errors[i];
            const errorElement = this.createInlineError(error);
            const field = error.field;

            if (field instanceof NodeList) {
                field.forEach(node => {
                    // add class 'invalid' to node
                    node.classList.add('invalid');
                    // set attribute 'aria-invalid' to 'true'
                    node.setAttribute('aria-invalid', 'true');
                    // set attribute 'aria-describedby' to errorElement.id
                    node.setAttribute('aria-describedby', errorElement.id);
                });
                // find fieldset
                const fieldSet = field[0].closest('fieldset');
                if (fieldSet) {
                    // add error element to legend
                    const legend = fieldSet.querySelector('legend');
                    if (legend) {
                        legend.appendChild(errorElement);
                    }
                }
            } else {
                // add class 'invalid' to field
                field.classList.add('invalid');
                // set attribute 'aria-invalid' to 'true'
                field.setAttribute('aria-invalid', 'true');
                // add error element to label
                const label = document.querySelector(`label[for=${field.id}]`);
                if (label) {
                    label.appendChild(errorElement);
                }
                // set attribute 'aria-describedby' to errorElement.id
                field.setAttribute('aria-describedby', errorElement.id);
            }
        }
    }

    removeInlineError() {
        // zoek en verwijder alle elementen **in het formulier**
        // met de class `.field-error`
        this.form.querySelectorAll('.field-error')
            .forEach(element => element.remove());

        this.form.querySelectorAll('.invalid')//rood vakje
            .forEach(element => {
                element.removeAttribute('aria-invalid');
                element.removeAttribute('aria-describedby');
                element.classList.remove('invalid');
            });
    }



    onSubmit(event) {
        event.preventDefault();
        console.log('Submit gelukt! Geen errors!')

        this.removeInlineError();
        let nameElement = document.querySelector('#name')
        let firstnameElement = document.querySelector('#firstname')
        let emailElement = document.querySelector('#email')
        let messageElement = document.querySelector('#message')
        let scoreElement = document.querySelector('#score')

        const data = {
            name: nameElement.value,
            fname: firstnameElement.value,
            email: emailElement.value,
            message: messageElement.value,
            score: scoreElement.value
        }


        fetch('http://localhost:3000/api/v1/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                // Handle the response from the server
                console.log(result);
            })
            .then(() => {
                window.location.href = 'thankyou/';
            })
            .catch(error => {
                // Handle any errors that occurred during the request
                console.error('Error:', error);
            });
    }
}

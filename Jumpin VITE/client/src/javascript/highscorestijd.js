
export function fetchHighscores() {
        const highscoresContainer = document.querySelector('#highscorestijden');
        highscoresContainer.innerHTML = '';
        let currentLevel = localStorage.getItem('currentLevel');
        if (!currentLevel) {
            currentLevel = 0;
        }
        currentLevel = parseInt(currentLevel) + 1;
        fetch(`http://localhost:3000/api/v1/highscores?idlevel=${currentLevel}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    let naam = data[i].naam;
                    let tijd = data[i].tijd;

                    highscoresContainer.innerHTML += `<li>${naam} - <span class="green">${tijd}s</span></li>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }




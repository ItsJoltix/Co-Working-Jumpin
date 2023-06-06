const sortBtn = document.querySelector('#sortBtn');
const sortBySelected = document.querySelector('#sortBy');
const sortOrderSelected = document.querySelector('#sortOrder');

sortBtn.addEventListener('click', () => {
    fetchReviews(sortBySelected.value, sortOrderSelected.value);
})


function fetchReviews(sortBy, sortOrder){
    fetch(`http://localhost:3000/api/v1/reviews?sortBy=${sortBy}&sortOrder=${sortOrder}`)
        .then(response => response.json())
        .then(reviews => {
            console.log(reviews);
            const container = document.getElementById('reviews-container');
            container.innerHTML = '';
            reviews.forEach(review => {
                const card = document.createElement('div');
                card.classList.add('review-card');

                const name = document.createElement('h3');
                name.textContent = `${review.name} ${review.firstname}`;
                card.appendChild(name);

                const message = document.createElement('p');
                message.textContent = review.message;
                card.appendChild(message);

                const score = document.createElement('div');
                score.classList.add('score')
                let starHTML = '';
                for (let i = 0; i < review.score; i++) {
                    starHTML += '<span><i class="fa-solid fa-star"></i></span>';
                }
                score.innerHTML = starHTML;
                card.appendChild(score);

                const time = document.createElement('p');
                time.textContent = review.time;
                card.appendChild(time);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}

fetchReviews();




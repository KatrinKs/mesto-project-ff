export function createCard(cardTemplate, cardData, deleteCard, likeCard, openImagePopup) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    
    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;

    const cardTitle = cardElement.querySelector('.card__title');
    cardTitle.textContent = cardData.name;

    const deleteButton = cardElement.querySelector('.card__delete-button'); 
    deleteButton.addEventListener('click', () => {
        deleteCard(cardElement);
    });

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', likeCard);

    if (openImagePopup) {
        cardImage.addEventListener('click', () => {
            openImagePopup(cardData.link, cardData.name);
        });
    }

    return cardElement; 
}

export function handleLikeClick(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}

export function deleteCard(cardElement) {
    if (cardElement instanceof HTMLElement) {
        cardElement.remove(); 
    } else {
        console.error('cardElement не является DOM элементом:', cardElement);
    }
}
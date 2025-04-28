// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function addCard(cardData, deleteCard) {
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

    return cardElement; 
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
    if (cardElement instanceof HTMLElement) {
        cardElement.remove(); 
    } else {
        console.error('cardElement не является DOM элементом:', cardElement);
    }
}

// @todo: Вывести карточки на страницу
initialCards.forEach(cardData => {
    const cardElement = addCard(cardData, deleteCard); 
    placesList.append(cardElement); 
});

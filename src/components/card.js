export function createCard(cardTemplate, cardData, userId, deleteCallback, likeCallback, openImageCallback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes?.length || 0;
  
  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      deleteCallback(cardData._id, cardElement);
});
  }
  
  const isLiked = cardData.likes?.some(user => user._id === userId) || false;
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }
  
  likeButton.addEventListener('click', () => likeCallback(cardData._id, likeButton, likeCount));
  cardImage.addEventListener('click', () => openImageCallback(cardData.link, cardData.name));
  
  return cardElement;
}
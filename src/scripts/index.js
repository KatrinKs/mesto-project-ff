import '../pages/index.css';
import {
  openPopup,
  closePopup,
  createCard,
  enableValidation,
  clearValidation,
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
  updateAvatar,

  constants
} from '../components';

let userId;

function initApp() {
  enableValidation(constants.validationConfig);
  
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      userId = userData._id;
      updateProfileInfo(userData);
      renderCards(cards);
    })
    .catch(err => console.error('Ошибка загрузки данных:', err));
}

function updateProfileInfo(userData) {
  constants.profileTitle.textContent = userData.name;
  constants.profileDescription.textContent = userData.about;
  constants.profileImage.style.backgroundImage = `url(${userData.avatar})`;
}

function renderCards(cards) {
  cards.forEach(cardData => {
    const cardElement = createCard(
      constants.cardTemplate, 
      cardData, 
      userId,
      handleDeleteCard, 
      handleLikeCard, 
      openImagePopup
    );
    constants.cardsContainer.append(cardElement);
  });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  
  updateUserInfo(constants.nameInput.value, constants.jobInput.value)
    .then(userData => {
      updateProfileInfo(userData);
      closePopup(constants.editPopup);
    })
    .catch(err => console.error('Ошибка обновления профиля:', err))
    .finally(() => submitButton.textContent = 'Сохранить');
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  submitButton.textContent = 'Создание...';
  
  addNewCard(constants.cardNameInput.value, constants.cardLinkInput.value)
    .then(newCard => {
      const cardElement = createCard(
        constants.cardTemplate,
        newCard,
        userId,
        handleDeleteCard,
        handleLikeCard,
        openImagePopup
      );
      constants.cardsContainer.prepend(cardElement);
      closePopup(constants.newCardPopup);
      constants.newCardForm.reset();
    })
    .catch(err => console.error('Ошибка добавления карточки:', err))
    .finally(() => submitButton.textContent = 'Создать');
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  
  updateAvatar(constants.avatarLinkInput.value)
    .then(userData => {
      constants.profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(constants.avatarPopup);
      constants.avatarForm.reset();
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => submitButton.textContent = 'Сохранить');
}

function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => cardElement.remove())
    .catch(err => console.error('Ошибка удаления карточки:', err));
}

function handleLikeCard(cardId, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const likeMethod = isLiked ? unlikeCard : likeCard;
  
  likeMethod(cardId)
    .then(card => {
      likeCountElement.textContent = card.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch(err => console.error('Ошибка лайка:', err));
}

function openImagePopup(link, name) {
  constants.popupImage.src = link;
  constants.popupImage.alt = name;
  constants.popupCaption.textContent = name;
  openPopup(constants.imagePopup);
}

function fillProfileForm() {
  constants.nameInput.value = constants.profileTitle.textContent;
  constants.jobInput.value = constants.profileDescription.textContent;
  clearValidation(constants.formElement, constants.validationConfig);
}

function setEventListeners() {
  constants.editButton.addEventListener('click', () => {
    fillProfileForm();
    openPopup(constants.editPopup);
  });

  constants.addButton.addEventListener('click', () => {
    constants.newCardForm.reset();
    clearValidation(constants.newCardForm, constants.validationConfig);
    openPopup(constants.newCardPopup);
  });

  constants.avatarEditButton.addEventListener('click', () => {
    constants.avatarForm.reset();
    clearValidation(constants.avatarForm, constants.validationConfig);
    openPopup(constants.avatarPopup);
  });

  constants.closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.closest('.popup');
      closePopup(popup);
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup_is-opened')) {
      closePopup(e.target);
    }
  });

  constants.formElement.addEventListener('submit', handleProfileFormSubmit);
  constants.newCardForm.addEventListener('submit', handleNewCardSubmit);
  constants.avatarForm.addEventListener('submit', handleAvatarFormSubmit);
}

setEventListeners();
initApp();
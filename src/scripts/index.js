import '../pages/index.css';
import { enableValidation, clearValidation } from '../components/validation';
import { createCard } from '../components/card';
import { 
  getUserInfo, 
  getInitialCards, 
  updateUserInfo, 
  addNewCard, 
  deleteCard, 
  likeCard, 
  unlikeCard,
  updateAvatar
} from '../components/api';
import { openPopup, closePopup } from '../components/modal';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const selectors = {
  cardTemplate: '#card-template',
  cardsContainer: '.places__list',
  editButton: '.profile__edit-button',
  addButton: '.profile__add-button',
  avatarEditButton: '.profile__image-edit',
  imagePopup: '.popup_type_image',
  editPopup: '.popup_type_edit',
  newCardPopup: '.popup_type_new-card',
  avatarPopup: '.popup_type_avatar',
  profileTitle: '.profile__title',
  profileDescription: '.profile__description',
  profileImage: '.profile__image',
  formElement: '.popup__form[name="edit-profile"]',
  nameInput: '.popup__input_type_name',
  jobInput: '.popup__input_type_description',
  newCardForm: '.popup__form[name="new-place"]',
  cardNameInput: '.popup__input_type_card-name',
  cardLinkInput: '.popup__input_type_url',
  avatarForm: '.popup__form[name="edit-avatar"]',
  avatarLinkInput: '.popup__input_type_url',
  popupImage: '.popup__image',
  popupCaption: '.popup__caption',
  confirmPopup: '.popup_type_confirm',
  confirmForm: '.popup__form[name="confirm-form"]'
};

const elements = {};
Object.keys(selectors).forEach(key => {
  elements[key] = document.querySelector(selectors[key]);
});

let userId;
let currentCardToDelete = null;

function initApp() {
  enableValidation(validationConfig);
  
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      userId = userData._id;
      updateProfileInfo(userData);
      renderCards(cards);
    })
    .catch(err => console.error('Ошибка загрузки данных:', err));
}

function updateProfileInfo(userData) {
  elements.profileTitle.textContent = userData.name;
  elements.profileDescription.textContent = userData.about;
  elements.profileImage.style.backgroundImage = `url(${userData.avatar})`;
}

function renderCards(cards) {
  cards.forEach(cardData => {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = createCard(
      cardTemplate, 
      cardData, 
      userId,
      (cardId, cardElement) => {
        currentCardToDelete = { cardId, cardElement };
        openConfirmPopup();
      },
      // handleDeleteCard, 
      handleLikeCard, 
      openImagePopup
    );
    elements.cardsContainer.append(cardElement);
  });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  
  updateUserInfo(
    elements.nameInput.value, 
    elements.jobInput.value
  )
    .then(userData => {
      updateProfileInfo(userData);
      closePopup(elements.editPopup);
    })
    .catch(err => console.error('Ошибка обновления профиля:', err))
    .finally(() => submitButton.textContent = 'Сохранить');
}

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  submitButton.textContent = 'Создание...';
  
  addNewCard(
    elements.cardNameInput.value, 
    elements.cardLinkInput.value
  )
    .then(newCard => {
      const cardTemplate = document.querySelector('#card-template').content;
      const cardElement = createCard(
        cardTemplate,
        newCard,
        userId,
        (cardId, cardElement) => {
          currentCardToDelete = { cardId, cardElement };
          openConfirmPopup();
        },
        // handleDeleteCard,
        handleLikeCard,
        openImagePopup
      );
      elements.cardsContainer.prepend(cardElement);
      closePopup(elements.newCardPopup);
      elements.newCardForm.reset();
      clearValidation(elements.newCardForm, validationConfig);
    })
    .catch(err => console.error('Ошибка добавления карточки:', err))
    .finally(() => submitButton.textContent = 'Создать');
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  
  updateAvatar(elements.avatarLinkInput.value)
    .then(userData => {
      elements.profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(elements.avatarPopup);
      elements.avatarForm.reset();
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => submitButton.textContent = 'Сохранить');
}

function handleDeleteCard(cardId, cardElement) {
  currentCardToDelete = { cardId, cardElement };
  openConfirmPopup();
}

function handleConfirmDelete() {
  if (!currentCardToDelete) return;
  
  const { cardId, cardElement } = currentCardToDelete;
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      currentCardToDelete = null;
      closePopup(elements.confirmPopup);
    })
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
  elements.popupImage.src = link;
  elements.popupImage.alt = name;
  elements.popupCaption.textContent = name;
  openPopup(elements.imagePopup);
}

function openConfirmPopup() {
  openPopup(elements.confirmPopup);
}

function fillProfileForm() {
  elements.nameInput.value = elements.profileTitle.textContent;
  elements.jobInput.value = elements.profileDescription.textContent;
  clearValidation(elements.formElement, validationConfig);

  const buttonElement = elements.formElement.querySelector(validationConfig.submitButtonSelector);
  buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  buttonElement.disabled = false;
}

function setEventListeners() {
  elements.editButton.addEventListener('click', () => {
    fillProfileForm();
    openPopup(elements.editPopup);
  });

  elements.addButton.addEventListener('click', () => {
    elements.newCardForm.reset();
    clearValidation(elements.newCardForm, validationConfig);
    openPopup(elements.newCardPopup);
  });

  elements.avatarEditButton.addEventListener('click', () => {
    elements.avatarForm.reset();
    clearValidation(elements.avatarForm, validationConfig);
    openPopup(elements.avatarPopup);
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup__close')) {
      closePopup(e.target.closest('.popup'));
    }
    if (e.target.classList.contains('popup_is-opened')) {
      closePopup(e.target);
    }
  });

  elements.formElement.addEventListener('submit', handleProfileFormSubmit);
  elements.newCardForm.addEventListener('submit', handleNewCardSubmit);
  elements.avatarForm.addEventListener('submit', handleAvatarFormSubmit);
  elements.confirmForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleConfirmDelete();
  });
}

setEventListeners();
initApp();
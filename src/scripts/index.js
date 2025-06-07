import '../pages/index.css';
import { openPopup, closePopup, handleEscClose } from '../components/modal.js';
import { createCard, handleLikeClick, deleteCard } from '../components/card.js';
import { initialCards } from './cards';

// -----------------------------------------------------------------------

const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const imagePopup = document.querySelector('.popup_type_image');
const editPopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const cardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm.querySelector('.popup__input_type_url');

// -----------------------------------------------------------------------

initialCards.forEach(cardData => {
    const cardElement = createCard(cardTemplate, cardData, deleteCard, handleLikeClick, (imgSrc, caption) => openImagePopup(imgSrc, caption)); 
    cardsContainer.append(cardElement); 
});

//---------------------------------------------------------------------------------------

closeButtons.forEach(button => {
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

document.addEventListener('keydown', handleEscClose);

function openImagePopup(imageSrc, caption) {
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');
  
  popupImage.src = imageSrc;
  popupImage.alt = caption;
  popupCaption.textContent = caption;
  
  openPopup(imagePopup);
}

//---------------------------------------------------------------------------------------

function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

function handleFormSubmit(evt) {
  evt.preventDefault();   
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  
  closePopup(editPopup);
}

// --------------------------------------------------------------

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  const newCardElement = createCard(
    cardTemplate,
    newCardData, 
    deleteCard, 
    handleLikeClick,
    (imgSrc, caption) => openImagePopup(imgSrc, caption)
  );
  cardsContainer.prepend(newCardElement);
  closePopup(newCardPopup);
  newCardForm.reset();
}

// ------------------------------------------------------------

formElement.addEventListener('submit', handleFormSubmit);
newCardForm.addEventListener('submit', handleNewCardSubmit);

editButton.addEventListener('click', () => {
  fillProfileForm(); 
  openPopup(editPopup);
});

addButton.addEventListener('click', () => {
    newCardForm.reset();
    openPopup(newCardPopup);
});
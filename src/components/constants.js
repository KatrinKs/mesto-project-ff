const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__image-edit');

const imagePopup = document.querySelector('.popup_type_image');
const editPopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');
const closeButtons = document.querySelectorAll('.popup__close');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const formElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

const newCardForm = document.querySelector('.popup__form[name="new-place"]');
const cardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm.querySelector('.popup__input_type_url');

const avatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_url');

const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const apiConfig = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-41',
  headers: {
    authorization: 'ba43ed7a-4bef-4d18-93b8-6e364019c77f',
    'Content-Type': 'application/json'
  }
};

const cardSelectors = {
  template: '.card',
  image: '.card__image',
  title: '.card__title',
  deleteButton: '.card__delete-button',
  likeButton: '.card__like-button',
  likeCount: '.card__like-count',
  likeActiveClass: 'card__like-button_is-active'
};

const popupSelectors = {
  openedClass: 'popup_is-opened',
  closeButton: '.popup__close',
  form: '.popup__form',
  input: '.popup__input',
  submitButton: '.popup__button'
};

export const constants = {
  cardTemplate,
  cardsContainer,
  editButton,
  addButton,
  avatarEditButton,
  imagePopup,
  editPopup,
  newCardPopup,
  avatarPopup,
  closeButtons,
  profileTitle,
  profileDescription,
  profileImage,
  formElement,
  nameInput,
  jobInput,
  newCardForm,
  cardNameInput,
  cardLinkInput,
  avatarForm,
  avatarLinkInput,
  popupImage,
  popupCaption,
  validationConfig,
  apiConfig,
  cardSelectors,
  popupSelectors
};
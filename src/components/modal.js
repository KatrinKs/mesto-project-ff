const ANIMATION_DELAY = 10;
const ANIMATION_DURATION = 600;

export function openPopup(popup) {
  popup.classList.add('popup_is-animated');
  setTimeout(() => {
    popup.classList.add('popup_is-opened');
  }, ANIMATION_DELAY);
  document.addEventListener('keydown', handleEscClose);
  popup.addEventListener('click', handleOverlayClick);
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  setTimeout(() => {
    popup.classList.remove('popup_is-animated');
  }, ANIMATION_DURATION);
  document.removeEventListener('keydown', handleEscClose);
  popup.removeEventListener('click', handleOverlayClick);
}

export function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

export function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closePopup(evt.currentTarget);
  }
}


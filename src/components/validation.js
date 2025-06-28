function addValidationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .popup__error {
      color: #FF0000;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.25;
      margin: 5px 0 0;
      min-height: 12px;
      opacity: 0;
      transition: opacity 0.3s;
      display: block;
    }

    .popup__error_visible {
      opacity: 1;
    }

    .popup__input_type_error {
      border-bottom-color: #FF0000;
    }

    .popup__button_disabled {
      background-color: #E5E5E5;
      color: #000000;
      opacity: 0.2;
      cursor: default;
    }

    .popup__button_disabled:hover {
      opacity: 0.2;
    }

    .popup__form-field {
      position: relative;
      margin-bottom: 15px;
    }
  `;
  document.head.appendChild(style);
}

const createErrorElement = (inputElement) => {
  const errorElement = document.createElement('span');
  errorElement.classList.add('popup__error');
  errorElement.classList.add(`${inputElement.id}-error`);
  return errorElement;
};

const showInputError = (formElement, inputElement, errorMessage, settings) => {
  let errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) {
    errorElement = createErrorElement(inputElement);
    inputElement.parentNode.appendChild(errorElement);
  }
  
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;
  
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
};

const isValidInput = (inputElement) => {
  if (!inputElement.value.trim()) return true; 
  const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
  return regex.test(inputElement.value);
};

const checkInputValidity = (formElement, inputElement, settings) => {
  inputElement.setCustomValidity("");
  
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
  } 
  else if (!isValidInput(inputElement)) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage || 
      "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы");
  }
  else if (inputElement.validity.tooShort || inputElement.validity.tooLong) {
    inputElement.setCustomValidity(`Должно быть от ${inputElement.minLength} до ${inputElement.maxLength} символов`);
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const isValidUrl = (urlString) => {
  if (!urlString.trim()) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch(e) {
    return false;
  }
};

const checkUrlInput = (formElement, inputElement, settings) => {
  inputElement.setCustomValidity("");
  
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
  } 
  else if (!isValidUrl(inputElement.value)) {
    inputElement.setCustomValidity('Введите корректный URL (начинающийся с http:// или https://)');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => {
    if (inputElement.type === 'url') {
      return !isValidUrl(inputElement.value);
    }
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach(inputElement => {
    const errorElement = createErrorElement(inputElement);
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  });

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    const validateInput = () => {
      if (inputElement.type === 'url') {
        checkUrlInput(formElement, inputElement, settings);
      } else {
        checkInputValidity(formElement, inputElement, settings);
      }
      toggleButtonState(inputList, buttonElement, settings);
    };

    inputElement.addEventListener('input', validateInput);
    inputElement.addEventListener('blur', validateInput);
  });
};

export const enableValidation = (settings) => {
  addValidationStyles();

  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });

    setEventListeners(formElement, settings);
  });
};

export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
    inputElement.setCustomValidity("");
  });

  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};
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
      margin-bottom: 15px;
    }
  `;
  document.head.appendChild(style);
}

const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
};

const checkInputValidity = (formElement, inputElement, settings) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const isValidUrl = (urlString) => {
  if (urlString === '') return false;
  try {
    return Boolean(new URL(urlString));
  } catch(e) {
    return false;
  }
};

const checkUrlInput = (formElement, inputElement, settings) => {
  if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity('Вы пропустили это поле.');
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
    return false;
  }
  
  if (inputElement.value && !isValidUrl(inputElement.value)) {
    inputElement.setCustomValidity('Введите адрес сайта.');
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
    return false;
  }
  
  inputElement.setCustomValidity("");
  hideInputError(formElement, inputElement, settings);
  return true;
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  const hasInvalidInput = inputList.some(inputElement => {
    if (inputElement.validity.valueMissing) return true;
    if (!inputElement.validity.valid) return true;
    if (inputElement.type === 'url') {
      return !isValidUrl(inputElement.value);
    }
    return false;
  });
  
  if (hasInvalidInput) {
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
    const formField = document.createElement('div');
    formField.classList.add('popup__form-field');
    inputElement.parentNode.insertBefore(formField, inputElement);
    formField.appendChild(inputElement);

    const errorElement = document.createElement('span');
    errorElement.classList.add('popup__error');
    errorElement.classList.add(`${inputElement.id}-error`);
    formField.appendChild(errorElement);

    inputElement.addEventListener('blur', () => {
      if (inputElement.type === 'url') {
        checkUrlInput(formElement, inputElement, settings);
      } else {
        checkInputValidity(formElement, inputElement, settings);
      }
      toggleButtonState(inputList, buttonElement, settings);
    });
  });

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      if (inputElement.type === 'url') {
        checkUrlInput(formElement, inputElement, settings);
      } else {
        checkInputValidity(formElement, inputElement, settings);
      }
      toggleButtonState(inputList, buttonElement, settings);
    });
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
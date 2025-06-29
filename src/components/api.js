const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-41',
  headers: {
    authorization: 'ba43ed7a-4bef-4d18-93b8-6e364019c77f',
    'Content-Type': 'application/json'
  }
};

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

function request(endpoint, options = {}) {
  // Добавляем базовые заголовки, если они не переданы
  options.headers = options.headers || config.headers;
  // Формируем полный URL
  const url = `${config.baseUrl}${endpoint}`;
  return fetch(url, options).then(checkResponse);
}

export const getUserInfo = () => {
  return request('/users/me');
};

export const getInitialCards = () => {
  return request('/cards');
};

export const updateUserInfo = (name, about) => {
  return request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ name, about })
  });
};

export const addNewCard = (name, link) => {
  return request('/cards', {
    method: 'POST',
    body: JSON.stringify({ name, link })
  });
};

export const deleteCard = (cardId) => {
  return request(`/cards/${cardId}`, {
    method: 'DELETE'
  });
};

export const likeCard = (cardId) => {
  return request(`/cards/likes/${cardId}`, {
    method: 'PUT'
  });
};

export const unlikeCard = (cardId) => {
  return request(`/cards/likes/${cardId}`, {
    method: 'DELETE'
  });
};

export const updateAvatar = (avatar) => {
  return request('/users/me/avatar', {
    method: 'PATCH',
    body: JSON.stringify({ avatar })
  });
};
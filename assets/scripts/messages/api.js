'use strict'

const config = require('../config')
const store = require('../store')

const create = (msg, username) => {
  return $.ajax({
    url: config.apiUrl + '/messages',
    method: 'POST',
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    data: {
      'message': {
        'text': `${msg}`,
        'username': `${username}`
      }
    }
  })
}

const index = () => {
  return $.ajax({
    url: config.apiUrl + '/messages',
    method: 'GET'
  })
}

const msgDestroy = (msgId, crId) => {
  return $.ajax({
    url: config.apiUrl + '/messages/' + msgId + '/' + crId,
    method: 'DELETE',
    headers: {
      Authorization: `Token token=${store.user.token}`
    }
  })
}

const msgUpdate = (text, name, msgId, crId) => {
  return $.ajax({
    url: config.apiUrl + '/messages/' + msgId,
    method: 'PATCH',
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    data: {
      'message': {
        'text': `${text}`,
        'username': `${name}`,
        'chatroomId': `${crId}`
      }
    }
  })
}

const destroy = (id) => {
  return $.ajax({
    url: config.apiUrl + '/chatrooms/' + id,
    method: 'DELETE',
    headers: {
      Authorization: `Token token=${store.user.token}`
    }
  })
}

const update = (formData, id) => {
  return $.ajax({
    url: config.apiUrl + '/chatrooms/' + id,
    method: 'PATCH',
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    data: formData
  })
}

const indexChatrooms = () => {
  return $.ajax({
    url: config.apiUrl + '/chatrooms',
    method: 'GET'
  })
}

const createChatroom = (name) => {
  return $.ajax({
    url: config.apiUrl + '/chatrooms',
    method: 'POST',
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    data: {
      'chatroom': {
        'name': `${name}`,
        'messages': []
      }
    }
  })
}

const showChatroom = id => {
  return $.ajax({
    url: config.apiUrl + '/chatrooms/' + id,
    method: 'GET',
    headers: {
      Authorization: `Token token=${store.user.token}`
    }
  })
}

const createCRMessage = (msg, username, id) => {
  return $.ajax({
    url: config.apiUrl + '/messages',
    method: 'POST',
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    data: {
      'message': {
        'text': `${msg}`,
        'username': `${username}`,
        'chatroomId': `${id}`
      }
    }
  })
}

module.exports = {
  create,
  index,
  destroy,
  update,
  indexChatrooms,
  createChatroom,
  showChatroom,
  createCRMessage,
  msgDestroy,
  msgUpdate
}

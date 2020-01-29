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

module.exports = {
  create,
  index
}

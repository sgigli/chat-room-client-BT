'use strict'

const config = require('../config')
const store = require('../store')

const create = (msg) => {
  return $.ajax({
    url: config.apiUrl + '/messages',
    method: 'POST',
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    data: {
      'message': {
        'text': `${msg}`
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

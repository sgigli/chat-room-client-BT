'use strict'
import io from 'socket.io-client'
const socket = io('http://localhost:4741')
const api = require('./api')

const sendMessage = (event) => {
  event.preventDefault() // prevents page reloading
  // socket.emit('chat message', $('#m').val())
  const msg = $('#m').val()
  api.create(msg)
    .then(res => {
      $('#messages').append($('<li>').text(msg))
      socket.emit('chat message', res.message.text)
    })
  $('#m').val('')
  return false
}

const getMessages = () => {
  api.index()
    .then(res => {
      res.messages.forEach(msg => {
        $('#messages').append($('<li>').text(msg.text))
      })
    })
}

const addHandlers = () => {
  // sendMessage()
  getMessages()
  $('#chat-form').submit(sendMessage)
  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg))
  })
}

module.exports = {
  addHandlers
}

'use strict'
import io from 'socket.io-client'
const socket = io('http://localhost:4741')
const api = require('./api')
const store = require('../store')

const sendMessage = (event) => {
  event.preventDefault() // prevents page reloading
  // socket.emit('chat message', $('#m').val())
  const msg = $('#m').val()
  console.log(store.user.email)
  const username = store.user.email
  api.create(msg, username)
    .then(res => {
      console.log(res.message.username)
      $('#messages').append($('<li>').text(`${username}: ${msg}`))
      socket.emit('chat message', `${username}: ${res.message.text}`)
    })
  $('#m').val('')
  return false
}

const getMessages = () => {
  api.index()
    .then(res => {
      res.messages.forEach(msg => {
        if (msg.username) {
          $('#messages').append($('<li>').text(`${msg.username}: ${msg.text}`))
        } else {
          $('#messages').append($('<li>').text(msg.text))
        }
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

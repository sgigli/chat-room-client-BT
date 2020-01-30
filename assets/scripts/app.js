'use strict'

// import io from 'socket.io-client'
// const socket = io('http://localhost:4741')
const messageEvents = require('./messages/messageEvents')
const authEvents = require('./auth/events')
// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

$(() => {
  // your JS code goes here
  // $('form').submit(function (e) {
  //   e.preventDefault() // prevents page reloading
  //   socket.emit('chat message', $('#m').val())
  //   $('#m').val('')
  //   return false
  // })
  // socket.on('chat message', function (msg) {
  //   $('#messages').append($('<li>').text(msg))
  // })
  authEvents.addHandlers()
  messageEvents.addHandlers()
})

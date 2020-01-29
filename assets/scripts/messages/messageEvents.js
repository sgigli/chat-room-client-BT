'use strict'
import io from 'socket.io-client'
const socket = io('http://localhost:4741')
const api = require('./api')
const store = require('../store')
const getMessagesHtml = require('../templates/messages-listing.handlebars')

const sendMessage = (event) => {
  event.preventDefault() // prevents page reloading
  // socket.emit('chat message', $('#m').val())
  const msg = $('#m').val()
  const username = store.user.username
  api.create(msg, username)
    .then(res => {
      $('#messages').append($('<li>').text(`${username}: ${msg}`))
      socket.emit('chat message', `${username}: ${res.message.text}`)
    })
  $('#m').val('')
  return false
}

const getMessages = () => {
  api.index()
    .then(res => {
      const filteredForUsername = res.messages.filter(msg => msg.username)
      filteredForUsername.forEach(msg => console.log(msg._id))
      const showMessagesHtml = getMessagesHtml({ messages: filteredForUsername })
      $('#messages').append(showMessagesHtml)
      // const filteredForUsername = res.messages.filter(msg => msg.username)
      // filteredForUsername.forEach(msg => $('#messages').append($('<li>').text(`${msg.username}: ${msg.text}`)))

      // res.messages.forEach(msg => {
      //   const name = msg.username ? `${msg.username}:` : ''
      //   $('#messages').append($('<li>').text(`${name} ${msg.text}`))
      // })
      // res.messages.forEach(msg => {
      //   if (msg.username) {
      //     $('#messages').append($('<li>').text(`${msg.username}: ${msg.text}`))
      //   } else {
      //     $('#messages').append($('<li>').text(msg.text))
      //   }
      // })
    })
}

const onDelete = (event) => {
  event.preventDefault()
  console.log($(event.target).data('id'))
  const id = $(event.target).data('id')
  api.destroy(id)
    .then(console.log('success'))
}

const addHandlers = () => {
  // sendMessage()
  getMessages()
  $('#chat-form').submit(sendMessage)
  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg))
  })
  $('#messages').on('click', '.delete', onDelete)
}

module.exports = {
  addHandlers
}

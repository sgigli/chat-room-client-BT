'use strict'
import io from 'socket.io-client'
const socket = io('http://localhost:4741')
const api = require('./api')
const store = require('../store')
const getFormFields = require('../../../lib/get-form-fields')
const getMessagesHtml = require('../templates/messages-listing.handlebars')
const getPostHtml = require('../templates/post-message.handlebars')

const sendMessage = (event) => {
  event.preventDefault() // prevents page reloading
  const msg = $('#m').val()
  const username = store.user.username
  api.create(msg, username)
    .then(res => {
      const showPostHtml = getPostHtml({ msg: res.message, id: store.user._id })
      $('#messages').append(showPostHtml)
      // $('#messages').append($('<li>').text(`${username}: ${msg}`))
      socket.emit('chat message', `${username}: ${res.message.text}`)
    })
  $('#m').val('')
  return false
}

const getMessages = () => {
  api.index()
    .then(res => {
      const filteredForUsername = res.messages.filter(msg => msg.username)
      filteredForUsername.forEach(msg => { msg.editable = msg.owner === store.user._id || false })
      const data = {
        messages: filteredForUsername,
        id: store.user._id
      }
      const showMessagesHtml = getMessagesHtml(data)
      $('#messages').text('')
      $('#messages').append(showMessagesHtml)
    })
}

const onDelete = (event) => {
  event.preventDefault()
  console.log($(event.target).data('id'))
  const id = $(event.target).data('id')
  api.destroy(id)
    .then(console.log('success'))
    .then(getMessages)
}

const onUpdate = event => {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  const id = $(event.target).data('id')
  console.log(formData, id)
  api.update(formData, id)
    .then(console.log)
    .then(getMessages)
}

const addHandlers = () => {
  // sendMessage()
  $('#get-messages').on('click', getMessages)
  $('#chat-form').submit(sendMessage)
  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg))
  })
  $('#messages').on('click', '.delete', onDelete)
  $('#messages').on('submit', '.update', onUpdate)
}

module.exports = {
  addHandlers
}

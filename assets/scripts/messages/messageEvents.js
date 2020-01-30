'use strict'
import io from 'socket.io-client'
const socket = io('http://localhost:4741')
const api = require('./api')
const store = require('../store')
const getFormFields = require('../../../lib/get-form-fields')
const getMessagesHtml = require('../templates/messages-listing.handlebars')
const getPostHtml = require('../templates/post-message.handlebars')
const getChatroomsHtml = require('../templates/chatrooms-listing.handlebars')

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
  // console.log($(event.target).data('id'))
  const id = $(event.target).data('id')
  api.destroy(id)
    .then(() => { socket.emit('chat message', `BLANK`) })
    .then(getMessages)
}

const onUpdate = event => {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  const id = $(event.target).data('id')
  // console.log(formData, id)
  api.update(formData, id)
    .then(() => { socket.emit('chat message', `BLANK`) })
    .then(getMessages)
}

const test = event => {
  event.preventDefault()
  socket.emit('test-room', `path test`)
}

const getChatrooms = () => {
  api.indexChatrooms()
    .then(res => {
      const showChatroomsHtml = getChatroomsHtml({ chatrooms: res.chatrooms })
      console.log(showChatroomsHtml)
      $('#chat-rooms').append(showChatroomsHtml)
    })
}

const createChatroom = event => {
  event.preventDefault()
  const formData = getFormFields(event.target)
  console.log(formData.chatroom.name)
  const name = formData.chatroom.name
  api.createChatroom(name)
    .then(console.log)
}

const addHandlers = () => {
  // sendMessage()
  getChatrooms()
  $('#get-messages').on('click', getMessages)
  $('#chat-form').submit(sendMessage)
  socket.on('chat message', function (msg) {
    // $('#messages').append($('<li>').text(msg))
    getMessages()
  })
  socket.on('test-room', function (msg) {
    // $('#messages').append($('<li>').text(msg))
    console.log(msg)
  })
  $('#messages').on('click', '.delete', onDelete)
  $('#messages').on('submit', '.update', onUpdate)
  $('#test').on('click', test)
  $('#create-chat-room').on('submit', createChatroom)
}

module.exports = {
  addHandlers
}

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
  socket.emit('send-message', chatroomName)
}

const getChatrooms = () => {
  api.indexChatrooms()
    .then(res => {
      const showChatroomsHtml = getChatroomsHtml({ chatrooms: res.chatrooms })
      $('#chat-rooms').append(showChatroomsHtml)
    })
}

const createChatroom = event => {
  event.preventDefault()
  const formData = getFormFields(event.target)
  const name = formData.chatroom.name
  api.createChatroom(name)
    .then(console.log)
}

const getCRMessages = event => {
  chatroomId = $(event.target).data('id')
  chatroomName = $(event.target).data('name')
  api.showChatroom(chatroomId)
    .then(res => {
      // const filteredForUsername = res.messages.filter(msg => msg.username)
      // filteredForUsername.forEach(msg => { msg.editable = msg.owner === store.user._id || false })
      const data = {
        messages: res.chatroom.messages,
        id: store.user._id
      }
      const showMessagesHtml = getMessagesHtml(data)
      $('#messages').text('')
      $('#messages').append(showMessagesHtml)
    })
    .then(() => {
      socket.emit('join-room', chatroomName)
    })
    .then(() => {
      socket.on(chatroomName, function (msg) {
        getCRMessages()
      })
    })
}

// const joinRoom = () => {
//   socket.emit('join-room', chatroomName)
// }
//
// const listenForMessage = () => {
//   socket.on(chatroomName, function (msg) {
//     // $('#messages').append($('<li>').text(msg))
//     console.log('TEST of rooms')
//   })
// }

const sendCRMessage = event => {
  event.preventDefault()
  const msg = $('#m').val()
  const username = store.user.username
  // console.log(chatroomId)
  api.createCRMessage(msg, username, chatroomId)
    // .then(console.log)
    .then(res => {
      console.log(res)
      const showPostHtml = getPostHtml({ msg: res.message, id: store.user._id })
      $('#messages').append(showPostHtml)
      // $('#messages').append($('<li>').text(`${username}: ${msg}`))
      // socket.emit('chat message', `${username}: ${res.message.text}`)
      socket.emit('send-message', chatroomName)
    })
}

let chatroomId
let chatroomName
const addHandlers = () => {
  // sendMessage()
  getChatrooms()
  $('#get-messages').on('click', getMessages)
  $('#chat-form').submit(sendCRMessage)
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
  $('#chat-rooms').on('click', '.chat-room-class', getCRMessages)
}

module.exports = {
  addHandlers
}

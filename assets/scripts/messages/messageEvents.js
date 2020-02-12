'use strict'
import io from 'socket.io-client'
import { apiUrl } from '../config'
const socket = io(apiUrl)
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

const onMGDelete = (event) => {
  event.preventDefault()
  // console.log($(event.target).data('id'))
  const msgId = $(event.target).data('id')
  // console.log(id)
  api.msgDestroy(msgId, chatroomId)
    .then(getCRMessages)
}

const onMGUpdate = event => {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  const msgId = $(event.target).data('id')
  const name = $(event.target).data('name')
  console.log(formData.message.text, name, msgId, chatroomId)
  api.msgUpdate(formData.message.text, name, msgId, chatroomId)
    // .then(() => { socket.emit('chat message', `BLANK`) })
    .then(getCRMessages)
}

const onCRDelete = (event) => {
  event.preventDefault()
  // console.log($(event.target).data('id'))
  // const id = $(event.target).data('id')
  // console.log(id)
  api.destroy(chatroomId)
    .then(getChatrooms)
    .then(() => {
      $('#editChatroomModal').modal('hide')
      $('.msg_history').text('')
      socket.emit('refresh-chatrooms', name)
    })
    // .then(() => { socket.emit('chat message', `BLANK`) })
}

const onCRUpdate = event => {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  // const id = $(event.target).data('id')
  console.log(formData, chatroomId)
  api.update(formData, chatroomId)
    // .then(() => { socket.emit('chat message', `BLANK`) })
    .then(getChatrooms)
    .then($('#editChatroomModal').modal('hide'))
    .then(() => { socket.emit('refresh-chatrooms', name) })
}

const test = event => {
  event.preventDefault()
  // console.log(chatroomName)
  socket.emit('send-message', 'test-room')
}

const getChatrooms = () => {
  console.log('test')
  api.indexChatrooms()
    .then(res => {
      res.chatrooms.forEach(chatroom => { chatroom.editable = chatroom.owner === store.user._id || false })
      res.chatrooms.forEach(chatroom => { console.log(chatroom.owner) })

      const showChatroomsHtml = getChatroomsHtml({ chatrooms: res.chatrooms })
      $('.inbox_chat').text('')
      // $('#chat-rooms').append(showChatroomsHtml)
      $('.inbox_chat').append(showChatroomsHtml)
    })
}

const createChatroom = event => {
  event.preventDefault()
  const formData = getFormFields(event.target)
  const name = formData.chatroom.name
  api.createChatroom(name)
    .then(getChatrooms)
    .then($('#createChatroomModal').modal('hide'))
    .then(() => { socket.emit('refresh-chatrooms', name) })
}

const getCRMessages = () => {
  return api.showChatroom(chatroomId)
    .then(res => {
      // const filteredForUsername = res.messages.filter(msg => msg.username)
      // filteredForUsername.forEach(msg => { msg.editable = msg.owner === store.user._id || false })
      res.chatroom.messages.forEach(msg => { msg.editable = msg.owner === store.user._id || false })
      const data = {
        messages: res.chatroom.messages,
        id: store.user._id
      }
      const showMessagesHtml = getMessagesHtml(data)
      // $('#messages').text('')
      $('.msg_history').text('')
      // $('#messages').append(showMessagesHtml)
      $('.msg_history').append(showMessagesHtml)
      // const elem = $('.msg_history')
      const elem = document.getElementById('scroll-to-bottom')
      elem.scrollTop = elem.scrollHeight
    })
}

const joinChatroom = (event) => {
  chatroomId = $(event.target).closest('.chat_list').data('id')
  chatroomName = $(event.target).closest('.chat_list').data('name')
  // console.log(chatroomId, chatroomName)
  // console.log($(event.target).closest('.chat_list').data('name'))
  getCRMessages(chatroomId)
    .then(() => {
      socket.emit('join-room', chatroomName)
    })
    .then(() => {
      socket.on('message', function (msg) {
        // console.log('TEST')
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
  console.log(msg)
  const username = store.user.username
  api.createCRMessage(msg, username, chatroomId)
    // .then(console.log)
    .then(res => {
      console.log(res)
      const showPostHtml = getPostHtml({ msg: res.message, id: store.user._id })
      // $('#messages').append(showPostHtml)
      $('.msg_history').append(showPostHtml)
      // $('#messages').append($('<li>').text(`${username}: ${msg}`))
      // socket.emit('chat message', `${username}: ${res.message.text}`)
      socket.emit('send-message', chatroomName)
      const elem = document.getElementById('scroll-to-bottom')
      elem.scrollTop = elem.scrollHeight
      $('#m').val('')
    })
}

const search = (event) => {
  event.preventDefault()
  const rooms = $('.chat_list')
  console.log(rooms)
  const input = $('#search-input').val()
  // let roomId
  rooms.each(function () {
    console.log($(this).data('name'))
    if ($(this).data('name') === input) {
      // return $(this).data('id')
      chatroomId = $(this).data('id')
      console.log($(this).data('id'))
      getCRMessages()
    }
  })
  // console.log(roomId)
  // const room = rooms.find(msg => )
}

// const onGetMGID = (event) => {
//   const id = $(event.target).data('id')
//   console.log(id)
// }

let chatroomId
let chatroomName
const addHandlers = () => {
  // sendMessage()
  // getChatrooms()
  $('#get-messages').on('click', getMessages)
  $('#chat-form').submit(sendCRMessage)
  socket.emit('join-room', 'test-room')
  socket.on('chat message', function (msg) {
    // $('#messages').append($('<li>').text(msg))
    getMessages()
  })
  socket.on('message', function (msg) {
    // $('#messages').append($('<li>').text(msg))
    console.log(msg)
  })
  socket.on('refresh-cr', function (msg) {
    getChatrooms()
  })
  $('#messages').on('click', '.delete', onMGDelete)
  $('#messages').on('submit', '.update', onMGUpdate)
  // $('#chat-rooms').on('click', '.delete', onCRDelete)
  $('#chat-room-delete').on('click', onCRDelete)
  // $('.inbox_chat').on('click', '.update', onGetMGID)
  $('#edit-chat-room').on('submit', onCRUpdate)

  $('#test').on('click', test)
  $('#create-chat-room').on('submit', createChatroom)
  // $('#chat-rooms').on('click', '.chat-room-class', joinChatroom)
  $('.inbox_chat').on('click', '.chat_list', joinChatroom)
  $('#search').on('submit', search)
  $('.modal-click').on('click', function () {
    $('.auth-message').text('')
  })
}

module.exports = {
  addHandlers,
  getChatrooms
}

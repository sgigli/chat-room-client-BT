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
  const msgId = $(event.target).data('id')
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
    .then(getCRMessages)
}

const onCRDelete = (event) => {
  event.preventDefault()
  api.destroy(chatroomId)
    .then(getChatrooms)
    .then(() => {
      $('#editChatroomModal').modal('hide')
      $('.msg_history').text('')
      socket.emit('refresh-chatrooms', name)
    })
}

const onCRUpdate = event => {
  event.preventDefault()
  const form = event.target
  const formData = getFormFields(form)
  api.update(formData, chatroomId)
    .then(getChatrooms)
    .then($('#editChatroomModal').modal('hide'))
    .then(() => { socket.emit('refresh-chatrooms', name) })
}

const getChatrooms = () => {
  api.indexChatrooms()
    .then(res => {
      res.chatrooms.forEach(chatroom => { chatroom.editable = chatroom.owner === store.user._id || false })

      const showChatroomsHtml = getChatroomsHtml({ chatrooms: res.chatrooms })
      $('.inbox_chat').text('')
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
      const l = res.chatroom.messages.length
      const msgs = res.chatroom.messages
      for (let i = 0; i < l; i++) {
        msgs[i].editable = msgs[i].owner === store.user._id || false
        if (i === l - 1) {
          msgs[i].last = true
        }
      }
      const data = {
        messages: res.chatroom.messages,
        id: store.user._id
      }
      const showMessagesHtml = getMessagesHtml(data)
      $('.msg_history').text('')
      $('.msg_history').append(showMessagesHtml)
      const elem = document.getElementById('scroll-to-bottom')
      elem.scrollTop = elem.scrollHeight
    })
}

const joinChatroom = (event) => {
  chatroomId = $(event.target).closest('.chat_list').data('id')
  chatroomName = $(event.target).closest('.chat_list').data('name')
  getCRMessages(chatroomId)
    .then(() => {
      socket.emit('join-room', chatroomName)
    })
    .then(() => {
      socket.on('message', function (msg) {
        getCRMessages()
      })
    })
}

const sendCRMessage = event => {
  event.preventDefault()
  const msg = $('#m').val()
  const username = store.user.username
  api.createCRMessage(msg, username, chatroomId)
    .then(res => {
      const showPostHtml = getPostHtml({ msg: res.message, id: store.user._id })
      $('.msg_history').append(showPostHtml)
      socket.emit('send-message', chatroomName)
      const elem = document.getElementById('scroll-to-bottom')
      elem.scrollTop = elem.scrollHeight
      $('#m').val('')
    })
}

const search = (event) => {
  event.preventDefault()
  const rooms = $('.chat_list')
  const input = $('#search-input').val()
  rooms.each(function () {
    if ($(this).data('name') === input) {
      chatroomId = $(this).data('id')
      getCRMessages()
    }
  })
}

const signOutClear = () => {
  $('.msg_history').text('')
  chatroomName = ''
  chatroomId = ''
}

let chatroomId
let chatroomName
const addHandlers = () => {
  $('#get-messages').on('click', getMessages)
  $('#chat-form').submit(sendCRMessage)
  $('.msg_send_btn').on('click', sendCRMessage)
  socket.emit('join-room', 'test-room')
  socket.on('chat message', function (msg) {
    getMessages()
  })
  socket.on('refresh-cr', function (msg) {
    getChatrooms()
  })
  $('#messages').on('click', '.delete', onMGDelete)
  $('#messages').on('submit', '.update', onMGUpdate)
  $('#chat-room-delete').on('click', onCRDelete)
  $('#edit-chat-room').on('submit', onCRUpdate)
  $('#create-chat-room').on('submit', createChatroom)
  $('.inbox_chat').on('click', '.chat_list', joinChatroom)
  $('#search').on('submit', search)
  $('.modal-click').on('click', function () {
    $('.auth-message').text('')
  })
}

module.exports = {
  addHandlers,
  getChatrooms,
  signOutClear
}

'use strict'

const store = require('../store')
// const gameEvents = require('../game/events')
const messagesEvents = require('../messages/messageEvents')

const onSuccess = message => {
  $('#message').text(message)
  $('.auth-message').text(message)
  $('form').trigger('reset')
}

const onFailure = message => {
  $('#message').text(message)
  $('.auth-message').text(message)
  $('form').trigger('reset')
}

const onSignUpSuccess = () => {
  // onSuccess('You successfully signed up, now sign in!')
  $('#signupModal').modal('hide')
  $('#signinModal').modal('show')
  onSuccess('Success!')
}

const onSignUpFailure = () => {
  onFailure('Please try again.')
}

const onSignInSuccess = responseData => {
  store.user = responseData.user
  messagesEvents.getChatrooms()
  $('#signinModal').modal('hide')
  $('#username').text(`Welcome, ${store.user.username}`)
  onSuccess('You successfully signed in!')
  $('.after-auth').show()
  $('.before-auth').hide()
}

const onSignInFailure = () => {
  onFailure('Please try to sign in again')
}

const onSignOutSuccess = () => {
  store.user = {}
  messagesEvents.signOutClear()
  onSuccess('You successfully signed out!')
  $('.before-auth').show()
  $('.after-auth').hide()
}

const onSignOutFailure = () => {
  onFailure('Please try to sign out again.')
}

const onChangePasswordSuccess = () => {
  $('form').trigger('reset')
  onSuccess('Successful password change!')
}

const onChangePasswordFailure = () => {
  $('form').trigger('reset')
  onFailure('Please try again')
}

module.exports = {
  onSignUpSuccess,
  onSignUpFailure,
  onSignInSuccess,
  onSignInFailure,
  onSignOutSuccess,
  onSignOutFailure,
  onChangePasswordSuccess,
  onChangePasswordFailure
}

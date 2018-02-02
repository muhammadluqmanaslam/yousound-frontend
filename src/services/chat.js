/**
 * [SocketManager description]
 * @param {String} socketHost url of socket connection
 * @param {String} room       room to join
 */
import io from 'socket.io-client'

var SocketManager = (socketHost, roomName, token) => {
  this.room = roomName || getParameterByName('room') || 'general' // TODO: change 'general'

  var sm = this
  var socket = io.connect(socketHost)

  socket.on('connect', () => {
    console.log('SocketManager connected to ' + roomName + ' @ ' + socketHost)
    socket.emit('authentication', { token })
    socket.on('authenticated', () => {
      socket.emit('loadMessages', sm.room) // ask for old messages and to join artist soundroom
    })
    socket.on('unauthorized', (err) => {
      alert('There was an error with the authentication: ' + err.message) // TODO: don't use alert
    })
    socket.on('newMessage', sm.onMessage)
    socket.on('loadMessages', sm.onLoadMessages)
    socket.on('roomInfo', sm.onRoomInfo)
    socket.on('userInfo', sm.onUserInfo)
    socket.on('disconnect', sm.onDisconnect)
    socket.on('reconnect', sm.onReconnect)
  })

  /**
   * [messageConstructor description]
   * @param  {String} text [description]
   * @param  {User} from [description]
   * @return {Message}      [description]
   */
  var messageConstructor = (text, from) => {
    return { from, text, time: Date.now(), localId: Date.now() * Math.random() } // fix id generation
  }

  /**
   * [sendMessage description]
   * @param  {String} text [description]
   * @param  {User} from [description]
   */
  sm.sendMessage = (text, from) => {
    if (text.trim() === '') { return }
    var message = messageConstructor(text, from)
    sm.onMessageSending(message)
    socket.emit('newMessage', message) // From field doesn't matter because server knows who this is
  }

  sm.idle = () => {
    socket.emit('idleUser')
  }

  sm.online = () => {
    socket.emit('onlineUser')
  }

  sm.updateSettings = (settings) => {
    socket.emit('settingsUpdate', settings)
  }

  sm.onDisconnect = () => {
    console.log('disconnected :(') // switch to toast eventually instead
  }

  sm.onReconnect = () => {
    console.log('reconnected :)') // switch to toast eventually instead
    socket.emit('loadMessages', sm.room) // reload messages
  }

  sm.onUserInfo = (user) => {
    // Override
  }

  sm.onRoomInfo = (room) => {
    // Override
  }

  sm.onMessageSending = (message) => {
    // Override
  }

  sm.onMessage = (message) => {
    // Override
  }

  sm.onLoadMessages = (message) => {
    // Override
  }

  sm.moreMessages = (chunk) => {
    socket.emit('moreMessages', chunk)
  }

  return sm
}

// Helper functions
var getParameterByName = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[[]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  var results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export default SocketManager

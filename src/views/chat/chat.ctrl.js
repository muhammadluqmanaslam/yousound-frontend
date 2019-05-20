import _ from 'lodash'
import SocketManager from '@/services/chat'
import UserService from '@/services/user'
import AuthService from '@/services/auth'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import moment from 'moment'
// import Message from '@/components/chat/message'
// import MessageInput from '@/components/chat/messageinput'
import ChatSidebar from '@/components/chat/chatsidebar'
import activityAlbumCard from '@/components/activityalbumcard'
import activityProductCard from '@/components/activityproductcard'
import activityUserCard from '@/components/activityusercard'
import { Picker } from 'emoji-mart-vue'
import VueChatScroll from 'vue-chat-scroll'
import Vue from 'vue'
// import { EHOSTUNREACH } from 'constants';
import { MyEvents } from '@/helper';

Vue.use(VueChatScroll)

const linkRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

export default {
  components: {
    // Message,
    // MessageInput,
    ChatSidebar,
    Picker,
    activityAlbumCard,
    activityProductCard,
    activityUserCard
  },

  data() {
    return {
      showEmojiPicker: false,
      show_broadcastPopup: false,
      show_confirmPopup: false,
      show_requestPopup: false,
      show_stream_live_button: false,
      chat_socket: null,
      moment: moment,
      artist: '',
      messages: [],
      sendingMessages: [],
      user: null,
      room: {
        settings: {
          links: false,
          charLimitBool: false,
          charLimit: 100,
          attachments: true
        },
        online: [],
        idle: []
      },
      onlineUsers: [],
      idleUsers: [],
      adminUsers: [],
      idleInterval: null,
      rules: {
        number: (value) => {
          const pattern = /^(0|[1-9][0-9]*)$/
          if (value == '') return 'Please enter a number.'
          if (!pattern.test(value)) return 'Please enter a number.'
          if (!((parseInt(value) <= 500) && (parseInt(value) >= 1))) return 'Please enter a number between 1-500'
          return true
        },
        link: (value) => {
          if (linkRegex.test(value)) return 'Links have been disabled.'
          return true
        }
      },
      admin: false,
      last: false,
      nextChunk: 0,
      message: '',
      meberList: true,
      request_tab: 'album',
      item_index: -1,
      albums: [],
      products: [],
      users: [],
      connected: false,
      albumLinks: {},
      merchLinks: {},
      userLinks: {},
      idleInterval: null,
      messageError: "",
      notAttachments: [],
      userSearchKeyword: "",
      user_page_index: 1,
      user_items_per_page: 50
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    settingsChange() {
      if (typeof this.room.settings.charLimit === 'string' && this.room.settings.charLimit !== '' && this.rules.number(this.room.settings.charLimit) !== 'string') {
        // this.room.settings.charLimit = parseInt(this.room.settings.charLimit);
      }
      return JSON.stringify(this.room.settings)
    },

    reverseMessages() {
      return this.messages.slice().reverse()
    },

    disconnected() {
      return !this.connected
    },

    isMessageErr() {
      return !!this.messageError
    }
  },

  methods: {
    isStreaming () {
      return _.get(this.user.stream, 'status', '') === 'running' &&
        (_.get(this.$store.state.videoPlayer.stream, 'user.slug', '') !== this.user.slug || !this.$store.getters['videoPlayer/hasFrame'])
      // return true
    },

    viewStream () {
      if (this.isStreaming()) {
        this.$store.dispatch('videoPlayer/setStream', this.user.stream)
        this.$root.$emit(MyEvents.VIDEO_PLAYER_INIT)
      }
    },

    startBroadcasting() {
      this.show_broadcastPopup = false
    },

    startListenning() {
      this.show_confirmPopup = false
    },

    sendMessage(messageText) {
      if (this.room.settings.charLimitBool && this.message.length > this.room.settings.charLimit) return false
      if (!this.room.settings.links && linkRegex.test(this.message)) return // TODO error instead of returning
      this.chat_socket.sendMessage(messageText, this.currentUser.username)
      this.message = '' // clear textbox
      $('#msg-container').scrollTop = $('#msg-container').scrollHeight
      return false
    },

    getMessages(a, b) {
      return (a, b)
    },

    addEmoji(emoji, event) {
      this.showEmojiPicker = false
      this.message += emoji.native
      this.$refs.chat.focus()
    },

    loadAlbums() {
      AlbumService.getAlbums().then(response => {
        this.albums = response.body
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadProducts () {
      ProductService.getProducts({
        statuses: 'published, collaborated',
        stock_statuses: 'active',
        user_statuses: 'accepted'
      }).then(response => {
        this.products = response.body
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadUsers () {
      var params = {
        'page': this.user_page_index,
        'per_page': this.user_items_per_page
      }
      if (this.userSearchKeyword.length) {
        params['q'] = this.userSearchKeyword
      }
      UserService.searchUsers(params).then(response => {
        this.users = response.body.users
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    onRequestTab(tab) {
      this.request_tab = tab
      this.item_index = -1
      if (tab === 'album') {
        this.loadAlbums()
      } else {
        this.loadProducts()
      }
    },

    choosePage(path) {
      this.$router.push({ path: '/' + path })
    },

    selectItemIndex(index) {
      const itemType = this.request_tab
      const itemId = (this.request_tab === "album" ? this.albums : this.products)[index].id
      this.show_requestPopup = false
      if (this.item_index != index) {
        this.item_index = index
      } else {
        this.item_index = -1
      }
      this.sendMessage("/"+itemType+"/"+itemId)
    },

    onSelectUser(a) {
      this.show_requestPopup = false
      this.sendMessage("/user/"+a.slug)
    },

    isAttachmentLink(string) {
      // const attachmentRegex = /\/((album)|(merch)\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12})|user\/\w+/g
      const attachmentRegex = /\/((album)|(merch)\/\d+)|user\/\w+/g
      return this.notAttachments.indexOf(string) < 0 && attachmentRegex.test(string)
    },

    isAlbumLink(string) {
      // const albumLinkRegex = /\/album\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      const albumLinkRegex = /\/album\/\d+/g
      return albumLinkRegex.test(string)
    },

    isMerchLink(string) {
      // const merchLinkRegex = /\/merch\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      const merchLinkRegex = /\/merch\/\d+/g
      return merchLinkRegex.test(string)
    },

    isUserLink(string) {
      const userLinkRegex = /\/user\/\w+/g
      return this.isAttachmentLink(string) && userLinkRegex.test(string)
    },

    getAlbumFromLink(string) {
      const albumId = string.split("/")[2]
      AlbumService.getAlbum(albumId)
        .then(res => {
          if (res.ok) {
            Vue.set(this.albumLinks, string, res.body)
          } else {
            this.notAttachments.push(string)
          }
        })
        .catch(err => {
          this.notAttachments.push(string)
        })
    },

    getMerchFromLink(string) {
      const merchId = string.split("/")[2]
      ProductService.getProduct(merchId)
        .then(res => {
          if (res.ok) {
            Vue.set(this.merchLinks, string, res.body)
          } else {
            this.notAttachments.push(string)
          }
        })
        .catch(err => {
          this.notAttachments.push(string)
        })
    },

    getUserFromLink(string) {
      const userId = string.split("/")[2]
      UserService.getUserInfo(userId)
        .then(res => {
          if (res && res.ok) {
            Vue.set(this.userLinks, string, res.body)
          } else {
            this.notAttachments.push(string)
          }
        })
        .catch(err => {
          this.notAttachments.push(string)
        })
    },

    onExitVideoPlayer(username) {
      // console.log('exit video player...', username)
      const vm = this
      if (this.user.username === username) {
        setTimeout(() => {
          console.log('back to online', username)
          vm.chat_socket.online()
        }, 1000)
      }
    },

    loadPage() {
      this.unloadPage()

      let vm = this
      let requestInProgress = false;
      vm.show_stream_live_button = false

      this.$store.dispatch('navigator/goNextState', {page: 'chat', tab: ''})
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(this.artist).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.user = response.body
        this.loadAlbums()
        if (_.get(this.user.stream, 'status', '') === 'running') {
          Vue.http.get(this.user.stream.mp_channel_1_ep_1_url).then(response => {
            this.show_stream_live_button = true
          })
        }
        this.chat_socket = new SocketManager(process.env.CHAT_SERVER_URL, this.user.slug, AuthService.getToken(), () => {
          this.chat_socket.onDisconnect = () => {
            console.log('chat disconnected :(')
            vm.connected = false
          }
          this.chat_socket.onError = error => {
            vm.messageError = error
          }
          this.chat_socket.onMessage = function (message) {
            if (!message) return;
            // Remove the message from sendingMessages
            vm.sendingMessages = $.grep(vm.sendingMessages, function (e) {
              return e.localId != message.localId
            })

            // look up the username in message.from to get image, etc.
            if (message.from === vm.currentUser.username) {
              message.me = true
              message.fromUser = vm.currentUser
              vm.messages.unshift(message)
            } else {
              UserService.getUserInfo(message.from).then(response => {
                message.fromUser = response.body
                if (vm.messages.length != 0) {
                  if (vm.messages[0].localId != message.localId) {
                    // This block of code runs twice for some reason
                    // So just make sure that we didn't already add this message
                    // if (!(vm.messages.length == 1)) {
                      vm.messages.unshift(message)
                    // }
                  }
                }
              })
            }

            if (vm.isAlbumLink(message.text)) {
              vm.getAlbumFromLink(message.text)
            }

            if (vm.isMerchLink(message.text)) {
              vm.getMerchFromLink(message.text)
            }

            if (vm.isUserLink(message.text)) {
              vm.getUserFromLink(message.text)
            }
          }

          this.chat_socket.onMessageSending = function (text) {
            vm.sendingMessages.push(text)
          }

          this.chat_socket.onUserInfo = function (user) {
            vm.user = user
          }

          this.chat_socket.onRoomInfo = async room => {
            console.log('chat onRoomInfo', room)
            // Vue.set(vm, "room", room)
            vm.room = room
            // Fetch user data (avatar image, etc)
            let temponlineUsers = await Promise.all(_.chain(room.online).compact().map(async username => {
              const res = await UserService.getUserInfo(username)
              return res.body
            }).value())
            let tempidleUsers = await Promise.all(room.idle.map(async username => {
              const res = await UserService.getUserInfo(username)
              return res.body
            }))
            vm.adminUsers = await Promise.all(room.admins.map(async username => {
              const res = await UserService.getUserInfo(username)
              return res.body
            }))
            // Remove admin users from online/idle list because they are displayed separately
            Vue.set(vm, "onlineUsers", temponlineUsers.filter(u => {
              return room.admins.indexOf(u.username) < 0
            }))
            Vue.set(vm, "idleUsers", tempidleUsers.filter(u => {
              return room.admins.indexOf(u.username) < 0
            }))
            vm.admin = (room.admins.filter((u) => {
              return u == vm.currentUser.username
            }).length == 1)
          }

          this.chat_socket.onLoadMessages = function (loadMessageObj) {
            // loadMessageObj is an object {chunk: <chunk number>, data: <array of messages in chunk>, last: <if it's the last chunk>}
            for (var i = loadMessageObj.chunk * 500; i < (loadMessageObj.chunk + 1) * 500; i++) {
              var nextMessage = loadMessageObj.data[i - (loadMessageObj.chunk * 500)];
              if (nextMessage) {
                Vue.set(vm.messages, i, nextMessage)
              }
            }
            vm.last = loadMessageObj.last;
            vm.nextChunk = loadMessageObj.chunk + 1
            requestInProgress = false;
            vm.messages.map((message) => {
              if (message) {
                if (vm.isAlbumLink(message.text)) {
                  vm.getAlbumFromLink(message.text)
                }
                if (vm.isMerchLink(message.text)) {
                  vm.getMerchFromLink(message.text)
                }
                if (vm.isUserLink(message.text)) {
                  vm.getUserFromLink(message.text)
                }
                if (message.from === vm.currentUser.username) {
                  message.me = true;
                }
                UserService.getUserInfo(message.from).then(response => {
                  Vue.set(message, "fromUser", response.body)
                })
                return message
              }
            })
            vm.connected = true
            vm.messageError = ""
            $('#msg-container')[0].scrollTop = $('#msg-container')[0].scrollHeight

            // setTimeout(function () {
            //   scrollDown(loadMessageObj.chunk === 0);
            //   if (loadMessageObj.chunk > 0) {
            //     $("#msg-container").scrollTop($("#msg-container")[0].scrollHeight - oldHeight + oldScroll);
            //   }
            // }, 1);
            //   vm.artist = this.chat_socket.room;
            // };
          }
        })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        console.log(e)
      })
    },

    unloadPage() {
      if (this.idleInterval) {
        clearInterval(this.idleInterval)
      }

      if (this.chat_socket) {
        this.chat_socket.close()
        this.chat_socket = null
      }
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      // const paths = toPath.path.split('/')
      // console.log(toPath, fromPath, toPath.params.user)
      this.artist = toPath.params.user
      this.loadPage()
    },

    settingsChange (newSettings) {
      // check settings
      var parsed = JSON.parse(newSettings)
      if (parsed.charLimitBool && typeof this.rules.number(parsed.charLimit) === 'string') {
        return
      }
      if (typeof parsed.charLimit === 'string' && parsed.charLimit !== '') {
        parsed.charLimit = parseInt(parsed.charLimit)
      }
      this.chat_socket.updateSettings(parsed)
    }
  },

  created() {
    this.artist = this.$route.params.user

    this.$root.$on(MyEvents.VIDEO_PLAYER_EXIT, this.onExitVideoPlayer)
    this.loadPage()
  },

  beforeDestroy () {
    this.$root.$off(MyEvents.VIDEO_PLAYER_EXIT, this.onExitVideoPlayer)
    this.unloadPage()
  },

  mounted() {
    const idleTimeout = 3 // 3 minutes
    const vm = this
    var idleTime = 0
    $(document).ready(function () {
      // increment the idle time counter every 0.1 minutes.
      vm.idleInterval = setInterval(timerIncrement, 6000) // 1 minute

      // zero the idle timer on mouse movement.
      $(this).mousemove(function (e) {
        if (idleTime >= idleTimeout) vm.chat_socket.online() // back online after being idle
        idleTime = 0
      })
      $(this).keypress(function (e) {
        if (idleTime >= idleTimeout) vm.chat_socket.online() // back online after being idle
        idleTime = 0
      })
    })

    let requestInProgress = false;
    let oldHeight = $("#msg-container").height();
    let oldScroll = $("#msg-container").scrollTop();

    $("#msg-container").scroll(() => {
      if ($("#msg-container").scrollTop() < 50 && !vm.last) {
        if (!requestInProgress) {
          oldHeight = $("#msg-container").height();
          oldScroll = $("#msg-container").scrollTop();
          requestInProgress = true;
          vm.chat_socket.moreMessages(vm.nextChunk);
        }
      }
    });

    function timerIncrement() {
      idleTime = idleTime + 0.1
      if (idleTime >= idleTimeout) { // 20 minutes
        vm.chat_socket.idle()
        clearInterval(vm.idleInterval)
      }
    }
  }
}

function scrollDown(force) {
  let container = $('#msg-container');
  if (force || Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 70) {
    container.scrollTop = container.scrollHeight;
  }
}

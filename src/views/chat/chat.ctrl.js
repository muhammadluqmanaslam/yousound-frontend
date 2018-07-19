import _ from 'lodash'
import SocketManager from '@/services/chat'
import UserService from '@/services/user'
import AuthService from '@/services/auth'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import moment from 'moment'
import Message from '@/components/chat/message'
import MessageInput from '@/components/chat/messageinput'
import ChatSidebar from '@/components/chat/chatsidebar'
import activityAlbumCard from '@/components/activityalbumcard'
import activityProductCard from '@/components/activityproductcard'
import { Picker } from 'emoji-mart-vue'
import VueChatScroll from 'vue-chat-scroll'
import Vue from 'vue'
import { EHOSTUNREACH } from 'constants';
import { MyEvents } from '@/helper';

Vue.use(VueChatScroll)

var sm
var idleTimeout = 3 // 3 minutes
const linkRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

export default {
  components: {
    Message,
    MessageInput,
    ChatSidebar,
    Picker,
    activityAlbumCard,
    activityProductCard
  },

  data() {
    return {
      showEmojiPicker: false,
      show_broadcastPopup: false,
      show_confirmPopup: false,
      show_requestPopup: false,
      show_stream_live_button: false,
      moment: moment,
      artist: this.$route.params.user,
      msgInput: '',
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
      connected: false,
      albumLinks: {},
      merchLinks: {},
      idleInterval: null
    }
  },

  computed: {
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
    }
  },

  watch: {
    settingsChange: function (newSettings) {
      // check settings
      var parsed = JSON.parse(newSettings)
      if (parsed.charLimitBool && typeof this.rules.number(parsed.charLimit) === 'string') {
        return
      }
      if (typeof parsed.charLimit === 'string' && parsed.charLimit !== '') {
        parsed.charLimit = parseInt(parsed.charLimit)
      }
      sm.updateSettings(parsed)
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
      if (this.room.settings.charLimitBool && this.msgInput.length > this.room.settings.charLimit) return false
      if (!this.room.settings.links && linkRegex.test(this.msgInput)) return // TODO error instead of returning
      sm.sendMessage(messageText, this.user.username)
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

    isAttachmentLink(string) {
      const attachmentRegex = /\/(album)|(merch)\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      return attachmentRegex.test(string)
    },

    isAlbumLink(string) {
      const albumLinkRegex = /\/album\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      return albumLinkRegex.test(string)
    },

    isMerchLink(string) {
      const merchLinkRegex = /\/merch\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      return merchLinkRegex.test(string)
    },

    getAlbumFromLink(string) {
      const albumId = string.split("/")[2]
      AlbumService.getAlbum(albumId)
        .then(res => {
          Vue.set(this.albumLinks, string, res.body)
        })
    },

    getMerchFromLink(string) {
      const merchId = string.split("/")[2]
      ProductService.getProduct(merchId)
        .then(res => {
          Vue.set(this.merchLinks, string, res.body)
        })
    }
  },

  created() {
    this.show_stream_live_button = false
    let app = this
    let requestInProgress = false;
    this.$store.dispatch('navigator/goNextState', {page: 'chat', tab: ''})
    this.$store.dispatch('error/showLoadingActivity', true)
    UserService.getUserInfo(this.$route.params.user).then(response => {
      this.$store.dispatch('error/showLoadingActivity', false)
      this.user = response.body
      this.loadAlbums()
      if (_.get(this.user.stream, 'status', '') === 'running') {
        Vue.http.get(this.user.stream.mp_channel_1_ep_1_url).then(response => {
          this.show_stream_live_button = true
        })
      }
      sm = new SocketManager(process.env.CHAT_SERVER_URL, this.user.slug, AuthService.getToken(), () => {
        sm.onDisconnect = () => {
          app.connected = false
        } 
        sm.onMessage = function (message) {
    
          if (!message) return;
          // Remove the message from sendingMessages
          app.sendingMessages = $.grep(app.sendingMessages, function (e) {
            return e.localId != message.localId
          })

          // look up the username in message.from to get image, etc.
          if (message.from === app.user.username) {
            message.me = true
          }
          UserService.getUserInfo(message.from).then(response => {
            message.fromUser = response.body
            if (app.messages.length != 0) {
              if (app.messages[0].localId != message.localId) {
                // This block of code runs twice for some reason
                // So just make sure that we didn't already add this message
                if (!(app.messages.length == 1)) {
                  app.messages.unshift(message)
                }
              }
            }
          })

          if (app.isAlbumLink(message.text)) {
            app.getAlbumFromLink(message.text)
          }

          if (app.isMerchLink(message.text)) {
            app.getMerchFromLink(message.text)
          }
        }

        sm.onMessageSending = function (text) {
          app.sendingMessages.push(text)
        }

        sm.onUserInfo = function (user) {
          app.user = user
        }

        sm.onRoomInfo = async room => {
          Vue.set(app, "room", room);
          // Fetch user data (avatar image, etc)
                    let temponlineUsers = await Promise.all(room.online.map(async username => {
            const res = await UserService.getUserInfo(username)
            return res.body
          }))
                    let tempidleUsers = await Promise.all(room.idle.map(async username => {
            const res = await UserService.getUserInfo(username)
            return res.body
          }))
          app.adminUsers = await Promise.all(room.admins.map(async username => { 
            const res = await UserService.getUserInfo(username)
            return res.body
          }))
          // Remove admin users from online/idle list because they are displayed separately
                    Vue.set(app, "onlineUsers", temponlineUsers.filter(u => {
            return room.admins.indexOf(u.username) < 0
          }));
                    Vue.set(app, "idleUsers", tempidleUsers.filter(u => {
            return room.admins.indexOf(u.username) < 0
          }));
          app.admin = (room.admins.filter((u) => {
            return u == app.user.username
          }).length == 1);
        }

        sm.onLoadMessages = function (loadMessageObj) {
          // loadMessageObj is an object {chunk: <chunk number>, data: <array of messages in chunk>, last: <if it's the last chunk>}
          for (var i = loadMessageObj.chunk * 500; i < (loadMessageObj.chunk + 1) * 500; i++) {
            var nextMessage = loadMessageObj.data[i - (loadMessageObj.chunk * 500)];
            if (nextMessage) {
              Vue.set(app.messages, i, nextMessage)
            }
          }
          app.last = loadMessageObj.last;
          app.nextChunk = loadMessageObj.chunk + 1
          requestInProgress = false;
          app.messages.map((message) => {
            if (message) {
              if (app.isAlbumLink(message.text)) {
                app.getAlbumFromLink(message.text)
              }
              if (app.isMerchLink(message.text)) {
                app.getMerchFromLink(message.text)
              }
              if (message.from === app.user.username) {
                message.me = true;
              }
              UserService.getUserInfo(message.from).then(response => {
                Vue.set(message, "fromUser", response.body);
              })
              return message;
            }
          });
          app.connected = true;
          $('#msg-container')[0].scrollTop = $('#msg-container')[0].scrollHeight

          // setTimeout(function () {
          //   scrollDown(loadMessageObj.chunk === 0);
          //   if (loadMessageObj.chunk > 0) {
          //     $("#msg-container").scrollTop($("#msg-container")[0].scrollHeight - oldHeight + oldScroll);
          //   }
          // }, 1);
          //   app.artist = sm.room;
          // };
        }
      })
    }).catch(e => {
      this.$store.dispatch('error/showLoadingActivity', false)
      console.log(e)
    })
  },

  beforeDestroy () {
    if (this.idleInterval) {
      clearInterval(this.idleInterval)
    }
    sm.close()
  },

  mounted() {
    var app = this
    var idleTime = 0
    $(document).ready(function () {
      // increment the idle time counter every 0.1 minutes.
      app.idleInterval = setInterval(timerIncrement, 6000) // 1 minute

      // zero the idle timer on mouse movement.
      $(this).mousemove(function (e) {
        if (idleTime >= idleTimeout) sm.online() // back online after being idle
        idleTime = 0
      })
      $(this).keypress(function (e) {
        if (idleTime >= idleTimeout) sm.online() // back online after being idle
        idleTime = 0
      })
    })

    let requestInProgress = false;
    let oldHeight = $("#msg-container").height();
    let oldScroll = $("#msg-container").scrollTop();

    $("#msg-container").scroll(() => {
      if ($("#msg-container").scrollTop() < 50 && !app.last) {
        if (!requestInProgress) {
          oldHeight = $("#msg-container").height();
          oldScroll = $("#msg-container").scrollTop();
          requestInProgress = true;
          sm.moreMessages(app.nextChunk);
        }
      }
    });

    function timerIncrement() {
      idleTime = idleTime + 0.1
      if (idleTime >= idleTimeout) { // 20 minutes
        sm.idle()
        clearInterval(app.idleInterval)
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

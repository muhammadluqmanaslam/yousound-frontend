import SocketManager from '@/services/chat'
import UserService from '@/services/user'
import AuthService from '@/services/auth'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import moment from 'moment'
import Message from '@/components/chat/message'
import MessageInput from '@/components/chat/messageinput'
import ChatSidebar from '@/components/chat/chatsidebar'
import { Picker } from 'emoji-mart-vue'


var sm;

var idleTimeout = 3; // 3 minutes
const linkRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

export default {
  components: {
    Message,
    MessageInput,
    ChatSidebar,
    Picker
  },
  data () {
    return {
      showEmojiPicker: false,
      show_broadcastPopup: false,
      show_confirmPopup: false,
      show_requestPopup: true,
      moment: moment,
      artist: this.$route.params.user,
      msgInput: "",
      messages: [],
      sendingMessages: [],
      user: null,
      room: {
        settings: {
          links: false,
          charLimitBool: false,
          charLimit: 100
        },
        online: [],
        idle: []
      },
      rules: {
        number: (value) => {
          const pattern = /^(0|[1-9][0-9]*)$/
          if (value == "") return 'Please enter a number.';
          if (!pattern.test(value)) return 'Please enter a number.';
          if (!((parseInt(value) <= 500) && (parseInt(value) >= 1))) return "Please enter a number between 1-500";
          return true;
        },
        link: (value) => {
          if (linkRegex.test(value)) return "Links have been disabled."
          return true;
        }
      },
      admin: false,
      last: false,
      nextChunk: 0,
      message : '',
      meberList: true,
      request_tab: 'album',
      item_index: -1,
      albums: [],
      products: []
    }
  },
  computed: {
    settingsChange: function() {
      if (typeof this.room.settings.charLimit === "string" && this.room.settings.charLimit !== "" && this.rules.number(this.room.settings.charLimit) !== "string") {
        // this.room.settings.charLimit = parseInt(this.room.settings.charLimit);
      }
      return JSON.stringify(this.room.settings);
    },
    reverseMessages() {
      return this.messages.slice().reverse();
    }
  },
  watch: {
    settingsChange: function(newSettings) {
      // check settings
      var parsed = JSON.parse(newSettings);
      if (parsed.charLimitBool && typeof this.rules.number(parsed.charLimit) === "string") {
        return;
      }
      if (typeof parsed.charLimit === "string" && parsed.charLimit !== "") {
        parsed.charLimit = parseInt(parsed.charLimit);
      }
      sm.updateSettings(parsed);
    }

  },
  methods: {
    startBroadcasting () {
      this.show_broadcastPopup = false
    },

    startListenning () {
      this.show_confirmPopup = false
    },

    sendMessage(messageText) {
      if (this.room.settings.charLimitBool && this.msgInput.length > this.room.settings.charLimit) return false;
      if (!this.room.settings.links && linkRegex.test(this.msgInput)) return; // TODO error instead of returning
      sm.sendMessage(messageText, this.user.username);
      return false;
    },

    getMessages(a, b) {
      return (a, b)
    },

    addEmoji(emoji, event) {
      this.showEmojiPicker = false
      this.message += emoji.native
      this.$refs.chat.focus()
    },

    loadAlbums () {
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

    selectItemIndex (index) {
      this.show_requestPopup = false
      if (this.item_index != index) {
        this.item_index = index        
      } else {
        this.item_index = -1
      }
    }
  },
  created() {
    this.$store.dispatch('navigator/goNextState', {page: 'chat', tab: ''})
    this.$store.dispatch('error/showLoadingActivity', true)
    UserService.getUserInfo(this.$route.params.user).then(response => {
      this.$store.dispatch('error/showLoadingActivity', false)
      this.user = response
      this.loadAlbums()
      // sm = new SocketManager(process.env.CHAT_SERVER_URL, this.user.slug, AuthService.getToken());
    }).catch(e => {
      this.$store.dispatch('error/showLoadingActivity', false)
    })
  },
  mounted() {
    var app = this;
    var idleTime = 0;
    $(document).ready(function() {
      // increment the idle time counter every minute.
      var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

      // zero the idle timer on mouse movement.
      $(this).mousemove(function(e) {
        if (idleTime >= idleTimeout) sm.online(); // back online after being idle
        idleTime = 0;
      });
      $(this).keypress(function(e) {
        if (idleTime >= idleTimeout) sm.online(); // back online after being idle
        idleTime = 0;
      });
    });

    // var requestInProgress = false;
    // var oldHeight = $("#msg-container").height();
    // var oldScroll = $("#msg-container").scrollTop();

    // $("#msg-container").scroll(() => {
    //   if ($("#msg-container").scrollTop() < 50 && !app.last) {
    //     if (!requestInProgress) {
    //       oldHeight = $("#msg-container")[0].scrollHeight;
    //       oldScroll = $("#msg-container").scrollTop();
    //       requestInProgress = true;
    //       sm.moreMessages(app.nextChunk);
    //     }
    //   }
    // });

    function timerIncrement() {
      idleTime = idleTime + 1;
      if (idleTime >= idleTimeout) { // 20 minutes
        sm.idle();
      }
    }

    function scrollDown(force) {
      // var container = $("#msg-container")[0];
      // if (force || Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 70) {
      //   container.scrollTop = container.scrollHeight;
      // }
    }
    scrollDown(true);
    // sm.onMessage = function(message) {
    //   // Remove the message from sendingMessages
    //   app.sendingMessages = $.grep(app.sendingMessages, function(e) {
    //     return e.localId != message.localId
    //   });
    //   // look up the username in message.from to get image, etc.
    //   if (message.from === app.user.username) {
    //     message.me = true;
    //   }
    //   app.messages.unshift(message);
    //   setTimeout(function() {
    //     scrollDown(false);
    //   }, 1);
    // };

    // sm.onMessageSending = function(text) {
    //   app.sendingMessages.push(text);
    //   setTimeout(function() {
    //     scrollDown(false);
    //   }, 1);
    // };

    // sm.onUserInfo = function(user) {
    //   app.user = user;
    // };

    // sm.onRoomInfo = function(room) {
    //   app.room = room;
    //   app.admin = (room.admins.filter((u) => { return u == app.user.username }).length == 1);
    // };

    // sm.onLoadMessages = function(loadMessageObj) {
    //   scrollDown(true);
    //   // loadMessageObj is an object {chunk: <chunk number>, data: <array of messages in chunk>, last: <if it's the last chunk>}
    //   for (var i = loadMessageObj.chunk * 500; i < (loadMessageObj.chunk + 1) * 500; i++) {
    //     var nextMessage = loadMessageObj.data[i - (loadMessageObj.chunk * 500)];
    //     if (nextMessage) {
    //       app.messages[i] = nextMessage
    //     }
    //   }
    //   app.last = loadMessageObj.last;
    //   app.nextChunk = loadMessageObj.chunk + 1
    //   requestInProgress = false;
    //   app.messages = app.messages.map((message) => {
    //     if (message) {
    //       if (message.from === app.user.username) {
    //         message.me = true;
    //       };
    //       return message;
    //     }
    //   });
    //   setTimeout(function() {
    //     scrollDown(loadMessageObj.chunk === 0);
    //     if (loadMessageObj.chunk > 0) {
    //       $("#msg-container").scrollTop($("#msg-container")[0].scrollHeight - oldHeight + oldScroll);
    //     }
    //   }, 1);

    //   app.artist = sm.room;
    // };
  }
}

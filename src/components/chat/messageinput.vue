<template>
  <v-layout row>
    <v-flex xs12>
      <hr class="divider2">
      <div class="msg-input-container">
        <v-layout row style="margin-left: 20px;">
          <v-flex xs10>
            <v-layout row>
              <v-flex xs1 class="text-xs-right">
                <img class="pic" v-bind:src="user.avatar.thumb.url" style="margin-right: 20px;" />
              </v-flex>
              <v-flex>
                <v-text-field v-model="msgInput" id="msg-input" class="msg-input" label="Write something..." single-line :counter="settings.charLimitBool" :max="settings.charLimit" :rules="settings.link ? [] : [rules.link] "></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs2>
            <button class="msg-send-btn" id="msg-send">Send</button>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import $ from 'jquery'

const linkRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/

export default {
  props: ['user', 'settings'],
  data () {
    return {
      rules: {
        link: (value) => {
          if (linkRegex.test(value)) return 'Links have been disabled.'
          return true
        }
      },
      msgInput: ''
    }
  },
  mounted () {
    let that = this

    $('#msg-send').mousedown((e) => {
      that.$emit('submit', that.msgInput)
      that.msgInput = ''
      e.stopPropagation()
      return false
    })
    $('#msg-input').on('keyup', (e) => {
      if (e.keyCode === 13) {
        that.$emit('submit', that.msgInput)
        that.msgInput = ''
        e.stopPropagation()
        return false
      }
    })
  }
}
</script>

<style scoped>
.msg-input {
  margin-top: 5px;
}

.msg-input-container {
  position: absolute;
  bottom: 0px;
  margin-bottom: 0px;
  width: 100%;
  display: block;
}

.msg-send-btn {
  background: #FFFFFF;
  border: 1px solid #B1B1B1;
  border-radius: 100px;
  font-size: 18px;
  padding: 3px 15px 3px 15px;
  color: #9B9B9B;
  letter-spacing: -0.8px;
  -webkit-transition: all .25s ease;
  -moz-transition: all .25s ease;
  -o-transition: all .25s ease;
  transition: all .25s ease;
}

.msg-send-btn:active {
  border: 1px solid #3A92FF;
  color: #3A92FF;
}

.pic {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0;
  background-color: #B1B1B1
}

.divider2 {
  border-width: 1px;
  border-color: #FFFFFF;
}

button:focus {
  outline: 0;
}
</style>

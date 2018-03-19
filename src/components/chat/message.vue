<template>
  <v-layout row>
    <template v-if="sending">
      <v-flex xs10 order-xs2>
        <div class="msg sending">
          {{message.text}}
        </div>
      </v-flex>
      <v-flex class="text-xs-right" xs1 v-bind:class="{gone: !(i==0 || (fromUser.username != messages[(i-1)<0?0:i-1].from) || (message.time - messages[(i-1)<0?0:i-1].time > 1200000))}">
        <img class="pic gone" v-bind:src="fromUser.image" />
      </v-flex>
    </template>
    <template v-else>
      <v-flex xs10 order-xs2>
        <template v-if="i==0 || (fromUser.username != messages[(i-1)<0?0:i-1].from) || (message.time - messages[(i-1)<0?0:i-1].time > 1200000)">
          <div class="msg-name">
            <user-modal :user="fromUser"></user-modal>
            <div class="msg-time">
              - {{moment(message.time).calendar()}}
            </div>
          </div>
        </template>
        <div class="msg">
          {{message.text}}
        </div>
      </v-flex>
      <v-flex class="text-xs-right" xs1 v-bind:class="{gone: !(i==0 || (fromUser.username != messages[(i-1)<0?0:i-1].from) || (message.time - messages[(i-1)<0?0:i-1].time > 1200000))}">
        <img class="pic" v-bind:src="fromUser.image" />
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import moment from 'moment'
import UserModal from './usermodal'
import UserService from '@/services/user'

export default {
  props: ['message', 'messages', 'i', 'sending'],
  data () {
    return { moment, fromUser: {image: 'temp'} }
  },
  components: {
    UserModal
  },
  created () {
    var app = this
    UserService.getUserInfo(this.message.from).then((a) => {
      app.fromUser = a
      app.fromUser.image = a.avatar.thumb.url
    })
  }
}
</script>

<style scoped>
.msg {
  font-size: 16px;
  padding-left: 15px;
  padding-right: 5px;
  padding-top: 0px;
  padding-bottom: 0px;
  color: #000;
  letter-spacing: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
  letter-spacing: 0;
  display: inline-block;
}

.msg-name {
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 10px;
  font-size: 18px;
  color: #3A92FF;
  letter-spacing: 0;
}

.gone {
  opacity: 0;
  height: 0;
}

.sending {
  color: #9B9B9B;
}

.bubble {
  width: 17px;
  height: 17px;
  position: relative;
  border-radius: 50%;
  top: -30%;
  right: -70%;
}

.msg-time {
  font-size: 12px;
  display: inline-block;
  color: #B1B1B1;
}

.me {
  background: #3A92FF;
  border-radius: 100px;
  color: #FFFFFF;
}

.pic {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0;
  background-color: #B1B1B1
}
</style>

<template>
  <v-flex xs3 class="full-height">
    <v-tabs centered grow class="full-height">
      <v-tabs-bar slot="activators" class="grey lighten-4">
        <v-tabs-slider color="black primary"></v-tabs-slider>
        <v-tabs-item href="#tab-online">
          <v-icon>people</v-icon>
        </v-tabs-item>
        <v-tabs-item href="#tab-settings" class="black--text" v-if="admin">
          <v-icon>settings</v-icon>
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-content id="tab-online" class="full-height">
        <v-card flat class="full-height">
          <v-card-text class="full-height">
            <v-flex class="text-xs-left" v-for="user in onlineUsers" :key="user.username">
              <v-layout row>
                <div>
                  <img class="pic" v-bind:src="user.avatar.thumb.url" />
                  <div class="bubble online"></div>
                </div>
                <div class="msg-name">
                  <user-modal :user="user"></user-modal>
                </div>
              </v-layout>
            </v-flex>
            <v-flex class="text-xs-left" v-for="user in idleUsers" :key="user.username">
              <v-layout row>
                <div>
                  <img class="pic" v-bind:src="user.avatar.thumb.url" />
                  <div class="bubble idle"></div>
                </div>
                <div class="msg-name">
                  <user-modal :user="user"></user-modal>
                </div>
              </v-layout>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="tab-settings" v-if="admin">
        <v-card flat>
          <v-card-text>
            <template id="room-admin-settings" v-if="admin">
              <v-switch label="Enable links?" v-model="room.settings.links"></v-switch>
              <v-switch label="Character limit?" v-model="room.settings.charLimitBool"></v-switch>
              <v-text-field v-if="room.settings.charLimitBool" label="Limit" placeholder="# of characters" v-model="room.settings.charLimit" :rules="[rules.number]"></v-text-field>
            </template>
            <template id="local-settings">
              <!-- <v-switch v-bind:label="`Switch 1: ${ex11.toString()}`" v-model="ex11"></v-switch>
                                        <v-switch v-bind:label="`Switch 2: ${ex12.toString()}`" v-model="ex12"></v-switch> -->
            </template>
          </v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs>
  </v-flex>
</template>
<script>
import UserModal from './usermodal'
import UserService from '@/services/user'

export default {
  props: ['admin', 'room'],
  components: {
    UserModal
  },
  data () {
    return {
      rules: {
        number: (value) => {
          const pattern = /^(0|[1-9][0-9]*)$/
          if (value === '') return 'Please enter a number.'
          if (!pattern.test(value)) return 'Please enter a number.'
          if (!((parseInt(value) <= 500) && (parseInt(value) >= 1))) return 'Please enter a number between 1-500'
          return true
        }
      },
      onlineUsers: [],
      idleUsers: []
    }
  },
  watch: {
    room (r) {
      var that = this
      Promise.all(that.room.online.map((e) => { if (e) return UserService.getUserInfo(e) })).then((v) => { that.onlineUsers = v })
      Promise.all(that.room.idle.map((e) => { if (e) return UserService.getUserInfo(e) })).then((v) => { that.idleUsers = v })
    },
    deep: true
  }
}

</script>
<style>
.bubble {
  width: 17px;
  height: 17px;
  position: relative;
  border-radius: 50%;
  top: -30%;
  right: -70%;
}

/*.online {
  background-color: #43b581;
}*/

.idle {
  background-color: #faa61a;
}

.pic {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0;
  background-color: #B1B1B1
}

</style>

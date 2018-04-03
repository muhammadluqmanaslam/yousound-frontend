<template>
  <v-flex xs12 sm12 class="approve-section">
    <v-layout row wrap class="dismiss-section" @click="dismiss()"></v-layout>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 sm12 class="profile-section">
        <div class="profile-image" :style="{'background-image': 'url(' + item.avatar.url + ')'}"></div>
        <div class="user-info-section">
          <div class="info-section">
            <label class="user-name">{{ item.display_name }}</label>
            <label class="main-genre">Main Genre: {{ mainGenreName }}</label>
          </div>
          <div class="action-section">
            <v-btn color="success" class="approve-btn" @click.native="approveButtonAction(item)">Approve</v-btn>
            <v-btn color="error" class="deny-btn" @click.native="denyButtonAction()">Deny</v-btn>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 sm12 class="link-section">
        <label class="link-title">Email: </label>
        <!-- <router-link class="link-link" to="/user">joehend@email.com</router-link> -->
        <a class="link-link">{{ item.email }}</a>
        <label class="link-title pl-4">Twitter: </label>
        <!-- <router-link class="link-link" to="https://facebook.com">facebook.com/joehenderson</router-link> -->
        <a v-if="item.social_user_id"
          :href="`https://twitter.com/intent/user?user_id=${item.social_user_id}`" target="_blank">https://twitter.com/intent/user?user_id={{ item.social_user_id }}</a>
      </v-flex>
      <v-flex xs12 sm12 class="about-section">
        <h5 class="about-title">About My Music</h5>
        <p class="link-title">Number of previous releases: {{ item.release_count }}</p>
        <v-flex xs12 sm12>
          <label class="link-title">Soundcloud: </label>
          <a class="link-link" :href="item.soundcloud_url | formatFullUrl" target="_blank">{{ item.soundcloud_url }}</a>
        </v-flex>
        <v-flex xs12 sm12>
          <label class="link-title">Bandcamp: </label>
          <a class="link-link" :href="item.basecamp_url | formatFullUrl" target="_blank">{{ item.basecamp_url }}</a>
        </v-flex>
        <v-flex xs12 sm12>
          <label class="link-title">Website: </label>
          <a class="link-link" :href="item.Website_url | formatFullUrl" target="_blank">{{ item.website_url }}</a>
        </v-flex>
        <p class="link-title">Artists and/or labels they've worked with:</p>
        <p class="description-text">{{ item.history }}</p>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
  import _ from 'lodash'
  import profileItem from '@/components/profileitem'
  export default {
    components: {
      profileItem
    },

    props: {
      item: {
        type: Object,
        required: true
      },

      dismiss: {
        type: Function,
        required: true
      },

      approveButtonAction: {
        type: Function,
        required: true
      },

      denyButtonAction: {
        type: Function,
        required: true
      }
    },

    data () {
      return {
      }
    },

    computed: {
      mainGenreName () {
        return _.get(this.item, 'genre.name')
      }
    },

    created () {
    },

    methods: {
    }
  }
</script>

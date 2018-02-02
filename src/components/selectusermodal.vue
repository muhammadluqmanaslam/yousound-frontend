<template>
  <v-flex xs12 sm12 class="select-user-section">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 class="title-section">
        <h2 class="text-xs-center">{{ title }}</h2>
        <v-flex xs12 class="search-section">
          <div class="search-box">
            <div class="search-container">
              <span class="icon">
                <svg width="20px" height="20px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                  <title>Group 22</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="searchIcon" transform="translate(-732.000000, -61.000000)" stroke="#FFFFFF" stroke-width="1.5999999">
                      <g id="Group-29" transform="translate(710.000000, 50.000000)">
                        <g id="Group-22" transform="translate(23.000000, 12.000000)">
                          <circle id="Oval-2" cx="11.375" cy="11.375" r="11.375"></circle>
                          <path d="M19.5,19.5 L25.59375,25.59375" id="Line" stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <input
                  class="search-field"
                  v-model="keyword"
                  type="search"
                  id="search"
                  placeholder="Search"
                  @keyup.enter="loadUsers()"/>
            </div>
          </div>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="list-section">
        <v-flex v-for="(user, index) in filtered_users"
            xs12 class="user-item"
            :key="index"
            @click.self="onSelectUser(user)">
          <a :href="'/' + user.slug"><div class="avatar-image" :style="{'background-image': 'url(' + user.avatar.thumb.url + ')'}"></div></a>
          <label class="user-name" @click="onSelectUser(user)">
            {{ user.display_name }}
            <v-icon 
              class="user-status"
              :class="{'online': user.status == 'active'}"
              v-if="user.user_type == 'artist'">fa-check-circle</v-icon>
          </label>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
  import _ from 'lodash'
  import UserService from '@/services/user'

  export default {
    props: {
      title: {
        type: String,
        required: true
      },

      type: {
        type: String
      },

      dismiss: {
        type: Function,
        required: true
      },

      selectUser: {
        type: Function,
        required: true
      }
    },

    data () {
      return {
        keyword: '',
        users: [],
        page_index: 1,
        total_pages: 1,
        items_per_page: 20 * 5
      }
    },

    computed: {
      filtered_users () {
        return _.filter(this.users, (user) => { return user.user_type === this.type })
      }
    },

    created () {
      this.loadUsers()
    },

    methods: {
      loadUsers () {
        var params = {
          'page': this.page_index,
          'per_page': this.items_per_page
        }
        if (this.keyword.length) {
          params['q'] = this.keyword
        }
        UserService.searchUsers(params).then(response => {
          this.users = response.body.users
        })
        .catch(e => {
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
      },

      onSelectUser (user) {
        this.dismiss()
        this.selectUser(user)
      }
    }
  }
</script>

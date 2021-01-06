<template>
  <v-app id="app">
    <v-snackbar
      v-model="showError"
      multi-line
      top
      :timeout="$store.state.error.timeout"
      :color="$store.state.error.color"
    >
      <label>{{ $store.state.error.errors[0] }}</label>
      <v-btn dark flat @click.native="$store.dispatch('error/hideToast')"
        ><v-icon>clear</v-icon></v-btn
      >
    </v-snackbar>
    <router-view class="main-content-view"></router-view>
  </v-app>
</template>

<script>
import CategoryService from '@/services/category'
import GenreService from '@/services/genre'
import SettingService from '@/services/setting'
import UserService from '@/services/user'
import { PublicRelationsUsername } from '@/helper'

export default {
  computed: {
    showError: {
      get: function () {
        return this.$store.state.error.showError
      },

      set: function (newValue) {
        this.$store.dispatch('error/hideToast')
      },
    },
  },

  created() {
    Promise.all([
      SettingService.getSettings(),
      GenreService.getGenres2(),
      CategoryService.getCategories(),
      UserService.getUserInfo(PublicRelationsUsername),
    ]).then((values) => {
      console.log('Mobile App initializing...')
      this.$store.dispatch('app/setSettings', values[0].body)
      this.$store.dispatch('app/setGenres', values[1].body)
      this.$store.dispatch('app/setProductCategories', values[2].body)
      this.$store.dispatch('app/setPublicRelationsUser', values[3].body)
    })
  },
}
</script>

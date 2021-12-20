<template>
  <div class="dashboard-nav">
    <v-toolbar fixed app flat color="white" height="73">
        <content-top-header>
            <template slot="topHeader">
                <ul class="width100">
                    <li
                    v-for="tab in tabs"
                    :key="tab.id"
                    :href="`#${tab.id}`"
                    :class="{ active: name === tab.id }"
                    >
                    <label @click="setTab(tab.pathName)">{{ tab.title }}</label>
                    </li>

                    <v-spacer></v-spacer>

                    <li>
                        <v-btn depressed to="/upload" class="upload-btn">Upload</v-btn>
                    </li>
                    <li>
                        <router-link :to="`/${currentUser.slug}`">
                            <div class="black--text">View Profile</div>
                        </router-link>
                    </li>
                    <li>
                        <v-btn
                            depressed
                            color="transparent"
                            class="text-capitalize no-Btn-bg"
                            @click="signOut"
                        >
                            Sign Out
                        </v-btn>
                    </li>
                </ul>
            </template>
        </content-top-header>
    </v-toolbar>
  </div>
</template>

<script>
import contentTopHeader from '@/components/contentTopHeader'
import AuthService from '@/services/auth'
import { MyEvents } from '@/helper'

export default {
  props: {
    name: String,
  },
  components: {
    contentTopHeader,
  },
  data() {
    return {
      activeTab: '',
      daysFilter: 7,
      tabs: [
        { id: 'dashboard', title: 'Dashboard', pathName: 'Dashboard' },
        { id: 'activity', title: 'Activity', pathName: 'Dashboard' },
        { id: 'sales', title: 'Sales', pathName: 'Sell' },
        { id: 'manage', title: 'Manage', pathName: 'ManageIndex' },
        { id: 'payments', title: 'Payments', pathName: 'PaymentIndex' },
        { id: 'settings', title: 'Settings', pathName: 'UserSettings' },
      ],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.name === tab
    },
    isActiveInnerTab(tab) {
      return this.activeInnerTab === tab
    },
    signOut() {
      AuthService.signout()
      this.$router.push({ path: '/login' })
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    },
    setTab(pathName) {
      this.$router.push({ name: pathName })
    },
  },

  created() {
    this.activeTab = this.name
  },
}
</script>

<style lang="scss" scoped>
.dashboard-nav {
    .upload-btn {
      box-shadow: none;
      text-transform: none;
      margin: 0;
      background: #0151ff !important;
      color: #ffffff;
      margin-top: 0;
    }
}
</style>

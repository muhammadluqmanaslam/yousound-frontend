<template>
  <app-card
    :image="userImage"
    :title="userName"
    :description="userType"
    :meta="userMeta"
  ></app-card>
</template>

<script>
import AppCard from '@/components/base/app_card'

export default {
  components: {
    AppCard,
  },

  props: {
    user: Object,
  },

  computed: {
    userImage() {
      if (
        this.user.user_type === 'superadmin' &&
        this.currentUser.user_type !== 'superadmin'
      ) {
        return this._.get(this.publicRelationsUser, 'avatar.thumb.url')
      } else {
        return this._.get(this.user, 'avatar.thumb.url')
      }
    },

    userName() {
      if (
        this.user.user_type === 'superadmin' &&
        this.currentUser.user_type !== 'superadmin'
      ) {
        return this._.get(this.publicRelationsUser, 'display_name')
      } else {
        return this._.get(this.user, 'display_name')
      }
    },

    userType() {
      if (
        this.user.user_type === 'superadmin' &&
        this.currentUser.user_type !== 'superadmin'
      ) {
        return this._.get(this.publicRelationsUser, 'user_type')
      } else {
        return this._.get(this.user, 'user_type')
      }
    },

    userMeta() {
      return {
        type: 'user',
        verified: this.userType !== 'listener',
      }
    },

    publicRelationsUser() {
      return this.$store.state.app.public_relations_user
    },

    currentUser() {
      return this.$store.state.auth.user
    },
  },
}
</script>

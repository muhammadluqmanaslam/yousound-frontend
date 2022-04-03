<template>
  <div class="footer-container">
    <ul>
      <li
        v-for="(footer, i) in footers"
        :key="i"
        @click="$router.push({name: footer.path})"
      >
        <span class="footer-wrapper">
          <img v-if="footer.isNotificationActive" :src="notificationIcon" width="8" class="__count" />
          <img :src="footer.icon" width="23" />
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      footers: [
        {
          id: 'discover',
          title: 'discover',
          icon: require('../../../../static/images/ic_search.svg'),
          path: 'DiscoverIndex',
          isNotificationActive: false,
        },
        {
          id: 'home',
          title: 'home',
          icon: require('@/assets/home.svg'),
          path: 'Feed',
          isNotificationActive: false,
        },
        {
          id: 'messages',
          title: 'messages',
          icon: require('@/assets/chat.svg'),
          path: 'Messages',
          isNotificationActive: false,
        },
        {
          id: 'notification',
          title: 'notification',
          icon: require('@/assets/bell_notification.svg'),
          path: 'ActivityIndex',
          isNotificationActive: false,
        },
      ],
      notificationIcon: require('@/assets/notification_dot.svg'),
    }
  },
  watch: {
    isUnreadActivity: {
      handler(val) {
        if (val == true) {
          this.footers = this.footers.map((f) => {
            if (f.id == 'notification') {
              f.isNotificationActive = true
            }
            return f
          })
        }
      },
      immediate: true
    },
    isUnreadMessages: {
      handler(val) {
        if (val == true) {
          this.footers = this.footers.map((f) => {
            if (f.id == 'messages') {
              f.isNotificationActive = true
            }
          })
        }
      },
      immediate: true
    }
  },
  computed: {
    badge() {
      return this.$store.state.activity.badge
    },
    isUnreadActivity() {
      return this.badge.activity > 0
    },
    isUnreadMessages() {
      return this.badge.message > 0
    },
  },
}
</script>

<style lang="scss" scoped>
.footer-container {
  position: absolute;
  width: 91%;
  bottom: 28px;
  left: 15px;
  margin: 0 auto;
  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    li {
      .footer-wrapper {
        position: relative;

        .__count {
          position: absolute;
          right: -4px;
          top: -15px;
        }
      }
    }
  }
}
</style>

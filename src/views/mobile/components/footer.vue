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

          <img v-if="footer.path === currentRoute" :src="footer.activeIcon" width="23" />
          <img v-else :src="footer.icon" width="23" />
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
          icon: require('@/assets/discover_2.svg'),
          activeIcon: require('@/assets/discover_2.svg'),
          path: 'AlbumIndex',
          isNotificationActive: false,
        },
        {
          id: 'home',
          title: 'home',
          icon: require('@/assets/home_2.svg'),
          activeIcon: require('@/assets/home_2_active.svg'),
          path: 'Feed',
          isNotificationActive: false,
        },
        {
          id: 'messages',
          title: 'messages',
          icon: require('@/assets/chat_2.svg'),
          activeIcon: require('@/assets/chat_2_active.svg'),
          path: 'Messages',
          isNotificationActive: false,
        },
        // {
        //   id: 'notification',
        //   title: 'notification',
        //   icon: require('@/assets/bell_notification.svg'),
        //   path: 'ActivityIndex',
        //   isNotificationActive: false,
        // },
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
    currentRoute() {
      return this.$route.name
    }
  },
}
</script>

<style lang="scss" scoped>
.footer-container {
  position: fixed;
  background-color: #ffffff;
  width: 100%;
  padding: 10px;
  bottom: 0px;
  left: 0px;
  margin: 0 auto;

  ul {
    display: flex;
    align-items: center;
    justify-content: space-around;
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

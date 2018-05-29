<template>
  <v-flex class="stream-user">
    <v-flex xs12 class="track-info" pa-0>
      <v-flex xs12 class="track-user" pa-0>
        <profile-item :user="user" :className="'track-user-avatar'"></profile-item>
        <div class="activity-section">
          <router-link class="user-name" :to="'/' + user.slug">{{ user.display_name }}</router-link>&nbsp;
          <v-icon class="user-status" v-bind:class="{'online': user.status == 'active'}" v-if="user.user_type == 'artist'">fa-check-circle</v-icon>&nbsp;
          <label class="description-text">{{ actionText }}
            <label class="items-title" @click="doAction()">{{ user.recent_items[0].assoc.name }}</label>
          </label>
        </div>
      </v-flex>
    </v-flex>
    <v-layout row wrap class="covers-content">
      <div class="card-container" v-for="(feed, index) in user.recent_items" :key="index" v-if="feed.assoc_type=='Album' || feed.assoc_type=='ShopProduct'">
        <track-card :objects="user.recent_items" :objectIndex="index" v-if="feed.assoc_type=='Album'"></track-card>
        <product-card :dataObject="feed" v-if="feed.assoc_type=='ShopProduct'"></product-card>
      </div>
    </v-layout>
    <merch-modal :item="user.recent_items[0].assoc" :dismiss="dimissMerchModal" v-if="showMerchModal && user.recent_items[0].assoc_type === 'ShopProduct'"></merch-modal>
  </v-flex>  
</template>

<script type="text/javascript">
  import profileItem from '@/components/profileitem'
  import trackCard from '@/components/trackcard'
  import productCard from '@/components/productcard'
  import merchModal from '@/components/merchmodal'

  export default {
    components: {
      profileItem,
      trackCard,
      productCard,
      merchModal
    },

    props: {
      user: {
        type: Object
      }
    },

    data () {
      return {
        showMerchModal: false
      }
    },

    computed: {
      actionText () {
        if (this.user.recent_items[0].feed_type === 'release') {
          return 'released'
        } else if (this.user.recent_items[0].feed_type === 'repost') {
          return 'reposted'
        } else if (this.user.recent_items[0].feed_type === 'unrepost') {
          return 'unreposted'
        } else if (this.user.recent_items[0].feed_type === 'follow') {
          return 'followed'
        } else if (this.user.recent_items[0].feed_type === 'unfollow') {
          return 'unfollowed'
        } else if (this.user.recent_items[0].feed_type === 'play') {
          return 'played'
        } else if (this.user.recent_items[0].feed_type === 'download') {
          return 'downloaded'
        } else {
          return 'commented'
        }
      }
    },

    created () {
    },

    methods: {
      doAction () {
        if (this.user.recent_items[0].assoc_type === 'ShopProduct') {
          this.showMerchModal = true
        } else {
          this.$router.push({ path: 'album/' + this.user.recent_items[0].assoc.slug })
        }
      },

      dimissMerchModal () {
        this.showMerchModal = false
      }
    }
  }
</script>

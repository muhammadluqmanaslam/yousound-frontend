<template>
  <v-flex class="video-card">
    <v-flex xs12 class="video-info" pa-0>
      <v-flex xs12 class="video-cover">
        <div class="video-image" :style="{'background-image': 'url(' + item.cover.url + ')'}"/></div>
        <v-flex xs12 class="video-actions" relative v-if="$store.state.auth.user" @click="viewStream()">
          <v-btn class="green px-2 live-video-btn" dark round>
            <v-icon>videocam</v-icon>
            <span v-if="item.view_price > 0">${{ item.view_price | formatNumber }}</span>
          </v-btn>
          <p>Broadcast started<br>{{ item.started_at | formatDateFromNow }}</p>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="video-detail" pa-0>
        <p class="video-name"><span></span>Broadcasting Live Now</p>
        <p class="video-user-name">
          <router-link :to="'/' + owner.slug">{{ owner.display_name }}</router-link>
        </p>
      </v-flex>
    </v-flex>
  </v-flex>  
</template>

<script type="text/javascript">
  import Vue from 'vue'
  import profileItem from '@/components/profileitem'
  import StreamService from '@/services/stream'

  export default {
    components: {
      profileItem
    },

    props: {
      dataObject: {
        type: Object
      }
    },

    data () {
      return {
      }
    },

    computed: {
      item () {
        if (this.dataObject.assoc_type) {
          return this.dataObject.assoc
        } else {
          return this.dataObject
        }
      },

      owner () {
        if (this.dataObject.assoc_type) {
          return this.dataObject.assoc.user
        } else {
          return this.dataObject.user
        }
      }
    },

    created () {
    },

    methods: {
      viewStream () {
        Vue.http.get(this.item.mp_channel_1_ep_1_url).then(response => {
          this.$router.push({ path: `/${this.owner.slug}` })
        }).catch(e => {
          this.$router.push({ path: `/user/${this.own.slug}/chat` })
        })
      },

      repost () {
        StreamService.repostStream(this.item.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just reposted a live video from' + this.owner.display_name])
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    mounted () {
    }
  }
</script>

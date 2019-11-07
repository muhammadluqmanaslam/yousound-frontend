<template>
  <v-flex class="album-card">
    <promote-modal v-if="isShowPromoteModal"
      :item="album"
      :dismiss="dismissPromoteDialog"
      :success="saveAndFinish"/>

    <v-flex xs12 class="album-info" pa-0>
      <v-flex xs12 class="album-cover">
        <div class="album-image" :style="{'background-image': 'url(' + album.cover.url + ')'}"></div>
        <v-flex xs12 class="album-actions">
          <router-link :to="`/${album.album_type}/${album.slug}`"><v-flex xs12 class="touch-flex"></v-flex></router-link>
          <v-flex xs12 pt-2 class="full-height">
            <template v-if="acceptButtonFunc">
              <div class="label-user-avatar" :style="`background-image: url(${user.avatar.url})`"></div>
              <div class="label-username">{{ user.display_name }}</div>
              <div class="label-description">wants to add this album to their catalog</div>
              <div class="label-actions-section">
                <v-btn dark class="action-btn accept" @click.native="acceptButtonFunc(album, user)">Accept</v-btn>
                <v-btn dark class="action-btn deny" @click.native="denyButtonFunc(album, user)">Deny</v-btn>
              </div>
            </template>
            <template v-else>
              <v-btn dark class="action-btn" v-if="status && status != ''">{{ status }}</v-btn>
              <!-- <v-btn dark class="action-btn" @click.native="showPromoteDialog()" v-if="showPromoteButton">Promote</v-btn> -->
              <v-btn dark class="action-btn" :class="deleteButtonClass" @click.native="deleteButtonFunc(album, user)" v-if="deleteButtonFunc"><span v-html="deleteButtonText"></span></v-btn>  
            </template>
          </v-flex>
          <p class="album-count" v-if="!acceptButtonFunc && album.tracks">{{ album.tracks }} tracks</p>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="album-detail" pa-0>
        <p class="album-name">{{ album.name }}</p>
        <p class="album-posted-date">2 months</p>
      </v-flex>
    </v-flex>
  </v-flex>  
</template>

<script type="text/javascript">
  import promoteModal from '@/components/promotemodal'

  export default {
    components: {
      promoteModal
    },

    props: {
      album: {
        type: Object
      },

      user: {
        type: Object
      },

      type: {
        type: String
      },

      deleteButtonFunc: {
        type: Function
      },

      deleteButtonText: {
        type: String,
        default: 'Delete'
      },

      deleteButtonClass: {
        type: String
      },

      acceptButtonFunc: {
        type: Function
      },

      denyButtonFunc: {
        type: Function
      },

      status: {
        type: String
      },

      showPromoteButton: {
        type: Boolean,
        default: true
      }
    },

    data () {
      return {
        isShowPromoteModal: false
      }
    },

    computed: {
      buttonText () {
        if (this.album.status === 'published') {
          return 'Make Private'
        } else if (this.album.status === 'privated') {
          return 'Make Public'
        }
      }
    },

    created () {
    },

    methods: {
      showPromoteDialog () {
        this.isShowPromoteModal = true
      },

      dismissPromoteDialog () {
        this.isShowPromoteModal = false
      },

      saveAndFinish () {
        this.dismissPromoteDialog()
      }
    }
  }
</script>

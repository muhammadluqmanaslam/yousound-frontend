<template>
  <v-flex class="album-card">
    <v-flex xs12 class="album-info" pa-0>
      <v-flex xs12 class="album-cover">
        <div class="album-image" :style="{'background-image': 'url(' + album.cover.url + ')'}"></div>
        <v-flex xs12 class="album-actions">
          <a :href="`/${album.album_type}/${album.slug}`"><v-flex xs12 class="touch-flex"></v-flex></a>
          <v-flex xs12 class="touch-flex" @click.self="editButtonAction(album)" v-if="this.$store.state.auth.user.id === album.user.id && editButtonAction"></v-flex>
          <v-flex xs12 pt-2>
            <!-- <v-btn dark class="action-btn" @click.native="editButtonAction(album)">Edit</v-btn> -->
            <v-btn v-if="showPromoteButton"
              dark class="action-btn" @click.native="showPromoteDialog()">Promote</v-btn>

            <template v-if="album.collaborators_count === 0">
              <v-btn v-if="deleteButtonAction"
                dark class="action-btn" @click.native="deleteButtonAction(album)">Delete</v-btn>
              <v-btn v-if="updateButtonAction"
                dark class="action-btn" @click.native="updateButtonAction(album)">{{ updateButtonText }}</v-btn>
            </template>

            <template v-else>
              <div v-if="album.status == 'pending'" class="collaboration-status">
                <template v-if="album.user.id === this.$store.state.auth.user.id && usersCountByStatus.accepted === album.collaborators_count">
                  <div class="approve-wrapper">
                    <div class="approved-text">This album has been <br><span>APPROVED</span></div>
                    <v-btn dark class="action-btn release" @click.native="releaseButtonAction(album)">Release Now</v-btn>
                  </div>
                </template>

                <div v-else class="status-overview">
                  <div v-if="usersCountByStatus.accepted > 0">
                    <div class="accepted-title">Accepted</div>
                    <div v-for="c in usersByStatus.accepted">{{ c.user.display_name }}</div>
                  </div>
                  <div v-if="usersCountByStatus.denied > 0">
                    <div class="denied-title">Denied</div>
                    <div v-for="c in usersByStatus.denied">{{ c.user.display_name }}</div>
                  </div>
                  <div v-if="usersCountByStatus.pending > 0">
                    <div class="pending-title">Waiting for approval</div>
                    <div v-for="c in usersByStatus.pending">{{ c.user.display_name }}</div>
                  </div>
                </div>

                <div v-if="acceptButtonAction" class="collaboration-actions">
                  <v-btn dark class="action-btn accept" @click.native="acceptButtonAction(album)">Accept</v-btn>
                  <v-btn dark class="action-btn deny" @click.native="denyButtonAction(album)">Deny</v-btn>
                </div>
              </div>

              <v-btn v-if="deleteButtonAction"
                dark class="action-btn" @click.native="deleteButtonAction(album)">Delete</v-btn>

              <div v-if="album.status == 'collaborated'" class="collaboration-status">
                <div class="status-overview">
                  <div>
                    <div class="accepted-title">Collaborators</div>
                    <div v-for="c in usersByStatus.accepted">{{ c.user.display_name }}</div>
                  </div>
                </div>
              </div>
            </template>
          </v-flex>
          <p class="album-count">{{ album.tracks.length }} tracks</p>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="album-detail" pa-0>
        <router-link :to="`/${album.album_type}/${album.slug}`"><p class="album-name">{{ album.name }}</p></router-link>
        <p class="album-posted-date">2 months</p>
      </v-flex>
    </v-flex>
    <promote-modal v-if="isShowPromoteModal"
      :item="album"
      :dismiss="dismissPromoteDialog"
      :success="saveAndFinish"></promote-modal>
  </v-flex>  
</template>

<script type="text/javascript">
  import _ from 'lodash'
  import promoteModal from '@/components/promotemodal'

  export default {
    components: {
      promoteModal
    },

    props: {
      album: {
        type: Object
      },

      type: {
        type: String
      },

      editButtonAction: {
        type: Function
      },

      updateButtonAction: {
        type: Function
      },

      deleteButtonAction: {
        type: Function
      },

      acceptButtonAction: {
        type: Function
      },

      denyButtonAction: {
        type: Function
      },

      releaseButtonAction: {
        type: Function
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
      updateButtonText () {
        if (this.album.status === 'published') {
          return 'Make Private'
        } else if (this.album.status === 'privated') {
          return 'Make Public'
        }
      },

      usersCountByStatus () {
        return _.countBy(this.album.collaborators, 'status')
      },

      usersByStatus () {
        return _.groupBy(this.album.collaborators, 'status')
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

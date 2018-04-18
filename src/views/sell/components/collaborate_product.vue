<template>
  <v-flex class="product-card">
    <v-flex xs12 class="product-info" pa-0>
      <v-flex xs12 class="product-cover">
        <div class="product-image" :style="{'background-image': 'url(' + product.covers[0].cover.url + ')'}"/></div>
        <v-flex xs12 class="product-actions">
          <v-flex xs12 class="touch-flex"></v-flex>
          <v-flex xs12 class="touch-flex" @click.self="editButtonAction(product)" v-if="this.$store.state.auth.user.id === product.merchant.id && editButtonAction"></v-flex>
          <v-flex xs12 pt-2>
            <v-btn v-if="showPromoteButton"
              dark class="action-btn" @click.native="showPromoteDialog()">Promote</v-btn>

            <template v-if="product.collaborators_count === 0">
              <v-btn v-if="deleteButtonAction"
                dark class="action-btn" @click.native="deleteButtonAction(product)">Delete</v-btn>
              <v-btn v-if="updateButtonAction"
                dark class="action-btn" @click.native="updateButtonAction(product)">{{ updateButtonText }}</v-btn>
            </template>

            <template v-else>
              <div v-if="product.status == 'pending'" class="collaboration-status">
                <template v-if="product.merchant.id === this.$store.state.auth.user.id && usersCountByStatus.accepted === product.collaborators_count">
                  <div class="approve-wrapper">
                    <div class="approved-text">This product has been <br><span>APPROVED</span></div>
                    <v-btn dark class="action-btn release" @click.native="releaseButtonAction(product)">Release Now</v-btn>
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
                  <v-btn dark class="action-btn accept" @click.native="acceptButtonAction(product)">Accept</v-btn>
                  <v-btn dark class="action-btn deny" @click.native="denyButtonAction(product)">Deny</v-btn>
                </div>
              </div>

              <v-btn v-if="deleteButtonAction && this.$store.state.auth.user.id === product.merchant.id"
                dark class="action-btn" @click.native="deleteButtonAction(product)">Delete</v-btn>

              <div v-if="product.status == 'collaborated'" class="collaboration-status">
                <div class="status-overview">
                  <div>
                    <div class="accepted-title">Collaborators</div>
                    <div>{{ product.merchant.display_name }} (owner) - {{ ownerShare }}%</div>
                    <div v-for="c in usersByStatus.accepted">{{ c.user.display_name }} - {{ c.user_share }}%</div>
                  </div>
                </div>
              </div>
            </template>
          </v-flex>
          <p class="product-count">{{ product.stock }} in stock</p>
        </v-flex>
      </v-flex>
      
      <v-flex xs12 class="product-detail" pa-0>
        <p class="product-name">{{ product.name }}</p>
        <p class="product-user-name">{{ product.merchant.display_name }}</p>
        <!-- <p class="product-posted-date">2 months</p> -->
      </v-flex> 
    </v-flex>
    <promote-modal v-if="isShowPromoteModal"
      :item="product"
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
      product: {
        type: Object
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
      usersCountByStatus () {
        return _.countBy(this.product.collaborators, 'status')
      },

      usersByStatus () {
        return _.groupBy(this.product.collaborators, 'status')
      },

      ownerShare () {
        return 100 - _.sumBy(this.product.collaborators, 'user_share')
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

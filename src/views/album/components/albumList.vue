<template>
  <v-flex xs12 class="product-item">

    <promote-modal
      v-if="isShowPromoteModal"
      :item="album"
      :dismiss="dismissPromoteDialog"
      :success="saveAndFinish"
    />
    <v-flex sm12 product-content-section pa-0 relative>
      <div class="product-image" :style="{ 'background-image': 'url(' + album.cover.url + ')' }"></div>
      <div class="product-content">
        <v-flex sm12 class="product-content-row" pr-0>
          <label class="product-name">{{ album.name }}</label>

          <!-- <label class="product-count product-status" v-if="album.stock_status=='active'">{{ album.stock_status }} <v-icon :class="album.stock_status">done</v-icon></label> -->
          <!-- <label class="product-count product-status" v-else>{{ album.stock_status }} <v-icon :class="album.stock_status">done</v-icon></label> -->

          <!-- <label class="product-count product-sold-count">Sold: <b>{{ album.sold }}</b></label> -->
          <!-- <label class="product-count product-stock-count">In Stock: <b>{{ album.stock }}</b></label> -->
        </v-flex>
        <!-- <v-flex sm12 class="product-content-row" pt-1>
          <label class="product-price">${{ album.price | formatNumber }}</label>

          <template v-if="$store.state.auth.user.id==album.merchant.id">
            <v-btn class="text-btn pr-1" @click.native.stop="deleteItem(product)">Delete</v-btn>
            <label class="btn-divider" v-if="showPromoteButton"></label>
            <v-btn class="text-btn" @click.native="editProduct()">Edit</v-btn>
            <label class="btn-divider"></label>
          </template>
          <template v-else>
            <v-btn class="text-btn" v-if="denyItem" @click.native="denyItem(product)">Deny</v-btn>
            <label class="btn-divider" v-if="denyItem"></label>
            <v-btn class="text-btn" v-if="acceptItem" @click.native="acceptItem(product)">Accept</v-btn>
            <label class="btn-divider" v-if="acceptItem"></label>
          </template>

          <label class="product-category-text" v-if="status && status != ''">{{ status }}</label>
          <label class="btn-divider" v-if="status && status != ''"></label>
          <label class="product-category-text">Category: {{ album.category ? album.category.name : '' }}</label>
        </v-flex> -->


        <v-flex xs12 class="product-content-row">
            <template v-if="album.collaborators_count === 0">
                <v-btn
                v-if="deleteButtonAction"
                dark
                class="text-btn"
                @click.native="deleteButtonAction(album)"
                >Delete</v-btn
                >
                <v-btn
                v-if="publishButtonAction"
                dark
                class="text-btn"
                @click.native="publishButtonAction(album)"
                >Make Public</v-btn
                >
                <v-btn
                v-if="videoOnlyButtonAction"
                dark
                class="text-btn"
                @click.native="videoOnlyButtonAction(album)"
                >Make Live Video Only</v-btn
                >
                <v-btn
                v-if="privateButtonAction"
                dark
                class="text-btn"
                @click.native="privateButtonAction(album)"
                >Make Private</v-btn
                >
            </template>

            <template v-else>
                <span
                v-if="album.status == 'pending'"
                class="collaboration-status"
                >
                    <template
                        v-if="
                        album.user.id === this.$store.state.auth.user.id &&
                        usersCountByStatus.accepted === album.collaborators_count
                        "
                    >
                        <span class="approve-wrapper">
                        <span class="approved-text">
                            This album has been <br /><span>APPROVED</span>
                        </span>
                        <v-btn
                            dark
                            class="text-btn release"
                            @click.native="releaseButtonAction(album)"
                            >Release Now</v-btn
                        >
                        </span>
                    </template>

                    <span v-else class="status-overview">
                        <span v-if="usersCountByStatus.accepted > 0">
                        <span class="accepted-title">Accepted</span>
                        <span v-for="(c, i) in usersByStatus.accepted" :key="i">
                            {{ c.user.display_name }}
                        </span>
                        </span>
                        <span v-if="usersCountByStatus.denied > 0">
                        <span class="denied-title">Denied</span>
                        <span v-for="(c, i) in usersByStatus.denied" :key="i">
                            {{ c.user.display_name }}
                        </span>
                        </span>
                        <span v-if="usersCountByStatus.pending > 0">
                            <span class="pending-title">Waiting for approval</span>
                            <span v-for="(c, i) in usersByStatus.pending" :key="i">
                                {{ c.user.display_name }}
                            </span>
                        </span>
                    </span>

                    <span v-if="acceptButtonAction" class="collaboration-actions">
                        <v-btn
                        dark
                        class="text-btn accept"
                        @click.native="acceptButtonAction(album)"
                        >Accept</v-btn
                        >
                        <v-btn
                        dark
                        class="text-btn deny"
                        @click.native="denyButtonAction(album)"
                        >Deny</v-btn
                        >
                    </span>
                </span>

                <v-btn
                v-if="
                    deleteButtonAction &&
                    this.$store.state.auth.user.id === album.user.id
                "
                dark
                class="text-btn"
                @click.native="deleteButtonAction(album)"
                >Delete</v-btn
                >
                <span
                v-if="
                    deleteButtonAction &&
                    this.$store.state.auth.user.id === album.user.id
                "
                >
                    <label class="btn-divider"></label>
                    <label class="product-category-text">{{ album.tracks.length }} tracks</label>
                </span>
            </template>
        </v-flex>
      </div>
    </v-flex>
    <v-flex v-if="album.status == 'collaborated'" sm12 collaborator-content-section>
      <div>
        <div class="app-bold">Collaborators</div>
        <div class="collaborator-content">
          <div>
            <span v-for="(c, i) in usersByStatus.accepted" :key="i">
                {{ c.user.display_name }}
                <span v-if="$store.state.auth.user.display_name === c.user.display_name">
                (owner)
                </span>
            </span>
          </div>

          <v-btn depressed dark class="action-btn release" @click.native="releaseButtonAction(product)">Release Now</v-btn>
        </div>
      </div>
    </v-flex>

  </v-flex>
</template>

<script type="text/javascript">
import _ from 'lodash'
import promoteModal from '@/components/promotemodal'

export default {
  components: {
    promoteModal,
  },

  props: {
    album: {
      type: Object,
    },

    type: {
      type: String,
    },

    editButtonAction: {
      type: Function,
    },

    publishButtonAction: {
      type: Function,
    },

    privateButtonAction: {
      type: Function,
    },

    videoOnlyButtonAction: {
      type: Function,
    },

    deleteButtonAction: {
      type: Function,
    },

    acceptButtonAction: {
      type: Function,
    },

    denyButtonAction: {
      type: Function,
    },

    releaseButtonAction: {
      type: Function,
    },

    showPromoteButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isShowPromoteModal: false,
    }
  },

  computed: {
    usersCountByStatus() {
      console.log(_.countBy(this.album.collaborators, 'status'))
      return _.countBy(this.album.collaborators, 'status')
    },

    usersByStatus() {
      console.log(_.groupBy(this.album.collaborators, 'status'))
      return _.groupBy(this.album.collaborators, 'status')
    },
  },

  watch: {
    album(val) {
      console.log(this.album)
    },
  },

  methods: {
    showPromoteDialog() {
      this.isShowPromoteModal = true
    },

    dismissPromoteDialog() {
      this.isShowPromoteModal = false
    },

    saveAndFinish() {
      this.dismissPromoteDialog()
    },
  },
}
</script>

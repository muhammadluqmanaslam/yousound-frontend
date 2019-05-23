<template>
  <v-flex class="my-card-wrapper">
    <v-flex xs12 class="my-card" pa-0>
      <v-flex xs12 class="my-card__media">
        <div
          class="my-card__media__body"
          :style="{'background-image': 'url(' + itemCover + ')'}"
        ></div>
        <div class="right-tag">${{ item.price | formatNumber }}</div>
        <v-flex xs12 class="my-card__actions" relative v-if="currentUser">
          <v-flex xs12 class="touch-flex" @click="openMerchDialog()"></v-flex>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="my-card__body" pa-0>
        <p class="my-card__title">
          {{ item.name }}
        </p>
        <p class="my-card__subtitle">
          <router-link :to="'/' + owner.slug">{{ owner.display_name }}</router-link>
        </p>
      </v-flex>
    </v-flex>

    <merch-modal
      v-if="show_merch_dialog"
      :item="item"
      :dismiss="closeMerchDialog"
    />
  </v-flex>
</template>

<script type="text/javascript">
  // import _ from 'lodash'
  import merchModal from '@/components/merchmodal'

  export default {
    components: {
      merchModal
    },

    props: {
      item: {
        type: Object
      }
    },

    data () {
      return {
        show_merch_dialog: false
      }
    },

    computed: {
      currentUser () {
        return this.$store.state.auth.user
      },

      itemCover () {
        return this.item.covers[0].cover.url
      },

      owner () {
        return this.item.merchant
      }
    },

    created () {
    },

    methods: {
      openMerchDialog () {
        this.show_merch_dialog = true
      },

      closeMerchDialog () {
        this.show_merch_dialog = false
      }
    }
  }
</script>

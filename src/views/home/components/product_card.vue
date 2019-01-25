<template>
  <v-flex class="my-card-wrapper">
    <v-flex xs12 class="my-card" pa-0>
      <v-flex xs12 class="my-card__media">
        <div
          class="my-card__media__body"
          :style="{'background-image': 'url(' + itemCover + ')'}"
        ></div>
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
  </v-flex>
</template>

<script type="text/javascript">
  // import _ from 'lodash'

  export default {
    components: {
    },

    props: {
      item: {
        type: Object
      }
    },

    data () {
      return {
      }
    },

    computed: {
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
    }
  }
</script>

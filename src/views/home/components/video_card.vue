<template>
  <v-flex class="my-card-wrapper">
    <v-flex xs12 class="my-card" pa-0>
      <v-flex xs12 class="my-card__media">
        <div
          class="my-card__media__body"
          :style="{ 'background-image': 'url(' + item.cover.url + ')' }"
        ></div>
        <div class="left-tag">{{ item.genre.name }}</div>
        <div class="right-tag">{{ itemPrice }}</div>
        <v-flex xs12 class="my-card__actions" relative v-if="false">
          <v-flex xs12 class="touch-flex"></v-flex>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="my-card__body" pa-0>
        <p class="my-card__title">
          {{ item.name }}
        </p>
        <p class="my-card__subtitle">
          <router-link :to="'/' + owner.slug">{{
            owner.display_name
          }}</router-link>
        </p>
      </v-flex>
    </v-flex>
  </v-flex>
</template>

<script type="text/javascript">
// import _ from 'lodash'
import { Filter } from '@/helper'

export default {
  components: {},

  props: {
    item: {
      type: Object,
    },
  },

  data() {
    return {}
  },

  computed: {
    owner() {
      return this.item.user
    },

    itemPrice() {
      if (this.item.price > 0) {
        return `$${Filter.formatNumber(this.item.price)}`
      } else {
        return 'Free'
      }
    },
  },

  created() {},

  methods: {},
}
</script>

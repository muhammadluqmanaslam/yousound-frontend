<template>
  <v-flex class="my-card-wrapper">
    <v-flex xs12 class="my-card" pa-0>
      <v-flex xs12 class="my-card__media">
        <div
          class="my-card__media__body"
          :style="{'background-image': 'url(' + item.cover.url + ')'}"
        ></div>
      </v-flex>
      <v-flex xs12 class="my-card__body with_avatar" pa-0>
        <p class="my-card__subtitle">
          <img class="my-card__avatar" :src="owner.avatar.url">
          <router-link :to="'/' + owner.slug">{{ owner.display_name }}</router-link>
        </p>
        <p class="my-card__title">
          {{ item.name }}
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
      owner () {
        return this.item.user
      }
    },

    created () {
    },

    methods: {
    }
  }
</script>


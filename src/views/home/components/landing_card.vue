<template>
  <v-card :class="klass">
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex
          sm5
          offset-sm1
          md4
          offset-md2
          v-if="klass == 'left-content-card'"
        >
          <div class="card__content">
            <label>{{ title }}</label>
            <slot></slot>
          </div>
        </v-flex>

        <v-flex sm6>
          <v-card-media :src="mediaSource"></v-card-media>
        </v-flex>

        <v-flex sm5 md4 v-if="klass == 'right-content-card'">
          <div class="card__content">
            <label>{{ title }}</label>
            <slot></slot>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  components: {},

  props: {
    klass: {
      type: String,
      default: 'left-content-card',
    },

    title: {
      type: String,
    },

    mediaSource: {
      type: String,
    },
  },

  data() {
    return {}
  },
}
</script>

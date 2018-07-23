<template>
  <v-flex class="activity-product-card">
    <v-flex xs12 class="product-info" pa-0>
      <v-flex xs12 class="product-cover">
        <div class="product-image" :style="{'background-image': 'url(' + (object ? object.avatar.url : '') + ')'}" ></div>
        <v-flex xs12 class="product-actions" relative>
          <v-flex @click="choosePage('/'+ object ? object.slug : '')" xs12 class="touch-flex"></v-flex>
        </v-flex>
      </v-flex>
    </v-flex>
  </v-flex>  
</template>

<script type="text/javascript">
  export default {
    components: {
    },

    props: {
      object: {
        type: Object
      }
    },

    data () {
      return {
      }
    },

    computed: {
      item () {
        return this.object
      }
    },

    created () {
    },

    methods: {
      choosePage (path) {
      // console.log(path)
        this.$router.push({ path: '/' + path })
      }
    },

    mounted () {
    }
  }
</script>

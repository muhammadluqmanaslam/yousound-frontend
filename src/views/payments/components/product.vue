<template>
  <v-flex xs12 sm12 class="merch-section" id="carousel-view">
    <v-layout row wrap class="dismiss-section" @click="dismiss()"></v-layout>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 sm7 class="image-section" v-if="!showPolicySection">
        <v-carousel class="product-carousel" v-if="covers.length > 1">
          <v-carousel-item v-for="(cover, index) in covers"
            :key="index"
            :src="cover.cover.large.url"
            transition="fade"
            reverseTransition="fade"
            @onmouseout="zoomOut()"
          ></v-carousel-item>
        </v-carousel>
        <div v-if="covers.length == 1"
          class="product-cover-image"
          :style="{'background-image': 'url(' + covers[0].cover.url + ')', 'background-repeat': 'no-repeat', 'background-size': 'contain'}"
        ></div>
        <div class="product-cover-image" v-if="!covers.length"></div>
      </v-flex>
      <v-flex xs12 sm5 class="info-section" v-if="!showPolicySection">
        <v-flex xs12 class="profile-section">
          <profile-item :user="item.merchant" :className="'avatar-image'"></profile-item>
          <div v-if="item.collaborators_count ==  0" class="profile-content">
            <router-link :to="`/${item.merchant.slug}`" class="user-name">{{ item.merchant.display_name }}</router-link>
          </div>
          <div v-else class="profile-content">
            <div class="profile-title">Multiple Collaborators</div>
            <router-link :to="`/${item.merchant.slug}`" class="user-name">{{ item.merchant.display_name }}</router-link>
            <template v-for="c in item.collaborators">
              ,&nbsp;<router-link :to="`/${c.user.slug}`" class="user-name">{{ c.user.display_name }}</router-link>
            </template>
          </div>
        </v-flex>
        <v-flex xs12 class="item-section">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-price">${{ price | formatNumber }}</p>
          <p class="item-description">{{ item.description }}</p>
        </v-flex>
      </v-flex>

      <v-flex xs12 sm12 class="policy-section" v-if="showPolicySection">
        <v-tabs fixed centered>
          <v-tabs-bar dark>
            <v-tabs-slider class="yellow"></v-tabs-slider>
            <v-tabs-item key="size_chart" href="#size_chart">Size Chart</v-tabs-item>
            <v-tabs-item key="shipping_policy" href="#shipping_policy">Shipping Policy</v-tabs-item>
            <v-tabs-item key="return_policy" href="#return_policy">Return Policy</v-tabs-item>
            <v-tabs-item key="privacy_policy" href="#privacy_policy">Privacy Policy</v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content key="size_chart" id="size_chart">
              <v-card flat>
                <v-card-text>{{ item.merchant.size_chart }}</v-card-text>
              </v-card>
            </v-tabs-content>
            <v-tabs-content key="shipping_policy" id="shipping_policy">
              <v-card flat>
                <v-card-text>{{ item.merchant.shipping_policy }}</v-card-text>
              </v-card>
            </v-tabs-content>
            <v-tabs-content key="return_policy" id="return_policy">
              <v-card flat>
                <v-card-text>{{ item.merchant.return_policy }}</v-card-text>
              </v-card>
            </v-tabs-content>
            <v-tabs-content key="prviacy_policy" id="privacy_policy">
              <v-card flat>
                <v-card-text>{{ item.merchant.privacy_policy }}</v-card-text>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </v-flex>

      <v-flex xs12 sm12 class="actions-section">
        <a class="action-btn right-border" @click.self="togglePolicy()">{{ policyButtonText }}</a>
        <a class="action-btn right-border" @click.self="repostProduct()">
          <svg width="24px" height="20px" viewBox="0 0 24 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="padding-top:3px;">
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="23---Merch-Modal" transform="translate(-818.000000, -773.000000)" fill="#3A92FF">
                      <g id="Group-4" transform="translate(460.000000, 240.000000)">
                          <g id="Group-6" transform="translate(177.000000, 529.000000)">
                              <path d="M203.353452,13.450486 C203.842994,13.420565 204.283792,13.7701682 204.323209,14.2639522 C204.332359,14.3817114 204.530322,17.1267443 202.64096,19.1604973 C201.389831,20.5064173 199.561882,21.1561054 197.207789,21.1561054 L186.388782,21.1561054 L186.388782,23.5503101 C186.388782,23.723362 186.19645,23.8813659 186.039135,23.9560809 C185.97737,23.9860019 185.818648,24 185.752308,24 C185.650775,24 185.549945,23.9657046 185.467769,23.8999134 L181.643996,20.8232999 C181.538064,20.7380863 181.476123,20.6098284 181.476123,20.4736966 C181.476123,20.3373899 181.538064,20.209132 181.643996,20.1239184 L185.467769,17.0473049 C185.603088,16.9393444 185.882876,16.9155475 186.039135,16.9911374 C186.19645,17.0658524 186.388782,17.2240313 186.388782,17.3970831 L186.388782,19.581316 L197.207789,19.581316 C199.02958,19.581316 200.406525,19.0126421 201.301144,18.0576198 C202.654685,16.6124881 202.520422,14.4555516 202.519015,14.4343794 C202.483645,13.9398955 202.85652,13.4874061 203.353452,13.450486 Z M181.979719,14.5451396 C181.490354,14.5748856 181.049379,14.2275571 181.010139,13.7337731 C181.000812,13.6160139 180.802849,10.8543582 182.692212,8.82043027 C183.94334,7.47451028 185.77129,6.80802443 188.125382,6.80802443 L198.934183,6.80802443 L198.934183,4.44968985 C198.934183,4.276638 199.131619,4.11845916 199.288933,4.04391913 C199.350698,4.01399813 199.5147,4 199.580863,4 C199.682573,4 199.783226,4.03412044 199.865403,4.10008661 L203.689176,7.17670012 C203.795284,7.26191372 203.857048,7.39017156 203.857048,7.52630336 C203.857048,7.66243515 203.795284,7.79069299 203.689176,7.87608157 L199.865403,10.9525201 C199.73026,11.0606556 199.445369,11.0844525 199.288933,11.0088626 C199.131619,10.9341476 198.934183,10.7759687 198.934183,10.6029169 L198.934183,8.3828138 L188.125382,8.3828138 C186.303591,8.3828138 184.926646,8.96951033 184.032204,9.92435762 C182.678662,11.3696643 182.812925,13.5355246 182.814157,13.5565218 C182.849526,14.0511807 182.476651,14.5082195 181.979719,14.5451396 Z" id="ic_repeat"></path>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
          Repost this product
        </a>
        <a class="action-btn" @click.self="shareProduct()">
          <svg width="15px" height="20px" viewBox="0 0 19 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="padding-top:3px;">
              <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="23---Merch-Modal" transform="translate(-1090.000000, -771.000000)" fill-rule="nonzero" fill="#3A92FF">
                      <g id="Group-4" transform="translate(460.000000, 240.000000)">
                          <g id="Group-6" transform="translate(177.000000, 529.000000)">
                              <g id="Group-23" transform="translate(453.000000, 2.000000)">
                                  <path d="M8.00415315,3.25693396 L1.70710678,9.55398033 C1.31658249,9.94450462 0.683417511,9.94450462 0.292893219,9.55398033 C-0.0976310729,9.16345604 -0.0976310729,8.53029106 0.292893219,8.13976677 L8.13976677,0.292893219 C8.53029106,-0.0976310729 9.16345604,-0.0976310729 9.55398033,0.292893219 L17.7919553,8.53086817 C18.1824796,8.92139246 18.1824796,9.55455744 17.7919553,9.94508173 C17.401431,10.335606 16.768266,10.335606 16.3777417,9.94508173 L10.0097727,3.57711275 L10.2200725,16.1756106 C10.2086891,19.7571806 12.3351533,21.4625058 17.0734141,21.4692941 C17.6256983,21.4700854 18.0727716,21.9184416 18.0719804,22.4707258 C18.0711892,23.02301 17.6228329,23.4700833 17.0705488,23.4692921 C11.3129674,23.4610434 8.20482908,20.9684614 8.22021711,16.1891374 L8.00415315,3.25693396 Z" id="Combined-Shape"></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
          Share this product
        </a>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<style lang="stylus">
  #carousel-view
    .fade
      &-enter-active, &-leave-active, &-leave-to
        transition: .5s ease-out
        position: absolute
        top: 0
        left: 0

      &-enter, &-leave, &-leave-to
        opacity: 0
</style>

<script type="text/javascript">
  import profileItem from '@/components/profileitem'
  import ProductService from '@/services/product'

  export default {
    components: {
      profileItem
    },

    props: {
      item: {
        type: Object,
        required: true
      },

      shareProduct: {
        type: Function
      },

      dismiss: {
        type: Function,
        required: true
      }
    },

    data () {
      return {
        showPolicySection: false,
        option: null
      }
    },

    computed: {
      policyButtonText () {
        return this.showPolicySection ? 'Close Policy' : 'Return Policy'
      },

      price () {
        if (this.option !== '') {
          for (let index in this.item.variants) {
            const variant = this.item.variants[index]
            if (variant.id === this.option) {
              return variant.price
            }
          }
        }
        return this.item.price
      },

      covers () {
        var covers = []
        for (let index in this.item.covers) {
          const cover = this.item.covers[index]
          if (cover.cover.url) {
            covers.push(cover)
          }
        }
        return covers
      }
    },

    created () {
      this.option = this.item.variants[0].id
    },

    methods: {
      repostProduct () {
        ProductService.repostProduct(this.item.id).then(response => {
          if (response.body.errors) {
            this.$store.dispatch('error/showErrorToast', response.body.errors)
          } else {
            this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.item.name])
          }
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      },

      togglePolicy () {
        this.showPolicySection = !this.showPolicySection
      },

      zoomOut () {
        console.log('test')
      }
    }
  }
</script>

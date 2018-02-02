<template>
  <v-flex xs12 sm12 class="promote-modal-section">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row class="popup-section">
      <v-flex xs12 sm12 class="main-section text-left">
        <h2 class="page-title text-xs-left">Promote</h2>
        <div class="normal-tab">
          <v-tabs dark v-model="tab">
            <v-tabs-bar class="transparent">
              <v-tabs-item
                key="suggested"
                href="#suggested"
                ripple
              >
                Suggested Reposters
              </v-tabs-item>
              <v-tabs-item
                key="current"
                href="#current"
                ripple
                @click.native="getCurrentReposters()"
              >
                Current Reposters
              </v-tabs-item>
              <v-tabs-slider color="black"></v-tabs-slider>
            </v-tabs-bar>
            <v-layout row wrap class="search-section" v-if="tab=='suggested'">
              <v-flex sm2 mx-1>
                <v-select
                  v-bind:items="repost_prices"
                  item-text="title"
                  item-value="value"
                  v-model="repost_price"
                  single-line
                  bottom
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex sm2 mx-1>
                <v-select
                  v-bind:items="amounts"
                  item-text="title"
                  item-value="value"
                  v-model="amount"
                  single-line
                  bottom
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex sm2 mx-1>
                <v-select
                  v-bind:items="filters"
                  item-text="title"
                  item-value="value"
                  v-model="filter"
                  label="Category"
                  single-line
                  bottom
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex sm2 mx-1>
                <input 
                  type="text" 
                  class="form-control search-box" 
                  v-model="keyword" 
                  placeholder="Search Username"
                  @keyup.enter="searchUsers()"
                >
              </v-flex>
              <v-flex sm2 mx-1>
                <v-btn class="search-btn" @click.native="searchUsers()">Search</v-btn>
              </v-flex>
            </v-layout> 
            <v-tabs-items>
              <v-tabs-content
                key="suggested"
                id="suggested"
              >
                <v-card flat>
                  <v-layout row wrap>
                    <v-flex sm1 class="header-title"></v-flex>
                    <v-flex sm2 class="header-title text-xs-left pl-2">User</v-flex>
                    <v-flex sm2 class="header-title">Followers</v-flex>
                    <v-flex sm2 class="header-title">Price</v-flex>
                    <v-flex sm3 class="header-title text-xs-left px-2">Recent Reposts</v-flex>
                    <v-flex sm2 class="header-title"></v-flex>
                  </v-layout>
                  <div class="user-list-section">
                    <v-layout row wrap 
                      class="suggested-reposter-item" 
                      v-for="(user, index) in users" 
                      :key="index"
                    >
                      <v-flex sm1>
                        <!-- <div class="user-avatar" :style="{'background-image': 'url(/static/images/user1.jpg)'}"></div> -->
                        <div class="user-avatar" :style="`background-image: url(${user.avatar.thumb.url})`"></div>
                      </v-flex>
                      <v-flex sm2>
                        <p class="user-name text-xs-left pl-2">{{ user.display_name }}</p>
                      </v-flex>
                      <v-flex sm2>
                        <p class="user-followers">{{ user.followers }}</p>
                      </v-flex>
                      <v-flex sm2>
                        <p class="repost-price">${{ user.repost_price|formatNumber }}</p>
                      </v-flex>
                      <v-flex sm3>
                        <div class="recent-posts text-xs-left px-2">
                          <!-- <div 
                            class="recent-post-item" 
                            :style="`background-image: url(${imageURL(recent_item)})`" 
                            v-for="(recent_item, index) in user.recent_items"
                            :key="index"
                          > -->
                          <div 
                            class="recent-post-item" 
                            v-for="(recent_item, index) in user.recent_items"
                            :key="index"
                          >
                            <activity-album-card 
                              :object="recent_item.assoc" 
                              v-if="recent_item.assoc_type=='Album'"
                            ></activity-album-card>
                            <activity-product-card 
                              :object="recent_item.assoc" 
                              :price-show="false" 
                              v-if="recent_item.assoc_type=='ShopProduct'"
                            ></activity-product-card>
                          </div>
                          <!-- <div 
                            class="recent-post-item" 
                            v-for="(product, index) in products"
                            :key="index"
                          >
                            <activity-product-card 
                              :object="product" 
                              :price-show="false" 
                            ></activity-product-card>
                          </div> -->
                        </div>
                      </v-flex>
                      <v-flex sm2>
                        <v-btn 
                          class="select-btn" 
                          @click.native="selectUser(user)"
                          :class="{'selected':user_ids.indexOf(user.id)>-1}"
                        >Select User</v-btn>
                      </v-flex>
                    </v-layout>
                  </div>
                  <div class="total-section">
                    <v-btn class="finish-btn ml-3 mt-1" @click.native="saveAndFinish()">Finish & Pay</v-btn>
                    <div class="total-potential-section px-3">
                      <p class="title mb-1">Total Potential Reach</p>
                      <p class="value">{{ suggested_values.total_potential_reach }}</p>
                    </div>
                    <div class="cost-section px-3">
                      <p class="title mb-1">Cost</p>
                      <p class="value">${{ suggested_values.total_cost|formatNumber }}</p>
                    </div>
                  </div>
                </v-card>
              </v-tabs-content>
              <v-tabs-content
                key="current"
                id="current"
              >
                <v-card flat>
                  <v-layout row wrap>
                    <v-flex sm1 class="header-title"></v-flex>
                    <v-flex sm3 class="header-title text-xs-left pl-2">User</v-flex>
                    <v-flex sm2 class="header-title">Followers</v-flex>
                    <v-flex sm2 class="header-title">Price</v-flex>
                    <v-flex sm2 class="header-title text-xs-left px-2">Actual Reach(Plays)</v-flex>
                    <v-flex sm2 class="header-title">Add to favorites</v-flex>
                  </v-layout>
                  <div class="user-list-section current">
                    <v-layout row wrap 
                      class="suggested-reposter-item" 
                      v-for="(user, index) in reposters" 
                      :key="index"
                    >
                      <v-flex sm1>
                        <!-- <div class="user-avatar" :style="{'background-image': 'url(/static/images/user1.jpg)'}"></div> -->
                        <div class="user-avatar" :style="`background-image: url(${user.avatar.thumb.url})`"></div>
                      </v-flex>
                      <v-flex sm3>
                        <p class="user-name text-xs-left pl-2">{{ user.display_name }}</p>
                      </v-flex>
                      <v-flex sm2>
                        <p class="user-followers">{{ user.followers }}</p>
                      </v-flex>
                      <v-flex sm2>
                        <p class="repost-price">${{ user.repost_price|formatNumber }}</p>
                      </v-flex>
                      <v-flex sm2>
                        <!-- <p class="user-followers">{{ user.followings }}</p> -->
                      </v-flex>
                      <v-flex sm2>
                        <v-btn 
                          class="favorite-btn"
                          v-if="favorite_ids.indexOf(user.id)>-1"
                          @click.native="addUserToFavorite(user)"
                        >
                          <v-icon>favorite</v-icon>
                        </v-btn>
                        <v-btn 
                          class="favorite-btn" 
                          v-if="favorite_ids.indexOf(user.id)<0"
                          @click.native="addUserToFavorite(user)"
                        >
                          <v-icon>favorite_border</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </div>
                  <div class="total-section">
                  <div class="cost-section px-3">
                      <p class="title mb-1">Paid</p>
                      <p class="value">${{ current_values.total_paid|formatNumber }}</p>
                    </div>
                    <div class="total-potential-section px-3">
                      <p class="title mb-1">Total Potential Reach</p>
                      <p class="value">{{ current_values.total_potential_reach }}</p>
                    </div>
                    <div class="cost-section px-3">
                      <p class="title mb-1">Total Actual Reach</p>
                      <p class="value">{{ current_values.total_actual_reach }}</p>
                    </div>
                    <div class="total-potential-section px-3">
                      <p class="title mb-1">Score</p>
                      <p class="value">0%</p>
                    </div>
                  </div>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </div>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
/* global $:true */
  import PromoteService from '@/services/promote'
  import UserService from '@/services/user'
  import activityAlbumCard from '@/components/activityalbumcard'
  import activityProductCard from '@/components/activityproductcard'
  import ProductService from '@/services/product'
  export default {
    props: {
      item: {
        type: Object,
        required: true
      },
      dismiss: {
        type: Function,
        required: true
      },
      success: {
        type: Function,
        required: true
      }
    },

    components: {
      activityAlbumCard,
      activityProductCard
    },

    data () {
      return {
        repost_prices: [
          {
            title: 'Any Amount',
            value: 'any'
          },
          {
            title: '$1',
            value: '100'
          },
          {
            title: '$5',
            value: '500'
          },
          {
            title: '$10',
            value: '1000'
          },
          {
            title: '$20',
            value: '2000'
          },
          {
            title: '$50',
            value: '5000'
          },
          {
            title: '$100',
            value: '10000'
          },
          {
            title: '$250',
            value: '25000'
          },
          {
            title: '$500',
            value: '50000'
          },
          {
            title: '$1000',
            value: '100000'
          }
        ],
        amounts: [
          {
            title: 'Any Follower #',
            value: 'any'
          },
          {
            title: 'less than 1K',
            value: '0'
          },
          {
            title: '1K+',
            value: '1000'
          },
          {
            title: '5K+',
            value: '5000'
          },
          {
            title: '10K+',
            value: '10000'
          },
          {
            title: '25K+',
            value: '25000'
          },
          {
            title: '50K+',
            value: '50000'
          },
          {
            title: '100K+',
            value: '100000'
          }
        ],
        filters: [
          {
            title: 'All User Types',
            value: 'any'
          },
          {
            title: 'Favorite Reposters',
            value: 'favorite'
          },
          {
            title: 'Your Followers',
            value: 'follower'
          },
          {
            title: 'New Users',
            value: 'new'
          },
          {
            title: 'Artists',
            value: 'artist'
          },
          {
            title: 'Listeners',
            value: 'listener'
          },
          {
            title: 'Brands',
            value: 'brand'
          }
        ],
        tab: 'suggested',
        repost_price: 'any',
        amount: 'any',
        filter: 'any',
        keyword: '',
        users: [],
        user_ids: [],
        suggested_values: {
          total_cost: 0,
          total_potential_reach: 0
        },
        reposters: [],
        products: [],
        current_values: {
          total_actual_reach: 0,
          total_paid: 0,
          total_potential_reach: 0
        }
      }
    },

    computed: {
      favorite_ids () {
        var ids = []
        for (let index in this.$store.state.auth.user.favorite_users) {
          const favoriteUser = this.$store.state.auth.user.favorite_users[index]
          ids.push(favoriteUser.id)
        }
        return ids
      }
    },

    created () {
      this.searchUsers()
      ProductService.getProducts().then(response => {
        this.products = response.body
      })
      .catch(e => {
        console.log(e)
      })
    },

    methods: {
      imageURL (item) {
        if (item.assoc_type === 'Album') {
          return item.assoc.cover.thumb.url
        } else {
          return item.assoc.covers[0].cover.thumb.url
        }
      },

      selectUser (user) {
        const index = this.user_ids.indexOf(user.id)
        if (index > -1) {
          this.user_ids.splice(index, 1)
        } else {
          this.user_ids.push(user.id)
        }
        this.suggestedReposters()
      },

      addUserToFavorite (user) {
        const index = this.favorite_ids.indexOf(user.id)
        if (index > -1) {
          UserService.unfavoriteUser(user.id).then(response => {
            this.$store.dispatch('error/showErrorToast', [`removed <${user.display_name}> from Favorite successfully!`])
            this.$store.dispatch('auth/removeFavoriteUser', user)
          })
          .catch(e => {
            if (e.body.errors) {
              this.$store.dispatch('error/showErrorToast', e.body.errors)
            } else {
              this.$store.dispatch('error/showErrorToast', [e.body])
            }
          })
        } else {
          UserService.favoriteUser(user.id).then(response => {
            this.$store.dispatch('error/showErrorToast', [`added <${user.display_name}> to Favorite successfully!`])
            this.$store.dispatch('auth/addFavoriteUser', user)
          })
          .catch(e => {
            if (e.body.errors) {
              this.$store.dispatch('error/showErrorToast', e.body.errors)
            } else {
              this.$store.dispatch('error/showErrorToast', [e.body])
            }
          })
        }
      },

      searchUsers () {
        // this.$store.dispatch('error/showLoadingActivity', true)
        const params = new FormData()
        params.append('repost_price', this.repost_price)
        params.append('followers_count', this.amount)
        params.append('user_type', this.filter)
        if (this.keyword.length) {
          params.append('username', this.keyword)
        }
        PromoteService.searchUsers(params).then(response => {
          // this.$store.dispatch('error/showLoadingActivity', false)
          this.users = response.body
        })
        .catch(e => {
          // this.$store.dispatch('error/showLoadingActivity', false)
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
      },

      suggestedReposters () {
        // this.$store.dispatch('error/showLoadingActivity', true)
        const params = new FormData()
        params.append('user_ids', this.filter)
        PromoteService.calculateSuggestedReposters(params).then(response => {
          // this.$store.dispatch('error/showLoadingActivity', false)
          this.suggested_values = response.body
        })
        .catch(e => {
          // this.$store.dispatch('error/showLoadingActivity', false)
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
      },

      getCurrentReposters () {
        this.$store.dispatch('error/showLoadingActivity', true)
        const params = new FormData()
        if (this.item.album_type) {
          params.append('assoc_type', 'Album')
        } else {
          params.append('assoc_type', 'ShopProduct')
        }
        params.append('assoc_id', this.item.id)
        PromoteService.calculateCurrentReposters(params).then(response => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.reposters = response.body.reposters
          this.current_values.total_paid = response.body.total_paid
          this.current_values.total_potential_reach = response.body.total_potential_reach
          this.current_values.total_actual_reach = response.body.total_actual_reach
        })
        .catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
      },

      saveAndFinish () {
        this.success(this.users)
      }
    },

    mounted () {
      $('body').css('overflow', 'hidden')
    }
  }
</script>

<template>
  <v-flex xs12 sm12 class="send-love-section" :class="{'transparent': showPaymentModal}">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()" v-if="!showPaymentModal"></v-flex>
    <v-layout row wrap class="popup-section" v-if="!showPaymentModal">
      <v-layout row wrap class="top-section">
        <!-- <p class="title-label">Support this artist with your contribution</p> -->
        <p class="title-label">Send payment to this user</p>
      </v-layout>
      <v-flex xs12 class="profile-section">
        <!-- <router-link :to="'/' + item.slug"><div class="avatar-image" :style="{'background-image': 'url(' + item.avatar.thumb.url + ')'}"></div></router-link> -->
        <!-- <router-link :to="'/' + item.slug"><label class="user-name">{{ item.display_name }} <v-icon class="user-status" v-bind:class="{'online': item.status == 'active'}" v-if="item.user_type == 'artist'">fa-check-circle</v-icon></label></router-link> -->
        <div class="avatar-image" :style="{'background-image': 'url(' + item.avatar.thumb.url + ')'}"></div>
        <label class="user-name">{{ item.display_name }} 
          <v-icon class="user-status" v-bind:class="{'online': item.status == 'active'}" v-if="item.user_type == 'artist'">fa-check-circle</v-icon>
        </label>
      </v-flex>
      <!-- <v-flex xs12 class="donate-section">
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(10)">$10</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(20)">$20</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(40)">$40</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(100)">$100</v-btn>
      </v-flex> -->
      <v-flex xs12 class="input-section">
        <!-- <input type="text" class="donate-amount form-control" v-model="donate_amount" placeholder="$0.00"> -->
        <vue-numeric currency="$" separator="," :precision="2" :min="1" v-model="donate_amount" class="donate-amount"></vue-numeric>
        <v-select
          :items="descriptions"
          v-model="description"
          class="pt-4"></v-select>
        <v-btn class ="download-btn" @click.native="showPaymentDialog()">Submit</v-btn>
      </v-flex>
    </v-layout>

    <payment-modal v-if="showPaymentModal"
      :type="''"
      :amount="donate_amount_by_cent"
      :dismiss="hidePaymentDialog"
      :finish="sendLove"></payment-modal>
  </v-flex>
</template>

<script type="text/javascript">
  import AuthService from '@/services/auth'
  import UserService from '@/services/user'
  import paymentModal from '@/components/paymentmodal'

  export default {
    components: {
      paymentModal
    },

    props: {
      item: {
        type: Object,
        required: true
      },

      dismiss: {
        type: Function,
        required: true
      }
    },

    data () {
      return {
        donate_amount: 0,
        description: 'Donation',
        descriptions: [
          'Donation',
          'Remix',
          'Vocalist',
          'Production',
          'Vocal Production',
          'Mixing',
          'Mastering',
          'Artwork',
          'Writer',
          'Session Musician'
        ],
        showPaymentModal: false,
        buttonHover: false
      }
    },

    computed: {
      followButtonText () {
        if (this.item.is_following) {
          return this.buttonHover ? 'Unfollow' : 'Following'
        }
        return 'Follow'
      },

      donate_amount_by_cent () {
        return this.donate_amount * 100
      }
    },

    created () {
    },

    methods: {
      donateAmount (amount) {
        this.donate_amount = amount
      },

      dismissModal () {
        console.log('touched')
      },

      followUser () {
        if (this.item.is_following) {
          UserService.unfollowUser(this.item.id).then(response => {
            this.$store.dispatch('error/showSuccessToast', ['You just unfollowed ' + this.item.display_name])
            this.item.is_following = false
            this.$store.dispatch('player/setUpdatedUser', this.item)
            this.$root.$emit('unfollow')
          }).catch(e => {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          UserService.followUser(this.item.id).then(response => {
            this.$store.dispatch('error/showSuccessToast', ['You just followed ' + this.item.display_name])
            this.item.is_following = true
            this.$store.dispatch('player/setUpdatedUser', this.item)
            this.$root.$emit('follow')
          }).catch(e => {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        }
      },

      showPaymentDialog () {
        if (this.donate_amount > 0) {
          this.showPaymentModal = true
        }
      },

      hidePaymentDialog () {
        this.showPaymentModal = false
      },

      sendLove (token) {
        this.dismiss()
        let params = {
          'amount': this.donate_amount_by_cent,
          'description': this.description
        }
        if (token) {
          params['payment_token'] = token.id
        }
        UserService.donateMoney(this.item.slug, params).then(response => {
          this.$store.dispatch('error/showSuccessToast', [`You've donated $${this.donate_amount} to ${this.item.display_name}`])
          AuthService.setUser(response.body)
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    }
  }
</script>

<template>
  <div class="page attendee-page" style="padding-top: 0px; min-height: 100%;">
    <form v-on:submit.prevent="submit()">
      <v-layout column wrap align-center>
        <v-flex xs12 sm4 pa-3 class="text-xs-center">
          <div class="mt-5"><img class="site-logo" src="/static/images/nav_logo_primary.png"></div>
          <v-divider style="width: 50px; margin: 30px auto 30px auto;"></v-divider>
          <p>
            Reserve & pre-verifiy your accounts.
          </p>
          <v-divider style="width: 50px; margin: 30px auto 30px auto;"></v-divider>
          <input
            type="text"
            class="my-2"
            placeholder="Full Name"
            name="full_name"
            v-model="attendee.full_name"
            v-validate="'required|max:255'"
          >
          <input
            type="text"
            class="my-2"
            placeholder="Artist / Brand / Label Name"
            name="display_name"
            v-model="attendee.display_name"
            v-validate="'required|max:255'"
          >
          <input
            type="email"
            class="my-2"
            placeholder="Email"
            name="email"
            v-model="attendee.email"
            v-validate="'required|email'"
          >
          <v-select
            :items="account_types"
            item-text="name"
            item-value="id"
            name="account_type"
            v-model="attendee.account_type"
            v-validate="'required'"
            label="- Select Account Type -"
            single-line
            bottom
            hide-details
            class="my-2"
          />
          <input
            type="text"
            class="my-2"
            placeholder="Referred By"
            name="referred_by"
            v-model="attendee.referred_by"
          >
          <v-btn dark round color="blue" class="ma-0 mt-2" type="submit">Reserve My Account</v-btn>
        </v-flex>
      </v-layout>
    </form>

    <v-dialog v-model="show_attendee_confirm_dialog" fullscreen content-class="attendee-confirm-dialog">
      <v-layout column wrap align-center>
        <v-flex xs12 sm4 pa-3 class="text-xs-center">
          <div class="mt-5"><img class="site-logo" src="/static/images/nav_logo_primary.png"></div>
          <v-divider style="width: 50px; margin: 30px auto 50px auto;"></v-divider>
          <div class="mb-5"><img class="page-logo" src="/static/images/ic_verified.png"></div>
          <h3>We’re launching soon!</h3>
          <p>
            You will receive an e-mail with a sign up<br>
            link to your pre-verifed account.
          </p>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./create_attendee.ctrl.js"></script>

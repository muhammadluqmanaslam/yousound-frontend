<template>
  <div class="page attendee-page" style="padding-top: 0px; min-height: 100%;">
    <form v-on:submit.prevent="submit()">
      <v-layout column wrap align-center>
        <v-flex xs12 sm4 pa-3 class="text-xs-center">
          <div class="mt-5"><img class="site-logo" src="/static/images/nav_logo_primary.png"></div>
          <v-divider style="width: 50px; margin: 30px auto 30px auto;"></v-divider>
          <div class="mb-3"><img class="page-logo" src="/static/images/img_playlist.png"></div>
          <p>
            Playlist Retreat attendees!</br>
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
          <v-btn dark round color="blue" class="ma-0 mt-2" type="submit">Reserve My Account</v-btn>
        </v-flex>
      </v-layout>
    </form>
  </div>
</template>

<script type="text/javascript" src="./playlist.ctrl.js"></script>

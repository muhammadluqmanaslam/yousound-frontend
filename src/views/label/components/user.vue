<template>
  <v-flex x12 sm12 class="roster-user-item">
    <!-- <div class="user-avatar" :style="{'background-image': 'url(' + user
    .avatar.thumb.url + ')'}"></div> -->
    <router-link :to="'/' + user.slug"
      ><div
        class="user-avatar"
        :style="{ 'background-image': 'url(' + user.avatar.thumb.url + ')' }"
      ></div
    ></router-link>
    <div class="user-name">{{ user.username }}</div>
    <v-btn
      class="text-btn error px-2"
      @click.native="deleteFunc(user)"
      v-if="deleteFunc"
      >{{ deleteText }}</v-btn
    >

    <label class="btn-divider" v-if="status !== ''"></label>
    <v-btn
      class="text-btn black px-2"
      :class="{ error: status == 'denied' }"
      v-if="status !== ''"
      >{{ status }}</v-btn
    >

    <v-btn
      class="text-btn error px-2"
      @click.native="denyFunc(user)"
      v-if="denyFunc"
      >Deny</v-btn
    >
    <label class="btn-divider" v-if="acceptFunc"></label>
    <v-btn
      class="text-btn px-2"
      @click.native="acceptFunc(user)"
      v-if="acceptFunc"
      >Accept</v-btn
    >
  </v-flex>
</template>

<script type="text/javascript">
export default {
  components: {},

  props: {
    user: {
      type: Object,
    },

    deleteFunc: {
      type: Function,
    },

    deleteText: {
      type: String,
      default: "remove",
    },

    acceptFunc: {
      type: Function,
    },

    denyFunc: {
      type: Function,
    },

    status: {
      type: String,
      default: "",
    },
  },
};
</script>

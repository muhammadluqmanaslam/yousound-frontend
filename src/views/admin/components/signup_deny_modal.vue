<template>
  <v-flex xs12 sm12 class="approve-section">
    <v-layout row wrap class="dismiss-section" @click="dismiss()"></v-layout>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 sm12 mx-3 py-3 class="profile-section border-bottom">
        <div
          class="profile-image"
          :style="{ 'background-image': 'url(' + item.avatar.url + ')' }"
        ></div>
        <div class="info-section">
          <div class="user-name">{{ item.username }}</div>
          <label class="denied-status">{{ item.request_status }}</label>
        </div>
        <div class="action-section">
          <v-btn
            color="primary"
            class="deny-btn"
            :loading="loading"
            @click.native="submission(item)"
            >SUBMIT</v-btn
          >
        </div>
      </v-flex>
      <v-flex xs12 sm12 mx-3 py-2 class="border-bottom">
        <label class="link-title">Verified By: </label>
        <span>Morderator Name</span>
        <label class="link-title pl-4">Date Verified: </label>
        <span>Jan 21, 2018</span>
      </v-flex>
      <v-flex xs12 sm12 mx-3 py-2>
        <h5>Reasons For Denial</h5>
        <!-- <v-flex xs12>
          <label>Number of previous releases:</label>
          <span>{{ item.release_count }}</span>
        </v-flex> -->
        <v-flex x12 sm6 px-3>
          <v-select
            :items="denial_reasons"
            v-model="item.denial_reason"
            class="normal-input"
            style="max-width: 100%"
            autocomplete
          ></v-select>
        </v-flex>
        <v-flex xs12 sm12>
          <v-text-field
            multi-line
            label="Leave specific message about why the user was denied."
            v-model="item.denial_description"
            class="normal-input"
            full-width
            style="max-width: 100%"
          ></v-text-field>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
export default {
  components: {},

  props: {
    item: {
      type: Object,
      required: true,
    },

    dismiss: {
      type: Function,
      required: true,
    },

    submission: {
      type: Function,
      required: true,
    },
    loading: null,
  },

  data() {
    return {
      denial_reasons: [
        "Did not complete application",
        "Music was not mixed/mastered",
        "Music was not your own",
        "Currently not accepting submissions",
        "Other reason",
      ],
    };
  },

  computed: {},

  created() {},

  methods: {},
};
</script>

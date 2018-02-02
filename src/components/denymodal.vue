<template>
  <v-flex xs12 sm12 class="approve-section">
    <v-layout row wrap class="dismiss-section" @click="dismiss()"></v-layout>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 sm12 class="profile-section">
        <div class="profile-image" :style="{'background-image': 'url(' + item.avatar.url + ')'}"></div>
        <div class="user-info-section">
          <div class="info-section">
            <label class="user-name">{{ item.display_name }}</label>
            <label class="denied-status">{{ item.request_status }}</label>
          </div>
          <div class="action-section">
            <v-btn color="primary" class="deny-btn" @click.native="submission(item)">SUBMIT</v-btn>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 sm12 class="link-section">
        <label class="link-title">Verified By: </label>
        <label class="description-text">Morderator Name</label>
        <label class="link-title pl-4">Date Verified: </label>
        <label class="description-text">Jan 21, 2018</label>
      </v-flex>
      <v-flex xs12 sm12 class="about-section">
        <h5 class="about-title">Reasons For Denial</h5>
        <p class="link-title">Number of previous releases: {{ item.release_count }}</p>
        <v-flex xs12 sm6>
          <v-select
            v-bind:items="denial_reasons"
            v-model="item.denial_reason"
            class="normal-input"
            style="max-width: 100%;"
            autocomplete></v-select>
        </v-flex>
        <v-flex xs12 sm12>
          <v-text-field
            name="input-7-1"
            multi-line
            label="Leave specific message about why the user was denied."
            v-model="item.denial_description"
            class="normal-input"
            full-width
            style="max-width:100%;"></v-text-field>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
  import profileItem from '@/components/profileitem'
  export default {
    components: {
      profileItem
    },

    props: {
      item: {
        type: Object,
        required: true
      },

      dismiss: {
        type: Function,
        required: true
      },

      submission: {
        type: Function,
        required: true
      }
    },

    data () {
      return {
        denial_reasons: [
          'Did not complete application',
          'Music was not mixed/mastered',
          'Music was not your own',
          'Currently not accepting submissions',
          'Other reason'
        ]
      }
    },

    computed: {
    },

    created () {
    },

    methods: {
    }
  }
</script>

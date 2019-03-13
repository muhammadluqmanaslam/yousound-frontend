<template>
  <!-- <div class="ys-dialog-container"> -->
    <!-- <div class="ys-dialog-dismiss" @click="dismiss()"></div> -->
  <v-layout row wrap class="ys-dialog ys-album-report-dialog">
    <v-flex xs5 px-3 py-4 class="left-pane">
      <h3>Report Content</h3>
      <v-radio-group v-model="active_violation" :mandatory="false">
        <v-radio
          v-for="v in violations"
          :key="v.value"
          :label="v.label"
          :value="v.value"
          @change="reason = ''"
        ></v-radio>
      </v-radio-group>
      <v-divider></v-divider>
      <p>Yousound reviews all reports to verify if users are in violation of our <b>Terms of Service</b>. Accounts falsely reporting content may have their accounts terminated.</p>
    </v-flex>
    <v-flex xs7 class="right-pane">
      <div v-if="active_violation != 'infringe'">
        <form @submit.prevent="submit">
          <v-flex x12 pa-3>
            <h3>Specify the violation</h3>
            <p>Yousound reviews all reports to verify if users are in violation of our <b>Terms of Service</b>.<br>Accounts falsely reporting content may have their accounts terminated.</p>
            <v-select
              v-if="violation.options.length"
              :items="violation.options"
              v-model="reason"
              v-validate="'required'"
              data-vv-name="reason"
              :error-messages="errors.collect('reason')"
              label="Choose one"
              single-line
            ></v-select>
            <v-text-field
              label="Provide additional details"
              v-model="description"
              v-validate="'required|max:500'"
              data-vv-name="description"
              :error-messages="errors.collect('description')"
              :counter="500"
              max="500"
              full-width
              multi-line
              single-line
              class="mt-3"
            ></v-text-field>
          </v-flex>
          <div class="right-pane__footer">
            <v-flex px-2><v-divider></v-divider></v-flex>
            <v-btn @click="dismiss()" flat>CANCEL</v-btn>
            <v-btn type="submit" flat>NEXT</v-btn>
          </div>
        </form>
      </div>
      <div v-else>
        <v-flex x12 pa-3>
          <h3>Specify the violation</h3>
          <p>Yousound reviews all reports to verify if users are in violation of our <b>Terms of Service</b>.<br>Accounts falsely reporting content may have their accounts terminated.</p>
          <v-btn dark round color="blue" class="mt-3 px-3">File Copyright Claim</v-btn>
        </v-flex>
      </div>
    </v-flex>
    <div v-if="show_confirm_view" class="confirm-view">
      <h3>Your Report Has Been Filed</h3>
      <div><label>Issue:</label><span>{{ violation.label }}</span></div>
      <p>If we find this content to be in violation of our <b>Term of Services</b>, we will remove it.</p>
      <v-btn @click="closeConfirmView()" dark round color="blue" class="px-4">Close</v-btn>
    </div>
  </v-layout>
</template>

<script type="text/javascript">
  import _ from 'lodash'
  import AlbumService from '@/services/album'

  export default {
    components: {
    },

    props: {
      album: {
        type: Object
      },

      dismiss: {
        type: Function
      }
    },

    data () {
      return {
        active_violation: '',
        reason: '',
        description: '',
        show_confirm_view: false,
        violations: [
          {
            value: 'sexual_content',
            label: 'Sexual Content',
            options: [
              'Graphic sexual activity',
              'Nudity',
              'Abusive title or description',
              'Other sexual content'
            ]
          },
          {
            value: 'repulsive_content',
            label: 'Violent or repulsive content',
            options: [
              'Physical attack',
              'Animal abuse'
            ]
          },
          {
            value: 'abusive_content',
            label: 'Hateful or abusive content',
            options: [
              'Promotes hatred or violence',
              'Bullying',
              'Abusive title or description'
            ]
          },
          {
            value: 'dangerous_acts',
            label: 'Harmful dangerous acts',
            options: [
              'Pharmaceutical or drug abuse',
              'Abuse of fire or explosives',
              'Suicide or self injury',
              'Other dangerous acts'
            ]
          },
          {
            value: 'child_abuse',
            label: 'Child abuse',
            options: []
          },
          {
            value: 'terrorism',
            label: 'Promotes terrorism',
            options: []
          },
          {
            value: 'spam',
            label: 'Spam or misleading',
            options: [
              'Mass advertising',
              'Pharmaceutical drugs for sale',
              'Misleading text',
              'Misleading thumbnail',
              'Scams / fraud'
            ]
          },
          {
            value: 'infringe',
            label: 'Infringes my rights',
            options: []
          }
        ]
      }
    },

    computed: {
      violation () {
        return _.find(this.violations, (v) => (v.value === this.active_violation)) || {options: []}
      }
    },

    created () {
      this.active_violation = 'sexual_content'
    },

    methods: {
      submit () {
        this.$validator.validateAll().then(response => {
          if (response === true) {
            const params = {
              reason: this.reason,
              description: this.description
            }
            AlbumService.reportAlbum(this.album.id, params).then(response => {
              this.show_confirm_view = true
            })
          } else {
            // console.log(this.errors)
          }
        }).catch(e => {
          console.log('error', e)
        })
      },

      closeConfirmView () {
        this.show_confirm_view = false
        this.dismiss()
      }
    }
  }
</script>

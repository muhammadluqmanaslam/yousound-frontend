<template>
  <div class="main-section">
    <!-- <div class="description-section"></div> -->
    <div class="content-section">
      <v-layout row wrap return-policy-section ma-0>
        <v-flex xs12 sm12 form-group>
          <label class="control-label">Return Policy</label>
          <textarea
            v-model="user.return_policy"
            class="policy-area"
            placeholder="Write a return policy..."
            rows="5"
          ></textarea>
        </v-flex>
        <v-flex xs12 sm12 form-group>
          <v-btn class="update-btn" @click.native="saveReturnPolicy()"
            >Save</v-btn
          >
        </v-flex>
      </v-layout>
      <v-layout row wrap return-policy-section ma-0>
        <v-flex xs12 sm12 form-group>
          <label class="control-label">Shipping Policy</label>
          <textarea
            v-model="user.shipping_policy"
            class="policy-area"
            placeholder="Write a shipping policy..."
            rows="5"
          ></textarea>
        </v-flex>
        <v-flex xs12 sm12 form-group>
          <v-btn class="update-btn" @click.native="saveShippingPolicy()"
            >Save</v-btn
          >
        </v-flex>
      </v-layout>
      <v-layout row wrap return-policy-section ma-0>
        <v-flex xs12 sm12 form-group>
          <label class="control-label">Size Chart</label>
          <textarea
            v-model="user.size_chart"
            class="policy-area"
            placeholder="Write a size chart..."
            rows="5"
          ></textarea>
        </v-flex>
        <v-flex xs12 sm12 form-group>
          <v-btn class="update-btn" @click.native="saveSizeChart()">Save</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap return-policy-section ma-0>
        <v-flex xs12 sm12 form-group>
          <label class="control-label">Privacy Policy</label>
          <textarea
            v-model="user.privacy_policy"
            class="policy-area"
            placeholder="Write a privacy policy..."
            rows="5"
          ></textarea>
        </v-flex>
        <v-flex xs12 sm12 form-group>
          <v-btn class="update-btn" @click.native="savePrivacyPolicy()"
            >Save</v-btn
          >
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script type="text/javascript" src="./policy_tab.ctrl.js"></script>

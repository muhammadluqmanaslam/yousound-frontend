<template>
  <div class="main-section">
    <div class="content-section">
      <v-layout row wrap shipping-address-section ma-0>
        <v-flex xs12 sm6 form-group>
          <label class="control-label">First Name</label>
          <input type="text" class="form-control" v-model="shipping_address.first_name">
        </v-flex>
        <v-flex xs12 sm6 form-group>
          <label class="control-label">Last Name</label>
          <input type="text" class="form-control" v-model="shipping_address.last_name">
        </v-flex>
        <v-flex xs12 sm6 form-group>
          <label class="control-label">Street Address</label>
          <input type="text" class="form-control" v-model="shipping_address.street_address">
        </v-flex>
        <v-flex xs12 sm6 form-group>
          <label class="control-label">Apt., Floor, Unit etc. (Optional)</label>
          <input type="text" class="form-control" v-model="shipping_address.address_line">
        </v-flex>
        <v-flex xs12 sm6 form-group>
          <div class="shipping-address-city-section">
            <label class="control-label">City</label>
            <input type="text" class="form-control" v-model="shipping_address.city">
          </div>
          <div class="shipping-address-state-section">
            <label class="control-label">State</label>
            <div class="shipping-address-state">
              <input type="text" class="form-control" v-model="shipping_address.state">
            </div>
          </div>
        </v-flex>
        <v-flex xs12 sm6 form-group>
          <label class="control-label">Zipcode</label>
          <input type="text" class="form-control" v-model="shipping_address.postcode">
        </v-flex>
        <v-flex xs12 sm6 form-group>
        </v-flex>
        <v-flex xs12 sm6 form-group>
          <label class="control-label">Country</label>
            <v-select
              v-bind:items="countries"
              v-model="shipping_address.country"
              item-text="name"
              item-value="name"
              single-line
              autocomplete></v-select>
        </v-flex>
        <v-flex xs12 sm6 form-group>
        </v-flex>
        <v-flex xs12 sm6 form-group>
          <v-btn class="update-btn" @click.native="saveShippingAddress()">Save</v-btn>
        </v-flex>
      </v-layout>
    </div>
    <div class="description-section">
      <p>Add or change your default shipping address for all of the physical orders you place.</p>
    </div>
  </div>
</template>

<script type="text/javascript" src="./address_tab.ctrl.js"></script>

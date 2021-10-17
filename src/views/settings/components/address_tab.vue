<template>
  <div class="main-section">
    <div class="description-section">
      <p>
        {{ header }}
      </p>
    </div>

    <div class="content-section">
      <form @submit.prevent="submit()">
        <v-layout row wrap shipping-address-section ma-0>
          <v-flex xs12 sm6 form-group first-name>
            <label class="control-label"
              >First Name<span class="required">*</span></label
            >
            <input
              type="text"
              class="form-control"
              name="first_name"
              v-model="shipping_address.first_name"
              v-validate="'required'"
            />
          </v-flex>
          <v-flex xs12 sm6 form-group last-name>
            <label class="control-label"
              >Last Name<span class="required">*</span></label
            >
            <input
              type="text"
              class="form-control"
              name="last_name"
              v-model="shipping_address.last_name"
              v-validate="'required'"
            />
          </v-flex>
          <v-flex xs12 sm6 form-group street>
            <label class="control-label"
              >Street Address<span class="required">*</span></label
            >
            <input
              type="text"
              class="form-control"
              name="street"
              v-model="shipping_address.street_address"
              v-validate="'required'"
            />
          </v-flex>
          <v-flex xs12 sm6 form-group apartment>
            <label class="control-label"
              >Apt., Floor, Unit etc. (Optional)</label
            >
            <input
              type="text"
              class="form-control"
              name="address_2"
              v-model="shipping_address.address_line"
            />
          </v-flex>
          <v-flex xs12 sm6 form-group d-flex justify-space-between city>
            <div class="shipping-address-city-section">
              <label class="control-label"
                >City / Region<span class="required">*</span></label
              >
              <input
                type="text"
                class="form-control"
                name="city"
                v-model="shipping_address.city"
                v-validate="'required'"
              />
            </div>
            <div v-if="isCountryUS" class="shipping-address-state-section">
              <label class="control-label"
                >State<span class="required">*</span></label
              >
              <div class="shipping-address-state">
                <v-select
                  :items="states"
                  name="state"
                  v-model="shipping_address.state"
                  v-validate="'required'"
                  item-text="value"
                  item-value="value"
                  single-line
                  autocomplete
                  hide-details
                  class="pt-0"
                ></v-select>
                <!-- <input
                  v-else
                  type="text"
                  class="form-control"
                  name="state"
                  v-model="shipping_address.state"
                  v-validate="'required'"
                /> -->
              </div>
            </div>
          </v-flex>
          <v-flex xs12 sm6 form-group zipcode>
            <label class="control-label"
              >Zipcode<span class="required">*</span></label
            >
            <input
              type="text"
              class="form-control"
              name="zipcode"
              v-model="shipping_address.postcode"
              v-validate="'required'"
            />
          </v-flex>
          <v-flex xs12 sm6 form-group></v-flex>
          <v-flex xs12 sm6 form-group country>
            <label class="control-label"
              >Country<span class="required">*</span></label
            >
            <v-select
              v-bind:items="countries"
              name="country"
              v-model="shipping_address.country"
              v-validate="'required'"
              item-text="name"
              item-value="name"
              single-line
              autocomplete
              class="pt-0"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 form-group></v-flex>
          <v-flex xs12 sm6 form-group text-xs-right save-btn>
            <v-btn type="submit" class="update-btn">Save</v-btn>
          </v-flex>
        </v-layout>
      </form>
    </div>
  </div>
</template>

<script type="text/javascript" src="./address_tab.ctrl.js"></script>

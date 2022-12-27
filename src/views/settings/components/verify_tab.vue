<template>
  <div class="main-section" v-if="isPageReady">
    <v-flex xs12 sm12 class="verification-section">
      <div class="profile-section border-bottom mx-3 pb-3">
        <div
          class="profile-image"
          :style="{ 'background-image': 'url(' + user.avatar.url + ')' }"
        ></div>
        <div class="user-info-section">
          <div class="info-section">
            <label class="user-name">{{ user.username }}</label>
            <label class="denied-status" :class="user.request_status">{{
              user.request_status
            }}</label>
          </div>
        </div>
      </div>

      <div
        v-if="['accepted', 'denied'].indexOf(user.request_status) > -1"
        class="link-section border-bottom mx-3 py-2"
      >
        <label>Verified By: </label>
        <span>{{ reviewerName }}</span>
        <label class="pl-4">Date Verified: </label>
        <span>{{ user.approved_at | formatDate }}</span>
      </div>

      <v-layout
        v-if="user.request_status == 'denied'"
        row
        wrap
        class="about-section border-bottom mx-3 pt-3"
      >
        <v-flex xs12 sm12>
          <label>Reasons For Denial</label>
          <p class="link-title">{{ user.denial_reason }}</p>
        </v-flex>
        <v-flex xs12 sm12>
          <label>Denial Description</label>
          <p class="link-title">{{ user.denial_description }}</p>
        </v-flex>
      </v-layout>

      <form
        v-if="user.request_status != 'accepted'"
        v-on:submit.prevent="submit()"
      >
        <div class="info-section mx-3">
          <v-layout row wrap pb-3 class="border-bottom">
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <input
                v-model="user.first_name"
                v-validate="'required'"
                :disabled="!enabledForm"
                type="text"
                name="first_name"
                autocomplete="off"
                placeholder="First Name"
              />
            </v-flex>
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <input
                v-model="user.last_name"
                v-validate="'required'"
                :disabled="!enabledForm"
                type="text"
                name="last_name"
                autocomplete="off"
                placeholder="Last Name"
              />
            </v-flex>
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <!-- <input v-model="user.year_of_birth" v-validate="'required|numeric'" :disabled="!enabledForm"
                type="text" name="year_of_birth" autocomplete="off" placeholder="Year of Birth"> -->
              <v-select
                v-validate="'required'"
                :items="year_of_birth_options"
                v-model="user.year_of_birth"
                :disabled="!enabledForm"
                name="year_of_birth"
                placeholder="Year of Birth"
                autocomplete
              />
            </v-flex>
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <v-select
                v-validate="'required'"
                :items="gender_options"
                v-model="user.gender"
                :disabled="!enabledForm"
                name="gender"
                placeholder="Sex"
              />
            </v-flex>
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <v-select
                v-validate="'required'"
                :items="country_options"
                v-model="user.country"
                :disabled="!enabledForm"
                name="country"
                placeholder="Country"
                autocomplete
              />
            </v-flex>
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <input
                v-model="user.city"
                v-validate="'required'"
                :disabled="!enabledForm"
                type="text"
                name="city"
                autocomplete="off"
                placeholder="City"
              />
            </v-flex>
          </v-layout>

          <v-layout row wrap pb-3 class="border-bottom">
            <template v-if="user.request_role == 'artist'">
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="main_genres"
                  item-value="id"
                  item-text="name"
                  v-model="user.genre_id"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="main_genre"
                  placeholder="What is your main Genre?"
                  autocomplete
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="artist_type_options"
                  v-model="user.artist_type"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="artist_type"
                  placeholder="What type of artist are you?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="released_albums_count_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.released_albums_count"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="released_albums_count"
                  placeholder="How many albums have you released?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="years_since_first_released_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.years_since_first_released"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="years_since_first_released"
                  placeholder="How many years since your first release?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_run_live_video"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_run_live_video"
                  placeholder="Do you plan to run live video on YouSound?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_sell_products"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_sell_products"
                  placeholder="Do you sell products?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_sell_physical_copies"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_sell_physical_copies"
                  placeholder="Do you sell physical copies of your music?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="annual_income_on_merch_sales_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.annual_income_on_merch_sales"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="annual_income_on_merch_sales"
                  placeholder="Annual income on product sales"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="annual_performances_count_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.annual_performances_count"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="annual_performances_count"
                  placeholder="How many show do you perform annually?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="signed_status_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.signed_status"
                  :disabled="!enabledForm"
                  v-validate="'required'"
                  name="signed_status"
                  placeholder="Are you currently signed?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="performance_rights_organization_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.performance_rights_organization"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="performance_rights_organization"
                  placeholder="Performance Rights Organization (Writers)"
                  autocomplete
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <input
                  v-model="user.ipi_cae_number"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  type="text"
                  name="ipi_cae_number"
                  autocomplete="off"
                  placeholder="IPI/CAE number"
                />
              </v-flex>
            </template>
            <template v-else-if="user.request_role == 'label'">
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="main_genres"
                  item-value="id"
                  item-text="name"
                  v-model="user.genre_id"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="main_genre"
                  placeholder="What is your main Genre?"
                  autocomplete
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="sub_genres"
                  item-value="id"
                  item-text="name"
                  v-model="user.sub_genre_id"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="sub_genre"
                  placeholder="What sub genre do you release most?"
                  autocomplete
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="released_albums_count_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.released_albums_count"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="released_albums_count"
                  placeholder="How many albums have you released?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="years_since_first_released_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.years_since_first_released"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="years_since_first_released"
                  placeholder="How many years since your first release?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_run_live_video"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_run_live_video"
                  placeholder="Do you plan to run live video on YouSound?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_sell_products"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_sell_products"
                  placeholder="Do you sell products?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_sell_physical_copies"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_sell_physical_copies"
                  placeholder="Do you sell physical copies of your music?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="annual_income_on_merch_sales_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.annual_income_on_merch_sales"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="annual_income_on_merch_sales"
                  placeholder="Annual income on product sales"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.is_business_registered"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="is_business_registered"
                  placeholder="Is your business registered?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="artists_count_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.artists_count"
                  v-validate="'required|numeric'"
                  :disabled="!enabledForm"
                  name="artists_count"
                  placeholder="How many artists are currently on your roster?"
                />
              </v-flex>
            </template>
            <template v-else-if="user.request_role == 'brand'">
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="standard_brand_type_options"
                  v-model="user.standard_brand_type"
                  :disabled="!enabledForm"
                  name="standard_brand_type"
                  placeholder="What type of Brand?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <input
                  v-model="user.customized_brand_type"
                  :disabled="!enabledForm"
                  type="text"
                  name="customized_brand_type"
                  autocomplete="off"
                  placeholder="If brand type not listed, what type are you?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="employees_count_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.employees_count"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="employees_count"
                  placeholder="How many employees do you have?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="years_in_business_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.years_in_business"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="years_in_business"
                  placeholder="How many years in business?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_sell_music_related_products"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_sell_music_related_products"
                  placeholder="Do you sell music related products or services?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_run_live_video"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_run_live_video"
                  placeholder="Do you plan to run live video on YouSound?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.will_sell_products"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="will_sell_products"
                  placeholder="Do you sell products?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="products_count_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.products_count"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="products_count"
                  placeholder="How many products / SKUs do you have?"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="annual_income_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.annual_income"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="annual_income"
                  placeholder="Annual income"
                />
              </v-flex>
              <v-flex xs6 pt-3 px-2 text-xs-center>
                <v-select
                  :items="boolean_options"
                  item-value="id"
                  item-text="name"
                  v-model="user.is_business_registered"
                  v-validate="'required'"
                  :disabled="!enabledForm"
                  name="is_business_registered"
                  placeholder="Is your business registered?"
                />
              </v-flex>
            </template>
          </v-layout>

          <v-layout row wrap pb-3>
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <input
                v-model="user.website_1_url"
                v-validate="'required|max:1023|url'"
                :disabled="!enabledForm"
                type="text"
                name="website_1_url"
                autocomplete="off"
                placeholder="Website URL"
              />
            </v-flex>
            <v-flex xs6 pt-3 px-2 text-xs-center>
              <input
                v-model="user.website_2_url"
                v-validate="'max:1023|url'"
                :disabled="!enabledForm"
                type="text"
                name="website_2_url"
                autocomplete="off"
                placeholder="Website URL"
              />
            </v-flex>
            <v-flex xs12 pt-3 px-2 text-xs-center>
              <textarea
                v-model="user.history"
                v-validate="'required|max:1023'"
                :disabled="!enabledForm"
                name="history"
                placeholder="What artists and/or labels have you previously worked with?"
              ></textarea>
            </v-flex>
            <v-flex xs12 px-2 text-xs-center v-if="enabledForm">
              <v-btn round dark type="submit" class="reset-btn"
                >Save and Resend</v-btn
              >
            </v-flex>
          </v-layout>
        </div>
      </form>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./verify_tab.ctrl.js"></script>

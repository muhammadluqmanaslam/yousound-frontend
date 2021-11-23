<template>
  <div class="page auth-page auth-register-page">
    <div class="text-xs-center">
      <img class="logo" src="/static/images/nav_logo_primary.png" />
      <h4>Sign Up</h4>
    </div>

    <form
      v-if="isPageReady"
      v-on:submit.prevent="submit()"
      data-vv-scope="main-form"
    >
      <v-flex xs12 text-xs-center>
        <div class="avatar-area">
          <img
            class="avatar"
            src="/static/images/placeholder.png"
            id="avatar"
            ref="avatar"
          />
          <label class="upload-caption">Upload image</label>
          <div class="avatar-upload">
            <input
              type="file"
              name="avatar_file"
              id="avatar_file"
              ref="avatar_file"
              class="avatar-file"
              accept="image/*"
              v-validate="'required'"
              @change="imageChanged($event)"
            />
            <label for="avatar_file">Choose a file</label>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 text-xs-center>
        <input
          class="username"
          type="text"
          name="username"
          placeholder="Username"
          autocomplete="off"
          v-model="user.username"
          v-validate="'required|max:20'"
        />
      </v-flex>
      <v-flex xs12 text-xs-center>
        <input
          class="displayname"
          type="text"
          name="display_name"
          placeholder="Display Name"
          autocomplete="off"
          v-model="user.username"
          v-validate="'required|max:20'"
        />
      </v-flex>
      <v-flex xs12 text-xs-center>
        <input
          class="email"
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="off"
          v-model="user.email"
          disabled
        />
      </v-flex>
      <v-flex xs12 text-xs-center>
        <input
          class="password"
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="off"
          v-model="user.password"
          v-validate="'required|min:5|max:16'"
        />
      </v-flex>
      <v-flex xs12 text pa-0>
        <p class="regular-checkbox">
          <input
            id="terms"
            type="checkbox"
            name="terms"
            v-model="terms"
            v-validate="'required'"
          />
          <label for="terms"
            >Accept
            <router-link class="forgot-password" to="#"
              >Terms & Conditions</router-link
            ></label
          >
        </p>
      </v-flex>
      <v-flex xs12 text-xs-center>
        <v-btn block round dark type="submit" class="create-account-button"
          >Create account</v-btn
        >
      </v-flex>
    </form>

    <v-dialog
      v-model="show_additional_info_dialog"
      content-class="additional-info-dialog"
      fullscreen
    >
      <v-layout row wrap class="page auth-page auth-twitter-page">
        <v-flex
          xs12
          sm6
          offset-sm3
          md6
          offset-md3
          lg8
          offset-lg2
          xl8
          offset-xl2
          transition="slide-x-reverse-transition"
          v-if="isPageReady"
        >
          <div class="page-header">
            <v-flex xs12 text-xs-center>
              <img class="logo" src="/static/images/nav_logo_primary.png" />
            </v-flex>
            <v-flex xs12 text-xs-center>
              <h4>Additional Information</h4>
            </v-flex>
          </div>
          <div class="page-content">
            <form
              v-on:submit.prevent="submitAdditionalForm()"
              data-vv-scope="additional-form"
            >
              <v-layout row wrap>
                <v-flex xs12>
                  <h5>Personal Info</h5>
                </v-flex>
                <v-flex xs6 pt-3 px-2 text-xs-center>
                  <input
                    v-model="user.first_name"
                    v-validate="'required'"
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
                    type="text"
                    name="last_name"
                    autocomplete="off"
                    placeholder="Last Name"
                  />
                </v-flex>
                <v-flex xs6 pt-3 px-2 text-xs-center>
                  <!-- <input v-model="user.year_of_birth" v-validate="'required|numeric'"
                    type="text" name="year_of_birth" autocomplete="off" placeholder="Year of Birth"> -->
                  <v-select
                    v-validate="'required'"
                    :items="year_of_birth_options"
                    v-model="user.year_of_birth"
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
                    name="gender"
                    placeholder="Sex"
                  />
                </v-flex>
                <v-flex xs6 pt-3 px-2 text-xs-center>
                  <v-select
                    v-validate="'required'"
                    :items="country_options"
                    v-model="user.country"
                    name="country"
                    placeholder="Country"
                    autocomplete
                  />
                </v-flex>
                <v-flex xs6 pt-3 px-2 text-xs-center>
                  <input
                    v-model="user.city"
                    v-validate="'required'"
                    type="text"
                    name="city"
                    autocomplete="off"
                    placeholder="City"
                  />
                </v-flex>

                <template v-if="user.request_role == 'artist'">
                  <v-flex xs12>
                    <h5 class="pt-3"><span>Artist</span> Info</h5>
                  </v-flex>
                  <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="main_genres"
                      item-value="id"
                      item-text="name"
                      v-model="user.genre_id"
                      v-validate="'required'"
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
                      name="will_sell_products"
                      placeholder="Do you sell products?"
                    />
                  </v-flex>
                  <!-- <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="boolean_options"
                      item-value="id"
                      item-text="name"
                      v-model="user.will_sell_physical_copies"
                      v-validate="'required'"
                      name="will_sell_physical_copies"
                      placeholder="Do you sell physical copies of your music?"
                    />
                  </v-flex> -->
                  <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="annual_income_on_merch_sales_options"
                      item-value="id"
                      item-text="name"
                      v-model="user.annual_income_on_merch_sales"
                      v-validate="'required'"
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
                      name="performance_rights_organization"
                      placeholder="Performance Rights Organization (Writers)"
                      autocomplete
                    />
                  </v-flex>
                  <!-- <v-flex xs6 pt-3 px-2 text-xs-center>
                    <input v-model="user.ipi_cae_number" v-validate="'required'"
                      type="text" name="ipi_cae_number" autocomplete="off" placeholder="IPI/CAE number">
                  </v-flex> -->
                </template>
                <template v-else-if="user.request_role == 'label'">
                  <v-flex xs12>
                    <h5 class="pt-3"><span>Label</span> Info</h5>
                  </v-flex>
                  <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="main_genres"
                      item-value="id"
                      item-text="name"
                      v-model="user.genre_id"
                      v-validate="'required'"
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
                      name="will_sell_products"
                      placeholder="Do you sell products?"
                    />
                  </v-flex>
                  <!-- <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="boolean_options"
                      item-value="id"
                      item-text="name"
                      v-model="user.will_sell_physical_copies"
                      v-validate="'required'"
                      name="will_sell_physical_copies"
                      placeholder="Do you sell physical copies of your music?"
                    />
                  </v-flex> -->
                  <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="annual_income_on_merch_sales_options"
                      item-value="id"
                      item-text="name"
                      v-model="user.annual_income_on_merch_sales"
                      v-validate="'required'"
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
                      name="artists_count"
                      placeholder="How many artists are currently on your roster?"
                    />
                  </v-flex>
                </template>
                <template v-else-if="user.request_role == 'brand'">
                  <v-flex xs12>
                    <h5 class="pt-3"><span>Brand</span> Info</h5>
                  </v-flex>
                  <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="standard_brand_type_options"
                      v-model="user.standard_brand_type"
                      name="standard_brand_type"
                      placeholder="What type of Brand?"
                    />
                  </v-flex>
                  <v-flex xs6 pt-3 px-2 text-xs-center>
                    <input
                      v-model="user.customized_brand_type"
                      type="text"
                      name="customized_brand_type"
                      autocomplete="off"
                      placeholder="If your Brand type isn't listed what kind of brand are you?"
                    />
                  </v-flex>
                  <v-flex xs6 pt-3 px-2 text-xs-center>
                    <v-select
                      :items="employees_count_options"
                      item-value="id"
                      item-text="name"
                      v-model="user.employees_count"
                      v-validate="'required'"
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
                      name="is_business_registered"
                      placeholder="Is your business registered?"
                    />
                  </v-flex>
                </template>

                <v-flex xs6 pt-3 px-2 text-xs-center>
                  <input
                    v-model="user.website_1_url"
                    v-validate="'required|max:1023|url'"
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
                    name="history"
                    placeholder="What artists and/or labels have you previously worked with?"
                  ></textarea>
                </v-flex>
                <v-flex xs12 text-xs-center>
                  <p>
                    All of the information you share with us is secure, never
                    sold & used to verify users.<br />
                    You agree to our terms of services by signing up.
                    <router-link
                      class="forgot-password"
                      to="/terms"
                      target="_blank"
                      >View our terms.</router-link
                    >
                  </p>
                  <v-btn block round dark type="submit" class="reset-btn"
                    >Next</v-btn
                  >
                </v-flex>
              </v-layout>
            </form>
          </div>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./register_by_attendee.ctrl.js"></script>

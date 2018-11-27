<template>
  <v-flex xs12 sm12 class="approve-section">
    <v-layout row wrap class="dismiss-section" @click="dismiss()"></v-layout>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 sm12 pa-3 class="profile-section">
        <div class="profile-image" :style="{'background-image': 'url(' + item.avatar.url + ')'}"></div>
        <div class="info-section">
          <div class="user-name">{{ item.display_name }}</div>
          <div><label>{{ userFullName }}</label></div>
          <div>
            <label>Age:</label>
            <span>{{ userAge }}</span>
            <label class="ml-2">Sex:</label>
            <span>{{ item.gender }}</span>
          </div>
          <div><label>{{ userFullAddress }}</label></div>
        </div>
        <div class="action-section">
          <v-btn
            color="success ma-0"
            class="approve-btn"
            @click.native="approveButtonAction(item)"
          >Approve</v-btn>
          <v-btn
            color="error ma-0"
            class="deny-btn"
            @click.native="denyButtonAction()"
          >Deny</v-btn>
        </div>
      </v-flex>
      <v-layout row wrap mx-3 py-2 class="link-section">
        <v-flex xs12 sm12>
          <label class="link-title">Email: </label>
          <a>{{ item.email }}</a>  
        </v-flex>
        <v-flex xs12 sm12>
          <label class="link-title">Twitter: </label>
          <a v-if="item.social_user_id"
            :href="`https://twitter.com/intent/user?user_id=${item.social_user_id}`" target="_blank"
          >https://twitter.com/intent/user?user_id={{ item.social_user_id }}</a>
        </v-flex>
        <v-flex xs12 sm12>
          <label class="link-title">Website: </label>
          <a v-if="item.website_1_url" :href="item.website_1_url" target="_blank">{{ item.website_1_url }}</a>
        </v-flex>
        <v-flex xs12 sm12>
          <label class="link-title">Website: </label>
          <a v-if="item.website_2_url" :href="item.website_2_url" target="_blank">{{ item.website_2_url }}</a>
        </v-flex>
      </v-layout>
      <v-layout v-if="item.request_role == 'artist'" row wrap mx-3 py-2 class="about-section">
        <v-flex xs12 sm6>
          <label>Main Genre:</label>
          <span>{{ userMainGenreName }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Artist type:</label>
          <span>{{ item.artist_type }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Number of release:</label>
          <span>{{ userReleasedAlbumsCount }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Years since first release:</label>
          <span>{{ userYearsSinceFirstReleased }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Plan to run live video?</label>
          <span>{{ getNameById(boolean_options, item.will_run_live_video) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Do you sell merch?</label>
          <span>{{ getNameById(boolean_options, item.will_sell_products) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Do you sell physical music?</label>
          <span>{{ getNameById(boolean_options, item.will_sell_physical_copies) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Annual income on merch sales:</label>
          <span>{{ userAnnualIncomeOnMerchSales }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>How many live shows annually?</label>
          <span>{{ userAnnualPerformancesCount }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Are you currently signed?</label>
          <span>{{ item.signed_status }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Performance Rights Organization:</label>
          <span>{{ userPerformanceRightsOrganization }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>IPI/CAE number</label>
          <span>{{ item.ipi_cae_number }}</span>
        </v-flex>
      </v-layout>
      <v-layout v-else-if="item.request_role == 'label'" row wrap mx-3 py-2 class="about-section">
        <v-flex xs12 sm6>
          <label>Main Genre:</label>
          <span>{{ userMainGenreName }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Sub Genre:</label>
          <span>{{ userSubGenreName }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Number of release:</label>
          <span>{{ userReleasedAlbumsCount }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Years since first release:</label>
          <span>{{ userYearsSinceFirstReleased }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Plan to run live video?</label>
          <span>{{ getNameById(boolean_options, item.will_run_live_video) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Do you sell merch?</label>
          <span>{{ getNameById(boolean_options, item.will_sell_products) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Do you sell physical music?</label>
          <span>{{ getNameById(boolean_options, item.will_sell_physical_copies) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Annual income on merch sales:</label>
          <span>{{ userAnnualIncomeOnMerchSales }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Business registered?</label>
          <span>{{ getNameById(boolean_options, item.is_business_registered) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>How many artists on your roster?</label>
          <span>{{ userArtistsCount }}</span>
        </v-flex>
      </v-layout>
      <v-layout v-else-if="item.request_role == 'brand'" row wrap mx-3 py-2 class="about-section">
        <v-flex xs12 sm6>
          <label>Brand Type:</label>
          <span>{{ item.standard_brand_type || item.customized_brand_type }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>How many employees?</label>
          <span>{{ userEmployeesCount }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Years in business:</label>
          <span>{{ userYearsInBusiness }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Do you sell music related products or services?</label>
          <span>{{ getNameById(boolean_options, item.will_sell_music_related_products) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Plan to run live video?</label>
          <span>{{ getNameById(boolean_options, item.will_run_live_video) }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>How many products/SKUs?</label>
          <span>{{ userProductsCount }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Annual Income:</label>
          <span>{{ userAnnualIncome }}</span>
        </v-flex>
        <v-flex xs12 sm6>
          <label>Business registered?</label>
          <span>{{ getNameById(boolean_options, item.is_business_registered) }}</span>
        </v-flex>
      </v-layout>
      <v-flex xs12 sm12 mx-3 py-2>
        <label>Artists and/or labels they've worked with:</label>
        <p class="description-text">{{ item.history }}</p>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript" src="./signup_approve_modal.ctrl.js"></script>

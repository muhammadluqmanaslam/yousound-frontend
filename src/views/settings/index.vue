<template>
  <div row wrap class="page settings-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Settings</h2>
          <ul>
            <li
              v-for="tab in availableTabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="onTab(tab.id)">{{ tab.title }}</label>
            </li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser">
        <div class="main-section" v-if="active_tab == 'info'">
          <div class="description-section"></div>
          <div class="content-section">
            <v-layout row wrap ma-0 profile-section>
              <v-flex xs12 pa-0>
                <div class="profile-image-section">
                  <!-- <img class="profile-image" id="profile_image" v-if="profile.image" :src="profile.image"/> -->
                  <div
                    class="profile-image"
                    id="profile_image"
                    v-if="profile.image"
                    :style="{
                      'background-image': 'url(' + profile.image + ')',
                    }"
                  ></div>
                  <div
                    class="profile-image-upload-section"
                    v-if="!profile.image"
                  >
                    <input
                      type="file"
                      name="profile_image_file"
                      id="profile_image_file"
                      class="add-profile-image-file"
                      accept="image/*"
                      @change="profileImageChanged($event)"
                    />
                    <label for="profile_image_file">
                      <v-icon class="camera">photo_camera</v-icon>Add
                    </label>
                  </div>
                  <div
                    class="profile-image-change-section"
                    v-if="profile.image"
                  >
                    <input
                      type="file"
                      name="profile_image_file"
                      id="profile_image_file"
                      class="change-profile-image-file"
                      accept="image/*"
                      @change="profileImageChanged($event)"
                    />
                    <label for="profile_image_file">
                      <v-icon class="camera">photo_camera</v-icon>Update
                    </label>
                  </div>
                </div>
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="profile.username"
                  disabled
                />
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label"
                  >Display Name<label class="required">*</label></label
                >
                <!-- <input type="text" class="form-control" v-model="profile.display_name"> -->
                <div
                  class="form-group"
                  :class="{ 'has-error': errors.has('display_name') }"
                >
                  <input
                    class="form-control"
                    v-model="profile.display_name"
                    v-validate="'required'"
                    :class="{
                      input: true,
                      'text-danger': errors.has('display_name'),
                    }"
                    name="display_name"
                    type="text"
                  />
                  <p
                    class="text-danger text-xs-left"
                    v-if="errors.has('display_name')"
                  >
                    {{ errors.first('display_name') }}
                  </p>
                </div>
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label"
                  >Email<label class="required">*</label></label
                >
                <!-- <input type="email" class="form-control" v-model="profile.email"> -->
                <div
                  class="form-group"
                  :class="{ 'has-error': errors.has('email') }"
                >
                  <input
                    class="form-control"
                    v-model="profile.email"
                    v-validate="'required|email'"
                    :class="{ input: true, 'text-danger': errors.has('email') }"
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                  <p
                    class="text-danger text-xs-left"
                    v-if="errors.has('email')"
                  >
                    {{ errors.first('email') }}
                  </p>
                </div>
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label"
                  >Contact URL(email, facebook, twitter)</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="profile.contact_url"
                />
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <v-btn
                  class="cancel-account-btn"
                  @click.native.stop="dialog = true"
                  >Cancel my account</v-btn
                >
                <v-dialog v-model="dialog">
                  <v-card>
                    <v-card-title class="headline">Cancel Account</v-card-title>
                    <v-card-text
                      >Cancelling your account will delete all of your data, are
                      you sure you want to cancel your account?</v-card-text
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        class="blue--text darken-1"
                        flat="flat"
                        @click.native="cancelAccount()"
                        >Yes</v-btn
                      >
                      <v-btn
                        class="blue--text darken-1"
                        flat="flat"
                        @click.native="dialog = false"
                        >No</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-flex>
              <v-flex xs12 sm6 form-group text-xs-right>
                <v-btn class="update-btn" @click.native="updateAccount()"
                  >Update</v-btn
                >
                <!-- <p class="regular-checkbox enable-alerts settings">
                  <input
                    type="checkbox"
                    id="enable_alert"
                    v-model="profile.enable_alert"
                  />
                  <label for="enable_alert">Enable Alerts</label>
                </p> -->
              </v-flex>
            </v-layout>
          </div>
        </div>

        <div class="main-section" v-else-if="active_tab == 'password'">
          <div class="description-section"></div>
          <div class="content-section">
            <v-layout row wrap ma-0 password-section>
              <v-flex xs12 sm6>
                <v-layout row wrap>
                  <v-flex xs12 form-group>
                    <label class="control-label"
                      >Current Password<label class="required">*</label></label
                    >
                    <!-- <input type="password" class="form-control" v-model="password.current_password"> -->
                    <div
                      class="form-group"
                      :class="{ 'has-error': errors.has('password') }"
                    >
                      <input
                        class="form-control"
                        v-model="password.current_password"
                        v-validate="'required'"
                        :class="{
                          input: true,
                          'text-danger': errors.has('password'),
                        }"
                        name="password"
                        type="password"
                      />
                      <p
                        class="text-danger text-xs-left"
                        v-if="errors.has('password')"
                      >
                        {{ errors.first('password') }}
                      </p>
                    </div>
                  </v-flex>
                  <v-flex xs12 form-group>
                    <label class="control-label"
                      >New Password<label class="required">*</label></label
                    >
                    <!-- <input type="password" class="form-control" v-model="password.new_password"> -->
                    <div
                      class="form-group"
                      :class="{ 'has-error': errors.has('new_password') }"
                    >
                      <input
                        class="form-control"
                        v-model="password.new_password"
                        v-validate="'required'"
                        :class="{
                          input: true,
                          'text-danger': errors.has('new_password'),
                        }"
                        name="new_password"
                        type="password"
                      />
                      <p
                        class="text-danger text-xs-left"
                        v-if="errors.has('new_password')"
                      >
                        {{ errors.first('new_password') }}
                      </p>
                    </div>
                  </v-flex>
                  <v-flex xs12 form-group>
                    <label class="control-label"
                      >Confirm New Password<label class="required"
                        >*</label
                      ></label
                    >
                    <!-- <input type="password" class="form-control" v-model="password.confirmed_password"> -->
                    <div
                      class="form-group"
                      :class="{ 'has-error': errors.has('confirmed_password') }"
                    >
                      <input
                        class="form-control"
                        v-model="password.confirmed_password"
                        v-validate="'required'"
                        :class="{
                          input: true,
                          'text-danger': errors.has('confirmed_password'),
                        }"
                        name="confirmed_password"
                        type="password"
                      />
                      <p
                        class="text-danger text-xs-left"
                        v-if="errors.has('confirmed_password')"
                      >
                        {{ errors.first('confirmed_password') }}
                      </p>
                    </div>
                  </v-flex>
                  <v-flex xs12 text-xs-right>
                    <v-btn class="update-btn" @click.native="updatePassword()"
                      >Update</v-btn
                    >
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </div>
        </div>

        <div class="main-section" v-else-if="active_tab == 'bank-details'">
          <div class="description-section">
            <p>
              In order to withdrawal funds, you must sign up for a
              <a href="https://stripe.com/" target="_blank">Stripe.com</a>
              account. <br />Stripe will handles your banking information,
              refunds and/or disputes.
            </p>
            <p></p>
          </div>
          <div class="content-section">
            <v-flex xs12 bank-details-section pa-0>
              <v-flex xs12 sm12 form-group stripe>
                <img src="/static/images/stripe-logo-blue.png" />
                <div v-if="!currentUser.stripe_connected">
                  <v-btn
                    :href="stripeLink"
                    target="_self"
                    class="update-btn"
                    dark
                    >Connect Stripe</v-btn
                  >
                </div>
                <div v-else>
                  <v-btn
                    @click.native="disconnetAccount()"
                    color="red"
                    class="update-btn"
                    >Disconnect Stripe</v-btn
                  >
                  <div>
                    <span>connected with: </span>
                    <label>{{ stripeEmail }}</label>
                  </div>
                </div>
                <!-- <v-btn
                  @click.native="viewStripeAccount()"
                  class="update-btn"
                  v-if="currentUser.stripe_connected"
                  >View Stripe Account</v-btn
                > -->
              </v-flex>
            </v-flex>
          </div>
        </div>
        <price-tab v-else-if="active_tab == 'repost-price'" />
        <address-tab v-else-if="active_tab == 'shipping-address'" />
        <!--genre-tab v-else-if="active_tab == 'genre-filter'"/-->
        <div class="main-section" v-else-if="active_tab == 'blocked'">
          <div class="description-section">
            <p>You can unblock users here</p>
          </div>
          <div class="content-section">
            <v-layout row wrap bocked-user-section ma-0>
              <v-flex
                xs12
                sm12
                form-group
                v-for="(blockedUser, index) in currentUser.blocked_users"
                :key="index"
              >
                <div
                  class="blocked-user-profile-image"
                  :style="{
                    'background-image':
                      'url(' + blockedUser.avatar.thumb.url + ')',
                  }"
                ></div>
                <!-- <profile-item :user="blockedUser" :className="'blocked-user-profile-image'"></profile-item> -->
                <label class="blocked-user-name">{{
                  blockedUser.display_name
                }}</label>
                <v-btn
                  class="unblock-btn"
                  @click.native="unblockUser(blockedUser)"
                  >Unblock</v-btn
                >
              </v-flex>
            </v-layout>
          </div>
        </div>
        <policy-tab
          v-else-if="active_tab == 'seller-policies'"
          :user="user"
          :updateUser="updateUser"
        />
        <verify-tab v-else-if="active_tab == 'verify-status'" />
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

<template>
  <div row wrap class="page settings-page">
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Settings</h2>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 relative content-page v-if="$store.state.auth.user">
      <v-navigation-drawer permanent absolute height="400px">
        <v-list>
          <v-list-tile v-for="t in tabs"
            :key="t.id"
            :href="`#${t.id}`"
            :class="{active: t.id == tab}"
            @click.native="onTab(t.id)"
            v-if="!(t.id == 'verify-status' && !$store.state.auth.user.request_status)"
            ripple>
            <v-list-tile-title>{{ t.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <div class="main-section" v-if="tab=='info'">
        <div class="content-section">
          <v-flex xs12 profile-section pa-0>
            <v-flex xs12 pa-0>
              <div class="profile-image-section">
                <!-- <img class="profile-image" id="profile_image" v-if="profile.image" :src="profile.image"/> -->
                <div class="profile-image" id="profile_image" v-if="profile.image" :style="{'background-image': 'url(' + profile.image + ')'}"></div>
                <div class="profile-image-upload-section" v-if="!profile.image">
                  <input type="file" name="profile_image_file" id="profile_image_file" class="add-profile-image-file" accept="image/*" @change="profileImageChanged($event)">
                  <label for="profile_image_file">
                    <v-icon class="camera">photo_camera</v-icon>Add
                  </label>  
                </div>
                <div class="profile-image-change-section" v-if="profile.image">
                  <input type="file" name="profile_image_file" id="profile_image_file" class="change-profile-image-file" accept="image/*" @change="profileImageChanged($event)">
                    <label for="profile_image_file">
                      <v-icon class="camera">photo_camera</v-icon>Update
                    </label>  
                </div>
              </div>
            </v-flex>
            <v-layout row wrap ma-0>
              <v-flex xs12 sm6 form-group>
                <label class="control-label">Username</label>
                <input type="text" class="form-control" v-model="profile.username" disabled />
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label">Display Name<label class="required">*</label></label>
                <!-- <input type="text" class="form-control" v-model="profile.display_name"> -->
                <div class="form-group" :class="{'has-error': errors.has('display_name') }" >
                  <input class="form-control"  v-model="profile.display_name" v-validate="'required'" :class="{'input': true, 'text-danger': errors.has('display_name') }" name="display_name" type="text">
                  <p class="text-danger text-xs-left" v-if="errors.has('display_name')">{{ errors.first('display_name') }}</p>
                </div>
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label">Email<label class="required">*</label></label>
                <!-- <input type="email" class="form-control" v-model="profile.email"> -->
                <div class="form-group" :class="{'has-error': errors.has('email') }" >
                  <input class="form-control"  v-model="profile.email" v-validate="'required|email'" :class="{'input': true, 'text-danger': errors.has('email') }" name="email" type="email" placeholder="Email">
                  <p class="text-danger text-xs-left" v-if="errors.has('email')">{{ errors.first('email') }}</p>
                </div>
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <label class="control-label">Contact URL(email, facebook, twitter)</label>
                <input type="text" class="form-control" v-model="profile.contact_url">
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <v-btn class="cancel-account-btn" @click.native.stop="dialog = true">Cancel my account</v-btn>
                <v-dialog v-model="dialog">
                  <v-card>
                    <v-card-title class="headline">Cancel Account</v-card-title>
                    <v-card-text>Cancelling your account will delete all of your data, are you sure you want to cancel your account?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn class="blue--text darken-1" flat="flat" @click.native="cancelAccount()">Yes</v-btn>
                      <v-btn class="blue--text darken-1" flat="flat" @click.native="dialog = false">No</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-flex>
              <v-flex xs12 sm6 form-group>
                <v-btn class="update-btn" @click.native="updateAccount()">Update</v-btn>
                <p class="regular-checkbox enable-alerts settings">
                  <input type="checkbox" id="enable_alert" v-model="profile.enable_alert">
                  <label for="enable_alert">Enable Alerts</label>
                </p>
              </v-flex>
            </v-layout>
          </v-flex>
        </div>
        <div class="description-section">
          <p>Update your profile here.</p>
        </div>
      </div>
      <div class="main-section" v-else-if="tab=='password'">
        <div class="content-section">
          <v-layout row wrap ma-0 password-section>
            <v-flex xs12 sm6 form-group>
              <label class="control-label">Current Password<label class="required">*</label></label>
              <!-- <input type="password" class="form-control" v-model="password.current_password"> -->
              <div class="form-group" :class="{'has-error': errors.has('password') }" >
                <input class="form-control"  v-model="password.current_password" v-validate="'required'" :class="{'input': true, 'text-danger': errors.has('password') }" name="password" type="password">
                <p class="text-danger text-xs-left" v-if="errors.has('password')">{{ errors.first('password') }}</p>
              </div>
            </v-flex>
            <v-flex xs12 sm6 form-group>
            </v-flex>
            <v-flex xs12 sm6 form-group>
              <label class="control-label">New Password<label class="required">*</label></label>
              <!-- <input type="password" class="form-control" v-model="password.new_password"> -->
              <div class="form-group" :class="{'has-error': errors.has('new_password') }" >
                <input class="form-control"  v-model="password.new_password" v-validate="'required'" :class="{'input': true, 'text-danger': errors.has('new_password') }" name="new_password" type="password">
                <p class="text-danger text-xs-left" v-if="errors.has('new_password')">{{ errors.first('new_password') }}</p>
              </div>
            </v-flex>
            <v-flex xs12 sm6 form-group>
              <label class="control-label">Confirm New Password<label class="required">*</label></label>
              <!-- <input type="password" class="form-control" v-model="password.confirmed_password"> -->
              <div class="form-group" :class="{'has-error': errors.has('confirmed_password') }" >
                <input class="form-control"  v-model="password.confirmed_password" v-validate="'required'" :class="{'input': true, 'text-danger': errors.has('confirmed_password') }" name="confirmed_password" type="password">
                <p class="text-danger text-xs-left" v-if="errors.has('confirmed_password')">{{ errors.first('confirmed_password') }}</p>
              </div>
            </v-flex>
            <v-flex xs12 sm6 form-group>
            </v-flex>
            <v-flex xs12 sm6 form-group>
              <v-btn class="update-btn" @click.native="updatePassword()">Update</v-btn>
            </v-flex>
          </v-layout>
        </div>
        <div class="description-section">
          <p>Change your password here.</p>
        </div>
      </div>
      <div class="main-section" v-else-if="tab=='bank-details'">
        <div class="content-section">
          <v-flex xs12 bank-details-section pa-0>
            <v-flex xs12 sm12 form-group>
              <img class="stripe" src="/static/images/stripe.jpg" />
              <a 
                :href="stripeLink" 
                target="_self" 
                v-if="!$store.state.auth.user.is_stripe_connected"
              >
                <v-btn 
                  class="update-btn top-btn" 
                  dark 
                >Connect Stripe</v-btn>
              </a>
              <!-- <v-btn @click.native="viewStripeAccount()" class="update-btn top-btn" v-if="$store.state.auth.user.is_stripe_connected">View Stripe Account</v-btn> -->
              <v-btn 
                @click.native="disconnetAccount()" 
                class="update-btn top-btn" 
                v-if="$store.state.auth.user.is_stripe_connected"
              >Disconnect Stripe</v-btn>
            </v-flex>
          </v-flex>
        </div>
        <div class="description-section">
          <p>In order to accept payments, you must sign up for a <a href="https://stripe.com/" target="_blank">Stripe.com</a> account.</p>
          <p>Stripe will handle all of your banking information, report transaction details, refunds and/or disputes on their site.</p>
          <p></p>
        </div>
      </div>
      <div class="main-section" v-else-if="tab=='repost-price'">
        <div class="content-section">
          <v-flex xs12 repost-price-section pa-0>
            <v-flex xs12 sm12 form-group>
              <label class="normal-text">repost price</label>
              <div class="repost-price-select">
                <v-select
                  v-bind:items="repost_prices"
                  v-model="repost_price"
                  item-text="name"
                  item-value="value"
                  label="Price"
                  single-line
                  auto
                  dirty
                  text-field
                ></v-select>
              </div>
              <v-btn @click.native="setRepostPrice()" class="update-btn top-btn">Set</v-btn>
            </v-flex>
          </v-flex>
        </div>
        <div class="description-section">
          <p>Set Repost Price here.</p>
        </div>
      </div>
      <div class="main-section" v-else-if="tab=='shipping-address'">
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
                  autocomplete
                ></v-select>
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
      <genre-tab v-else-if="tab=='genre-filter'"></genre-tab>
      <div class="main-section" v-else-if="tab=='blocked'">
        <div class="content-section">
          <v-layout row wrap bocked-user-section ma-0>
            <v-flex xs12 sm12 form-group v-for="(blockedUser, index) in $store.state.auth.user.blocked_users" :key="index">
              <div class="blocked-user-profile-image" :style="{'background-image': 'url(' + blockedUser.avatar.thumb.url + ')'}" ></div>
              <!-- <profile-item :user="blockedUser" :className="'blocked-user-profile-image'"></profile-item> -->
              <label class="blocked-user-name">{{ blockedUser.display_name }}</label>
              <v-btn class="unblock-btn" @click.native="unblockUser(blockedUser)">Unblock</v-btn>
            </v-flex>
            <!-- <v-flex xs12 sm12 form-group>
              <img class="blocked-user-profile-image" src="/static/images/user2.jpg" />
              <label class="blocked-user-name">Kris Boy</label>
              <v-btn class="unblock-btn" @click.native="unblockUser('user')">Unblock</v-btn>
            </v-flex> -->
          </v-layout>
        </div>
        <div class="description-section">
          <p>You can unblock users here.</p>
        </div>
      </div>
      <div class="main-section" v-else-if="tab=='seller-policies'">
        <div class="content-section">
          <v-layout row wrap return-policy-section ma-0>
            <v-flex xs12 sm12 form-group>
              <label class="control-label">Return Policy</label>
              <textarea v-model="user.return_policy"
                class="policy-area"
                placeholder="Write a return policy..."
                rows="5"></textarea>
            </v-flex>
            <v-flex xs12 sm12 form-group>
              <v-btn class="update-btn" @click.native="saveReturnPolicy()">Save</v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap return-policy-section ma-0>
            <v-flex xs12 sm12 form-group>
              <label class="control-label">Shipping Policy</label>
              <textarea v-model="user.shipping_policy"
                class="policy-area"
                placeholder="Write a shipping policy..."
                rows="5"></textarea>
            </v-flex>
            <v-flex xs12 sm12 form-group>
              <v-btn class="update-btn" @click.native="saveShippingPolicy()">Save</v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap return-policy-section ma-0>
            <v-flex xs12 sm12 form-group>
              <label class="control-label">Size Chart</label>
              <textarea v-model="user.size_chart"
                class="policy-area"
                placeholder="Write a size chart..."
                rows="5"></textarea>
            </v-flex>
            <v-flex xs12 sm12 form-group>
              <v-btn class="update-btn" @click.native="saveSizeChart()">Save</v-btn>
            </v-flex>
          </v-layout>
        </div>
        <div class="description-section"></div>
      </div>
      <verify-tab v-else-if="tab=='verify-status'"></verify-tab>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./list.ctrl.js"></script>

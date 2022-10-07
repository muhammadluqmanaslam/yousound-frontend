<template>
  <div row wrap class="page settings-page mx-5" :class="{onMobile}">
    <dashboard-nav name="settings" />

    <content-top-header absolute class="__inner mt-3">
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in availableTabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ 'active tab-active': isActiveTab(tab.id) }"
          >
            <label @click="onTab(tab.id)" class="innerBold">{{
              tab.title
            }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>
    <!-- <div class="page-left">
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
    </div> -->

    <div class="page-content" v-if="currentUser">
      <div class="main-section" v-if="active_tab == 'info'">
        <div class="description-section"></div>
        <div class="content-section">
          <v-layout row wrap ma-0 profile-section>
            <v-flex xs12 sm4 pa-0>
              <div class="dflex align-center justify-space-between mb-4">
                <div class="avatar-section">
                  <h2 class="mb-3">Profile info</h2>

                  <div class="__wrapper dflex align-center">
                    <div class="profile-image-section">
                      <!-- <img class="profile-image" id="profile_image" v-if="profile.image" :src="profile.image"/> -->
                      <div
                        v-if="profile.image"
                        class="profile-image"
                        id="profile_image"
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

                    <div>
                      <div class="app-bold text-capitalize">{{ profile.username }}</div>
                      <label class="link--text" for="profile_image_file">Change avatar</label>
                    </div>
                  </div>
                </div>

                <v-btn
                  v-if="onMobile"
                  depressed
                  round
                  class="logout-btn"
                  @click="signOut"
                  >Log out</v-btn
                >
              </div>

              <div class="form-group user-names">
                <div class="dflex justify-space-between align-center _wrapper">
                  <div class="first-name">
                    <label class="control-label">First Name</label>
                    <input
                      v-model="profile.firstName"
                      type="text"
                      class="form-control"
                    />
                  </div>

                  <div class="last-name">
                    <label class="control-label">Last Name</label>
                    <input
                      v-model="profile.lastName"
                      type="text"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="control-label">
                  Email
                </label>
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
                  <p class="text-danger text-xs-left" v-if="errors.has('email')">
                    {{ errors.first("email") }}
                  </p>
                </div>
              </div>

              <div class="plans-section list-plans">
                <label class="control-label">Subscriptions</label>
                
                
                <div class="plans">
                  <div class="plan" :class="{isCurrentPlan: currentUser.user_type === 'listener'}">
                    <div class="plan-details">
                      <div class="plan-title">
                        Free
                      </div>
                      <div class="plan-price">
                        Previews only
                      </div>
                    </div>

                    <div v-if="currentUser.plan === null" class="current-plan">Current plan</div>
                  </div>
                  <div
                    v-for="(plan, i) in plansData"
                    :key="i"
                    class="plan"
                    :class="{isCurrentPlan: isCurrentPlan(plan)}"
                  >
                    <div class="plan-details">
                      <div class="plan-title">
                        {{ plan.title }}
                      </div>
                      <div class="plan-price">
                        {{ plan.price }} / month
                      </div>
                    </div>

                    <div
                      v-if="plan.id === currentUser.plan"
                      class="current-plan"
                      style="margin-left: 10px"
                    >
                      Current plan
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="form-group">
                <label class="control-label">
                  Display Name
                </label>
                <div
                  class="form-group"
                  :class="{ 'has-error': errors.has('display_name') }"
                >
                  <input
                    class="form-control"
                    v-model="profile.username"
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
                    {{ errors.first("display_name") }}
                  </p>
                </div>
              </div> -->

              <div class="form-group mt-4">
                <v-btn class="update-btn" @click.native="updateAccount()">
                  <span>Save</span>
                </v-btn>
                <!-- <p class="regular-checkbox enable-alerts settings">
                  <input
                    type="checkbox"
                    id="enable_alert"
                    v-model="profile.enable_alert"
                  />
                  <label for="enable_alert">Enable Alerts</label>
                </p> -->
              </div>
            </v-flex>

            <!-- <v-flex xs12 sm6 form-group>
              <label class="control-label"
                >Contact URL(email, facebook, twitter)</label
              >
              <input
                type="text"
                class="form-control"
                v-model="profile.contact_url"
              />
            </v-flex> -->
          </v-layout>
          <v-dialog v-model="subscriptionModal">
            <v-card>
              <v-card-title class="headline"
                >Deactivate Subscription</v-card-title
              >
              <v-card-text>
                Are you sure you want to deactivate subscription?
                This process might take a while. Please don't refresh page in this time.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  class="blue--text darken-1"
                  flat="flat"
                  @click.native="deactivateSubscription()"
                  >Yes</v-btn
                >

                <v-btn
                  class="blue--text darken-1"
                  flat="flat"
                  @click.native="disableSubscriptionModal()"
                  >Cancel</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div class="delete-account-section" :style="{'padding-left': `${calcSideBarWidth}px`}">
            <div class="dflex align-center">
              <div class="delete-caption mr-5">
                Delete account & data
              </div>

              <v-btn
                round
                class="cancel-account-btn"
                @click.native.stop="dialog = true"
              >
                Delete account
              </v-btn>
              <v-btn v-if="isSubscriptionAvailable()"
                round
                class="cancel-account-btn"
                style="margin-left: 20px"
                :disabled="currentUser.deactivate_subscription == true"
                @click.native="enableSubscriptionModal()">
                Deactivate Subscription
              </v-btn>
            </div>

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
          </div>
        </div>
      </div>

      <div class="main-section" v-else-if="active_tab == 'password'">
        <div class="description-section"></div>
        <div class="content-section">
          <v-layout row wrap ma-0 password-section>
            <v-flex xs12 sm4>
              <div class="app-bold mb-3">
                Reset your password
              </div>

              <div class="form-group">
                <label class="control-label">
                  Current Password
                </label>
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
                    {{ errors.first("password") }}
                  </p>
                </div>
              </div>

              <div class="form-group">
                <label class="control-label">
                  New Password
                </label>
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
                    {{ errors.first("new_password") }}
                  </p>
                </div>
              </div>

              <div class="form-group">
                <label class="control-label">
                  Confirm New Password
                </label>
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
                    {{ errors.first("confirmed_password") }}
                  </p>
                </div>
              </div>

              <div>
                <v-btn class="update-btn" @click.native="updatePassword()">
                  Save
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>

      <div class="main-section" v-else-if="active_tab == 'bank-details'">
        <div class="description-section">
          <!-- <p>
            In order to accept payments you must connect your
            <a href="https://stripe.com/" target="_blank">Stripe.com</a>
            account. <br />
            Stripe will handle your banking information, refunds and/or
            disputes.
          </p> -->

          <div class="app-bold _title">
            Connect payment processor to accept payments & handle refunds.
          </div>

          <div class="my-2 _subtitle">
            Payment process
          </div>
        </div>
        <div class="content-section">
          <v-flex xs12 sm4 bank-details-section pa-0>
            <div v-if="!currentUser.stripe_connected" class="mb-4">
              <div class="stripe-status-identifier dflex align-center justify-space-between">
                <div class="dflex align-center">
                  <img :src="require('@/assets/stripe_block_dark.svg')" class="stripe-img" width="100" />

                  <div>
                    <div class="status">Connect Stripe account</div>
                  </div>
                </div>

                <div>
                  <router-link :href="stripeLink"></router-link>
                  <v-icon
                    class="cursor-pointer stripeLink-icon stripeLink-icon-add"
                    @click="$router.href(stripeLink)"
                  >
                    add
                  </v-icon>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="stripe-status-identifier stripe-status-identifier-connected dflex justify-space-between align-center">
                <div class="dflex align-center">
                  <img :src="require('@/assets/stripe_block_blue.svg')" class="stripe-img" width="100" />

                  <div>
                    <div class="status-title">Stripe</div>
                    <div class="status">Connected</div>
                  </div>
                </div>

                <div>
                  <v-icon
                    class="cursor-pointer stripeLink-icon stripeLink-icon-remove"
                    @click="openStripeDisconnectConfirmDialog()"
                  >
                    remove
                  </v-icon>

                  <!-- <v-btn
                    @click="openStripeDisconnectConfirmDialog()"
                    color="red"
                    class="update-btn"
                  >
                    Disconnect Stripe
                  </v-btn> -->
                </div>
                <!-- <v-btn
                  @click.native="viewStripeAccount()"
                  class="update-btn"
                  v-if="currentUser.stripe_connected"
                  >View Stripe Account</v-btn
                > -->
              </div>

              <div class="stripeEmail-section">
                {{ stripeEmail }}
              </div>
            </div>
          </v-flex>

          <div class="cursor-pointer text-underline app-bold mt-3">
            View FAQ to learn about payments
          </div>
        </div>

        <v-dialog
          v-model="show_stripe_disconnect_confirm_dialog"
          content-class="my-dialog-1"
        >
          <v-card>
            <v-card-text>
              <div class="headline">
                Do you really want to disconnect stripe?
              </div>
              <div>
                Your products will be deleted permanetly when you disconnect to
                stripe.
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn dark color="red" @click="disconnetAccount()"
                >Confirm</v-btn
              >
              <v-btn
                dark
                color="grey"
                @click="closeStripeDisconnectConfirmDialog()"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <price-tab v-else-if="active_tab == 'repost-price'" />

      <v-flex v-else-if="active_tab == 'shipping-address'" xs12 sm4>
        <address-tab
          actionRight
          singleCol
          hideRequireIcon
          header="Update your shipping address"
        />
      </v-flex>

      <div class="main-section" v-else-if="active_tab == 'blocked'">
        <!-- <div class="description-section">
          <p>You can unblock users here</p>
        </div> -->

        <div class="content-section">
          <v-layout row wrap bocked-user-section ma-0>
            <v-flex
              xs12
              sm4
              form-group
              v-for="(blockedUser, index) in currentUser.blocked_users"
              :key="index"
            >
              <div class="blocked-users">
                <user-tag
                  :user="blockedUser"
                  showAvatar
                  clickUser
                  showUserType
                  width="50"
                  height="50"
                />
                <!-- <profile-item :user="blockedUser" :className="'blocked-user-profile-image'"></profile-item> -->

                <v-btn
                  outline
                  round
                  class="unblock-btn"
                  @click.native="unblockUser(blockedUser)"
                >
                  Unblock
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>

      <policy-tab
        v-else-if="active_tab == 'seller-policies'"
        :user="user"
        :updateUser="updateUser"
      />

      <!-- <verify-tab v-else-if="active_tab == 'verify-status'" /> -->

      <div v-else-if="active_tab == 'verify-status'" class="main-section">
        <v-flex xs12 sm3 verify-section>
          <div v-if="currentUser.approver && currentUser.approver.display_name" class="verify-wrapper verified">
            <div class="app-bold verify-status">Verified</div>
            <div class="verified-by">by {{ currentUser.approver.display_name }}</div>
          </div>

          <div v-else class="verify-wrapper pending">
            <div class="app-bold verify-status">Pending</div>
            <div class="verified-by">-</div>
          </div>
        </v-flex>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style lang="scss">
.top-menu .__inner {
  font-weight: 400;
  font-size: 14px;
  color: #787878;

 /deep/ ixlabel {
    font-weight: 400;
    font-size: 14px;
    color: #787878;
  }
}

.logout-btn {
  border: 1px solid #d8d8d8;
  background: transparent;
}
.address-section {
  .header {
    font-weight: bold;
    margin-bottom: 0;
  }

  /deep/ .control-label {
    font-weight: 500;
  }
}

.user_tag {
  .tag__usertype {
    font-weight: 500;
    margin-top: 10px;
  }
}
</style>

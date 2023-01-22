<template>
  <div row wrap class="page settings-page mx-5 relative" :class="{onMobile}">
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
    <v-dialog v-model="initPayment" content-class="plans-dialog">
			<payment-card :item="selectedPlan" :totalPayable="totalPayable" :closePayment="closePaymentModal" />
		</v-dialog>

		<v-dialog v-model="plansUpgradeModal" v-if="currentUser !== null && currentUser.plan !== null">
			<v-card>
				<v-card-title class="headline"
					>Plan Changes</v-card-title
				>
				<v-card-text v-if="plansName[currentUser.plan] == 'Listener'"
					>
					<p>Your current plan is <b> {{ plansName[currentUser.plan]}} </b> and you are trying to <b>{{ planChangeText }}. </b> </p>
					<p>You will remain listener until admin approve your account. Once you verified, you will be charged according to subscription of current plan and new chosen plan.
						Are you sure you want to continue?
					</p>
				</v-card-text>
				<v-card-text v-else>
					<p>Your current plan is <b> {{ plansName[currentUser.plan]}} </b> and you are trying to <b>{{ planChangeText }}. </b> </p>
					<p>This will have an immediate effect and you will be charged according to subscription of current plan and new chosen plan.
						Are you sure you want to continue?
					</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						class="blue--text darken-1"
						flat="flat"
            :loading="loading"
						@click.native="subscriptionChange(planChangeText)"
						>Ok</v-btn
					>
					<v-btn
						class="blue--text darken-1"
						flat="flat"
						@click.native="hidePlanChangeModal()"
						>Cancel</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
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
                      v-model="profile.first_name"
                      type="text"
                      class="form-control"
                    />
                  </div>

                  <div class="last-name">
                    <label class="control-label">Last Name</label>
                    <input
                      v-model="profile.last_name"
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
                  <div class="plan" :class="{isCurrentPlan: currentUser.plan === null}">
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
                    class="plan planX"
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
                    <div v-else>
                      <div class="plan_btn_wrapper" v-if="currentUser.request_status !== 'denied'">
                        <v-btn
                          depressed
                          block
                          round
                          dark
                          class="plan_btn py-3 button_display"
                          @click.native="verifyPlanType(plan)"
                        >
                          <span>{{ plansDescription(plan.id) }}</span>
                        </v-btn>
					            </div>
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
                  :loading="loading"
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

      <div class="main-section upload-page" v-else-if="active_tab == 'bank-details'">
        <v-container fluid grid-list-lg px-0 mb-4>
          <v-layout upload-flex>
            <v-flex xs12 class="upload-tab-container">
              <div class="upload-tab-wrapper">
                    <div class="text-left">
                      <div class="dflex align-center">
                        <img src="../../assets/visa.svg" width="32">
                        <h3 class="secondary-heading">Accept Payments</h3>
                      </div>
                      <div class="upload-tab-description light">
                        Connect to <a href="https://stripe.com" target="_blank">Stripe.com</a> to get paid & manage your customers
                      </div> 
                    </div>


                    <div class="toggle-container">
                      
                      <v-btn v-if="currentUser.stripe_connected && currentUser.stripe_express_dashboard_link"
                        depressed
                        class="upload-tab-btn width-auto"
                        :href=currentUser.stripe_express_dashboard_link>
                          Stripe Express Dashboard
                      </v-btn>
                      <v-btn v-else
                        depressed
                        class="upload-tab-btn width-auto"
                        :href="stripeLink"
                        target="_blank"
                      >
                          Connect to Stripe
                      </v-btn>

                      <div v-if="currentUser.stripe_connected" class="dflex align-center mt-3">
                        <div class="dflex align-center">
                          <img src="../../assets/c-check.svg" width="25">
                          <p class="bold-text">Connected</p>
                        </div>
                        <div>
                          <a :href="stripeLink" class="anchor-text" target="_blank">
                            Edit
                          </a>
                        </div>
                      </div>
                    
                    </div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <div class="description-section">
          <!-- <p>
            In order to accept payments you must connect your
            <a href="https://stripe.com/" target="_blank">Stripe.com</a>
            account. <br />
            Stripe will handle your banking information, refunds and/or
            disputes.
          </p> -->
          

          <div class="app-bold _title">
            {{ currentUser.stripe_connected ? "Connect payment processor to accept payments & handle refunds." : "Connect to stripe to start getting paid for plays." }}
          </div>

          <v-btn v-if="currentUser.stripe_connected && currentUser.stripe_express_dashboard_link"
            :href=currentUser.stripe_express_dashboard_link
            target="_blank"
            dark
            round
            class="update-btn"
          >
            Stripe Express Dashboard
          </v-btn>
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
                  <a :href="stripeLink">
                  <v-icon
                  class="cursor-pointer stripeLink-icon stripeLink-icon-add"
                  >
                  add
                </v-icon>
              </a>
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
            <div class="app-bold verify-status">
              {{ this.requestStatuses[currentUser.request_status] }}
            </div>
            <div v-if="currentUser.request_status !== 'pending'" class="verified-by">by {{ currentUser.approver.display_name }}</div>
            <div v-else><span>-</span></div>
          </div>

          <div v-else class="verify-wrapper pending">
            <div class="app-bold verify-status">Pending</div>
            <div class="verified-by">-</div>
          </div>
          <div v-if="(currentUser.request_status === 'pending')">
            <span> You have already requested for account approval.</span>
          </div>
          <div v-else-if="(currentUser.request_status === 'denied')">
            <v-btn
              round
              @click.native="verifyReRequestStatus()"
              dark
            >
              Re request for verification
            </v-btn>
          </div>
        </v-flex>
      </div>
    </div>
    <div v-if="showGetVerifiedModal">
      <div class="verified-main">
        <div class="modal-inner">
          <div class="text-center _title">Get verified</div>
          <div class="margin-vertical">
            <div class="form-group">
              <div class="_lable">Social channel</div>
              <v-menu class="social-type-menu" content-class="s-menu__content">
                <v-select :placeholder="socialChannel ? socialChannel.title : 'Choose'" class="social-types-selector py-0"
                  :class="{ '_filled': socialChannel }" single-line hide-details slot="activator"></v-select>

                <div v-for="(channel, i) in socialChannels" :key="i" @click="selectedChannel(channel)"
                  class="channel-info" :class="[`${channel.id}-menu`]">
                  <div class="_title">{{ channel.title }}</div>
                  <div class="_tags">
                    {{ channel.tags }}
                  </div>
                </div>
              </v-menu>
              <div class="_lable">Social Username</div>
              <input v-model="socialUsername" placeholder="Username" class="_socialHandle width100" type="text"/>
            </div>

          </div>
          <div class="footnote">
            If we need to contact you we will send a direct message from <strong>@yousoundapp</strong>
          </div>
          <v-btn
            round
            dark
            @click.native="verifiedSocialAttributes()"
            class="mt-3 px-3"
            >Get Verified</v-btn
          >

          <!-- close sign -->
          <div class="close-button" @click="hideModal()">
            <img src="../../assets/cross.svg" width="11">
          </div>
        </div>

      </div>
    </div>

    <div v-if="remainingDaysModal">
      <UpgradeModal @remainingDaysModal="remainingDaysModal = $event" :daysRemaining="30 - remainingDays()" ></UpgradeModal>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/upload.scss" lang="scss" scoped />

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

.button_display{
  display: none;
}
.planX{
  height: 75px;
}
.planX:hover .button_display{
  display: block
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

.verified-main {
	position: fixed;
	z-index: 10;
	background: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;

	.modal-inner {
		border-radius: 10px;
		padding: 40px 25px;
		width: 100%;
		max-width: 375px;
		background: white;
		margin-left: 280px;
		position: relative;
		color: #000000;

		._title {
			font-size: 28px;
			font-weight: 500;
			line-height: 36px;
		}

		._lable {
			font-size: 12px;
			font-family: 'Inter', sans-serif;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.6);
			line-height: 30px;
		}

		.margin-vertical {
			margin: 30px 0;
			position: relative;
		}

		.close-button{
			filter: invert(1);
			position: absolute;
			top: 15px;
			right: 15px;
			cursor: pointer;
		}
	}

	.menu {
		width: 100%;
		display: block !important;
		margin-bottom: 14px;
	}

	._socialHandle {
		color: #000000;
		font-weight: 500;
		padding: 10px;
	}

	[disabled] {
		background: none !important;
	}

	.footnote {
		font-size: 14px;
	}

	input {
		min-height: 44px;
		font-weight: 500;
	}

	.social-menu {
		width: 100%;
	}

	.input-group__selections input {
		&::placeholder {
			color: #000000 !important;
			font-weight: 500 !important;
			opacity: 1 !important;
			font-size: 14px !important;
		}

		&[placeholder="Choose"] {
			&::placeholder {
				color: rgba(0, 0, 0, 0.7) !important;
			}
		}

	}

	.input-group__input {

		background: url("../../assets/chevron.svg") no-repeat scroll 95% 16px;
		background-size: 15px 15px;

		i {
			font-size: 0;
		}
	}

	&.input-group--focused {
		.input-group__input {
			// border: 1px solid #000000;
			border-radius: 4px;


		}
	}

}

.form-group{
	font-family: "Inter",sans-serif !important;
}

.social-type-menu {
	width: 100%;
}

.s-menu__content {
  position: fixed;
	top: 320px !important;
	box-shadow: none !important;
	border-radius: 12px !important;
	border: 2px solid #000000 !important;

	.channel-info {
		color: #000000;
		width: 100%;
		background-color: #ffffff;
		padding: 10px 10px;

		// &:not(:last-child) {
		//     border-bottom: 2px solid #000000;
		// }

		&:hover {
			background-color: #000000;
			color: #ffffff;
		}
	}


}

</style>

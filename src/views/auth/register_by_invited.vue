<template>
  <div class="auth-page auth-register-page">
    <div
      class="text-xs-center"
      v-if="isPageReady && !show_register_success_dialog"
    >
      <!-- <img class="logo" src="/static/images/nav_logo_primary.png" /> -->
      <div v-if="inviter.username" class="inviter">
        You've been invited by<br />
        <user-tag :user="inviter" /><br />
        to get verified
      </div>
      <!-- <h5>Create Your Verified Account</h5> -->
    </div>

    <form
      v-if="isPageReady && !show_register_success_dialog"
      v-on:submit.prevent="submit()"
      class="auth-form register-form"
      >
      <v-container fluid grid-list-item px-0>
        <v-layout wrap justify-center>
          <v-flex xs12 text-xs-center>
            <div class="avatar-area">
              <span class="avatar-img">
                <img
                  class="avatar"
                  src="/static/images/user-new.svg"
                  id="avatar"
                  ref="avatar"
                />
              </span>
              <div>
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
                  <label for="avatar_file">Choose image</label>
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex xs12 text-xs-center>
            <v-select
              v-model="user.request_role"
              :items="UserTypeOptions"
              item-value="value"
              item-text="text"
              v-validate="'required'"
              name="account_type"
              class="account_type"
              placeholder="Choose account type"
              hide-details
            />
          </v-flex>

          <v-flex xs12 text-xs-center relative>
            <input
              type="text"
              name="username"
              placeholder="@username"
              v-model="user.username"
              v-validate="{
                required: true,
                min: 3,
                max: 20,
                regex: /^[A-Za-z0-9_.]+$/,
              }"
              @blur="onBlur"
              class="username"
            />
            <label v-if="!is_username_available" class="error--text"
              >already taken</label
            >
          </v-flex>

          <!-- <v-flex xs12 text-xs-center relative>
            <input
              class="instagram_username"
              type="text"
              name="instagram_username"
              placeholder="Instagram username"
              autocomplete="off"
              v-model="user.social_user_name"
              v-validate="'required'"
            />
            <img src="/static/images/ic_instagram.png" />
          </v-flex> -->
          <!-- <v-flex xs12 text-xs-center>
            <v-select
              :items="main_genres"
              item-value="id"
              item-text="name"
              v-model="user.genre_id"
              v-validate="'required'"
              name="main_genre"
              placeholder="Main music genre"
              autocomplete
              hide-details
            />
          </v-flex> -->
          <!-- <v-flex xs12 text-xs-center>
            <input
              class="username"
              type="text"
              name="username"
              placeholder="Username"
              autocomplete="off"
              v-model="user.username"
              v-validate="'required|max:20'"
            />
          </v-flex> -->
          <!-- <v-flex xs12 text-xs-center>
            <input
              class="displayname"
              type="text"
              name="display_name"
              placeholder="Display Name"
              autocomplete="off"
              v-model="user.username"
              v-validate="'required|max:20'"
            />
          </v-flex> -->

          <v-flex xs12 text-xs-center>
            <input
              v-model="user.name"
              class="displayname"
              type="text"
              name="name"
              autocomplete="off"
              placeholder="Name"
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
              v-validate="'required|email'"
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

          <v-flex xs12 text-xs-center>
            <input
              v-model="user.social_url"
              class="displayname"
              type="text"
              name="social_media"
              autocomplete="off"
              placeholder="Social Media URL"
              v-validate="'required'"
            />
          </v-flex>
          
          <v-flex xs12 text-xs-center>
            <div class="dflex justify-space-between align-center mt-2">
              <p class="regular-checkbox ma-0">
                <input
                  v-model="terms"
                  id="terms"
                  type="checkbox"
                  name="terms"
                  v-validate="'required'"
                />
                
                <label for="terms" class="terms-text">
                  <span>Accept Terms</span>

                </label>
              </p>

              <router-link class="forgot-password terms-text" to="/terms">
                Terms & Conditions
              </router-link>
            </div>
            <!-- <p class="regular-checkbox mt-0">
              <input
                id="newsletter_terms"
                type="checkbox"
                name="newsletter_terms"
                v-model="newsletter_terms"
                v-validate="'required'"
              />
              <label for="newsletter_terms">Signup for newsletters</label>
            </p> -->
          </v-flex>

          <v-flex xs12 text-xs-center mt-3>
            <v-btn block round dark type="submit" class="create-account-button"
              >Create account</v-btn
            >
          </v-flex>

          <!-- <v-flex xs12 text-xs-center mt-3>
            Already a member?
            <router-link class="terms-text" to="/login">Sign in</router-link>
          </v-flex> -->
        </v-layout>
      </v-container>
    </form>

    <v-dialog
      v-model="show_register_success_dialog"
      fullscreen
      content-class="register-success-dialog"
    >
      <v-layout row wrap class="page auth-page register-success-page">
        <v-flex xs12 transition="slide-x-reverse-transition">
          <div class="page-header">
            <v-flex xs12 text-xs-center>
              <img class="logo" src="/static/images/nav_logo_primary.png" />
            </v-flex>
          </div>
          <div class="page-content">
            <div class="overview-section">
              <h5>Success!</h5>
              <p>Please check your email to confirm your account.</p>
            </div>

            <v-divider></v-divider>

            <div class="info-section">
              <p>
                Please allow at least 48 hours for staff to verify your account.
              </p>
              <p>
                While your account is being activated you can download the iOS
                app & browse as a listener.
              </p>
              <p>
                Use the web/desktop version to upload albums & products,
                download songs & broadcast live!
              </p>
            </div>

            <v-divider></v-divider>

            <div class="download-section">
              <div>
                <a href="//apps.apple.com/us/app/id1452078262" target="_blank"
                  ><img src="/static/images/img_download_ios.svg" height="64"
                /></a>
              </div>
              <div>
                <img class="qr-code" src="/static/images/ios-app-link-qr.svg" />
              </div>
              <div><label>Android coming soon.</label></div>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./register_by_invited.ctrl.js"></script>

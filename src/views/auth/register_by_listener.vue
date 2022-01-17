<template>
  <div class="auth-page auth-register-page">
    <form v-on:submit.prevent="submit()" autocomplete="off" class="auth-form register-form">
      <input
        autocomplete="off"
        name="hidden"
        type="text"
        style="display: none"
      />
      <v-container fluid grid-list-item px-0>
        <v-layout wrap justify-center>
          <v-flex xs12 sm8 text-xs-center>
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
                    @change="imageChanged($event)"
                  />
                  <label for="avatar_file">Choose profile image</label>
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex xs12 sm8 text-xs-center relative>
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

          <v-flex xs12 sm8 text-xs-center>
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

          <!-- <v-flex xs12 text-xs-center>
            <input
              class="displayname"
              type="text"
              name="display_name"
              autocomplete="off"
              placeholder="Display Name"
              v-model="user.username"
              v-validate="'required|max:20'"
            />
          </v-flex> -->
          <v-flex xs12 sm8 text-xs-center>
            <input
              class="email"
              type="email"
              name="email"
              autocomplete="new-password"
              placeholder="Email"
              v-model="user.email"
              v-validate="'required|email'"
            />
          </v-flex>

          <v-flex xs12 sm8 text-xs-center>
            <input
              class="password"
              type="password"
              name="password"
              autocomplete="new-password"
              placeholder="Password"
              v-model="user.password"
              v-validate="'required|min:5|max:16'"
            />
          </v-flex>

          <v-flex xs12 sm8 text-xs-center>
            <div class="dflex justify-space-between align-center mt-2">
              <p class="regular-checkbox ma-0">
                <input
                  v-model="terms"
                  id="terms"
                  type="checkbox"
                  name="terms"
                  v-validate="'required'"
                />
                
                <label for="terms">
                  <span>Accept Terms</span>

                </label>
              </p>

              <router-link class="terms-text" to="/terms">
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

          <v-flex xs12 sm8 text-xs-center mt-3>
            <v-btn block round dark type="submit" class="create-account-button"
              >Create account</v-btn
            >
          </v-flex>

          <v-flex xs12 text-xs-center mt-3>
            Already a member?
            <router-link class="terms-text" to="/login">Sign in</router-link>
          </v-flex>
        </v-layout>
      </v-container>
    </form>
  </div>
</template>

<script type="text/javascript" src="./register_by_listener.ctrl.js"></script>

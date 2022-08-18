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
                    @change="imageChanged($event)"
                  />
                  <label for="avatar_file">Choose image</label>
                </div>
              </div>
            </div>
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
          <v-flex xs12 text-xs-center>
            <input
              v-model="user.display_name"
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
              class=""
              type="text"
              name="city"
              placeholder="City"
              v-model="user.city"
            />
          </v-flex>
          <v-flex xs12 text-xs-center>
            <country-select class="country" name="country" v-model="user.country" :country="country" topCountry="US" />
          </v-flex>
          <v-flex xs12 text-xs-center>
            <v-select
                v-model="user.age_group"
                :items="age_group"
                label="Age Group"
                persistent-hint
                return-object
                class="country"
                single-line
                name="social_provider"
              ></v-select>
            <!-- <select class="country" v-model="user.age_group" name="age_group" :agegroup="agegroup" placeholder="Age Group">
              <option :value="null" disabled selected>Age Group</option>
              <option>14-21</option>
              <option>22-34</option>
              <option>35-49</option>
              <option>50-65+</option>
            </select> -->
          </v-flex>
          <v-flex xs12 text-xs-center>
            <v-select
                v-model="user.social_provider"
                :items="social_platform"
                label="Social Platform"
                persistent-hint
                return-object
                class="country"
                single-line
                name="social_provider"
              ></v-select>
            <!-- <select class="country" v-model="user.social_provider" name="social_provider">
              <option disabled>Social Platform</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>Twitter</option>
              <option>LinkedIn</option>
              <option>Snapchat</option>
            </select> -->
          </v-flex>
          <v-flex xs12 text-xs-center>
            <input
              v-model="user.social_user_name"
              class="displayname"
              type="text"
              name="social_user_name"
              autocomplete="off"
              placeholder="Social Username"
            />
          </v-flex>
          <v-flex xs12 text-xs-center>
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

          <v-flex xs12 text-xs-center>
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
                
                <label for="terms">
                  <span class="terms-text">Accept Terms</span>

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
  </div>
</template>

<script type="text/javascript" src="./register_by_listener.ctrl.js"></script>

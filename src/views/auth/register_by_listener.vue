<template>
  <div class="page auth-page auth-register-page">
    <div class="text-xs-center">
      <img class="logo" src="/static/images/nav_logo_primary.png" />
      <h4>Create Account</h4>
    </div>

    <form v-on:submit.prevent="submit()">
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
              @change="imageChanged($event)"
            />
            <label for="avatar_file">Choose a file</label>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 text-xs-center relative>
        <input
          type="text"
          name="username"
          placeholder="Username"
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
          class="displayname"
          type="text"
          name="display_name"
          placeholder="Display Name"
          v-model="user.display_name"
          v-validate="'required|max:20'"
        />
      </v-flex>
      <v-flex xs12 text-xs-center>
        <input
          class="email"
          type="email"
          name="email"
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
          placeholder="Password"
          v-model="user.password"
          v-validate="'required|min:6'"
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
            <router-link class="forgot-password" to="/terms"
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
  </div>
</template>

<script type="text/javascript" src="./register_by_listener.ctrl.js"></script>

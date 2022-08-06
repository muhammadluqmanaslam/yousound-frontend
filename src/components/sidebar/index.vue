<template>
  <v-navigation-drawer
    permanent
    app
    fixed
    dark
    :mini-variant="mini"
    mobile-break-point
    :width="sideBarWidth"
    class="sidebar"
  >
    <div class="pa-3 tabs-auth-wrapper">
      <div class="dflex justify-space-between align-center mb-3">
        <router-link :to="{ name: 'AlbumIndex' }" class="sidebar-logo">
          <img
            v-if="mini"
            class="_mini"
            src="/static/images/nav_logo_white_mini.png"
          />
          <img v-else src="/static/images/nav_logo_white.png" />
        </router-link>

        <!-- <span
          class="icon cursor-pointer pr-2"
          @click="searchActive = !searchActive"
        >
        </span> -->
        <div v-if="!mini" class="toggle-sidebar">
          <img
            class="cursor-pointer"
            :class="{ inversed: !mini }"
            @click.stop="mini = !mini"
            src="/static/images/slide-right.svg"
          />
        </div>
      </div>

      <search-input
        v-if="isAuthenticated"
        :senderRoute="$route.name"
        :isRound="false"
        theme="dark"
        placeholder="Search"
        class="mb-5"
      />

      <div v-if="!isAuthenticated" class="auth-btn-container">
        <ul class="signed-out-menu">
          <li class="cursor-pointer login" @click="$router.push('/login')">
            <img class="mr-2" src="/static/images/sign-in.svg" width="20" />
            <span v-if="!mini" class="width100">Sign In</span>
          </li>
          <li
            class="cursor-pointer discover"
            @click="$router.push({ name: 'DiscoverIndex' })"
          >
            <img
              class="mr-2 invert-color"
              src="/static/images/search.svg"
              width="20"
            />
            <span v-if="!mini">Discover</span>
          </li>
        </ul>
      </div>

      <div
        v-if="
          currentUser &&
          currentUser.stream !== null &&
          $store.state.streamPlayer == 'active'
        "
        class="live-notice"
        :class="{ 'pl-0': mini }"
        @click="$router.push({ name: 'VideoManage' })"
      >
        <b v-if="!mini" class="__text">View live broadcast</b>
        <span class="icon_wrapper" :class="{ dflex: mini }">
          <v-icon>circle</v-icon>
          <span class="icon_text">LIVE</span>
        </span>
      </div>

      <!-- isAuthenticated: {{ isAuthenticated }} -->

      <template v-if="isAuthenticated">
        <v-list v-for="(parent, i) in tabs" :key="i" class="py-1 px-0">
          <h4>
            <h3 v-if="parent.name" class="px-3 subheader">{{ parent.name }}</h3>
          </h4>
          <div>
            <v-list-tile
              v-for="(subMenu, ii) in parent.items"
              :key="ii"
              :active-class="subMenu.path ? 'activeTab' : ''"
              class="side-tab"
              :to="
                subMenu.directPath ? `/${subMenu.path}` : { name: subMenu.path }
              "
              :class="[
                customActiveTab(subMenu) ? 'activeTab' : '',
                {
                  'd-none':
                    subMenu.allowedUser &&
                    !subMenu.allowedUser.includes(currentUser.user_type),
                },
              ]"
            >
              <v-list-tile-avatar>
                <div
                  v-if="subMenu.id === 'you'"
                  class="profile-image"
                  :style="{
                    'background-image':
                      'url(' + currentUser.avatar.thumb.url + ')',
                  }"
                ></div>
                <span v-else>
                  <img
                    v-if="subMenu.icon.length > 50"
                    :src="subMenu.icon"
                    class="icon _icon_img"
                  />

                  <v-icon v-else class="__icon">
                    {{ subMenu.icon }}
                  </v-icon>
                </span>
              </v-list-tile-avatar>
              <v-list-tile-title
                v-if="!mini"
                class="d-flex justify-space-between align-center"
              >
                <span v-if="!mini" class="__title">
                  {{ subMenu.title }}
                </span>

                <span
                  v-if="subMenu.id === 'notifications' && badge.message > 0"
                  class="dot_notifications"
                  :class="{ 'mr-0 ml-1': mini }"
                >
                  <v-icon size="1">circle</v-icon>
                </span>

                <span
                  v-else-if="subMenu.id === 'sales' && badge.sell > 0"
                  class="dot_notifications"
                  :class="{ 'mr-0 ml-1': mini }"
                >
                  <v-icon size="1">circle</v-icon>
                </span>

                <span
                  v-else-if="subMenu.id === 'cart' && badge.cart > 0"
                  class="dot_notifications"
                  :class="{ 'mr-0 ml-1': mini }"
                >
                  <v-icon size="1">circle</v-icon>
                </span>
              </v-list-tile-title>
            </v-list-tile>
          </div>
        </v-list>
      </template>
    </div>

    <v-spacer></v-spacer>

    <transition v-if="!onMobile" name="slide-fade">
      <side-audio-player
        ref="audioPlayer"
        :isMini="mini"
        v-show="$store.getters['navigator/hasAudioPlayer']"
      ></side-audio-player>
    </transition>

    <div v-if="mini" class="toggle-sidebar _bottom">
      <img
        class="cursor-pointer"
        :class="{ inversed: !mini }"
        @click.stop="mini = !mini"
        src="/static/images/slide-right.svg"
      />
    </div>
  </v-navigation-drawer>
</template>

<script src="./sidebar.ctrl.js"></script>
<style src="../../../static/styles/sidebar.scss" lang="scss" scoped></style>

<template>
  <div class="dashboard-nav margin-top-header">
    <v-toolbar fixed app flat color="white" height="73" class="nav-z-index">
        <content-top-header>
            <template slot="topHeader">
                <ul class="width100">
                    <li v-if="displayTabs"
                    v-for="tab in tabs"
                    :key="tab.id"
                    :href="`#${tab.id}`"
                    class="nav-li"
                    :class="[{ 'active': name === tab.id, 'tab-active': tabActivePill }, `nav-${tab.id}`]"
                    >
                      <label
                        class="nav-label"
                        @click="setTab(tab.pathName)"
                      >
                        <img v-if="tab.icon" :src="tab.icon" width="18" class="li-icon">
                        {{ tab.title }}
                      </label>
                    </li>

                    <v-spacer></v-spacer>
                    <li>
                      <v-btn v-if="(currentUser.user_type === 'artist' || currentUser.user_type === 'brand') && currentUser.creator_verified" depressed to="/upload" class="upload-btn">Upload</v-btn>
                    </li>
                    <li>
                        <v-menu
                        v-if="currentUser"
                        bottom
                        left
                        offset-y
                        :nudge-top="-5"
                        :nudge-left="0"
                        class="profile-menu"
                        content-class="profile-menu__content"
                      >
                        <v-btn icon class="border-dark" slot="activator">
                          <v-icon>more_horiz</v-icon>
                        </v-btn>
                        <v-list class="pa-0">
                          <v-list-tile
                            v-for="(menu, i) in dropdownMenu"
                            :key="i"
                            @click="setMenuAction(menu)"
                          >
                            <v-list-tile-content>
                              <div class="dflex align-center px-4" :class="[`${menu.id}-menu`]">
                                <user-tag v-if="menu.id == 'profile'" :user="currentUser" showAvatar hideName hideTick />
                                <span v-else>
                                  <img
                                    v-if="menu.icon.length > 50" 
                                    :src="menu.icon"
                                    :width="[menu.id !== 'signOut' ? 23 : 18 ]"
                                    class="icon _icon_img mr-2"
                                    :class="[menu.id == 'signOut' ? 'flipX' : '' ]"
                                  />

                                  <v-icon v-else class="__icon">
                                    {{ subMenu.icon }}
                                  </v-icon>
                                  </span>
                                <div class="black--text">{{ menu.title }}</div>
                              </div>
                            </v-list-tile-content>
                          </v-list-tile>
                          <!-- <v-list-tile
                            key="profile"
                            :to="`/${currentUser.slug}`"
                          >
                            <v-list-tile-content>
                              <div class="black--text">View Profile</div>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile
                            key="signout"
                            @click="signOut"
                          >
                            <v-list-tile-content>
                                <div>Sign Out</div>
                            </v-list-tile-content>
                          </v-list-tile> -->
                        </v-list>
                      </v-menu>
                    </li>
                </ul>
            </template>
        </content-top-header>
    </v-toolbar>
  </div>
</template>

<script src="./dashboardnav.ctrl.js"></script>

<style lang="scss" scoped>
.nav-z-index{
  z-index: 10 !important;
}
.dashboard-nav {
    .upload-btn {
      box-shadow: none;
      margin: 0;
      background: #0151ff !important;
      color: #ffffff;
      margin-top: 0;
      border-radius: 76px;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
    }
}
@media (max-width: 810px) {
  .dashboard-nav {
    /deep/.toolbar__content {
      padding-left: 0 !important;
    }
  }
}
</style>

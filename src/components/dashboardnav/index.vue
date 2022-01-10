<template>
  <div class="dashboard-nav">
    <v-toolbar fixed app flat color="white" height="73">
        <content-top-header>
            <template slot="topHeader">
                <ul class="width100">
                    <li
                    v-for="tab in tabs"
                    :key="tab.id"
                    :href="`#${tab.id}`"
                    class="nav-li"
                    :class="[{ active: name === tab.id }, `nav-${tab.id}`]"
                    >
                      <label
                        class="nav-label"
                        @click="setTab(tab.pathName)"
                      >
                        <img :src="tab.icon" width="23" class="li-icon">
                        {{ tab.title }}
                      </label>
                    </li>

                    <v-spacer></v-spacer>

                    <li>
                        <v-btn depressed to="/upload" class="upload-btn">Upload</v-btn>
                    </li>
                    <li>
                        <router-link :to="`/${currentUser.slug}`">
                            <div class="black--text">View Profile</div>
                        </router-link>
                    </li>
                    <li>
                        <v-btn
                            depressed
                            color="transparent"
                            class="text-capitalize no-Btn-bg"
                            @click="signOut"
                        >
                            Sign Out
                        </v-btn>
                    </li>
                </ul>
            </template>
        </content-top-header>
    </v-toolbar>
  </div>
</template>

<script src="./dashboardnav.ctrl.js"></script>

<style lang="scss" scoped>
.dashboard-nav {
    .upload-btn {
      box-shadow: none;
      margin: 0;
      background: #0151ff !important;
      color: #ffffff;
      margin-top: 0;
      border-radius: 7px;
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

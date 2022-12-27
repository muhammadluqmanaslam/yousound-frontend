<template>
  <div row wrap class="page terms-page">
    <div class="d-flex">
      <!-- <div class="page-left">
        <div class="tab-container">
          <v-navigation-drawer permanent fixed height="100vh">
            <div class="page-title"></div>
            <v-list>
              <v-list-tile
                v-for="t in tabs"
                :key="t.id"
                :href="`#${t.id}`"
                :class="{ active: t.id == currentTab }"
                @click.native="onTab(t.id)"
              >
                <v-list-tile-title>{{ t.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-navigation-drawer>
        </div>
      </div> -->

      <div class="page-content">
        <terms-of-use-tab v-if="currentTab == 'terms_of_use'" />
        <community-guidelines-tab
          v-else-if="currentTab == 'community_guidelines'"
        />
        <privacy-policy-tab v-else-if="currentTab == 'privacy_policy'" />
        <privacy-choice-tab v-else-if="currentTab == 'privacy_choice'" />
        <copyright-policy-tab v-else-if="currentTab == 'copyright_policy'" />
        <trademark-policy-tab v-else-if="currentTab == 'trademark_policy'" />
        <gdpr-tab v-else-if="currentTab == 'gdpr'" />
        <cookie-policy-tab v-else-if="currentTab == 'cookie_policy'" />
        <sample-clearance-tab v-else-if="currentTab == 'sample_clearance'" />
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

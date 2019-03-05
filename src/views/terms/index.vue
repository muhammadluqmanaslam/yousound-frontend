<template>
  <div row wrap class="page terms-page">
    <div class="content-page">
      <v-navigation-drawer permanent fixed height="100vh">
        <div class="page-title"></div>
        <v-list>
          <v-list-tile v-for="t in tabs"
            :key="t.id"
            :href="`#${t.id}`"
            :class="{active: t.id == currentTab}"
            @click.native="onTab(t.id)"
          >
            <v-list-tile-title>{{ t.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <terms-of-use-tab v-if="currentTab == 'terms_of_use'"/>
      <community-guidelines-tab v-else-if="currentTab == 'community_guidelines'"/>
      <privacy-policy-tab v-else-if="currentTab == 'privacy_policy'"/>
      <privacy-choice-tab v-else-if="currentTab == 'privacy_choice'"/>
      <copyright-policy-tab v-else-if="currentTab == 'copyright_policy'"/>
      <trademark-policy-tab v-else-if="currentTab == 'trademark_policy'"/>
      <gdpr-tab v-else-if="currentTab == 'gdpr'"/>
      <trademark-guideline-tab v-else-if="currentTab == 'trademark_guideline'"/>
      <cookie-policy-tab v-else-if="currentTab == 'cookie_policy'"/>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

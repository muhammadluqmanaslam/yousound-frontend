<template>
  <div row wrap class="page terms-page">
    <div class="content-page">
      <v-navigation-drawer permanent fixed height="100vh">
        <div class="page-title"></div>
        <v-list>
          <v-list-tile v-for="t in tabs"
            :key="t.id"
            :href="`#${t.id}`"
            :class="{active: t.id == active_tab}"
            @click.native="onTab(t.id)"
          >
            <v-list-tile-title>{{ t.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <team-tab v-if="active_tab == 'team'"/>
      <product-tab v-else-if="active_tab == 'product'"/>
      <timeline-tab v-else-if="active_tab == 'timeline'"/>
      <success-tab v-else-if="active_tab == 'success'"/>
      <opportunity-tab v-else-if="active_tab == 'opportunity'"/>
      <features-tab v-else-if="active_tab == 'features'"/>
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

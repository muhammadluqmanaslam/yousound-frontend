<template>
  <div class="page notification-page mx-5">
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ active: isActiveTab(tab.id) }"
          >
            <label @click="setTab(tab.id)">{{ tab.title }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

      <div class="d-flex">
        <div class="page-content">
          <Activity v-if="currentTab === 'activity'" />
          <Messages v-else-if="currentTab === 'messages'" />
        </div>
      </div>


  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/notifications.scss" lang="scss" scoped>

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
            <label :class="[tab.id]" class="__tabs" @click="setTab(tab.id)">
              <span class="__tab">{{ tab.title }}</span>
              <span
                v-if="tab.id === 'activity'"
                class="notifications "
              >
                <span class="__count">
                  <!-- {{ typeof badge.activity }} -->
                  <!-- {{ badge.activity > 99 }} -->
                  {{ badge.activity > 99 ? badge.activity : '99+' }}
                  <!-- {{ badge.activity > 99 ? badge.activity : '99+' }} -->
                </span>
              </span>
              <span
                v-if="tab.id === 'messages'"
                class="notifications "
              >
                <span class="__count">
                  <!-- {{ typeof badge.message }} -->
                  <!-- {{ badge.message > 99 }} -->
                  {{ badge.message > 99 ? badge.message : '99+' }}
                  <!-- {{ badge.message > 99 ? badge.message : '99+' }} -->
                </span>
              </span>
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

      <div class="d-flex">
        <div class="page-content">
          <Activity v-if="currentTab === 'activity'" />
          <Messages v-else-if="currentTab === 'messages'" />
          <getPaidToShare v-else-if="currentTab === 'paidToShare'" />
        </div>
      </div>


  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/notifications.scss" lang="scss" scoped>

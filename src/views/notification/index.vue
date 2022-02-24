<template>
  <div class="page notification-page" :class="{'mx-5': currentTab != 'messages' }">
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            class="nav-li"
            :class="[{ active: isActiveTab(tab.id) }, `nav-${tab.id}`]"
          >
            <label class="nav-label __tabs" :class="[tab.id]" @click="setTab(tab.id)">
              <span class="__tab dflex align-center">
                <img :src="tab.icon" width="18" class="li-icon">
                {{ tab.title }}
              </span>
              <span
                v-if="tab.id === 'activity'"
                class="notifications "
              >
                <span class="__count">
                  <!-- {{ typeof badge.activity }} -->
                  <!-- {{ badge.activity > 99 }} -->
                  {{ badge.activity < 99 ? badge.activity : '99+' }}
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
                  {{ badge.message < 99 ? badge.message : '99+' }}
                  <!-- {{ badge.message > 99 ? badge.message : '99+' }} -->
                </span>
              </span>
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content">
      <Activity v-if="currentTab === 'activity'" />
      <Messages v-else-if="currentTab === 'messages'" class="mt-1" />
      <getPaidToShare v-else-if="currentTab === 'paidToShare'" />
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/notifications.scss" lang="scss" scoped>

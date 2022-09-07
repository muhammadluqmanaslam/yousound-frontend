<template>
  <div class="page notification-page" :class="{'mx-5': activeTab == 'activity' }">
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            class="nav-li"
            :class="[{ 'active tab-active': isActiveTab(tab.id) }, `nav-${tab.id}`]"
          >
            <label class="nav-label __tabs" :class="[tab.id]" @click="setTab(tab.id)">
              <span class="__tab dflex align-center">
                <img v-if="tab.icon" :src="tab.icon" width="18" class="li-icon">
                {{ tab.title }}
              </span>

              <!-- <span
                v-if="tab.id === 'activity'"
                class="notifications "
              >
                <span class="__count">
                  {{ badge.activity < 99 ? badge.activity : '99+' }}
                </span>
              </span>
              <span
                v-if="tab.id === 'messages'"
                class="notifications "
              >
                <span class="__count">
                  {{ badge.message < 99 ? badge.message : '99+' }}
                </span>
              </span> -->
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content">
      <Activity v-if="activeTab === 'activity'" isComp />
      <Messages v-else-if="activeTab === 'messages'" class="mt-1" />
      <SMS v-else-if="activeTab === 'sms'" class="mt-1" />
      <getPaidToShare v-else-if="activeTab === 'paidToShare'" />
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../static/styles/notifications.scss" lang="scss" scoped>

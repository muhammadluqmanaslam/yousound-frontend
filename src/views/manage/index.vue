<template>
  <div class="page manage-page mx-5">
    <dashboard-nav name="manage" :replaceMenuWith="replaceTopMenu" />
    <content-top-header absolute class="__inner mt-3" style="margin-bottom: -25px">
      <template slot="topHeader">
        <ul>
          <li
            v-for="filter in tabFilterOptions"
            :key="filter.id"
            :href="`#${filter.value}`"
            :class="{ 'active tab-active': isActiveFilter(filter.value) }"
          >
            <label @click="setActiveInnerFilter(filter.value)" class="innerBold">{{ filter.title }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <content-top-header absolute class="__inner ml-3">
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in getInnerMenuTabs(activeInnerFilter)"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ active: isActiveInnerTab(tab.id) }"
          >
            <label @click="setInnerTab(tab.id)">{{ tab.title }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

   <!-- Header Dropdown alternative -->
   <!-- <content-top-header
      absolute
      class="__inner my-3 px-0"
      v-if="userType == 'artist'"
    >
      <template slot="topHeader">
        <ul>
          <li class="tabSelectMenu">
            <v-select
              v-model="activeInnerFilter"
              :items="tabFilterOptions"
              item-text="title"
              item-value="value"
              hide-details
              class="pt-0"
            ></v-select>
          </li>

          <div class="allChildrenCenter">
            <li
              v-for="tab in getInnerMenuTabs(activeInnerFilter)"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveInnerTab(tab.id) }"
            >
              <label @click="setInnerTab(tab.id)">{{ tab.title }}</label>
            </li>
          </div>
        </ul>
      </template>
    </content-top-header> -->

    <div v-show="active_tab === 'content'">
      <manage-product
        v-show="activeInnerFilter === 'products'"
        ref="manageProduct"
      />
      <manage-album
        v-show="activeInnerFilter === 'albums'"
        ref="manageAlbum"
        :textBtnToRight="
          activeInnerFilter == 'albums' &&
          (activeInnerTab == 'published' || activeInnerTab == 'privated')
        "
      />
      <manage-video v-show="activeInnerFilter === 'videos'" ref="manageVideo" />
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style lang="scss" scoped>
.tabSelectMenu {
  /deep/.input-group--select .input-group__selections__comma {
    font-weight: 400;
  }
}
</style>

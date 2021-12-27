<template>
  <div class="page manage-page mx-5">
    <dashboard-nav name="manage" />

    <content-top-header absolute class="__inner my-3 px-0" v-if="userType == 'artist'">
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
    </content-top-header>

    <div v-if="active_tab === 'content'">
      <manage-product v-if="activeInnerFilter === 'products'" ref="manageProduct" />
      <manage-album 
        v-if="activeInnerFilter === 'albums'" 
        ref="manageAlbum" 
        :textBtnToRight="activeInnerFilter == 'albums' && (activeInnerTab == 'published' || activeInnerTab == 'privated')" 
      />
      <manage-video v-if="activeInnerFilter === 'videos'" ref="manageVideo" />
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

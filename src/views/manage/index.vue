<template>
  <div class="page manage-page mx-5">
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
    <content-top-header class="__inner" v-if="active_tab === 'content' && userType == 'artist'">
      <template slot="topHeader">
        <ul>
            <li class="tabSelectMenu">
              <v-select
              v-model="activeInnerFilter"
              :items="tabFilterOptions"
              item-text="title"
              item-value="value"
              hide-details
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
    </div>

    <div v-else-if="active_tab === 'payment'">
      <payments isComp />
    </div>

    <div v-else-if="active_tab === 'setting'">
      <settings isComp />
    </div>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

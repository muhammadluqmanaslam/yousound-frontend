<template>
  <div class="page-onMobile discover-onMobile">
    <search-input class="mb-2" isOnMobile />
    <tab-nav :tabData="tabs" ref="tabData" @tabClicked="tabClicked" recChip />

    {{ activeDiscover }}
    <div class="page-content">
        <discover-music v-if="activeDiscover == 'album'" />
        <discover-video v-if="activeDiscover == 'video'" />
        <discover-product v-if="activeDiscover == 'merch'" />
    </div>
  </div>
</template>

<script>
// import desktop script
import def from "../../discover/index.ctrl"

import SearchInput from '@/components/searchInput'
import TabNav from '../components/tab_nav.vue'
import discoverMusic from './music'
import discoverVideo from './video'
import discoverProduct from './product'

export default {
    components: {
        SearchInput,
        TabNav,
        discoverMusic,
        discoverVideo,
        discoverProduct,
        // ItemTab,
    },
    data() {
        return {
            // ...def.data(),
            selectedTab: '',
            activeDiscover: 'album',
            isComp: true,
            tabs: [
                { id: 'album', title: 'Music' },
                { id: 'video', title: 'Video' },
                { id: 'merch', title: 'Shop' },
            ],
        }
    },
    methods: {
        tabClicked(data) {
            this.selectedTab = data
            this.activeDiscover = data.id
            console.log(data);
        }
    },
    created() {
        console.log('default:', def);
    }
}
</script>

<style src="../../../../static/styles/mobile/search_input.scss" lang="scss"></style>

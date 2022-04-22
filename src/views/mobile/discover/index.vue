<template>
  <div class="page-onMobile discover-onMobile">
    <search-input class="mb-2" isOnMobile />
    <tab-nav :tabData="tabs" ref="tabData" @tabClicked="tabClicked" recChip />

    <div class="page-content">
        <discover-music v-if="activeDiscover == 'album'" />
        <discover-video v-if="activeDiscover == 'video'" />
        <discover-product v-if="activeDiscover == 'merch'" />
    </div>
  </div>
</template>

<script>
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
            this.activeDiscover = data.id
            console.log(data);
        }
    },
    created() {
        // set activeDiscover if instructed passed via route
        const {activeDiscover} = this.$route.params
        console.log('activeDiscover:', activeDiscover);

        if (activeDiscover) {
            this.activeDiscover = activeDiscover
        }
    }
}
</script>

<style src="../../../../static/styles/mobile/search_input.scss" lang="scss"></style>

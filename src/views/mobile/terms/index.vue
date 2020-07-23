<template>
  <div class="mobile-terms-page page terms-page">
    <mobile-header theme="light" @open-menu="openMenu" />
    <div class="section">
      <community-guidelines-tab v-if="activeTab == 'community_guidelines'" />
      <privacy-policy-tab v-else-if="activeTab == 'privacy_policy'" />
      <privacy-choice-tab v-else-if="activeTab == 'privacy_choice'" />
      <copyright-policy-tab v-else-if="activeTab == 'copyright_policy'" />
      <trademark-policy-tab v-else-if="activeTab == 'trademark_policy'" />
      <gdpr-tab v-else-if="activeTab == 'gdpr'" />
      <cookie-policy-tab v-else-if="activeTab == 'cookie_policy'" />
      <sample-clearance-tab v-else-if="activeTab == 'sample_clearance'" />
      <terms-of-use-tab v-else />
    </div>

    <v-dialog
      v-model="showMenu"
      fullscreen
      transition="slide-x-reverse-transition"
    >
      <mobile-menu @close-menu="closeMenu"></mobile-menu>
    </v-dialog>
  </div>
</template>

<script>
/* global $:true */

import mobileHeader from '@/views/mobile/components/header'
import mobileMenu from '@/views/mobile/components/menu'
import communityGuidelinesTab from '@/views/terms/components/community_guidelines_tab'
import cookiePolicyTab from '@/views/terms/components/cookie_policy_tab'
import copyrightPolicyTab from '@/views/terms/components/copyright_policy_tab'
import gdprTab from '@/views/terms/components/gdpr_tab'
import privacyChoiceTab from '@/views/terms/components/privacy_choice_tab'
import privacyPolicyTab from '@/views/terms/components/privacy_policy_tab'
import sampleClearanceTab from '@/views/terms/components/sample_clearance_tab'
import termsOfUseTab from '@/views/terms/components/terms_of_use_tab'
import trademarkPolicyTab from '@/views/terms/components/trademark_policy_tab'

export default {
  components: {
    mobileHeader,
    mobileMenu,
    communityGuidelinesTab,
    cookiePolicyTab,
    copyrightPolicyTab,
    gdprTab,
    privacyChoiceTab,
    privacyPolicyTab,
    sampleClearanceTab,
    termsOfUseTab,
    trademarkPolicyTab,
  },

  data() {
    return {
      activeTab: 'terms_of_use',
      showMenu: false,
    }
  },

  watch: {
    $route(toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
  },

  created() {
    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  },

  methods: {
    setTab(tab) {
      if (tab === this.activeTab) {
        return
      }

      if (!tab) {
        tab = 'terms_of_use'
      }

      this.activeTab = tab
      this.$nextTick(() => {
        $(window).scrollTop(0)
      })
    },

    openMenu() {
      this.showMenu = true
    },

    closeMenu() {
      this.showMenu = false
    },
  },
}
</script>

<style lang="scss" scoped>
.mobile-terms-page {
  .section {
    padding-top: 80px;

    /deep/ h2 {
      font-size: 24px;
    }

    /deep/ h3 {
      font-size: 20px;
    }
  }

  .header-container {
    background-color: #fff;
  }
}
</style>

<template>
  <div
    class="onboarding"
    :class="[
      `onboarding-${currentStage.stage}`,
      {
        allowFullPage: currentStage.allowFullPage,
        onMobile,
        aboveMobile: !onMobile,
      },
    ]"
  >
    <!-- <transition name="fade"> -->
    <Stager v-if="!currentStage.hideStage" staging="onboarding" />

    <div v-if="current === 1" class="stage-wrapper">
      <ChooseAccount />
    </div>
    <div v-else-if="accountCategory === 'creator'" class="stage-wrapper">
      <transition name="slide-fadeInOnly">
        <AccountType v-if="current === 2" />
      </transition>

      <transition name="slide-fadeInOnly">
        <ProfileImage v-if="current === 3" />
      </transition>

      <transition name="slide-fadeInOnly">
        <AccountInfo v-if="current === 4" />
      </transition>

      <transition name="slide-fadeInOnly">
        <AgeLocation v-if="current === 5" />
      </transition>

      <transition name="slide-fadeInOnly">
        <GetVerified v-if="current === 6" />
      </transition>

      <transition name="slide-fadeInOnly">
        <AuthPlan v-if="current === 7" />
      </transition>

      <transition name="slide-fadeInOnly">
        <CheckEmail v-if="current === 8" />
      </transition>
    </div>
    <div v-else-if="accountCategory === 'listener'" class="stage-wrapper">
      <transition name="slide-fadeInOnly">
        <AccountType v-if="current === 2" />
      </transition>
      <transition name="slide-fadeInOnly">
        <ProfileImage v-if="current === 3" />
      </transition>

      <transition name="slide-fadeInOnly">
        <AccountInfo v-if="current === 4" />
      </transition>

      <transition name="slide-fadeInOnly">
        <AgeLocation v-if="current === 5" />
      </transition>

      <transition name="slide-fadeInOnly">
        <CheckEmail v-if="current === 6" />
      </transition>
    </div>
  </div>
</template>

<script src="./index.ctrl.js"></script>

<style lang="scss" src="../../../../../static/styles/onboarding.scss"></style>

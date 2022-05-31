<template>
  <div class="onboarding">
    <Stager :current="current" :title="currentStage.title" />

    <div v-if="current === 1" class="stage-wrapper">
      <ChooseAccount />
    </div>
    <div v-else-if="accountCategory === 'creator'" class="stage-wrapper">
      <AccountType v-if="current === 2" />
      <ProfileImage v-if="current === 3" />
      <AccountInfo v-if="current === 4" />
      <AgeLocation v-if="current === 5" />
      <GetVerified v-if="current === 6" />
      <CheckEmail v-if="current === 7" />
    </div>
    <div v-else-if="accountCategory === 'listener'" class="stage-wrapper">
      <ProfileImage v-if="current === 2" />
      <AccountInfo v-if="current === 3" />
      <AgeLocation v-if="current === 4" />
      <CheckEmail v-if="current === 5" />
    </div>
  </div>
</template>

<script src="./index.ctrl.js"></script>

<style lang="scss" src="../../../../../static/styles/onboarding.scss"></style>

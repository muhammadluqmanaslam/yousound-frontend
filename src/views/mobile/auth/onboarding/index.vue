<template>
  <div class="onboarding">
    <Stager :current="current" :title="currentStage.title" />

    <div v-if="accountCategory === 'creator'" class="stage-wrapper">
      <ChooseAccount v-if="current === 1" />
      <AccountType v-if="current === 2" />
      <ProfileImage v-if="current === 3" />
      <AccountInfo v-if="current === 4" />
      <AgeLocation v-if="current === 5" />
      <GetVerified v-if="current === 6" />
      
      <CheckEmail v-if="current === 7" />
    </div>
  </div>
</template>

<script src="./index.ctrl.js"></script>

<style lang="scss" scoped>
.onboarding {
  position: relative;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .stage-wrapper {
    margin-top: -70px;
  }
}
</style>
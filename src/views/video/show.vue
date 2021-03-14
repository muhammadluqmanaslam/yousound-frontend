<template>
  <div class="page video-page show-page mx-5">
    <v-layout row>
      <v-flex sm9>
        <video-player :video="stream"></video-player>
      </v-flex>
      <v-flex sm3 pl-3>
        <div class="box">
          <div class="box__header">
            <div class="box__title">Join the conversation</div>
          </div>
          <div class="box__content">
            <chat :items="comments"></chat>
          </div>
          <div class="box__footer">
            <input type="text" />
          </div>
        </div>
      </v-flex>
    </v-layout>

    <div class="meta">
      <div class="meta__header">
        <div class="meta__title">{{ video.name }}</div>
        <div class="meta__subtitle"></div>
      </div>
      <div class="meta__content"></div>
      <div class="meata__footer">
        <div class="meta_cta follow"></div>
        <div class="meta_cta donate"></div>
        <div class="meta_cta repost"></div>
        <div class="meta_cta share"></div>
      </div>
    </div>

    <div class="section users-section">
      <h4 class="section__title">featured profiles</h4>
      <div class="section__content">
        <template v-for="account in accounts">
          <div class="user-container" :key="`user-${account.id}`">
            <artist-item :artist="account" />
          </div>
        </template>
      </div>
    </div>

    <div class="section videos-section">
      <h4 class="section__title">Similar videos</h4>
      <div class="section__content">
        <template v-for="(video, index) in videos">
          <div class="video-container" :key="`video-${index}`">
            <video-box :video="video" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./show.ctrl.js"></script>

<style lang="scss" scoped>
.section {
  border-top: 1px solid #ccc;

  &__content {
    display: flex;
  }
}

.box {
  position: relative;
  width: 100%;
  height: 100%;

  &__header {
    display: flex;
    align-items: center;
    height: 60px;
  }

  &__footer {
    display: flex;
    align-items: flex-end;
    height: 60px;
  }

  &__content {
    position: relative;
    height: calc(100% - 120px);
  }

  &__title {
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    font-size: 20px;
    font-weight: 700;
  }
}

.user-container {
  display: inline-block;
  width: 12.5%;
  padding: 5px;
}
.video-container {
  display: inline-block;
  width: 20%;
  padding: 5px;
}
</style>

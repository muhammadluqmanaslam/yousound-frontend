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
            <div class="ci">
              <div class="ci__header">
                <div
                  class="ci__image"
                  :style="`background-image: url(${currentUser.avatar.url})`"
                ></div>
              </div>
              <div class="ci__content">
                <input type="text" />
              </div>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>

    <div class="meta">
      <div class="meta__header">
        <div
          class="meta__image"
          :style="`background-image: url(${stream.user.avatar.url})`"
        ></div>
      </div>
      <div class="meta__content">
        <div class="meta__title">{{ stream.name }}</div>

        <div class="meta__subtitle">
          {{ stream.viewers_size || 0 }}
          views &bull;
          {{ moment(stream.created_at).format('MMM D, YYYY') }}
        </div>

        <div class="meta__actions">
          <user-tag :user="stream.user" />
          <div class="meta_cta follow"></div>
          <div class="meta_cta donate"></div>
          <div class="meta_cta repost"></div>
          <div class="meta_cta share"></div>
        </div>

        <div class="meta__description">
          {{ stream.description }}
        </div>
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
  margin: 20px 0 0;
  border-top: 1px solid #ccc;

  &__content {
    display: flex;
  }
}

// comments list
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
    height: 55px;
    margin-top: 5px;
    border-top: 1px solid #ccc;
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

// chat input box
.ci {
  display: flex;

  &__header {
    width: 55px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input {
    width: 100%;
    padding: 5px 10px;
  }
}

.meta {
  display: flex;
  margin: 20px 0 0;
  padding: 10px 0 0;
  border-top: 1px solid #ccc;

  &__header {
    width: 60px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__content {
    flex: 1;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
  }

  &__actions {
    display: flex;

    .tag {
      font-size: 20px;
    }
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

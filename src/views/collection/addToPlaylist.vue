<template>
  <v-dialog v-model="getAddToPlaylist" content-class="addToPlaylist-dialog">
    <div class="addToPlaylist">
      <div class="text-center _top">
        <span>Add To Playlist</span>
      </div>

      <div class="mb-3 app-bold">All to Playlists</div>
      <div class="mb-2 _playlist">
        <trackcardsimple
          :item="{}"
          :cover="require('@/assets/playlist-grey.svg')"
          title="New Playlist"
          coverRadius
        />
      </div>

      <div v-for="(playlist, index) in 7" :key="index" class="mb-2 _playlist">
        <trackcardsimple
          :item="{}"
          :cover="require('@/assets/playlist-grey.svg')"
          :title="`Playlist ${index+1}`"
          coverRadius
        />
      </div>
    </div>
  </v-dialog>
</template>

<script>
import trackcardsimple from "@/components/trackcardsimple";

export default {
  components: { trackcardsimple },
  props: {
    addToPlaylist: Boolean,
  },
  data() {
    return {
      getAddToPlaylist: this.addToPlaylist,
    };
  },
  watch: {
    getAddToPlaylist(val) {
      if (!val) {
        this.$emit("closeAddToPlaylist");
      }
    },
  },
};
</script>

<style lang="scss">
.addToPlaylist-dialog {
  position: relative;
  padding: 20px;
  background-color: #ffffff;

  ._top {
    margin-bottom: 30px;
    font-weight: bold;
    position: sticky;
    top: 0;
    background-color: #ffffff;
    z-index: 99;

    span {
        position: relative;
        z-index: 3;
        color: #000000;
    }

    &::before {
      content: "";
      width: calc(100% + 60px);
      height: calc(100% + 40px);
      background-color: #ffffff;
      position: absolute;
      top: -23px;
      left: -21px;
    }
  }

  ._playlist {
    position: relative;
    border-top: 1px solid #0000001a;
    padding-top: 10px;

    .track-card-simple {
      position: relative;

      .cover {
        background-size: 50%;
        background-color: rgba(217, 217, 217, 0.2) !important;
      }
    }
  }
}
</style>
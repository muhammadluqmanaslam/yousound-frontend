<template>
  <v-dialog v-model="getAddToPlaylist" content-class="addToPlaylist-dialog">
    <v-icon
      class="icon-close"
      @click="closeAddToPlaylist()"
    >close</v-icon>

    <div v-if="!newPlaylistActive && !playlistAddedSuccess" class="addToPlaylist">
      <div class="text-center _top">
        <span>Add To Playlist</span>
      </div>

      <div class="mb-3 app-bold">All to Playlists</div>
      <div class="mb-2 _playlist add_new" @click="newPlaylist()">
        <trackcardsimple
          :item="{}"
          :cover="require('@/assets/ic_add_to.png')"
          title="New Playlist"
          coverRadius
        />
      </div>

      <div v-for="(playlist, index) in 7" :key="index" class="mb-2 _playlist">
        <trackcardsimple
          :item="{}"
          :cover="require('@/assets/playlist-grey.svg')"
          :title="`Playlist ${index + 1}`"
          coverRadius
        />
      </div>
    </div>

    <div v-if="newPlaylistActive" class="newPlaylist">
      <div class="text-center _top">
        <span>New Playlist</span>
      </div>

      <input
        v-model="newPlaylistTitle"
        type="text"
        name="newPlaylist"
        id="newPlaylist"
        placeholder="Name your playlist"
      />
      <div class="dflex justify-space-between align-center">
        <div class="app-bold my-3">Playlist is public</div>
        <v-switch
          v-model="isNewPlaylistPublic"
          color="green"
          hide-details
          class="flex-none widthfit"
        ></v-switch>
      </div>
      <hr />
      <v-btn round dark block class="py-4" @click="addNewPlaylist()">
        Save Playlist
      </v-btn>
    </div>

    <div v-if="playlistAddedSuccess" class="text-center playlistAddedSuccess">
      <img :src="require('@/assets/playlist-grey.svg')" width="50" alt="playlist icon" />

      <h3 class="intro-text">Added to Playlist</h3>
      <div class="body-text">
        {{ selectedAlbums.length }} {{ "song" | pluralize(selectedAlbums.length) }} added to "{{ newPlaylistTitle }}"
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
    selectedAlbums: Array,
  },
  data() {
    return {
      getAddToPlaylist: this.addToPlaylist,
      newPlaylistActive: false,
      isNewPlaylistPublic: false,
      newPlaylistTitle: "",
      playlistAddedSuccess: false,
    };
  },
  watch: {
    getAddToPlaylist(val) {
      if (!val) {
        const isPartial = true
        this.closeAddToPlaylist(isPartial);
      }
    },
  },
  methods: {
    addNewPlaylist() {
      if (this.newPlaylistTitle) {
        this.newPlaylistActive = false;
        this.playlistAddedSuccess = true;
      }
    },
    closeAddToPlaylist(isPartial) {
      this.$emit("closeAddToPlaylist", isPartial);
    },
    newPlaylist() {
      this.newPlaylistActive = true;
    },
  },
};
</script>

<style lang="scss">
.addToPlaylist-dialog {
  width: 400px;
  position: relative;
  padding: 20px;
  background-color: #ffffff;

  .icon-close {
    position: absolute;
    right: 12px;
    top: 20px;
    color: #000000;
    cursor: pointer;
    z-index: 999;
  }

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

  .addToPlaylist {
    ._playlist {
      position: relative;
      border-top: 1px solid #0000001a;
      padding-top: 10px;
      cursor: pointer;

      &.add_new {
        .track-card-simple {
          .cover {
            background-size: 30%;
          }
        }
      }

      .track-card-simple {
        position: relative;

        .cover {
          background-size: 50%;
          background-color: rgba(217, 217, 217, 0.2) !important;
        }
      }
    }
  }

  .newPlaylist {
    padding-bottom: 50px;

    input#newPlaylist {
      width: 100%;
      padding: 0 13px;
      margin-bottom: 70px 15px 0 15px;
    }

    hr {
      background-color: #0000001a;
      height: 1px;
      border: 0;
      margin: 15px 0 30px;
    }
  }

  .playlistAddedSuccess {
    text-align: center;
    padding: 90px 0;

    .intro-text {
      color: #5B5B5B;
    }
    .body-text {
      color: #717171;
    }
  }
}
</style>
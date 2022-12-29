<template v-if="pageReady">
  <div class="playlist px-5">
    <content-top-header class="mt-3">
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ 'active tab-active': isActiveTab(tab.id) }"
          >
            <label @click="onTab(tab.id)" class="innerBold">{{
              tab.title
            }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="breadcrumb">Playlists > {{ "Playlist" }}</div>

    <div class="meta-summary">
      <div class="breadcrumb"> {{ this.playlist.name }}</div>
      <span v-if="this.playlist.playlist_type == 'tracks'"
        >{{ this.tracks.length }}
        {{ "track" | pluralize(this.tracks.length) }}</span
      >
      <span v-else-if="this.playlist.playlist_type == 'streams'"
        >{{ this.streams.length }}
        {{ "stream" | pluralize(this.streams.length) }}</span
      >
      <span v-if="this.playlist.playlist_type == 'products'"
        >{{ this.products.length }}
        {{ "product" | pluralize(this.products.length) }}</span
      >
      <span class="mx-1">&#8226;</span>
    </div>

    <div v-if="this.playlist.playlist_type == 'tracks'" class="list-track-view list-track-view-trackCard listings">
      <div
        v-for="(track, index) in this.tracks"
        :key="index"
        class="list-track-view-item listing"
      >
        <track-card
          :objects="parseAlbum"
          :objectIndex="index"
          hideMoreMenu
          hideTrackLength
          displayDuration
        />
      </div>
    </div>

    <div v-else-if="this.playlist.playlist_type == 'streams'" class="list-track-view list-track-view-trackCard listings">
      <div
        v-for="(video, index) in this.streams"
        :key="index"
        class="list-track-view-item listing"
      >
        <video-box
          :hoverOverlay="false"
          :item="video"
          showUsername
          :hideUser="false"
          :sideTabView=true
        />
      </div>
    </div>

    <div v-else-if="this.playlist.playlist_type == 'products'" class="list-track-view list-track-view-trackCard listings">
      <div
        v-for="(product, index) in this.products"
        :key="index"
        class="list-track-view-item listing"
      >
        <product-card
          :dataObject="product"
          sideTabView
          :hideOverlay="false"
          hideOptionCount
          altMeta
          noMeta
          altMetaPrice
        />
      </div>
    </div>

    <share-modal
      v-if="share_dialog"
      :item="sharedAlbum"
      :dismiss="closeShareTrack"
    />
  </div>
</template>

<script>
import trackCard from "@/components/trackcard";
import contentTopHeader from "@/components/contentTopHeader";
import shareModal from "@/components/sharemodal";
import CollectionPlaylist from '@/services/collection_playlist'
import VideoBox from "@/components/video_box";
import productCard from "@/components/productcard";

export default {
  components: {
    contentTopHeader,
    trackCard,
    shareModal,
    VideoBox,
    productCard,
  },

  data() {
    return {
      playlist: null,
      activeTab: "",
      tabs: [
        { id: "music", title: "Music" },
        { id: "videos", title: "Videos" },
        { id: "products", title: "Products" },
      ],
      playlistType: null,
      playlistId: null,
      share_dialog: false,
      pageReady: false,
      tracks: null,
      streams: null,
      products: null,
    };
  },

  computed: {
    parseAlbum() {
			let albums = []
			for(let i=0; i < this.tracks.length;i++) {
				let track = this.tracks[i]
				let album = track.album
				let user = track.user

				albums.push({
					id: album.id,
					slug: album.slug,
					name: album.name,
					description: album.description,
					cover: {
						url: album.cover.url,
						large: {
							url: album.cover.large.url,
						},
						thumb: {
							url: album.cover.thumb.url,
						},
					},
					album_type: album.album_type,
					collaborators_count: album.collaborators_count,
					status: album.status,
					recommended: album.recommended,
					played: album.played,
					downloaded: album.downloaded,
					reposted: album.reposted,
					commented: album.commented,
					enabled_sample: album.enabled_sample,
					recommended_at: album.recommended_at,
					location: album.location,
					track: track,
					user: user,
				});
			}

			return albums;
	  },

  },
  methods: {
    onTab(tab) {
      this.activeTab = tab;
      this.$router.push({
        name: "CollectionIndex",
        params: { activeTab: tab },
      });
    },
    isActiveTab(tab) {
      return this.activeTab === tab;
    },
    shareTrack(track) {
      this.sharedAlbum = this.tempAlbum;
      this.share_dialog = true;
    },
    closeShareTrack(tab) {
      this.share_dialog = false;
      this.sharedAlbum = {};
    },
  },

  created() {
    this.playlistId = this.$route.params.id
    let params = {id: this.playlistId}

    CollectionPlaylist.getPlaylistDetails(params)
      .then((response) => {
        this.tracks = response.body.tracks
        this.streams = response.body.streams
        this.products = response.body.products
        this.playlist = response.body.playlists
        if (this.playlist.playlist_type == 'tracks') {
          this.activeTab = "music"
        } else if (this.playlist.playlist_type == 'streams') {
          this.activeTab = 'videos'
        } else if (this.playlist.playlist_type == 'products') {
          this.activeTab = 'products'
        }
        this.pageReady = true
      })
      .catch((e) => {
        this.pageReady = true
        this.$store.dispatch(
          'error/showErrorToast', e.body.errors || [e.body] || [e.body.error]
        )
      })

  },
};
</script>

<style lang="scss" scoped>
.playlist {
  .breadcrumb {
    font-size: 18px;
    font-weight: bold;
    line-height: 1.5;
  }

  .meta-summary {
    color: #1c1c1c;
    margin: 15px 0;
  }
}
</style>
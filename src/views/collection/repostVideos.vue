<template>
  <div class="repost-comp repost-music">
    <div v-if="showBanner"  class="repost-banner">
			<div class="dflex gap-25 align-center justify-space-between">
				<div class="repost-content">

				<div class="dflex align-center mb-4">
					<img src="../../assets/build-icon.svg" width="25">
					<h2 class="repost-head">Build your collection</h2>
				</div>
				<p class="repost-text">Create playlists or shopping lists for all of the albums, videos & products you discover</p>
			</div>

			<div class="repost-img">
				<img src="../../assets/music-drop.gif" width="100%"/>
			</div>

			</div>

			<div class="repost-banner-close" @click="closeBanner()">
				<img src="../../assets/cross.svg" width="15px">
			</div>
		</div>
		<div class="playlists">
			<div class="title dflex align-center _intro">
				<div>{{ playlistLen() }} Playlists</div>
				<div class="_action">View All</div>
			</div>

			<div class="dflex playlist-container">
				<div
					v-for="(playlist, index) in this.playlists"
					:key="index"
					class="playlist-holder"
					@click="$router.push({path: `/playlist/${playlist.id}` })"
				>
					<div class="playlist-box">
						<div class="playlist-images">
							<ul>
								<li v-for="(playlistImage, index) in playlistImageList(playlist)">
									<img
										:src="playlistImage"
										width="30"
										alt="playlist icon"
									/>
								</li>
							</ul>
						</div>
						<div class="playlist-text">
						 {{ playlist.name }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="playlist-container">
			<div class="playlist-holder">
				<div class="playlist-box">
					<div class="playlist-images with-button" @click="(addToPlaylistActive = true)">
						<v-btn></v-btn>
					</div>
					<div class="playlist-text">
						New Playlist
					</div>
				</div>
			</div>
		</div>

    <div class="music playlist-music">
			<div class="title dflex align-center justify-space-between _intro">
        <div class="_top mb-3">{{ streams.length }} {{ "video" | pluralize(streams.length) }}</div>

        <div v-if="selectVideosMode" class="selectAlbumsMode _action">
          <v-btn round dark depressed @click="openAddToPlaylist()"> Add selected to... </v-btn>
          <span @click="toggleSelectVideosMode(false)"> Cancel </span>
        </div>
        <div v-else class="dflex align-center">
        
          <input class="input-track" type="text" placeholder="Select videos">

          <v-btn
            round
            dark
            depressed
            class="dflex align-center _action pointer-cursor font-bold"
            @click="toggleSelectVideosMode(true)"
          >
            <v-icon>add</v-icon>
            <span>Select Videos</span>
          </v-btn>
        </div>
      </div>

      <div class="list-track-view list-track-view-trackCard list-track-view-video listings">
        <div v-for="(video, index) in tempVideo" :key="index" class="list-track-view-item listing cursor-none">
          <video-box
            :hoverOverlay="false"
            :item="video"
            showUsername
            :hideUser="false"
            :sideTabView=true
          />

          <div v-if="selectVideosMode" class="selectMusic">
            <input
              v-model="selectedVideos"
              :value="video"
              type="checkbox"
              class="selectMusic-check"
              :id="`check-${index}`"
            />
            <v-icon
              v-if="selectedVideos.includes(video)"
              class="check-icon"
              @click="removeVideo(video.id)"
            >
              check
            </v-icon>
          </div>

        </div>
      </div>
    </div>
    <add-to-playlist v-if="addToPlaylistActive" :playlists="this.playlists" :addToPlaylist="addToPlaylistActive" :selectedItems="this.selectedVideos" type="stream" @closeAddToPlaylist="closeAddToPlaylist" @methodThatForcesUpdate="methodThatForcesUpdate" />
  </div>
</template>

<script>
import VideoBox from "@/components/video_box";
import addToPlaylist from "@/views/Playlists/addToPlaylist";

export default {
  components: {
    VideoBox,
    addToPlaylist,
  },
  props: {
		streams: Array,
		playlists: Array,
	},

  data() {
    return {
      showBanner: true,
      addToPlaylistActive: false,
      selectedVideos: [],
      selectVideosMode: false,
    };
  },
  methods: {
    methodThatForcesUpdate() {
      this.$emit("methodThatForcesUpdate");
    },
    playlistImageList(playlist) {
			let playlistImages = []
			const playlistDetails = playlist.playlist_details
			for(let i = 0; i < playlistDetails.length; i++) {
				playlistImages.push(playlistDetails[i].cover.url)
			}
			if(playlistImages.length < 4) {
				while(playlistImages.length != 4) {
					console.log(playlistImages.length)
					playlistImages.push(require('@/assets/playlist-grey.svg'))
				}
			}
			return playlistImages;
		},

    toggleSelectVideosMode(status) {
			this.selectVideosMode = status
			if (!status) {
				this.selectedVideos = []
			}
		},
    removeVideo(id) {
    	this.selectedVideos = this.selectedVideos.filter(video => video.id !== id)
		},

    closeBanner(){
			this.showBanner = false;
		},

    openAddToPlaylist() {
			if (this.selectedVideos.length) {
				this.addToPlaylistActive = true
			}
		},
    closeAddToPlaylist(isPartial) {
			if (!isPartial) {
				this.toggleSelectVideosMode()
			}
			this.addToPlaylistActive = false
		},

    playlistLen() {
			return this.playlists.length;;
		},
  },
  computed: {

    tempVideo() {
      let streams = []
      for (let i = 0; i < this.streams.length; i++) {
        let stream = this.streams[i]
        let user = stream.user

        streams.push({
          id: stream.id,
          name: stream.name,
          slug: stream.slug,
          description: stream.description,
          cover: {
            url: stream.cover.url,
            large: { url: stream.cover.large.url },
            thumb: { url: stream.cover.thumb.url },
          },
          video_type: stream.video_type,
          status: stream.status,
          started_at: stream.started_at,
          stopped_at: stream.stopped_at,
          mp_channel_1_ep_1_url: stream.mp_channel_1_ep_1_url,
          mp_channel_2_url: stream.mp_channel_2_url,
          duration: stream.duration,
          valid_period: stream.valid_period,
          remaining_seconds: stream.remaining_seconds,
          assoc_type: stream.assoc_type,
          account_ids: stream.account_ids,
          digital_content_name: stream.digital_content_name,
          view_price: stream.view_price,
          viewers_limit: stream.viewers_limit,
          notified: true,
          assoc: null,
          guests: [],
          is_reposted: stream.is_reposted,
          broadcast_seconds: 0,
          digital_content_url: null,
          accounts: [],
          user: user,
          genre: stream.genre,
        })
      }

      return streams;
    }
  },
};
</script>

<style src="../../../static/styles/repost.scss" lang="scss" scoped></style>
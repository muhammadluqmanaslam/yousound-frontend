<template>
	<div class="repost-comp repost-music">

		<div v-if="showBanner"  class="repost-banner">
			<div class="dflex gap-25 align-center justify-space-between">
				<div class="repost-content">

				<div class="dflex mb-4">
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
		</div>

		<div class="music playlist-music">
			<div class="title _intro">{{ this.tracks.length }} Tracks</div>
			<div class="title dflex align-center justify-space-between _intro">
				<div class="dflex align-center">
					<div>
						<img src="../../assets/genre_filter.svg" width="25">
					</div>

					<div class="tags-container ml-3">
						<div class="tags-main">
							All <span>X</span>
						</div>
					</div>
				</div>

				<div v-if="selectAlbumsMode" class="selectAlbumsMode _action">
					<v-btn round dark depressed @click="openAddToPlaylist()"> Add selected to... </v-btn>
					<span @click="toggleSelectAlbumsMode(false)"> Cancel </span>
				</div>
				<div v-else class="dflex align-center">
					
					<input class="input-track" type="text" placeholder="Select tracks">

					<v-btn
            round
            dark
            depressed
				    class="dflex align-center _action pointer-cursor font-bold"
					  @click="toggleSelectAlbumsMode(true)"
					>
            <v-icon>add</v-icon>
            <span>Select tracks</span>
          </v-btn>
			  </div>
			</div>

			<div class="_body list-track-view list-track-view-trackCard">
				<div
					v-for="(track, index) in this.tracks"
					:key="index"
					class="list-track-view-item"
				>
					<track-card
						:objects="tempAlbum"
						:objectIndex="index"
						hideMoreMenu
						hideTrackLength
						forCollection
						meatBall
						displayDuration
					/>

					<div v-if="selectAlbumsMode" class="selectMusic">
						<input
							v-model="selectedAlbums"
							:value="track"
							type="checkbox"
							class="selectMusic-check"
							:id="`check-${index}`"
						/>
						<v-icon
							v-if="selectedAlbums.includes(track)"
							class="check-icon"
							@click="removeAlbum(index)"
						>
							check
						</v-icon>
					</div>
				</div>
			</div>
		</div>

		<add-to-playlist v-if="addToPlaylistActive" :playlists="this.playlists" :addToPlaylist="addToPlaylistActive" :selectedItems="selectedAlbums" type="track" @closeAddToPlaylist="closeAddToPlaylist" @methodThatForcesUpdate="methodThatForcesUpdate"/>
	</div>
</template>

<script>
import trackCard from "@/components/trackcard";
import addToPlaylist from "@/views/Playlists/addToPlaylist";


export default {
	components: {
		trackCard,
		addToPlaylist,
	},
	props: {
		tracks: Array,
		playlists: Array,
	},
	data() {
		return {
			showBanner: true,
			selectAlbumsMode: false,
			addToPlaylistActive: false,
			// playlists: [
			// 	{
			// 		title: "Workout",
			// 		cover: "",
			// 		tracks: 6,
			// 		status: "private",
			// 	},
			// ],
			// playlist: [],
			selectedAlbums: [],
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
		toggleSelectAlbumsMode(status) {
			this.selectAlbumsMode = status
			if (!status) {
				this.selectedAlbums = []
			}
		},

		closeBanner(){
			this.showBanner = false;
		},
		openAddToPlaylist() {
			if (this.selectedAlbums.length) {
				this.addToPlaylistActive = true
			}
		},
		closeAddToPlaylist(isPartial) {
			if (!isPartial) {
				this.toggleSelectAlbumsMode()
			}
			this.addToPlaylistActive = false

			// window.location.reload();
		},
		removeAlbum(index) {
			const idx = this.selectedAlbums.indexOf(index);
			this.selectedAlbums.splice(idx, 1);
		},

    playlistLen() {
			return this.playlists.length;;
		},
	},
	computed: {
		tempAlbum() {
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

	created() {
		console.log("=================", this.tracks)
	}
};
</script>

<style src="../../../static/styles/repost.scss" lang="scss" scoped></style>

<template>
	<div class="" :style="{'pointer-events':  currentUser.free_trial_time <= 0 && !this.isSubscribed ? 'none' : ''}">
		<discover-nav 
		pageName="video"

		:class="show_nav ? 'navVisible': 'navHide'"
		/>
		<div class="video-container-main"
		@mouseenter="show_video_overlay = true; show_nav = true"
		@mouseleave="hideOverlay(); show_nav = false"
		>
		<video
			ref="myVideoPlayer"
			id="myVideoPlayer"
			class="video-js vjs-default-skin vjs-fluid"
			:class="{onMobile}"
			:playsinline="onMobile"
			:disabled="true"
			control
		></video>

		<div class="video-overlay" v-if="firstTimePlay" :class="show_video_overlay ?'visibleOverlay' :'hideOverlay'">
			<div class="vo-content"> 
				<h2 class="vo-heading">{{ video.name }}</h2>
				<div class="vo-following-main">

					<div class="dflex align-center gap-10">
						<div class="profile-img" :style="{'background-image': 'url(' + video.user.avatar.url + ')',}"></div>
						<div class="profile-text">{{ video.user.username }}</div>
					</div>

					<div class="following-btns">
						<user-follow-btn
							v-if="video.user.id !== currentUser.id"
							:user="video.user"
							type="default"
							borderRadius
						/>
						<v-btn class="icon-button" @click="addToCollection()">
							<img src="../../../assets/plus.svg" width="18">
						</v-btn>
						<v-btn class="icon-button" @click="openShareModal()">
							<img src="../../../assets/respond-arrow 2.svg" width="18" class="invert">
						</v-btn>
						<v-btn class="icon-button" @click="showLoveDialog()">
							<img src="../../../assets/dollar-sign.svg" width="18">
						</v-btn>
						<v-btn class="icon-button">
							<img src="../../../assets/line-chart.svg" width="18">
						</v-btn>
					</div>

				</div>

			</div>

			<div class="project-icon">
				<img src="../../../assets/project.svg" width="25">
			</div>

			<div class="ad-show" v-if="assoc.assoc_type !== null">
				<div class="ad-show-img"><img :src="assoc.itemPic" width="100%"></div>

				<div class="ad-show-content">
					<div class="dflex align-center gap-10">
						<div class="profile-img" :style="{'background-image': 'url(' + assoc.userImageUrl + ')',}"></div>
						<div class="profile-text">{{ assoc.username }}</div>
					</div>

					<div class="ad-info my-3">
						<div class="category">{{ assoc.category }}</div>
						<div class="name my-1">{{ assoc.name }}</div>
						<div class="price" v-if="assoc.assoc_type === 'ShopProduct'">${{ assoc.price }}</div>
					</div>

					<div class="ad-option" v-if="assoc.assoc_type === 'ShopProduct'">
						<v-select
							v-model="option"
							:items="options()"
							item-text="name"
							item-value="id"
							placeholder="Option"
						></v-select>
						<v-btn
							v-if="assoc.assoc_type === 'ShopProduct'"
							class="ad-btn"
							block
							@click="assoc.stock > 0 ? addToCart() : ''"
						>
							<span v-if="assoc.stock > 0">Add to cart</span>
							<span v-else>Out of Stock</span>
						</v-btn>
					</div>

				</div>

				<div>

				</div>
			</div>

			<div class="ad-d-bar" v-if="assoc.assoc_type !== null">
				<img :src="assoc.itemPic" width="100%">
			</div>
		</div>

		<div class="ad-show" v-if="displayListingProduct && assoc.assoc_type !== null">
			<div class="ad-show-img"><img :src="assoc.itemPic" width="100%"></div>

			<div class="ad-show-content">
				<div class="dflex align-center gap-10">
					<div class="profile-img" :style="{'background-image': 'url(' + assoc.userImageUrl + ')',}"></div>
					<div class="profile-text">{{ assoc.username }}</div>
				</div>

				<div class="ad-info my-3">
					<div class="category">{{ assoc.category }}</div>
					<div class="name my-1">{{ assoc.name }}</div>
					<div class="price" v-if="assoc.assoc_type === 'ShopProduct'">${{ assoc.price }}</div>
				</div>
				<div class="ad-option ad-d-btn mt-2" v-if="assoc.assoc_type === 'ShopProduct'">
					<v-select
						v-model="option"
						:items="options()"
						item-text="name"
						item-value="id"
						placeholder="Option"
					></v-select>
					<v-btn
						v-if="assoc.assoc_type === 'ShopProduct'"
						class="ad-btn"
						block
						@click="assoc.stock > 0 ? addToCart() : ''"
					>
						<span v-if="assoc.stock > 0">Add to cart</span>
						<span v-else>Out of Stock</span>
					</v-btn>
				</div>
			</div>

			<div>

			</div>
		</div>

	</div>
		<li v-if="currentUser && currentUser.creator_verified && video.user.stripe_connected && video.user.creator_verified && video.user.id !== currentUser.id">
			<send-love-modal
				v-if="showSendLoveModal"
				:item="video.user"
				:dismiss="dismissLoveDialog"
			/>
		</li>
		<li>
			<share-modal
				v-if="showShareModal"
				:item="video"
				type="Stream"
				:dismiss="dismissShareDialog"
			></share-modal>
		</li>
		<v-dialog v-model="showListeningMessage">
			<v-card>
				<v-card-title class="headline"
					>Still Listening</v-card-title
				>
				<v-card-text
					>Are you still Listening?</v-card-text
				>
				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn
						class="blue--text darken-1"
						flat="flat"
						@click.native="hideListeningMessage"
						>Cancel</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<div v-if="this.user">
			<v-dialog v-model="show_modalCard1" content-class="dialog-w_auto dialog-no_shadow">
				<div class="modal-card">
					<div>
						<img src="../../../assets/nav_logo_white.png" width="135px">
							</div>
							<div class="modal-card-img">
								<div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}">
								</div>
						</div>
						<div class="text-center user-box">
							<p>Sign up to experience</p>
							<div class="user-div">
								<p class="user-text"> {{ this.user.username }}</p>
								<img src="../../../assets/check-white.svg" width="15px">
						</div>
					</div>

					<div class="button-wrapper">
						<router-link to="/signup">
							<button class="modal-button">
								Create account
							</button>
						</router-link>
					</div>

				</div>
			</v-dialog>

			<!-- Show MOdal 2 -->

			<v-dialog v-model="show_modalCard2" content-class="dialog-w_auto dialog-no_shadow">
				<div class="modal-card">
					<div>
						<img src="../../../assets/nav_logo_white.png" width="135px">
							</div>
							<div class="modal-card-img">
								<div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}"></div>

							</div>
						<div class="text-center user-box">
							<p>Sign up to experience</p>
							<div class="user-div">
								<p class="user-text"> {{ this.user.username }}</p>
								<img src="../../../assets/check-white.svg" width="15px">
						</div>
					</div>

					<div class="text-center font-inter">
						<p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
					</div>

					<div class="button-wrapper">
						<router-link to="/settings">
							<button class="modal-button">
								Start 30 day free trial
							</button>
						</router-link>
					</div>

				</div>
			</v-dialog>

			<!-- Show MOdal 3 -->

			<v-dialog v-model="show_modalCard3" content-class="dialog-w_50 dialog-no_shadow">
				<div class="modal-card-main">
					<div class="modal-card-split">
						<div>
							<img src="../../../assets/nav_logo_white.png" width="135px">
								</div>
								<div class="modal-card-img">
								<div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}"></div>
							</div>
							<div class="user-box">
								<p>Sign up to experience</p>
								<div class="user-div">
									<p class="user-text">{{ this.user.username }}</p>
									<img src="../../../assets/check-white.svg" width="15px">
							</div>
						</div>

						<!-- <div class="text-center">
							<p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
						</div> -->

						<div class="button-wrapper">
							<router-link to="/signup">
								<button class="modal-button">
									Create account
								</button>
							</router-link>
						</div>

					</div>

					<div class="modal-card-title-img" :style="`background-image: url(${videoLoading})`">
						<video playsinline autoplay loop id="bgvid">
							<source v-if="spotlightVideoSource" :src="`https://stream.mux.com/${spotlightVideoSource}/low.mp4`"  type="video/mp4">
						</video>
						<div class="volume-button">
							<img src="../../../assets/mute-icon.svg" width="17px">
						</div>

					</div>
				</div>
			</v-dialog>

			<!-- Show MOdal 4 -->

			<v-dialog v-model="show_modalCard4" content-class="dialog-w_50 dialog-no_shadow">
				<div class="modal-card-main">
					<div class="modal-card-split">
						<div>
							<img src="../../../assets/nav_logo_white.png" width="135px">
								</div>
								<div class="modal-card-img">
								<div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url +')',}"></div>
							</div>
							<div class="user-box">
								<p>Sign up to experience</p>
								<div class="user-div">
									<p class="user-text">{{ this.user.username }}</p>
									<img src="../../../assets/check-white.svg" width="15px">
							</div>
						</div>

						<div class="font-inter">
							<p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
						</div>

						<div class="button-wrapper" >
							<router-link to="/settings">
								<button class="modal-button">
									Start 30 day free trial
								</button>
							</router-link>
						</div>
					</div>

					<div class="modal-card-title-img" :style="`background-image: url(${videoLoading})`">
						<video playsinline autoplay loop id="bgvid">
							<source v-if="spotlightVideoSource" :src="`https://stream.mux.com/${spotlightVideoSource}/low.mp4`" type="video/mp4">
						</video>
						<button class="volume-button">
							<img src="../../../assets/mute-icon.svg" width="17px">
						</button>

					</div>
				</div>
			</v-dialog>
		</div>
	</div>
</template>

<script>
import { MyEvents } from '@/helper'
import UserService from '@/services/user'
import AuthService from '@/services/auth'
import TrackingService from '@/services/tracking'
import StreamService from '@/services/stream'
import discoverNav from '@/components/discoverNav'
import ItemService from '@/services/item'
import sendLoveModal from '@/components/sendlovemodal'
import UserFollowBtn from "@/components/userFollowBtn";
import CollectionService from '@/services/collection'
import shareModal from "@/components/sharemodal";

export default {
	props: {
		// video: Object,
		src: {
			type: String,
		},
	},
	components: {
		discoverNav,
		sendLoveModal,
		UserFollowBtn,
		shareModal,
	},

	data() {
		return {
			player: null,
			pipMode: false,
			videoId: null,
			show_video_overlay: false,
			show_nav: false,
			firstTimePlay: false,
			remainingTimerCalculator: null,
			remainingTime: 0,
			stillListeningTimer: null,
			showListeningMessage: false,
			isSubscribed: false,
			endPlayTime: 0,
			totalPlayTime: 0,
			seekTime1: 0,
			seekTime2: 0,
			bgDemoImg: require('../../../assets/tile-1.jpeg'),
			videoLoading: require('../../../assets/loading.gif'),
			show_modalCard1: false,
			show_modalCard2: false,
			show_modalCard3: false,
			show_modalCard4: false,
			spotlightVideoSource: null,
			user: null,
			displayListingProduct: false,
			video: null,
			assoc: {
				username: null,
				userImageUrl: null,
				itemPic: null,
				category: null,
				price: null,
				name: null,
				assoc_type: null,
				variants: null,
				stock: 0
			},
			option: '',
			showSendLoveModal: false,
			showShareModal: false,
			buttonHover: false,
		}
	},

	async mounted() {
		await this.fetchSubscriptionDetails();
		await this.getUserDetailFromStream();
		this.videoId = this.$route.params.videoId

		console.log('video_player created adfasdfsdfsdf')
		this.$nextTick(() => {
			if (!this.pipMode && this.allVideosCount < 1) {
				console.log('init player');

				console.log(this.allVideos);
				// no player in DOM, init a new player
				this.initPlayer()
				let vm = this
				vm.player.exitPictureInPicture()
			} else {
				const nodeDetails2 = this.$store.state.streamPlayer.nodeDetails
				console.log('nodeDetails :', nodeDetails2);

				console.log('player already init');
				console.log(this.$store.state.streamPlayer.nodeDetails);

				console.log(this.allVideos);
				// there is a player in DOM, update original div wrapper
				// this is a fix for the DOM dissapearing when video page is re-visited
				let nodeDetails = this.$store.state.streamPlayer.nodeDetails
				let glitchedVid = document.getElementById('myVideoPlayer')

				console.log('nodeDetails', nodeDetails);
				console.log('glitchedVid', glitchedVid);

				console.log('replace');

				glitchedVid.replaceWith(nodeDetails.parent)
			}
		})
	},
	created() {
	  this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus)
	},

	beforeDestroy() {
	  this.$root.$off(MyEvents.USER_FOLLOW, this.setFollowingStatus)

		try {
			const vm = this
			if (vm.player && !vm.player.paused()) {
				// player is playing, toggle pipmode
				this.togglePip()
			} else {
				// player is not playing, close player
				this.closePlayer()
			}
		} catch (error) {
			return error
		}
	},

	watch: {
		src: function (newVal, oldVal) {
			console.log('video_player watchingjjkjkjk   jkjkjk ')
			console.log(newVal, oldVal)
			console.log("this.src--->", this.src)
			this.player.src([
				{
					type: 'application/x-mpegURL',
					src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
				},
			])
		},
	},
	methods: {
		setFollowingStatus(userId, isFollowing) {
      if (this.video.user && this.video.user.id === userId) {
        this.video.user.is_following = isFollowing
      }
    },

		openShareModal() {
      this.showShareModal = true;
    },

		dismissShareDialog() {
      this.showShareModal = false;
    },

		addToCollection() {
      let params = { stream_id: this.video.id }
      CollectionService.createCollection(params)
      .then((response) => {
        this.$store.dispatch('error/showSuccessToast', [
          'You just added ' + this.video.name + ' stream in your collection.',
        ])
      })
      .catch((e) => {
        this.$store.dispatch(
          'error/showErrorToast',
          e.body.errors || [e.body] || [e.body.error]
        )
      })
    },

		showLoveDialog() {
			if (this.currentUser.creator_verified && this.video.user.stripe_connected && this.video.user.creator_verified) {
				if (this.video.user.id !== this.currentUser.id) {
					this.showSendLoveModal = true
				} else {
					this.$store.dispatch('error/showErrorToast',
						['You cannot donate to your own.']
					)
				}
			} else {
				this.$store.dispatch('error/showErrorToast',
          ['Both creator and listeners must be verified and there stripes must be connected for donation.']
        )
			}
		},

		dismissLoveDialog() {
			this.showSendLoveModal = false
		},

		addToCart() {
      if (this.option === '' || this.option === null) {
        this.$store.dispatch('error/showErrorToast', [
          'Please select valid variant.',
        ])
      } else {
        const params = {
          product_variant_id: this.option,
          quantity: 1
        }

        ItemService.addToCart(params)
          .then((response) => {
            if (response.body.errors) {
              this.$store.dispatch('error/showErrorToast', response.body.errors)
            } else {
              this.$store.dispatch('error/showSuccessToast', [
                'Added successfully to Cart.',
              ])
            }
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },

		fetchSpotlightVideo() {
			StreamService.getSpotlightStream(this.user.id)
				.then((response) => {
					console.log("response", response)
					this.spotlightVideoSource = response.body.mp_channel_1_ep_1_id
					if (this.currentUser == null) {
						this.show_modalCard3 = true
					} else {
						this.show_modalCard4 = true
					}
				})
				.catch((e) => {
					if (this.currentUser == null) {
						this.show_modalCard1 = true
					} else {
						this.show_modalCard2 = true
					}
				})
		},
		hideOverlay(){
			console.log( 'Hide Overlay' );
			this.show_video_overlay = false;
			// this.show_video_overlay = false
			// setTimeout(() => {
				
			// }
			//   , 100
			// )
		},
		initPlayer() {
			if (this.currentUser.free_trial_time <= 0 && !this.isSubscribed) {
				this.fetchSpotlightVideo()
			}
			const vm = this
			console.log("this.src--->", this.src)
			vm.player =
				vm.player || window.videojs('myVideoPlayer', {
					autoplay: false,
					controls: true,
					sources: [
						{
							type: 'application/x-mpegURL',
							src: this.src,
						},
					],
				})
			this.pauseMusicOnPlay();
			console.log("=====stripe_subscription_id=====", this.currentUser.stripe_subscription_id)
			if (this.currentUser.stripe_subscription_id === undefined || this.currentUser.stripe_subscription_id === null) {
				var options = {
					id: "myVideoPlayer",
				};
				vm.player.ima(options);
				vm.player.ima.initializeAdDisplayContainer();
				vm.player.ima.setContentWithAdTag(null, "https://servedbyadbutler.com/vast.spark?setID=14941&ID=182673&pid=141490", false);
				vm.player.ima.requestAds();
				// register method
			}
		},

		closePlayer() {
			const vm = this
			vm.updateUserInfo();
			if (vm.player) {
				vm.player.dispose()
				vm.player = null

				// reset store
				this.$store.dispatch('streamPlayer/setPipParentNode', {})
			}
		},

		pauseMusicOnPlay() {
			const vm = this

			vm.player.on('ended', function() {
				this.show_video_overlay= true;
				if (vm.totalPlayTime === 0) {
					vm.totalPlayTime = vm.player.currentTime()
				} else {
					vm.totalPlayTime = vm.totalPlayTime + Math.floor(vm.player.duration() - vm.endPlayTime)
				}
				if (vm.totalPlayTime >= 30 && vm.isSubscribed) {
					let params = { stream_id: vm.videoId, duration: Math.floor(vm.totalPlayTime) }

					TrackingService.createPlayRecord(params)
					.then((response) => {
						console.log(response)
					})
					.catch((e) => {
						console.log("error in updating record")
					})
				}
				vm.totalPlayTime = 0;
				vm.seekTime1 = 0;
				vm.seekTime2 = 0;
				vm.endPlayTime = 0
			});

			vm.player.on('play', () => {
				this.show_video_overlay= false;
				vm.remainingTime = 0
				this.firstTimePlay = true
				clearTimeout(vm.stillListeningTimer);
				clearInterval(vm.remainingTimerCalculator);
				vm.stillListeningTimer = setTimeout(vm.stillPlaying, 3600000)
				vm.remainingTimerCalculator = setInterval(vm.timeCounter, 1000)
				vm.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
			})

			vm.player.on('pause', () => {
				vm.updateUserInfo();
				vm.remainingTime = 0
				clearTimeout(vm.stillListeningTimer);
				clearInterval(vm.remainingTimerCalculator);
				if (vm.totalPlayTime === 0) {
					vm.totalPlayTime = vm.totalPlayTime + Math.floor(vm.seekTime1);
				} else {
					vm.totalPlayTime = vm.totalPlayTime + Math.floor(vm.seekTime1 - vm.endPlayTime)
				}
				vm.endPlayTime = vm.seekTime2
				console.log("================ playing time ", vm.totalPlayTime)
			})

			vm.player.on('mouseenter', function(event) {
				vm.player.inactivityTimeout = 0
				vm.player.userActive(true)

				console.log("Mouse Enter", new Date());
				var vim = document.querySelector('.video-js').classList.remove('vjs-user-inactive')
				var vim = document.querySelector('.video-js').classList.remove('vjs-user-active')
				vm.displayListingProduct = false
			});

			vm.player.on('mouseleave', function(event) {
				vm.player.inactivityTimeout = 0
				vm.player.userActive(false)
				vm.displayListingProduct = false
				console.log("Mouse Leave", new Date());
				var vim = document.querySelector('.video-js').classList.add('vjs-user-inactive')
				var vim = document.querySelector('.video-js').classList.add('vjs-user-active')
			
			});

			vm.player.on('timeupdate', function() {
				vm.seekTime1 = vm.seekTime2;
				vm.seekTime2 = vm.player.currentTime();
				if (vm.video.show_attachment_at !== null && vm.player.currentTime() >= vm.video.show_attachment_at && vm.player.currentTime() <= vm.video.show_attachment_at + 5) {
					vm.displayListingProduct = true
				} else {
					vm.displayListingProduct = false
				}
			});
		},

		timeCounter() {
			if (this.currentUser.free_trial_time <= this.remainingTime && !this.isSubscribed) {
				this.player.pause();
				this.updateUserInfo();
				this.fetchSpotlightVideo()
			} else {
				this.remainingTime = this.remainingTime + 1;
			}
		},

		stillPlaying(){
			this.player.pause();
			this.showListeningMessage = true
		},

		hideListeningMessage() {
			this.showListeningMessage = false;
		},

		updateUserInfo() {
			const params = {
				user: { free_trial_time: this.remainingTime },
			}
			if (this.remainingTime > 0) {
				UserService.updateUserInfo(this.currentUser.id, params)
				.then((response) => {
					AuthService.setUser(response.body)
				})
				.catch((e) => {
					console.log(e)

					this.$store.dispatch(
						'error/showErrorToast', ["There was an error on updating user info "]
					)
				})
			}
			clearTimeout(this.stillListeningTimer);
			clearInterval(this.remainingTimerCalculator);
			this.remainingTime = 0
		},

		async fetchSubscriptionDetails() {
			await UserService.getSubscriptionDetail(this.currentUser.id)
			.then((response) => {
				if (response.bodyText === "Subscribed") {
					this.isSubscribed = true
				}
			})
			.catch((e) => {
				this.$store.dispatch(
					'error/showErrorToast', ["There was an error on fetching user info "]
				)
			})
		},

		async togglePip() {
			const vm = this
			console.log('activate pip')
			vm.pipMode = true

			// ontoggle, set pipMode status in store
			vm.$store.dispatch('streamPlayer/setPipPipMode', true)
			await vm.player.requestPictureInPicture()

			// resume player play
			// fix for sudden pause of pip on activation
			vm.player.play()
		},

		async getUserDetailFromStream() {
			const stream_id = this.$route.params.videoId
			await StreamService.getStream(stream_id)
				.then((response) => {
					this.video = response.body
					this.user = response.body.user
					const associatedItem = response.body.assoc;
					if (associatedItem !== null) {
						if (response.body.assoc_type === 'ShopProduct') {
							this.assoc.assoc_type = 'ShopProduct'
							this.assoc.username = associatedItem.merchant.username
							this.assoc.category = associatedItem.category.name
							this.assoc.name = associatedItem.name
							this.assoc.userImageUrl = associatedItem.merchant.avatar.url
							this.assoc.itemPic = associatedItem.covers[0].cover.url
							this.assoc.price = associatedItem.price
							this.assoc.variants = associatedItem.variants
							this.assoc.stock = associatedItem.stock
						} else if (response.body.assoc_type === 'Album') {
							this.assoc.assoc_type = 'Album'
							this.assoc.username = associatedItem.user.username
							this.assoc.category = associatedItem.album_type
							this.assoc.userImageUrl = associatedItem.user.avatar.url
							this.assoc.name = associatedItem.name
							this.assoc.itemPic = associatedItem.cover.url
							this.assoc.price = associatedItem.price
						}
					}
				})
				.catch((e) => {
					console.log(e)
				})
		},

		options() {
			var options = [];
			// const defaultOption = {
			//   id: '',
			//   name: '-----'
			// }
			// options.push(defaultOption)
			for (let index in this.assoc.variants) {
				const variant = this.assoc.variants[index];
				if (this.isDigitalProduct || variant.quantity > 0) {
					const option = {
						id: variant.id,
						name: variant.name,
					};
					options.push(option);
				}
			}

			return options;
		},
	},

	computed: {
	 	followButtonText() {
      if (this.video.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },

		allVideos() {
			// eslint-disable-next-line no-undef
			return videojs.getAllPlayers()
		},
		allVideosCount() {
			return this.allVideos.length
		},
		onMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
		currentUser() {
			return this.$store.state.auth.user
		},
		mergedAttachmentItems() {
      const combined = [...this.albums, ...this.products]
      console.log('combined: ', combined);
      return combined
    },
	},
}
</script>

<style src="./video-player.scss"></style>
<style lang="scss">
	.ad-btn{
		width: 100%;
		margin: 0;
		box-shadow: none;
		background: #1D5EDD !important;
		border-radius: 4px;
		font-size: 14px;
		font-weight: 600;
		color: white;
		height: 35px;
	}
	.ad-show{
		color: white;
		background: #1d1d1d;
		border-radius: 10px;
		position: absolute;
		top: 5%;
		right: 5%;
		max-width: 250px;
		z-index: 25;

		.ad-show-img{
			img{
				border-radius: 4px;
			}
		}

		.ad-show-content{
			padding: 15px;

			.gap-10{
				gap: 10px;
			}

			.profile-img{
				width: 33px;
				height: 33px;
				min-width: 33px;
				max-width: 33px;
				border-radius: 50%;
				background-size: cover;
				background-color: aquamarine;
			}

			.profile-text{
				font-size: 16px;
				font-weight: bold;
			}

			.ad-info{
				.category{
					font-size: 12px;
					font-family: 'Inter', sans-serif;
					font-weight: bold;
					color: rgba($color: #fff, $alpha: 0.5);
					text-transform: uppercase;
				}
				.name{
					font-size: 18px;
					font-family: 'Inter', sans-serif;
					font-weight: bold;
					color: white;
				}
				.price{
					font-size: 16px;
					font-family: 'Inter', sans-serif;
					font-weight: bold;
					color: white;
				}
			}

			.ad-option{
				.input-group__input{
					background-color: transparent !important;
					border: 1px solid rgba($color: #fff, $alpha: 0.1);
					border-radius: 5px;
					width: 100%;
					font-weight: 500;
					font-size: 14px;
					color: white;
					height: 35px;
					padding: 0 10px;



					background-image:
				linear-gradient(45deg, transparent 50%, white 50%),
				linear-gradient(135deg, white 50%, transparent 50%);
			background-position:
				calc(100% - 20px) calc(1em + 2px),
				calc(100% - 15px) calc(1em + 2px),
				calc(100% - 2.5em) 0.5em;
			background-size:
				5px 5px,
				5px 5px,
				1px 1.5em;
			background-repeat: no-repeat;

			.input-group__selections{
				input{
					background-color: transparent !important;

					&::placeholder{
						color: rgba(255, 255, 255, 0.5) !important;
					}
				}
			}

				.input-group__selections__comma{
					color: white !important;
				}

				i{
					display: none !important;
				}

			option{
				color: black !important;
			}
				}
			}

			.ad-d-btn{
				.ad-btn{
					width: 100%;
					margin: 0;
					box-shadow: none;
					background: #1D5EDD;
					border-radius: 4px;
					font-size: 14px;
					font-weight: 600;
					color: white;
					height: 35px;
				}
			}
	
		}
	}
.navVisible{
	display: block;
	visibility: visible;
	opacity: 1;

	// -webkit-transition: visibility 1s, opacity 1.5s;
	// -moz-transition: visibility 1s, opacity 1.5s;
	// -ms-transition: visibility 1s, opacity 1.5s;
	// -o-transition: visibility 1s, opacity 1.5s;
	// transition: visibility 1s, opacity 1.5s;

	// /* Wait a moment before fading out the control bar */
	// -webkit-transition-delay: 1s;
	// -moz-transition-delay: 1s;
	// -ms-transition-delay: 1s;
	// -o-transition-delay: 1s;
	// transition-delay: 1s;
}

.navHide{
	display: block;
	visibility: hidden;
	opacity: 0;

	-webkit-transition: visibility 1s, opacity 1.5s;
	-moz-transition: visibility 1s, opacity 1.5s;
	-ms-transition: visibility 1s, opacity 1.5s;
	-o-transition: visibility 1s, opacity 1.5s;
	transition: visibility 1s, opacity 1.5s;

	/* Wait a moment before fading out the control bar */
	-webkit-transition-delay: 1s;
	-moz-transition-delay: 1s;
	-ms-transition-delay: 1s;
	-o-transition-delay: 1s;
	transition-delay: 1s;
}

.hideOverlay{
	display: block;
	visibility: hidden;
	opacity: 0;

	-webkit-transition: visibility 1s, opacity 1.5s;
	-moz-transition: visibility 1s, opacity 1.5s;
	-ms-transition: visibility 1s, opacity 1.5s;
	-o-transition: visibility 1s, opacity 1.5s;
	transition: visibility 1s, opacity 1.5s;

	/* Wait a moment before fading out the control bar */
	-webkit-transition-delay: 0s;
	-moz-transition-delay: 0s;
	-ms-transition-delay: 0s;
	-o-transition-delay: 0s;
	transition-delay: 0s;
}
.video-js .vjs-big-play-button {
	top: 44% !important;
	left: 44% !important;
}
.video-container-main{
	position: relative;

	& + li {
		display: none;
		& + li {
			display: none;
			& + li {
				display: none;		
			}	
		}
	}
	
	.video-overlay{
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.61) 0%, #000000 89.58%);
		top: 0;
		left: 0;
		font-family: "Inter", sans-serif;
		color: white;

		.ad-d-bar{
			position: absolute;
			left: 47%;
			bottom: 105px;
			width: 50px;
			height: 50px;

			img{
				border-radius: 4px;
				object-fit: cover;
			}
		}
		.project-icon{
			z-index: 25;
			position: absolute;
			width: 90%;
			left: 4%;
			bottom: 105px;
			z-index: 25;
			height: auto;
			text-align: right;
			display: block;
			top: auto;
			padding-right: 0;
		}

		.ad-show{
			background: #1d1d1d;
			border-radius: 10px;
			position: absolute;
			top: 5%;
			right: 5%;
			max-width: 250px;
			z-index: 25;

			.ad-show-img{
				img{
					border-radius: 4px;
				}
			}

			.ad-show-content{
				padding: 15px;

				.gap-10{
					gap: 10px;
				}
	
				.profile-img{
					width: 33px;
					height: 33px;
					min-width: 33px;
					max-width: 33px;
					border-radius: 50%;
					background-size: cover;
					background-color: aquamarine;
				}
	
				.profile-text{
					font-size: 16px;
					font-weight: bold;
				}

				.ad-info{
					.category{
						font-size: 12px;
						font-family: 'Inter', sans-serif;
						font-weight: bold;
						color: rgba($color: #fff, $alpha: 0.5);
						text-transform: uppercase;
					}
					.name{
						font-size: 18px;
						font-family: 'Inter', sans-serif;
						font-weight: bold;
						color: white;
					}
					.price{
						font-size: 16px;
						font-family: 'Inter', sans-serif;
						font-weight: bold;
						color: white;
					}
				}

				.ad-option{
					.input-group__input{
						background-color: transparent !important;
						border: 1px solid rgba($color: #fff, $alpha: 0.1);
						border-radius: 5px;
						width: 100%;
						font-weight: 500;
						font-size: 14px;
						color: white;
						height: 35px;
						padding: 0 10px;



						background-image:
					linear-gradient(45deg, transparent 50%, white 50%),
					linear-gradient(135deg, white 50%, transparent 50%);
				background-position:
					calc(100% - 20px) calc(1em + 2px),
					calc(100% - 15px) calc(1em + 2px),
					calc(100% - 2.5em) 0.5em;
				background-size:
					5px 5px,
					5px 5px,
					1px 1.5em;
				background-repeat: no-repeat;

				.input-group__selections{
				input{
					background-color: transparent !important;

					&::placeholder{
						color: rgba(255, 255, 255, 0.5) !important;
					}
				}
			}

				.input-group__selections__comma{
					color: white !important;
				}

				i{
					display: none !important;
				}

				option{
					color: black !important;
				}
					}
				}
				

				.ad-d-btn{

				}
		
			}
		}

		.vo-content{
			

			max-width: 575px;
			position: absolute;
			left: 80px;
			bottom: 30%;

			.vo-heading{
				color: white;
				font-size: 42px;
				font-weight: 700;
			}
		}

		.vo-following-main{
			margin-top: 30px;
			display: flex;
			align-items: center;
			gap: 25px;

			.gap-10{
				gap: 10px;
			}

			.profile-img{
				width: 33px;
				height: 33px;
				min-width: 33px;
				max-width: 33px;
				border-radius: 50%;
				background-size: cover;
				background-color: aquamarine;
			}

			.profile-text{
				font-size: 16px;
				font-weight: bold;
			}

			.following-btns{
				display: flex;
				gap: 10px;

				.following-button{
					box-shadow: none;
					margin: 0;
					font-size: 14px;
					font-weight: 700;
					background: rgba($color: #181818, $alpha: 0.5) !important;
					border: 1px solid #fff;
					border-radius: 5px;
					color: white;
					height: 32px;
				}

				.follow-btn {
					border: 1px solid #959595 !important;
					margin-top: 0;
				}

				.icon-button{
					box-shadow: none;
					margin: 0;
					font-size: 14px;
					font-weight: 700;
					background: rgba($color: #181818, $alpha: 0.5) !important;
					border: 1px solid #000;
					border-radius: 5px;
					color: white;
					height: 32px;
					width: 32px !important;
					display: flex;
					justify-content: center;
					min-width: auto;

					.invert{
						filter: invert(1);
					}
				}
		}
	}
}
}
.video-js button {
	outline: none;
	box-shadow: none;
}
.ima-ad-container{
	left:0 !important;
	top:0 !important;
}
.video-js .vjs-big-play-button {
// position: relative;
}
.video-js.vjs-fluid {
	max-height: 572px;
	padding-top: 56.25%;
	video {
		max-height: 572px;
	}
}
.onMobile {
	.video-js button {
		border: 0;
		background-color: transparent;
	}
}
// .video-js::after {
//   content: "";
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   background: blue;
//   top: 0;
//   left: 0;
//   z-index: 0;
// }
// .video-js .vjs-big-play-button::after {
//   content: "";
//   position: absolute;
//   width: 100%;
//   height: 100%;
// }
</style>
<style src="../../../../static/styles/spotlight.scss" ></style>

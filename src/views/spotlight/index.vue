<template>
	<div v-if="onMobile">
		<div v-if="!videoUploaded">
			<BannerUpload
				MainHeading="Spotlight video"
				MainText="Upload a 15 second video clip to attract new followers when new potential subscribers preview your content"
				:Icon="iconImage"
				:MainImage="bannerImage"
			/>

			<drag-file-uploader
				accept="video/*"
				type="file"
				category="video"
				@filePicked="pickedFile"
				:autoUpload="true"
				ref="dragFileUploader"
			></drag-file-uploader>
		</div>

		<div v-else>
			<div class="spotlight-header dflex align-center justify-space-between">
				<div class="replace" @click="replaceVideo()">
					< Replace video
				</div>
				<div>
					<v-btn class="head-button" :loading="loading" @click="submit()">
						Save video
					</v-btn>
				</div>
			</div>

			<div class="main-flex">
				<div class="w-75">
					<h2 class="heading">Web Preview</h2>
					<div class="web-container">
						<div class="web-content">
							<div class="profile-image-section">
								<div class="profile-image">
									<img src="../../../static/images/nav_logo_white.png" width="140">
								</div>
							</div>
							<div class="_user-icon mb-4">
								<div class="user-icon-inner" :style="{ 'background-image': 'url(' + currentUser.avatar.url + ')' }">
								</div>
							</div>
							<div class="_info mb-4">
								<p>Subscribe to support</p>
								<div class="dflex align-center">
									<p class="font-bold mr-1"> {{ currentUser.username }}</p>
									<img src="../../assets/check_success.svg" width="12">
								</div>
							</div>
							<div class="_text mb-4">
								Get full access to all creators and their content. 50% of your subscription shared with creators that viewed the most.
							</div>
							<div class="_button">
								<v-btn rounded class="button-web">
									Subscribe
								</v-btn>
							</div>
						</div>
						<div class="web-video">
							<div class="modal-card-title-img">
								<video playsinline autoplay loop id="bgvid">
									<source :src="this.video.src" :type="this.videoFile[0].type">
								</video>
								<button class="volume-button">
									<img src="../../assets/mute-icon.svg" width="17px">
								</button>

								</div>
						</div>
					</div>
				</div>

				<div class="w-25">
					<h2 class="heading">Mobile Preview</h2>
					<div class="mob-container">
						<div class="mob-video">
							<div class="modal-card-title-img">
								<video playsinline autoplay muted loop id="bgvid" class="min-height">
									<source :src="this.video.src" :type="this.videoFile[0].type">
								</video>
								<!-- <button class="volume-button">
									<img src="../../assets/mute-icon.svg" width="17px">
								</button> -->
								</div>
						</div>
						<div class="mob-content">
							<div class="_info">
								<p>Subscribe to support</p>
								<div class="dflex align-center">
									<p class="font-bold mr-1"> {{ currentUser.username }}</p>
									<img src="../../assets/check_success.svg" width="12">
								</div>
							</div>
							<div class="_content">
								<div class="_logo mb-3">
									<img src="../../assets/ys_logo_primary-black.svg" width="70">
								</div>

								<div class="_text mb-3">
									Get full access to all creators and their content. 50% of your subscription shared with creators that viewed the most.
								</div>

								<div class="_button">
									<v-btn class="button-mob">
										Start 30 day free trial
									</v-btn>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import BannerUpload from '../BannerUpload'
import iconImage from '../../assets/flashlight-white.svg'
import mainImage from '../../assets/music-drop.gif'
import dragFileUploader from '@/components/dragFileUploader'
import VideoService from '@/services/video'
import * as UpChunk from '@mux/upchunk'

export default {
	components:{
		BannerUpload,
		dragFileUploader,
	},
	data(){
		return{
			iconImage: iconImage,
			bannerImage: mainImage,
			videoUploaded: false,
			videoFile: null,
			video: null,
			submitLoading: false,
			duration: null,
			isSpotlightVideoAvailable: false,
		}
	},

	computed: {
		currentUser() {
			return this.$store.state.auth.user
		},
		onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
	},
	methods: {

		async pickedFile(file) {
			const video = await this.validateDuration(file)
			if (video.duration > 20) {
				this.videoFile = null;
				this.$store.dispatch('error/showErrorToast', [
					`You can't upload video which is more than 20 seconds.`,
				])
			} else {
				this.videoUploaded = true
				this.videoFile = file
				this.duration = video.duration
			}
		},

		submit() {
			this.loading = true
			const stream = this.videoFile[0]
			this.submitLoading = true;
			const formData = new FormData()
			formData.append('stream[name]', stream.name)
			formData.append('stream[description]', "Spotlight Video")
			formData.append('stream[duration]', this.duration)
			formData.append('stream[spotlight_video]', true)

			this.$store.dispatch('error/showLoadingActivity', true)
			VideoService.createVideo(formData)
				.then((response) => {
					this.video = response.body
					const upload_url = this.video.upload_url

					const upload = UpChunk.createUpload({
						endpoint: upload_url,
						file: this.videoFile[0],
						chunkSize: 5120, // Uploads the file in ~5mb chunks
					})

					upload.on('error', (err) => {
						this.loading = false
						this.$store.dispatch('error/showLoadingActivity', false)
						console.error('💥', err.detail)
					})

					upload.on('progress', (progress) => {
						this.loading = false
						this.$store.commit(
							'error/setProgressBarValue',
							parseInt(progress.detail)
						)
					})

					upload.on('success', () => {
						this.$store.dispatch('error/showLoadingActivity', false)
						console.log("Wrap it up, we're done here. 👋")
						this.$router.push({ path: `/video/${this.video.id}/show` })
						this.$store.dispatch(
							'error/showSuccessToast', ["Spotlight video has been uploaded successfully."]
						)
						this.loading = false
					})
				})
				.catch((e) => {
					this.loading = false
					console.log(e)
					console.log(e.message)
					this.$store.dispatch('error/showLoadingActivity', false)
					this.$store.dispatch(
						'error/showErrorToast',
						e.message || e.body.errors || [e.body]
					)

					this.submitLoading = false
				})
    },

		async validateDuration(file) {
			return new Promise((resolve, reject) => {
				try {
					this.video = document.createElement('video')
					this.video.preload = 'metadata'

					this.video.onloadedmetadata = async function () {
						resolve(this)
					}

					this.video.onerror = function () {
						reject("Invalid video. Please select a video file.")
					}

					this.video.src = window.URL.createObjectURL(file[0])
				} catch (e) {
					reject(e)
				}
			})
		},

		replaceVideo() {
			this.video = null
			this.videoFile = null
			this.videoUploaded = false
		},

	}
}
</script>

<style src="./spotlight.scss" lang="scss" scoped>
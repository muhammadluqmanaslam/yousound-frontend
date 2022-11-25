<template>
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
			<div class="replace">
				Replace video
			</div>
			<div>
				<v-btn class="head-button">
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
								<img :src="currentUser.avatar.url" width="140">
							</div>
						</div>
						<div class="_user-icon mb-4">
							<div class="user-icon-inner">
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
					</div>
				</div>
			</div>

			<div class="w-25">
				<h2 class="heading">Mobile Preview</h2>
				<div class="mob-container">
					<div class="mob-video">

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
</template>

<script>
import BannerUpload from '../BannerUpload'
import iconImage from '../../assets/flashlight-white.svg'
import mainImage from '../../assets/live-drop.gif'
import dragFileUploader from '@/components/dragFileUploader'

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
		}
	},

	computed: {
		currentUser() {
			return this.$store.state.auth.user
		},
	},
	methods: {

		videoFiled() {
			debugger
		},

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
			}
		},

		async validateDuration(file) {
			return new Promise((resolve, reject) => {
				try {
					let video = document.createElement('video')
					video.preload = 'metadata'

					video.onloadedmetadata = async function () {
						resolve(this)
					}

					video.onerror = function () {
						reject("Invalid video. Please select a video file.")
					}

					video.src = window.URL.createObjectURL(file[0])
				} catch (e) {
					reject(e)
				}
			})
		},

	}
}
</script>

<style src="./spotlight.scss" lang="scss" scoped>
<template>
	<div class="feature-bar-container">
		<div class="main-text">Feature content</div>

		<div class="divider mt-4 mb-5"></div>


		<div class="feature-flex">
			<div class="w-75">
				<div class="feature-head mb-3">Web description</div>
				<div>
					<div class="input-feature">
						<div class="dflex align-center justify-space-between">
							<label class="label-title">Title for Web</label>
							<label class="label-time">*46 chars max</label>
						</div>
						<div class="mt-2">
							<input type="text" class="feature-input" placeholder="" maxlength="46" v-model="webTitle">
						</div>
					</div>

					<div class="input-feature mt-3">
						<div class="dflex align-center justify-space-between">
							<label class="label-title">Review for web</label>
							<label class="label-time">*120 chars max</label>
						</div>
						<div class="mt-2">
							<input type="text" class="feature-input" maxlength="120" v-model="webReview">
						</div>
					</div>

				</div>
				<div class="feature-head mb-3 mt-5">Mobile description</div>
				<div>
					<div class="input-feature">
						<div class="dflex align-center justify-space-between">
							<label class="label-title">Title for mobile</label>
							<label class="label-time">*46 chars max</label>
						</div>
						<div class="mt-2">
							<input type="text" class="feature-input" maxlength="46" v-model="mobileTitle">
						</div>
					</div>

					<div class="input-feature mt-3">
						<div class="dflex align-center justify-space-between">
							<label class="label-title">Review for mobile</label>
							<label class="label-time">*120 chars max</label>
						</div>
						<div class="mt-2">
							<input type="text" class="feature-input" maxlength="120" v-model="mobileReview">
						</div>
					</div>

				</div>
			   
			</div>
			<div class="w-25">
				<div class="feature-head mb-3">Content Image</div>
				<div class="feature-img">
					<img :src="album.cover.url" width="100%">
				</div>
			</div>

		</div>

		<div class="divider mt-4 mb-5"></div>
		<div>
			<v-btn class="post-content" @click="saveTitleAndReview()">
				Post content
			</v-btn>
		</div>
	</div>
</template>
<script>

import AlbumService from '@/services/album'

export default {
	props: {
		album: Object
	},
	data() {
		return {
			webTitle: this.album.web_title,
			webReview: this.album.web_review,
			mobileTitle: this.album.mobile_title,
			mobileReview: this.album.mobile_review,
		}
	},

	methods: {
		saveTitleAndReview() {
			let params = {web_title: this.webTitle, web_review: this.webReview,
				mobile_title: this.mobileTitle, mobile_review: this.mobileReview
			}
			AlbumService.updateTitleAndReview(this.album.id, params)
			.then((res) => {
				this.$store.dispatch(
					'error/showSuccessToast',
					['Successfully updated Title and Review.']
				)
			})
			.catch((e) => {
				this.$store.dispatch('error/showLoadingActivity', false)
				this.$store.dispatch(
					'error/showErrorToast',
					e.body.errors || [e.body]
          		)
			})
		},
	},
}
</script>
<style scoped src="./feature.scss" lang="scss"></style>

<template>
	<div v-if="isPageReady" class="page video-page show-page" :class="{'no-top-nav': !onMobile, onMobile }">
		<div class="page-content margin-top-header">
			<v-container fluid px-0 :class="{'grid-list-md px-4':!onMobile}">
				<div class="vid_col mb-4">
					<video-player :src="stream.mp_channel_1_ep_1_url"></video-player>
				</div>
				<v-layout row wrap>
					<v-flex v-if="!onMobile" xs12 sm8 comment-wrapper>
						<div>
							<div v-if="onMobile" class="pane-tabs-onMobile">
								<div
									v-for="(tab, index) in paneTabs"
									:key="index"
									class="pane-tab"
									:class="{active: activePaneTab == tab.id}"
									@click="activePaneTab = tab.id"
								>
									{{ tab.name }} <span v-if="tab.id == 'comments'">({{ comments.length | formatLargeNumber }})</span>
								</div>
							</div>
	
							<div v-if="activePaneTab == 'info'">
								<div class="content-section">
									<div class="meta__content" :class="{'px-4':onMobile}">
										<user-tag v-if="onMobile" class="tag" showAvatar hideName hideTick clickUser width="40" height="40" :user="stream.user" />
										<div v-if="!onMobile" class="meta__title">{{ stream.name }}</div>
	
										<div v-if="onMobile" class="dflex flex-column">
											<div class="meta__name">{{ stream.name.split('- ')[1] || stream.name }}</div>
											<div class="meta__title text-capitalize">{{ stream.user.username }}</div>
										</div>

										<div class="show-more">
	
											<div class="vid__description">
												{{ stream.description }}
											</div>
	
											<span
												v-if="initShowMore"
												class="app-grey--text cursor-pointer showMoreActive"
												@click="showMoreActive = !showMoreActive"
											>
												<b v-if="!showMoreActive" class="show-more-less show-more">
													SHOW MORE
												</b>
												<b v-if="showMoreActive" class="show-more-less show-less">
													SHOW LESS
												</b>
											</span>
										</div>

										<div class="divider my-4"></div>

										<div class="attachment-block" @click="(showAttachProduct = true)">
											<div><img src="../../assets/bold-plus.svg" width="16"></div>
											<div class="_content">Attach content to video</div>
										</div>
	
										<!-- <div class="meta__subtitle">
											{{ stream.viewers_size || 0 }}
											views <span v-if="!onMobile">&bull;</span>
											{{ moment(stream.created_at).format("MMM D, YYYY") }}
										</div>
	 -->
										<div v-if="onMobile" class="meta__cta follow">
											<user-follow-btn
												v-if="currentUser && stream.user.id != currentUser.id"
												:user="stream.user"
												theme="dark"
												type="player"
											/>
										</div>
									</div>
<!--   
									<div class="meta__actions" :class="{'py-3': !ownItem}">
										<div v-if="ownItem && this.isSubscribed" class="meta__cta donate">
											<img src="/static/images/stat.svg" width="20" />
										</div>
	
										<div v-if="this.isSubscribed" class="meta__cta donate" @click="showLoveDialog()">
											<img src="/static/images/ic_dollar.svg" height="21" />
										</div>
	
										<div class="meta__cta repost" @click="repostItem()">
											<img src="/static/images/ic_repost.svg" width="21" />
										</div>
										<div class="meta__cta share" @click="openShareDialog()">
											<img src="/static/images/ic_share.svg" width="21" />
										</div>
										<div class="meta__cta" v-if="ownItem">
											<v-menu offset-y class="more-menu">
												<v-btn icon slot="activator">
													<v-icon>more_horiz</v-icon>
												</v-btn>
												<v-list>
													<v-list-tile
														class="default-menu-item"
														@click.native="deleteStream()"
													>
														<v-list-tile-title>
															<label>Delete</label>
														</v-list-tile-title>
													</v-list-tile>
													<v-list-tile class="default-menu-item">
														<v-list-tile-title>
															<label>Report</label>
														</v-list-tile-title>
													</v-list-tile>
	
													<v-list-tile
														v-if="stream.user.username === currentUser.username"
														class="default-menu-item"
														:to="{ name: 'VideoEdit', params: { slug: stream.slug }}"
													>
														<v-list-tile-title>
															<label>Edit Video</label>
														</v-list-tile-title>
													</v-list-tile>
												</v-list>
											</v-menu>
										</div>
									</div> -->
								</div>
	
							</div>
						</div>
						<comments :item="stream" :comments="comments" roundAvatar />
					</v-flex>
					<v-flex v-else xs12 comment-wrapper class="px-4">
						<chat
							:items="comments"
							hideDatedString
							showShortAge
						/>

						<comment-input
							:item="stream"
							roundInput
							noBorder
							placeholder="Add your reply"
						></comment-input>
					</v-flex>
					<v-flex v-if="activePaneTab == 'info'" xs12 sm4 class="related_col" :class="{'pl-4': !onMobile}">
						<div class="videos-section">
							<h4 class="__title" :class="{'px-2': onMobile}">Related Videos</h4>
							<div class="section__content">
								<!-- <template v-for="(video, index) in videos">
									<div class="video-container" :key="`video-${index}`">
										<video-box :item="video" hideUser />
									</div>
								</template> -->
								<div
									v-for="(video) in videos"
									:key="video.name"
									:class="{side_fullwidth: onMobile}"
								>
									<video-box :hoverOverlay="false" :item="video" showUsername :hideUser="!onMobile ? true : false" :sideTabView="!onMobile ? true : false" />
								</div>
							</div>
						</div>
					</v-flex>
		
				</v-layout>
			</v-container>
		</div> 

		<!-- Add a Product on Timeline -->

		<v-dialog
		v-model="showAttachProduct"
		content-class="product-attach-dialog"
	>
		<div class="product-attach-flex">
			<div class="w-60">
				<div class="content-head">SELECT CONTENT</div>
				<div class="content-options">
					<div class="_title" @click="(selectAttactProduct = 1)"
					:class='(selectAttactProduct == 1) ? "active": null'>Music</div>
					<div class="_title" @click="(selectAttactProduct = 2)"
					:class='(selectAttactProduct == 2) ? "active": null'>Products</div>
				</div>
				<div class="tabs-main">
					<div class="tabs-container" v-if="(selectAttactProduct == 1)">
						music
						<div class="tabs-div" :class="{'active': mainItem.id === album.id}" @click="mainItem = album" v-for="(album, index) in albums">
							<div class="_image">
								<img :src="album.cover.url" width="50">
							</div>
							<div class="_text">
								<div class="title">{{ album.name }}</div>
								<div class="sub mt-1">{{ album.user.username }}</div>
							</div>
						</div>
					</div>
					<div class="tabs-container" v-if="(selectAttactProduct == 2)">
						<div class="tabs-div" :class="{'active': mainItem.id === product.id}" @click="mainItem = product" v-for="(product, index) in products">
							<div class="_image">
								<img :src="product.covers[0].cover.url" width="50">
							</div>
							<div class="_text">
								<div class="title">{{ product.name }}</div>
								<div class="sub mt-1">{{ product.merchant.username }}</div>
							</div>
						</div>
					</div>

				</div>
			</div>
			<div class="w-40 cursor-pointer" v-if="mainItem">
				<div class="profile_image">
					<img :src="mainItem.category ? mainItem.covers[0].cover.url :  mainItem.cover.url" width="100%">
				</div>
				<div class="profile_info my-3">
					<div class="image" :style="{'background-image': 'url(' + mainItem.merchant.avatar.url + ')'}" v-if="mainItem.category">
					</div>
					<div class="image" :style="{'background-image': 'url(' + mainItem.user.avatar.url + ')'}" v-else>
					</div>
					<div class="text">{{ mainItem.category ? mainItem.merchant.username : mainItem.user.username }}</div>
				</div>
				<div class="product-info ">
					<div class="category" v-if="mainItem.category">{{ mainItem.category.name }}</div>
					<div class="name">{{ mainItem.name }}</div>
					<div class="price mt-1" v-if="mainItem.price">${{ mainItem.price }}</div>
				</div>
				<div class="time-info mb-4 mt-3">
					<div class="text">SHOW ATTACHMENT AT:</div>
					<div class="timer-outer mt-2">
						<div class="time-flex">
							<div>
								<span contenteditable id="showAttachmentHours">00</span>hr
							</div>
							<div>
								:
							</div>
							<div>
								<span contenteditable id="showAttachmentMinutes">00</span>min
							</div>
							<div>
								:
							</div>
							<div>
								<span contenteditable id="showAttachmentSeconds">00</span>sec
							</div>
						</div>
					</div>
				</div>
				<div class="button-case">
					<v-btn blue rounded class="button-blue ma-0" @click="addContent()">Add content</v-btn>
				</div>
			</div>

		</div>
	</v-dialog>



		<v-dialog
			v-model="show_featured_dialog"
			content-class="featured-content-dialog"
		>
			<v-card>
				<v-card-text>
					<div class="headline mb-2">Add albmus & products to your video</div>
					<v-divider />
					<div
						class="mt-3 pa-3"
						style="
							text-align: left;
							background-color: #f8f8f8;
							border: 1px solid #eee;
							border-radius: 5px;
						"
					>
						<attach
							ref="assocAttach"
							@getAssoc="getAssoc"
							dataOnlyMode
						/>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						dark
						round
						color="blue"
						@click.native="updateStream()"
						class="px-4"
						>Update</v-btn
					>
					<v-btn
						dark
						round
						color="grey"
						@click.native="closeFeaturedDialog()"
						class="px-4"
						>Cancel</v-btn
					>
					<v-spacer></v-spacer>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="show_payment_dialog">
			<payment-modal
				v-if="show_payment_dialog"
				:receivers="[stream.user]"
				:amount="amount"
				:dismiss="closePaymentDialog"
				:finish="payAttachment"
			/>
		</v-dialog>

		<send-love-modal
			v-if="showSendLoveModal"
			:item="user"
			:dismiss="dismissLoveDialog"
		/>

		<share-modal
			v-if="show_share_dialog"
			:item="stream"
			type="Stream"
			:dismiss="closeShareDialog"
		></share-modal>

		<merch-modal
			v-if="showMerchModal"
			:item="stream.assoc"
			:dismiss="dimissMerchDialog"
		/>
	</div>
</template>

<script type="text/javascript" src="./show.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
.product-attach-flex{

	display: flex;
	background: white;
	border-radius: 20px;
	
	.w-60{
		width: 60%;
		padding: 30px 25px;

		.content-head{
			font-weight: 700;
			font-size: 12px;
			color: black;
		}
		.content-options{
			display: flex;
			gap: 35px;
			margin: 20px 0;

			._title{
				font-size: 16px;
				font-weight: 500;
				color: black;
				opacity: 30% !important;
				cursor: pointer;

				&.active{
					opacity: 100% !important;
				}
			}
		}

		.tabs-main{
			.tabs-container{
				height: 100%;
				max-height: 385px;
				overflow-y: auto;
				.tabs-div{
					display: flex;
					align-items: center;
					gap: 16px;
					padding: 8px;
					margin-bottom: 8px;
					border-radius: 10px;

					&.active{
						background: rgba($color: #D9D9D9, $alpha: 0.4);
					}
					&:hover{
						background: rgba($color: #D9D9D9, $alpha: 0.15);
					}
					._image{
						img{
							border-radius: 4px;
						}
					}
					._text{
						.title{
							font-size: 16px;
							font-weight: 500;
							color: black;
						}

						.sub{
							font-size: 12px;
							font-weight: 500;
							color: rgba($color: #000000, $alpha: 0.4);
						}
					}
				}
			}
		}

	}
	.w-40{
		width: 40%;
		padding: 30px 25px;
		border-left: 1px solid rgba(0,0,0,0.1);

		.profile_image{
			img{
				border-radius: 4px;
			}
		}
		.profile_info{
			display: flex;
			align-items: center;
			gap: 8px;
			.image{
				width: 24px;
				height: 24px;
				border-radius: 50%;
				background: #c4c4c4;
				background-size: cover;
			}
			.text{
				font-size: 12px;
				font-family: "Inter", sans-serif ;
				font-weight: bold;
				color: black;
			}
		}
		.product-info{
			.category{
				font-size: 12px;
				font-family: 'Inter', sans-serif;
				font-weight: bold;
				color: rgba($color: #000000, $alpha: 0.5);
				text-transform: uppercase;
			}
			.name{
				font-size: 18px;
				font-family: 'Inter', sans-serif;
				font-weight: bold;
				color: black;
			}
			.price{
				font-size: 16px;
				font-family: 'Inter', sans-serif;
				font-weight: bold;
				color: black;
			}
		}
		.time-info{
			.text{
				font-size: 12px;
				font-family: 'Inter', sans-serif;
				font-weight: bold;
				color: rgba($color: #000000, $alpha: 0.5);
				text-transform: uppercase;
			}
			.timer-outer{
				width: 100%;
				border: 1px solid rgba($color: #000000, $alpha: 0.1);
				border-radius: 3px;
				padding: 10px 30px;
				display: flex;
				justify-content: center;

				.time-flex{
					display: flex;
					justify-content: space-between;
					gap: 10px;
					font-family: "Inter",sans-serif;
					font-size: 14px;
					color: black;
					align-items: center;

					span{
						font-weight: bold;
					}
				}
			}
		}
		.button-blue{
			box-shadow: none;
			border: none;
			width: 100%;
			margin: 0;
			font-size: 16px;
			font-weight: bold;
			height: 40px;
			background: #5051F9;
			color: white;
			border-radius: 50px;
		}
	}
}
.divider{
	width: 100%;
	height: 1px;
	background: rgba($color: #000000, $alpha: 0.1);
}
.vid_col {
	// -ms-flex-preferred-size: 66.66666666666666%;
	// flex-basis: 100%;
	// max-width: 80%;
}
.show-more{
	.vid__description {
		height: 20px;
		overflow: hidden;
	}

	.show-more-less {
		color: #333;
		font-size: 13px;
	}
}

.attachment-block{
	display: flex;
	padding: 20px;
	gap: 20px;
	align-items: center;
	border: 1px solid rgba($color: #000000, $alpha: 0.1);
	border-radius: 6px;
	max-width: 265px;
	cursor: pointer;

	._content{
		font-family: "DM Sans", sans-serif;
		font-weight: 500;
		font-size: 16px;

	}
}
.video-page {
	.page-content {
		margin-top: 0;
	}

	.section {
		border-top: 1px solid #e4e4e4;

		&__content {
			display: block;

			.profile-section {
				.user-container {
					padding: 13px;
				}

				/deep/.artist-cover {
					border-radius: 0;
					width: 100px;
					height: 84px;
					background-size: contain;
					margin-right: 15px;
					padding: 0;
				}
				/deep/.artist-info-section {
					display: flex;
					align-items: center;
					margin: 0;
				}
				/deep/.avatar-cover {
					padding: 0 !important;
				}

				/deep/.artist-actions {
					pointer-events: none;
				}
			}
		}

		&__title {
			margin-top: 20px;
			font-size: 18px;
		}

		&__subtitle {
			color: #1976d2;
			cursor: pointer;
		}
	}

	.user-section {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid #e4e4e4;
		padding: 20px 0;
		padding: 20px 0;

		.user__wrapper {
			display: flex;
			.user__image {
				width: 48px;
				height: 48px;
				border-radius: 50%;
				background-size: contain;
				background-repeat: no-repeat;
				margin-right: 10px;
			}

			.tag {
				font-size: 16px;

				/deep/.user-status {
					margin-left: 0px;
					color: #24ab18;
				}
			}

			.vid__description {
				height: 20px;
				overflow: hidden;
			}

			.show-more-less {
				color: #333;
				font-size: 13px;
			}
		}
	}

	.users-section {
		.section__title {
			margin-top: 12px;
			font-size: 14px;
		}

		.section__content {
			width: 100%;
			overflow-x: auto;
			white-space: nowrap;
			padding-bottom: 12px;
			margin-top: 10px;
		}
	}

	.content-section {
		display: flex;
		padding: 10px 0;
		.meta {
			display: flex;
			margin: 20px 0 0;
			padding: 10px 0 0;
			border-top: 1px solid #f3dfdf;

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
				font-size: 22px;
				font-weight: 700;
				font-family: "inter",sans-serif;
				color: black;
				margin-bottom: 15px;

			}

			&__actions {
				display: flex;
				align-items: center;
				// margin-top: 10px;

				.tag {
					font-size: 20px;
				}
			}

			&__cta {
				display: inline-flex;
				margin-left: 32px;

				img {
					cursor: pointer;
				}

				.options {
					filter: invert(1);
					width: 20px;
					height: auto;
					padding: 15px 0;
				}
			}
		}
	}
	.assoc {
		display: flex;
		height: 100%;
		border-radius: 5px;
		border: 1px solid #e4e4e4;

		&__header {
			position: relative;
			width: 40%;
			flex: 0 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 15px;
		}

		&__content {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 10px;
		}

		&__image-wrapper {
			position: relative;
			width: 100%;
			padding-bottom: 100%;
		}

		&__image {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 5px;
			background-size: cover;
			background-position: center center;
			background-repeat: no-repeat;
		}

		&__title {
			font-size: 16px;
			font-weight: 700;
			padding-bottom: 14px;
		}

		&__subtitle {
			font-size: 14px;
			padding-bottom: 0px;

			.__name {
				white-space: break-spaces;
			}
		}

		&__cta {
			position: absolute;
			right: 20px;
			bottom: 20px;
			width: 40px;
			height: 40px;
			background-color: #000;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;

			img {
				filter: invert(1);
			}
		}
	}

	.follow-btn {
		text-transform: none;
		box-shadow: none;
		height: 36px;
		border-radius: 24px;
		font-size: 14px;
		letter-spacing: 0;
		min-width: 100px;
		&.follow {
			border: 1px solid #076AFF;
			background-color: #076AFF !important;
			color: #fff !important;
		}
		&.following {
			border: 1px solid #5bad00;
			background-color: #0000 !important;
			color: #000 !important;
			&:hover {
				border: 0.75px solid #dc3545;
				background-color: #dc3545 !important;
				color: #fff !important;
			}
		}
	}

	.attach-container {
		display: inline-block;
		width: 37.5%;
		padding: 16px 20px 10px 5px;
	}

	.user-container {
		display: inline-block;
		padding: 10px;
	}

	.video-container {
		display: inline-block;
		width: 100%;
		padding: 10px;
		margin-top: -20px;
	}
	.related_col {
		position: sticky;
		top: 0;

		.videos-section {
			.__title {
				// margin-left: 10px;
				margin-bottom: 10px;
			}

			.video-container {
				.box {
					display: flex;
					align-items: center;

					/deep/ &__content {
						width: 40%;
						margin-right: 20px;
					}
				}
			}
		}
	}

	&.onMobile {
		.users-section {
			.section__content {
				overflow-x: unset;
			}
		}
		.content-section {
			display: block;

			.meta__title {
				font-weight: 700;
				font-size: 22px;
				color: black;
				font-family: "Inter", sans-serif;
				max-width: 75%;
			}
			.meta__content {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
			}
			.meta__subtitle {
				flex-basis: 100%;
				padding-left: 52px;
				color: #606060;
			}
			.meta__actions {
				border-top: 1px solid #e4e4e4;
				border-bottom: 1px solid #e4e4e4;
				justify-content: space-around;
				margin-top: 12px;
				margin-bottom: 10px;

				.meta__cta {
					margin: 0;
				}
			}
		}
		.attach-container {
			display: inline-block;
			width: 100%;
			padding: 0;
		}
		.assoc {
			display: flex;
			height: 100%;
			border-radius: 5px;
			border: none;

			&__header {
				width: 23%;
			}

			&__content {
				position: relative;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 10px;
			}

			&__image-wrapper {
				position: relative;
				width: 100%;
				padding-bottom: 100%;
			}

			&__image {
				position: absolute;
				width: 100%;
				height: 100%;
			}

			&__title {
				font-size: 16px;
				font-weight: 700;
				padding-bottom: 0;
			}

			&__subtitle {
				font-size: 14px;
				padding-bottom: 0px;

				.__name {
					white-space: break-spaces;
				}
			}

			&__cta {
				position: absolute;
				right: 20px;
				bottom: 20px;
				width: 40px;
				height: 40px;
				background-color: #000;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				img {
					filter: invert(1);
				}
			}
		}
		.follow-btn {
			&.follow {
				border: 1px solid #000000;
				background-color: #000000 !important;
				color: #fff !important;
			}
			&.following {
				border: 1px solid #5bad00;
				background-color: #0000 !important;
				color: #000 !important;
				&:hover {
					border: 0.75px solid #dc3545;
					background-color: #dc3545 !important;
					color: #fff !important;
				}
			}
		}
	}
}
</style>

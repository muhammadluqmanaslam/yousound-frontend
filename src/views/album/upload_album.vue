<template>

	<div>
		<BannerUpload 
		v-if="!album.tracks.length"
		MainHeading="Release an album" 
		MainText="Upload music & connect your products, add collaborators +
		earn subscription revenue from your streams"
		:Icon="iconImage"
		:MainImage="bannerImage"
		/>

		<div class="page upload-child upload-album-page margin-top-header" v-if="this.currentUser.creator_verified">
			<div v-if="isPageReady">
				<content-top-header class="black-theme" v-if="album.tracks.length">
					<template slot="topHeader">
						<ul class="pr-3">
							<li
								class="nav-li active"
							>
								<label class="nav-label" >
								<router-link to="/upload">
									
									< Back
								</router-link>
								</label>
							</li>
						</ul>
					</template>
				</content-top-header>
	
				<div>
					<track-uploader
						accept=".mp3"
						:autoUpload="true"
						:album="album"
					></track-uploader>
				</div>
	
				<div
					v-if="album.tracks.length"
					class="album-info-section mx-5"
					id="album_info_section"
				>
					<div>
						<h4 class="album-info-title mt-5">Info</h4>
					</div>
	
					<v-container fluid grid-list-lg px-0 album-section>
						<v-layout wrap row album-content-section>
							<v-flex xs12 sm8>

								<div class="dflex d-row">
									<div class="w-100">
										<label class="control-label">
											<label class="required">*</label>
											Album Title
											</label>
										<input type="text" class="form-control" v-model="album.name" />
									</div>
								</div>
								<div class="dflex gap-15">
									<div class="w-25">
										<label class="control-label">
											<label class="required">*</label>
											Genre
											</label>
										<input
											:value="$store.getters['genreSelector/genre'].name"
											@click="openGenreSelectorDialog()"
											type="text"
											class="form-control"
											readonly
										/>
									</div>

									<div class="w-15">
										<label class="control-label">
											BPM
											</label>
										<input type="text" class="form-control" placeholder="'1-999'" v-model="album.bpm" />
									</div>

									<div class="w-15">
										<label class="control-label">
											KEY
											</label>

											<div class="dropdown-nail" >
												<div class="dropdown-head" @click="(majorDropdown = true)"> 
													<div v-if="majorValue == 'major' ">
														Major
													</div>
													<div v-else-if="majorValue == 'minor' ">
														Minor
													</div>
													<div v-else class="text-dull">
														Select
													</div>
												</div>
												<div v-if="majorDropdown"> 
												<div class="dropdown-overlay" @click="(majorDropdown = false)"></div>
												<div class="dropdown-body">
													<div class="inline-block" @click="majorValue = 'major'; majorDropdown = false; keyDropdown = true">
														<input type="radio" id="major" name="key" value="major">
														<label for="major">Major</label>
													</div>
													<div class="inline-block" @click="majorValue = 'minor'; majorDropdown = false; keyDropdown = true">
														<input type="radio" id="minor" name="key" value="minor">
														<label for="minor">Minor</label>
													</div>
													
												</div>
												</div>
											</div>
											
									</div>
									<div class="w-10">
										<label class="control-label show-none">
											KEY
											</label>
											<div class="dropdown-nail" >
												<div class="dropdown-head"> 
													<div v-if="keyValue == 'none'" class="text-dull">
														-
													</div>
													<div v-else>
														{{keyValue}}
													</div>
												</div>
												<div v-if="keyDropdown"> 
												<!-- <div class="dropdown-overlay" @click="(keyDropdown = false)"></div> -->
												<div class="dropdown-body">
													<div class="cursor-pointer key-value" v-for="index in keyOptions" @click="setKeyValue(index); keyDropdown=false;">
														{{index}}
													</div>
											
												</div>
												</div>
											</div>
									</div>

									<div class="w-30">
										<label class="control-label">Location this album represents</label>
									<v-select
										:items="locations"
										v-model="album.location"
										item-text="name"
										item-value="name"
										placeholder="Type name to search"
										class="pt-0"
										single-line
										autocomplete
									/>
									</div>
								</div>

								<div class="dflex gap-15">
									<div class="w-25">
										<label class="control-label">
											<label class="required">*</label>
												Released Date
										</label>
										<v-menu
											class="released-at-picker"
											:close-on-content-click="false"
											transition="scale-transition"
											offset-y
											full-width
											:nudge-right="40"
											max-width="290px"
											min-width="290px"
											lazy
										>
											<v-text-field
												slot="activator"
												v-model="album.released_at"
												readonly
											></v-text-field>
											<v-date-picker
												v-model="album.released_at"
												no-title
												scrollable
												actions
											>
												<template slot-scope="{ save, cancel }">
													<v-card-actions>
														<v-spacer></v-spacer>
														<v-btn flat color="primary" @click="cancel"
															>Cancel</v-btn
														>
														<v-btn flat color="primary" @click="save">OK</v-btn>
													</v-card-actions>
												</template>
											</v-date-picker>
										</v-menu>
									</div>
									<div class="w-75">
										<label class="control-label">
											<label class="required">*</label>
												Album includes
											</label>
											<div class="album-content-wrapper font-lable-check">
												<v-checkbox
													v-model="album.is_content_acapella"
													label="Acapella"
													hide-details
												></v-checkbox>
												<v-checkbox
													v-model="album.is_content_instrumental"
													label="Inst"
													hide-details
												></v-checkbox>
												<v-checkbox
													v-model="album.is_content_stems"
													label="Stems"
													hide-details
												></v-checkbox>
												<v-checkbox
													v-model="album.is_content_remix"
													label="Remix"
													hide-details
												></v-checkbox>
												<v-checkbox
													v-model="album.is_content_dj_mix"
													label="DJ Mix"
													hide-details
												></v-checkbox>
											</div>
									</div>
								
								</div>

								<div class="dflex">
									<div class="w-100">
										<label class="control-label">Description</label>
										<textarea
											v-model="album.description"
											class="album-description form-control non-resizable"
										></textarea>
									</div>
								</div>

								
							</v-flex>
							<v-flex xs12 sm4>
								<label class="control-label">
									<label class="required">*</label>
									Album cover
								</label>

									<div class="album-image-section">
										<div class="image-section">
											<div
												class="album-image"
												id="album_image"
												v-if="album_image_url"
												:style="`background-image: url(${album_image_url})`"
											></div>
											<div class="album-image-upload-section" v-if="!album_image_url">
												<input
													type="file"
													name="album_image_file"
													id="album_image_file"
													class="add-album-image-file"
													accept="image/*"
													@change="imageChanged($event)"
												/>
												<label for="album_image_file">
													<v-icon class="camera mt-0">photo_camera</v-icon>upload
												</label>
											</div>
										</div>
										<div class="image-change-section">
											<input
												type="file"
												name="album_image_file"
												id="album_image_file"
												class="change-album-image-file"
												accept="image/*"
												@change="imageChanged($event)"
											/>
											<label for="album_image_file" v-if="album_image_url"
												>Change</label
											>
										</div>
									</div>
							</v-flex>
						</v-layout>

					</v-container>

					<div class="mt-4">
						<h4 class="album-info-title mt-5">Options</h4>
					</div>

					<v-container fluid grid-list-lg px-0 album-section> 
						<v-layout wrap row album-content-section>
							<v-flex xs12 sm6 form-group>
								<label class="control-label">Attach product to album</label>
								<v-select
								v-bind:items="products"
								v-model="selected_product"
								item-text="name"
								item-value="id"
								placeholder="Type name to search product"
								chips
								class="pt-0"
								no-data-text="No products found"
								autocomplete
								clearable
							>
								<template slot="selection" slot-scope="data">
									<v-chip
										:key="JSON.stringify(data.item)"
										@input="data.parent.selectItem(data.item)"
										:selected="data.selected"
										class="chip--select-multi"
									>
										<v-avatar>
											<img :src="data.item.covers[0].cover.thumb.url" />
										</v-avatar>
										{{ data.item.name }}
									</v-chip>
								</template>
								<template slot="item" slot-scope="data">
									<template v-if="typeof data.item !== 'object'">
										<v-list-tile-content
											v-text="data.item"
										></v-list-tile-content>
									</template>
									<template v-else>
										<v-list-tile-avatar>
											<img v-bind:src="data.item.covers[0].cover.thumb.url" />
										</v-list-tile-avatar>
										<v-list-tile-content>
											<v-list-tile-title
												v-html="data.item.name"
											></v-list-tile-title>
										</v-list-tile-content>
									</template>
								</template>
							</v-select>
							</v-flex>

							<v-flex xs12 sm6 form-group>
								<label class="control-label">Live stream only</label>
								<div>
									<v-checkbox
										v-model="album.is_only_for_live_stream"
										hide-details
									>
									<template slot="label">
										<span class="black--text">
											Check box if album is available for live stream only
										</span>
									</template>
									</v-checkbox>
								</div>
							</v-flex>
						</v-layout>
					</v-container>

					<div>
						<h4 class="album-info-title mt-5">Collaborators</h4>
					</div>

					<v-container fluid grid-list-lg px-0 album-section> 
						<v-layout wrap row album-content-section>
							<v-flex xs12 class="additional-info-section">
								<v-flex xs12 pa-0>
									<v-flex xs12 class="my-0">
										<v-layout>
											<v-flex xs12 sm6 dflex align-center pa-0 my-0>
												<h4 class="album-info-title-x mb-0 mr-2">Collaborators ({{ collaborators.length }})</h4>
												<v-btn
													v-if="collaborators.length < 3"
													class="add-option-btn ma-0"
													@click.native="addCollaborator()"
												>
													<v-icon>add</v-icon>
												</v-btn>
											</v-flex>
										</v-layout>
									</v-flex>
	
									<v-flex xs12 pa-0>
										<v-layout
											row
											option-content
											v-for="(collaborator, index) in collaborators"
											:key="index"
										>
											<v-flex xs12 sm6>
												<label class="control-label">Collaborator</label>
												<v-select
													:items="potential_collaborators"
													v-model="collaborator.user_id"
													item-text="username"
													item-value="id"
													placeholder="Type name to search"
													chips
													class="pt-0"
													no-data-text="No artist found"
													autocomplete
												>
													<template slot="selection" slot-scope="data">
														<v-chip
															:key="JSON.stringify(data.item)"
															@input="data.parent.selectItem(data.item)"
															:selected="data.selected"
															class="chip--select-multi"
														>
															<v-avatar>
																<img :src="data.item.avatar.thumb.url" />
															</v-avatar>
															{{ data.item.username }}
														</v-chip>
													</template>
													<template slot="item" slot-scope="data">
														<template v-if="typeof data.item !== 'object'">
															<v-list-tile-content
																v-text="data.item"
															></v-list-tile-content>
														</template>
														<template v-else>
															<v-list-tile-avatar>
																<img v-bind:src="data.item.avatar.thumb.url" />
															</v-list-tile-avatar>
															<v-list-tile-content>
																<v-list-tile-title
																	v-html="data.item.username"
																></v-list-tile-title>
															</v-list-tile-content>
														</template>
													</template>
												</v-select>
											</v-flex>
											
											<v-flex xs12 sm6 mb-4>
												<label class="control-label">Role</label>
												<span class="dflex align-center">
													<v-select
														v-bind:items="role_types"
														v-model="collaborator.user_role"
														item-text="name"
														item-value="name"
														placeholder="Type name to search"
														class="pt-0"
														autocomplete
													></v-select>
	
												<v-icon 
													class="clear-btn" 
													@click="deleteCollaborator(index)"
												>
													clear
												</v-icon>
												</span>
											</v-flex>
										</v-layout>
									</v-flex>
								</v-flex>
							</v-flex>
	
							<v-flex xs12 class="additional-info-section">
								<v-flex xs12 pa-0>
									<v-flex xs12 class="my-0">
										<v-layout>
											<v-flex xs12 sm6 dflex align-center pa-0 my-0>
												<h4 class="album-info-title-x mb-0 mr-2">Album Credits ({{ contributors.length }})</h4>
												<v-btn
													class="add-option-btn ma-0"
													@click.native="addContributor()"
												>
													<v-icon>add</v-icon>
												</v-btn>
											</v-flex>
										</v-layout>
									</v-flex>
	
									<v-flex xs12 pa-0>
										<v-layout
											row
											option-content
											v-for="(contirbutor, index) in contributors"
											:key="index"
										>
											<v-flex xs12 sm6>
												<label class="control-label"
													>Username<label class="required">*</label></label
												>
												<v-select
													:items="potential_contributors"
													v-model="contirbutor.user_id"
													item-text="username"
													item-value="id"
													placeholder="Type name to search"
													chips
													class="pt-0"
													no-data-text="No user found"
													autocomplete
													clearable
												>
													<template slot="selection" slot-scope="data">
														<v-chip
															:key="JSON.stringify(data.item)"
															@input="data.parent.selectItem(data.item)"
															:selected="data.selected"
															class="chip--select-multi"
														>
															<v-avatar>
																<img :src="data.item.avatar.thumb.url" />
															</v-avatar>
															{{ data.item.username }}
														</v-chip>
													</template>
													<template slot="item" slot-scope="data">
														<template v-if="typeof data.item !== 'object'">
															<v-list-tile-content
																v-text="data.item"
															></v-list-tile-content>
														</template>
														<template v-else>
															<v-list-tile-avatar>
																<img v-bind:src="data.item.avatar.thumb.url" />
															</v-list-tile-avatar>
															<v-list-tile-content>
																<v-list-tile-title
																	v-html="data.item.username"
																></v-list-tile-title>
															</v-list-tile-content>
														</template>
													</template>
												</v-select>
											</v-flex>
											<v-flex xs12 sm6>
												<label class="control-label"
													>Role<label class="required">*</label></label
												>
												<span class="dflex align-center">
													<v-select
														:items="role_types"
														v-model="contirbutor.user_role"
														item-text="name"
														item-value="name"
														placeholder="Type name to search"
														class="pt-0"
														autocomplete
													></v-select>
													<v-icon
														class="clear-btn" 
														@click="deleteContributor(index)"
													>
														clear
													</v-icon>
												</span>
												</v-flex>
										</v-layout>
									</v-flex>
								</v-flex>
							</v-flex>

						</v-layout>
					</v-container>
	
	
					<!-- <v-flex xs12 class="additional-info-section">
						<div>
							<h4 class="album-info-title">Downloads</h4>
						</div>
						<ul>
							<li>
							All tracks are $1.00 by default, to accept payments for downloads, you must 
							<router-link :to="{ name: 'ManageIndex', params: { tab: 'payment' } }">Connect to Stripe</router-link>
							 or downloads will be disabled
							</li>
							<li>
								To sell an album and limit tracks, only upload free tracks you want listeners to stream, then connect your digital product to the album
							</li>
						</ul>
					</v-flex> -->
	
					<!-- <v-flex xs12 class="additional-info-section">
						<v-flex xs12>
							<v-layout>
								<v-flex xs12 sm6 pa-0>
									<h4 class="album-info-title">Sample Used from YouSound</h4>
								</v-flex>
							</v-layout>
						</v-flex>
						<v-flex xs12>
							<v-flex xs12 sm6 pa-0>
								<v-btn class="add-option-btn ma-0" @click.native="addSampling()">
									<v-icon>add</v-icon> Add another
								</v-btn>
							</v-flex>
						</v-flex>
						<v-flex sm12 pa-0>
							<v-layout
								v-for="(sampling, index) in samplings"
								:key="index"
								row
								option-content
							>
								<v-flex xs12 sm3>
									<label class="control-label"
										>Sampling Track<label class="required">*</label></label
									>
									<v-select
										v-model="sampling.sampling_track_id"
										:items="album.tracks"
										item-text="track.name"
										item-value="track.id"
										placeholder="Type name to search"
										class="pt-0"
									>
									</v-select>
								</v-flex>
								<v-flex xs12 sm3>
									<label class="control-label"
										>Artist you sampled<label class="required">*</label></label
									>
									<v-select
										:items="sampling.artists"
										v-model="sampling.sample_user_id"
										item-text="username"
										item-value="id"
										placeholder="Type name to search"
										return-object
										@change="onChangeSampleArtist"
										chips
										class="pt-0"
										no-data-text="No user found"
										autocomplete
										clearable
									>
										<template slot="selection" slot-scope="data">
											<v-chip
												:key="JSON.stringify(data.item)"
												@input="data.parent.selectItem(data.item)"
												:selected="data.selected"
												class="chip--select-multi"
											>
												<v-avatar>
													<img :src="data.item.avatar.thumb.url" />
												</v-avatar>
												{{ data.item.username }}
											</v-chip>
										</template>
										<template slot="item" slot-scope="data">
											<template v-if="typeof data.item == 'object'">
												<v-list-tile-avatar>
													<img :src="data.item.avatar.thumb.url" />
												</v-list-tile-avatar>
												<v-list-tile-content>
													<v-list-tile-title
														v-html="data.item.username"
													></v-list-tile-title>
												</v-list-tile-content>
											</template>
										</template>
									</v-select>
								</v-flex>
								<v-flex xs12 sm3>
									<label class="control-label"
										>Sample<label class="required">*</label></label
									>
									<v-select
										:items="sampling.artist_albums"
										v-model="sampling.sample_album_id"
										item-text="name"
										item-value="id"
										placeholder="Type name to search"
										return-object
										@change="onChangeSampleArtistAlbum"
										chips
										class="pt-0"
										content-class="menu__content--avatar"
										no-data-text="No album found"
										autocomplete
										clearable
									>
										<template slot="selection" slot-scope="data">
											<v-chip
												:key="JSON.stringify(data.item)"
												@input="data.parent.selectItem(data.item)"
												:selected="data.selected"
												class="chip--select-multi"
											>
												<v-avatar>
													<img :src="data.item.cover.thumb.url" />
												</v-avatar>
												{{ data.item.name }}
											</v-chip>
										</template>
										<template slot="item" slot-scope="data">
											<template v-if="typeof data.item == 'object'">
												<v-list-tile-avatar>
													<img :src="data.item.cover.thumb.url" />
												</v-list-tile-avatar>
												<v-list-tile-content>
													<v-list-tile-title
														v-html="data.item.name"
													></v-list-tile-title>
												</v-list-tile-content>
											</template>
										</template>
									</v-select>
								</v-flex>
								<v-flex xs12 sm3>
									<label class="control-label"
										>Track<label class="required">*</label></label
									>
									<v-select
										:items="sampling.artist_album_tracks"
										v-model="sampling.sample_track_id"
										item-text="name"
										item-value="id"
										placeholder="Type name to search"
										autocomplete
										class="pt-0"
									></v-select>
								</v-flex>
								<v-icon class="clear-btn" @click="deleteSampling(index)"
									>clear</v-icon
								>
							</v-layout>
						</v-flex>
					</v-flex> -->
					
					<hr>
					<v-flex xs12 album-action-section>
						<v-layout row>
							<!-- <v-flex xs12 sm-6>
								<a class="delete-album-btn" @click="deleteAlbum()">Remove Album</a>
							</v-flex> -->
							<v-flex xs12 sm-6 text-xs-left mb-5>
								<v-btn
									class="release-now-btn white--text"
									flat
									:loading="loading"
									@click.native="releaseNow()"
									:disabled="slug? !isAvailableToEditAlbum : !isAvailableToUploadAlbum"
									>Release</v-btn
								>
								<v-btn
									v-if="false"
									class="save-for-later-btn"
									flat
									@click.native="saveForLater()"
									>Save for later</v-btn
								>
							</v-flex>
						</v-layout>
					</v-flex>
				</div>
			</div>
	
			<v-dialog
				v-model="show_sample_clearance_license_modal"
				content-class="my-dialog-1 large"
			>
				<sample-license-dialog :dismiss="closeSampleClearanceLicenseModal" />
			</v-dialog>

			<!-- Promote your Profile  -->

		<v-dialog v-if="show_collaborators_confirm_dialog"
			v-model="show_collaborators_confirm_dialog"
			content-class="collaborators-success-dialog"
		>
			<v-card>
				<v-card-title class="headline">
					<div class="dflex gap-15">
						<div>
							<img src="../../assets/black-check.svg" width="25">
						</div>
						<div class="headline-text">
							Your album was released! <a href="/upload/album" style="text-decoration: underline !important">Upload another</a> or go to <router-link to="/upload" style="text-decoration: underline !important">upload page</router-link> 
						</div>
					</div>
				</v-card-title>

				<div class="modal-body">
					<div class="dflex gap-20">
						<div class="w-30 border-round">
							<img :src="album.cover.url" width="100%">
						</div>
						<div class="w-70">
							<div>
								<h3 class="main-head">{{ album.name }}</h3>
								<p class="mb-0 second-head mx-0 my-0">{{ album.user.username }}</p>
								<p class="light-text mx-0 my-0">{{ album.tracks.length }} tracks</p>
								<p class="light-text mx-0 my-0">{{ album.genres[0] && album.genres[0].name }}</p>

							</div>
							<hr class="my-4">

							<div class="dflex align-center gap-20">
								<div class="dflex align-center gap-15">
									<a href="#"><img src="../../assets/email-xcon.svg" width="16"></a>
									<a href="#"><img src="../../assets/facebook-xcon.svg" width="10"></a>
									<a href="#"><img src="../../assets/twitter-xcon.svg" width="17"></a>
									
									
		
								</div>
								<div class="url-bar">
									<p class="mx-0 my-0">{{ albumURL }}</p>
									<div
										class="clipboard-btn"
										v-clipboard:copy="albumURL"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
									>
										<img src="../../assets/clone.svg" width="16">
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<div class="dflex align-center justify-space-between gap-max">
						<div class="w-100">
							<h2 class="foot-head">
								Promote your profile
							</h2>
							<p class="mx-0 my-0 mt-2">
								Upload a spotlight video to promote your content to new subscribers!
							</p>

							<router-link to="#">
								<v-btn class="mt-4 fx-btn ml-0">
									Add spotlight
								</v-btn>
							</router-link>
						</div>
						<div class="w-100">
							<img src="../../assets/spotlight-demo.png" width="100%">
						</div>
					</div>

				</div>
			</v-card>
		</v-dialog>

		<v-dialog
			v-model="show_genre_selector_dialog"
			content-class="my-genre-dialog ma-0 pa-2"
		>
			<genre-single-selector :dismiss="closeGenreSelectorDialog" />
		</v-dialog>
		</div>
	</div>
</template>

<script type="text/javascript" src="./upload_album.ctrl.js"></script>
<style scoped src="../../../static/styles/album.scss" lang="scss"></style>

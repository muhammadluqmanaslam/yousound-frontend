<template>
	<div v-if="!product.image1">
		<BannerUpload 
			MainHeading="Launch a product" 
			MainText="Upload digital + physical products, set recoup costs, split revenue with collaborators & keep 100% of sales"
			:Icon="iconImage"
			:MainImage="bannerImage"
		/>
		<div class="page-content mx-5">
			<drag-file-uploader
				accept="image/*"
				type="image"
				category="product"
				@filePicked="pickedFile"
				:autoUpload="true"
				ref="dragFileUploader"
			></drag-file-uploader>
		</div>
	</div>
	<div v-else>
	<div class="page upload-child sell-page product-page mx-5 margin-top-header" v-if="currentUser.creator_verified">
		<topbarNotification
			v-if="!currentUser.stripe_connected"
			:content="topBarContent"
			ctaTitle="Connect"
			:cta="{ name: 'ManageIndex', params: { tab: 'payment' } }"
		/>
		<!-- <content-top-header>
			<template slot="topHeader">
				<ul class="pr-3">
					<li
						v-for="tab in tabs"
						:key="tab.id"
						:href="`#${tab.id}`"
						class="nav-li"
						:class="[
							{ 'active tab-active': isActiveTab(tab.id) },
							`nav-${tab.id}`,
							{ isParent: tab.isParent },
						]"
					>
						<label class="nav-label" @click="onTab(tab)">
							{{ tab.title }}
							<v-icon v-if="tab.isParent">chevron_right</v-icon>
						</label>
					</li>
				</ul>
			</template>
		</content-top-header> -->

		<div class="page-content">
			<v-layout row wrap>
				<v-flex xs12 v-if="isPageReady">
					<h2 class="my-2 album-info-title">Info</h2>
					<v-layout wrap row content-section mt-4>
						<v-flex xs12 sm7>
							<v-flex xs12 product-section>
								<v-flex xs12 form-group>
									<label class="control-label max-char-label">
										<span class="__title">
											<label class="required">*</label>
											Product Name
										</span>
									</label>

									<input
										type="text"
										class="form-control"
										v-model="product.name"
									/>
								</v-flex>
					
								<v-flex xs12 form-group>
									<label class="control-label max-char-label">
										<span class="__title">
											<label class="required">*</label>
											Category
										</span>
									</label>

									<v-select
										v-model="product.category"
										placeholder="Select"
										v-bind:items="product_categories"
										item-text="name"
										item-value="id"
										@change="onChangeProductCategory"
										class="pt-0"
										no-data-text="No destination available"
										autocomplete
									/>
								</v-flex>

								<v-flex xs12 form-group>
									<label class="control-label max-char-label">
										<span class="__title">
											<label class="required">*</label>
											Description
										</span>
									</label>

									<textarea
										v-model="product.description"
										class="product-description form-control non-resizable"
										maxlength="2000"
									></textarea>
								</v-flex>


								<!-- <v-flex xs12 mt-4>
									<v-checkbox
										value="show_only_stream"
										label="Only For Live Stream"
										v-model="product.show_status"
									>
									<template slot="label">
										<span class="black--text">Check box if product is available for <b>live stream only</b></span>
									</template>
									</v-checkbox>
	 
								</v-flex> -->
							</v-flex>
						</v-flex>


						<v-flex xs12 sm5 pl-4>
							<v-flex xs12 product-section>
								<label class="control-label max-char-label">
									<span class="__title">
										<label class="required">*</label>
										Product Images
									</span>
								</label>
								<v-container grid-list-lg px-0 pt-0 mt-0>
									<v-layout wrap row>
										<v-flex xs12 sm6>
											<!-- <label class="control-label">Image 1<label class="required">*</label></label> -->
											<div class="product-image-section">
												<!-- <img class="product-image" id="product_image1"  v-if="product.image1"/> -->
												<div
													class="product-image"
													id="product_image1"
													v-if="product.image1"
												></div>
												<div
													class="product-image-upload-section"
													v-if="!product.image1"
												>
													<input
														type="file"
														name="product_image_file"
														id="product_image_file"
														class="add-product-image-file"
														accept="image/*"
														@change="imageChanged('product_image1', $event)"
													/>
													<label for="product_image_file">
														<v-icon class="camera">photo_camera</v-icon>
														Upload
													</label>
												</div>
											</div>
											<div class="product-image-change-section">
												<input
													type="file"
													name="product_image_file"
													id="product_image_file"
													class="change-product-image-file"
													accept="image/*"
													@change="imageChanged('product_image1', $event)"
												/>
												<label for="product_image_file" v-if="product.image1"
													>Change</label
												><label
													class="text-btn"
													v-if="product.image1"
													@click="deleteProductImage('product_image1')"
												>
													/ Delete</label
												>
											</div>
										</v-flex>

										<v-flex xs12 sm6>
											<!-- <label class="control-label">Image 2</label> -->
											<div class="product-image-section">
												<!-- <img class="product-image" id="product_image2" v-if="product.image2"/> -->
												<div
													class="product-image"
													id="product_image2"
													v-if="product.image2"
												></div>
												<div
													class="product-image-upload-section"
													v-if="!product.image2"
												>
													<input
														type="file"
														name="product_image_file2"
														id="product_image_file2"
														class="add-product-image-file"
														accept="image/*"
														@change="imageChanged('product_image2', $event)"
													/>
													<label for="product_image_file2">
														<v-icon class="camera">photo_camera</v-icon>
														Upload
													</label>
												</div>
											</div>
											<div class="product-image-change-section">
												<input
													type="file"
													name="product_image_file2"
													id="product_image_file2"
													class="change-product-image-file"
													accept="image/*"
													@change="imageChanged('product_image2', $event)"
												/>
												<label for="product_image_file2" v-if="product.image2"
													>Change</label
												><label
													class="text-btn"
													v-if="product.image2"
													@click="deleteProductImage('product_image2')"
												>
													/ Delete</label
												>
											</div>
										</v-flex>

										<v-flex xs12 sm6>
											<!-- <label class="control-label">Image 3</label> -->
											<div class="product-image-section">
												<!-- <img class="product-image" id="product_image3" v-if="product.image3"/> -->
												<div
													class="product-image"
													id="product_image3"
													v-if="product.image3"
												></div>
												<div
													class="product-image-upload-section"
													v-if="!product.image3"
												>
													<input
														type="file"
														name="product_image_file3"
														id="product_image_file3"
														class="add-product-image-file"
														accept="image/*"
														@change="imageChanged('product_image3', $event)"
													/>
													<label for="product_image_file3">
														<v-icon class="camera">photo_camera</v-icon>
														Upload
													</label>
												</div>
											</div>
											<div class="product-image-change-section">
												<input
													type="file"
													name="product_image_file3"
													id="product_image_file3"
													class="change-product-image-file"
													accept="image/*"
													@change="imageChanged('product_image3', $event)"
												/>
												<label for="product_image_file3" v-if="product.image3"
													>Change</label
												><label
													class="text-btn"
													v-if="product.image3"
													@click="deleteProductImage('product_image3')"
												>
													/ Delete</label
												>
											</div>
										</v-flex>
									</v-layout>
								</v-container>
							</v-flex>
						</v-flex>
						<v-flex xs12 price-option-section>
							<h2 class="album-info-title">Products ({{ product.variants.length }})</h2>
						</v-flex>
						<v-flex xs12 sm7 mt-4>
							<v-flex xs12 product-section>

								<v-layout
									row
									product-option-content
									form-group
									v-for="(variant, index) in product.variants"
									:key="index"
								>
									<v-flex xs12 sm4>
										<label class="control-label">
											<label class="required">*</label>
											Option Name
											</label>
										<span class="dflex align-center">
										 
											<input
												v-model="variant.name"
												type="text"
												class="form-control"
												:disabled="isDigitalProduct"
												placeholder="Large - Black"
											/>
										</span>
									</v-flex>
									<v-flex xs12 sm4 v-if="!isDigitalProduct">
										<label class="control-label">
											 <label class="required">*</label>
											# In Stock
										</label>
										<input
											v-model="variant.quantity"
											type="text"
											class="form-control"
											placeholder="99"
										/>
									</v-flex>
									<v-flex xs12 sm4>
										<label class="control-label">
											<label class="required">*</label>
										 Price
									 </label>

									 <div class="dflex gap-10 align-center">
										<span class="dflex align-center">
											<vue-numeric
												v-model="variant.price"
												currency="$"
												currency-symbol-position="prefix"
												separator=","
												:precision="2"
												:min="0"
												class="form-control primary-input"
											/>
											<v-icon class="clear-btn" @click="deleteVariant(index)">
												clear
											</v-icon>
										</span>
										<v-btn
										class="add-option-btn"
										@click.native="addVariant()"
										v-if="!isDigitalProduct"
									>
										<v-icon>add</v-icon>
									</v-btn>
								</div>
									</v-flex>
								</v-layout>
								<!-- <p class="d-inline-flex grey--text lighten-2">
									e.g. "Large - Black" "100" "30.00"
								</p> -->
							</v-flex>
						</v-flex>
				 
						<v-flex xs12 sm12 v-if="!isDigitalProduct">
							<v-flex xs12  pa-0 mt-5>
								<h2 class="album-info-title">Tax</h2>
							</v-flex>
							<v-flex xs12 sm8 product-section>
								<v-flex xs12 mt-2 product-section mt-4>
									<v-checkbox
										v-model="product.is_vat"
										@change="resetTaxPercent"
									>
										<template slot="label">
											<span class="text-muted">Sellers outside of US check box for VAT/GST</span>
										</template>
									</v-checkbox>
									<!-- <div class="tax-description">
										<label>*</label>
										<p class="d-inline-flex grey--text lighten-2">
											Some countries might not have the accurate tax rate.<br />
											You can manually type the tax rate in the textbox.
										</p>
									</div> -->
								</v-flex>
								<v-layout wrap row mt-3>
									<v-flex xs12 sm4 v-if="product.is_vat">
										<label class="control-label">Sellers Country</label>
										<v-select
											v-model="product.seller_location"
											:items="countries"
											item-text="name"
											item-value="name"
											@change="changeTaxPercent"
											class="pt-0"
											autocomplete
										/>
									</v-flex>
									<v-flex xs12 sm4 v-else>
										<label class="control-label">Sellers State</label>
										<v-select
											v-model="product.seller_location"
											placeholder="CA"
											:items="states"
											item-text="name"
											item-value="name"
											@change="changeTaxPercent"
											class="pt-0"
											autocomplete
										/>
									</v-flex>
									<v-flex xs12 sm4>
										<label class="control-label" v-if="product.is_vat"
											>Tax</label
										>
										<label class="control-label" v-else>State Tax</label>
										<vue-numeric
											v-model="product.tax_percent"
											currency="%"
											placeholder="8.5%"
											currency-symbol-position="suffix"
											separator=","
											:precision="3"
											:min="0"
											:max="100"
											class="form-control primary-input"
										/>
									</v-flex>
								</v-layout>




							</v-flex>
							<v-flex xs12 price-option-section form-group mt-5>
								<h2 class="album-info-title">
										Shipping & Handling 
										<!-- ({{ product.shipments.length }}) -->
								</h2>
							</v-flex>
							<v-flex xs12 sm8>
							<span class="text-muted mt-4">
								Please select <strong>All other countries</strong> in destination to proceed.
							</span>
							<v-layout
								row
								mt-3
								product-option-content
								v-for="(shipment, index) in product.shipments"
								:key="index"
							>
								<v-flex xs12 sm4 pr-2>
									<label class="control-label">Destination</label>

									<span class="dflex align-center">
										<v-select
											v-model="shipment.country"
											v-bind:items="destinations"
											item-text="name"
											item-value="value"
											class="pt-0"
											autocomplete
										/>
									</span>
								</v-flex>
								<v-flex xs12 sm4 pr-2>
									<label class="control-label">Shipped Alone</label>
									<vue-numeric
										currency="$"
										currency-symbol-position="prefix"
										separator=","
										:precision="2"
										:min="0"
										v-model="shipment.shipment_alone_price"
										class="form-control primary-input"
									/>
								</v-flex>
								<v-flex xs12 sm4>
									<label class="control-label">With others</label>
									<div class="dflex align-center gap-10">
										<span class="dflex align-center">
											<vue-numeric
											currency="$"
											currency-symbol-position="prefix"
											separator=","
											:precision="2"
											:min="0"
											v-model="shipment.shipment_with_price"
											class="form-control primary-input"
										/>
										<v-icon class="clear-btn" @click="deleteShipment(index)">clear</v-icon>
									</span>
										<v-btn
										class="add-option-btn"
									>
										<v-icon>add</v-icon>
									</v-btn>
								</div>
								</v-flex>
							</v-layout>
							</v-flex>
						</v-flex>

						<v-flex xs12 sm7 v-else>
							<v-flex xs12 section-title>
								<h4>Digital Product Upload</h4>
							</v-flex>
							<v-flex xs12 product-section>
								<h4 class="option-title">.Zip file only, 2GB max upload</h4>
								<digital-uploader :digitalContent="digital_content" />
							</v-flex>
						</v-flex>

						<v-flex xs12  pa-0 mt-5>
							<h2 class="album-info-title">Collaborators</h2>
						</v-flex>
						<v-flex xs12 class="collaborator-section first-child">
							<v-flex xs12>
								<h2 class="album-info-title-x mt-3">
									<span class="my-2 mr-2">
										Collaborators ({{ product.collaborators.length }})
									</span>
									<v-btn
										v-if="product.collaborators.length < 3"
										class="add-option-btn"
										@click.native="addCollaborator()"
									>
										<v-icon>add</v-icon>
									</v-btn>
								</h2>
							</v-flex>

							<v-flex xs12 sm7 pa-0>
								<v-container fluid grid-list-lg px-0 py-0>
									<v-layout
										row
										creator-wrapper
										v-if="
											product.collaborators && product.collaborators.length > 0
										"
									>
										<v-flex xs12 sm4>
											<label class="control-label">Owner</label>
											<label class="creator-name">{{ $store.state.auth.user.username }}</label>
										</v-flex>

										<v-flex xs6 sm4>
											<label class="control-label">Profit Share</label>
											<label class="creator-share">{{ creator_share }}</label>
										</v-flex>

										<v-flex xs6 sm4>
											<label class="control-label">Recoup Cost</label>
											<span class="dflex align-center">
												<input
													type="text"
													class="form-control"
													v-model="product.creator_recoup_cost"
												/>
												<v-icon class="clear-btn" @click="deleteCollaborator(index)">clear</v-icon>
											</span>
										</v-flex>
									</v-layout>
									<v-layout
										row
										collaborator-wrapper
										v-for="(collaborator, index) in product.collaborators"
										:key="index"
									>
										<v-flex xs12 sm4>
											<label class="control-label">Collaborators</label>
											<v-select
												:items="users"
												v-model="collaborator.user_id"
												item-text="username"
												item-value="id"
												chips
												class="pt-0"
												autocomplete
												no-data-text="No collaborator available"
												clearable
											>
												<template slot="selection" slot-scope="data">
													<v-chip
														@input="data.parent.selectItem(data.item)"
														:selected="data.selected"
														:key="JSON.stringify(data.item)"
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
											<!-- <input type="text" class="form-control" v-model="collaborator.user_id"> -->
										</v-flex>
										<v-flex xs12 sm4>
											<label class="control-label">Profit Share</label>
											<v-select
												v-bind:items="profit_share_types"
												v-model="collaborator.user_share"
												item-text="name"
												item-value="id"
												class="pt-0"
												autocomplete
											></v-select>
										</v-flex>
									</v-layout>
								</v-container>
							</v-flex>
						</v-flex>

						<v-flex xs12 class="collaborator-section">
							<v-flex xs12>
								<h2 class="album-info-title-x mt-3">
									<span class="my-2 mr-2">
										Seller Policies ({{ product.collaborators.length }})
									</span>

									<v-btn
										class="add-option-btn ma-0"
										@click.native="showPolicyActive = !showPolicyActive"
									>
										<span v-if="!showPolicyActive">
											<v-icon>add</v-icon>
										</span>
										<span v-else>
											<v-icon>remove</v-icon>
										</span>
									</v-btn>
								</h2>
							</v-flex>
							<v-flex xs12 sm7 pa-0>
								<v-layout
									row
									creator-wrapper
									mt-1
									v-if="showPolicyActive == true"
								>
									<policy-tab ref="policyTab" :user="user" :textAreaHeight="'180px'" :updateUser="updateUser" :isSaveAllMode="true" class="px-2" />
								</v-layout>
							</v-flex>
						</v-flex>

						<v-flex xs12  pa-0 mt-5>
							<h2 class="album-info-title">Options</h2>
						</v-flex>

						<v-flex xs12 sm12>
							<label class="control-label mt-4 mb-3">Live stream only </label>
							<v-checkbox
							value="show_only_stream"
							label="Only For Live Stream"
							v-model="product.show_status"
							class="live-label"
						>
						<template slot="label" class="get_c">
							<span class="text-muted">Check box if product is available for live stream only</span>
						</template>
						</v-checkbox>
						</v-flex>



						<v-flex xs12 submit-section>
							<hr class="my-4" />
							<v-btn
								class="product-save-btn"
								:class="{'app-blue': isAvailableToAddProduct, 'cursor-pointer': !isAvailableToAddProduct}"
								@click.native="beforeSaveProduct()"
								:disabled="!isAvailableToAddProduct"
								>Release</v-btn
							>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</div>

		<v-dialog v-model="collaborators_confirm_dialog">
			<v-card>
				<v-card-title class="headline"
					>Confirm Collaborators</v-card-title
				>
				<v-card-text
					>Make sure to add any collaborators to your product, once it's
					uploaded you won't be able to add collaborators</v-card-text
				>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						class="blue--text darken-1"
						flat="flat"
						:loading="loading"
						@click.native="saveProduct()"
						>Ok</v-btn
					>
					<v-btn
						class="blue--text darken-1"
						flat="flat"
						@click.native="hideCollaboratorsConfirmDialog()"
						>Cancel</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-if="product_upload_successfully"
			v-model="product_upload_successfully"
			content-class="collaborators-success-dialog"
		>
			<v-card>
				<v-card-title class="headline">
					<div class="dflex gap-15">
						<div>
							<img src="../../assets/black-check.svg" width="25">
						</div>
						<div class="headline-text">
							Your product was released! <a href="/upload/product/add" style="text-decoration: underline !important">Upload another</a> or go to <router-link to="/upload" style="text-decoration: underline !important">upload page</router-link> 
						</div>
					</div>
				</v-card-title>

				<div class="modal-body">
					<div class="dflex gap-20">
						<div class="w-30 border-round">
							<img :src="confirmationImage" width="100%">
						</div>
						<div class="w-70">
							<div>
								<h3 class="main-head">{{ product.name }}</h3>
								<p class="mb-0 second-head mx-0 my-0">{{ currentUser.username }}</p>
								<p class="light-text mx-0 my-0">{{ product_category }}</p>

							</div>
							<hr class="my-4">

							<div class="dflex align-center gap-20">
								<div class="dflex align-center gap-15">
									<a href="#"><img src="../../assets/email-xcon.svg" width="16"></a>
									<a href="#"><img src="../../assets/facebook-xcon.svg" width="10"></a>
									<a href="#"><img src="../../assets/twitter-xcon.svg" width="17"></a>
								</div>
								<div class="url-bar">
									<p class="mx-0 my-0">{{ productUrl }}</p>
									<div
										class="clipboard-btn"
										v-clipboard:copy="productUrl"
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
							<img src="../../assets/album-drop.gif" width="100%">
						</div>
					</div>

				</div>
			</v-card>
		</v-dialog>
	</div>

	</div>
</template>

<script type="text/javascript" src="./add_product.ctrl.js"></script>
<style src="../../../static/styles/sell.scss" lang="scss" scoped />
<style scoped src="../../../static/styles/album.scss" lang="scss" />

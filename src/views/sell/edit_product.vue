<template>
	<div class="page upload-child sell-page product-page mx-5 margin-top-header" v-if="product && currentUser.creator_verified">
		<div class="page-content">
			<v-layout row wrap>
				<v-flex xs12>
					<v-layout row wrap class="">
						<v-flex xs12 sm10>
							<h2 class="my-2 album-info-title">Info</h2>
						</v-flex>
						<v-flex xs12 sm10>
							<v-layout row wrap content-section>
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
															v-if="product_image1_url"
															:style="`background-image:url(${product_image1_url})`"
														></div>
														<div
															class="product-image-upload-section"
															v-if="!product_image1_url"
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
														<label for="product_image_file" v-if="product_image1_url"
															>Change</label
														><label
															class="text-btn"
															v-if="product_image1_url"
															@click="deleteProductImage('product_image1')"
														>
															/ Delete</label
														>
													</div>
												</v-flex>

												<v-flex xs12 sm6>
													<!-- <label class="control-label">Image 1<label class="required">*</label></label> -->
													<div class="product-image-section">
														<!-- <img class="product-image" id="product_image1"  v-if="product.image1"/> -->
														<div
															class="product-image"
															id="product_image2"
															v-if="product_image2_url"
															:style="`background-image:url(${product_image2_url})`"
														></div>
														<div
															class="product-image-upload-section"
															v-if="!product_image2_url"
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
														<label for="product_image_file2" v-if="product_image2_url"
															>Change</label
														><label
															class="text-btn"
															v-if="product_image2_url"
															@click="deleteProductImage('product_image2')"
														>
															/ Delete</label
														>
													</div>
												</v-flex>

												<v-flex xs12 sm6>
													<!-- <label class="control-label">Image 1<label class="required">*</label></label> -->
													<div class="product-image-section">
														<!-- <img class="product-image" id="product_image1"  v-if="product.image1"/> -->
														<div
															class="product-image"
															id="product_image3"
															v-if="product_image3_url"
															:style="`background-image:url(${product_image3_url})`"
														></div>
														<div
															class="product-image-upload-section"
															v-if="!product_image3_url"
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
														<label for="product_image_file3" v-if="product_image3_url"
															>Change</label
														><label
															class="text-btn"
															v-if="product_image3_url"
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
										<v-flex xs12 sm5 pr-2>
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

								<v-flex xs12
									class="collaborator-section"
									v-if="['pending', 'collaborated'].indexOf(product.status) != -1"
								>
									<v-flex xs12>
										<h4 class="option-title">Collaborators</h4>
									</v-flex>
									<v-flex
										xs12
										v-if="
											product.status == 'pending' && product.collaborators.length < 3
										"
									>
										<v-btn
											class="add-option-btn ma-0"
											@click.native="addCollaborator()"
										>
											<v-icon>add</v-icon> Add another collaborator
										</v-btn>
									</v-flex>
									<v-flex xs12 sm6 pa-0>
										<v-layout
											row
											creator-wrapper
											v-if="product.collaborators && product.collaborators.length > 0"
										>
											<v-flex xs12 sm6>
												<label class="control-label"
													>Creator<label class="required">*</label></label
												>
												<label class="creator-name">{{
													$store.state.auth.user.username
												}}</label>
											</v-flex>
											<v-flex xs6 sm3>
												<label class="control-label"
													>Profit Share<label class="required">*</label></label
												>
												<label class="creator-share">{{ creator_share }}</label>
											</v-flex>
											<v-flex xs6 sm3>
												<label class="control-label">Recoup Cost</label>
												<input
													type="text"
													class="form-control"
													v-model="product.creator_recoup_cost"
													:disabled="product.status != 'pending'"
												/>
											</v-flex>
										</v-layout>
										<v-layout
											row
											product-option-content
											v-for="(collaborator, index) in product.collaborators"
											:key="index"
										>
											<v-flex xs12 sm6>
												<label class="control-label"
													>Collaborators<label class="required">*</label></label
												>
												<v-select
													v-bind:items="users"
													v-model="collaborator.user_id"
													item-text="username"
													item-value="id"
													chips
													class="pt-0"
													no-data-text="No collaborator available"
													:disabled="product.status != 'pending'"
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
												<!-- <input type="text" class="form-control" v-model="collaborator.user_id"> -->
											</v-flex>
											<v-flex xs12 sm6>
												<label class="control-label"
													>Profit Share<label class="required">*</label></label
												>
												<v-select
													:items="profit_share_types"
													v-model="collaborator.user_share"
													item-text="name"
													item-value="id"
													class="pt-0"
													:disabled="product.status != 'pending'"
													autocomplete
												></v-select>
											</v-flex>
											<v-flex xs12 sm3>
												<label class="control-label">Status</label>
												{{ collaborator.status }}
											</v-flex>
											<v-icon
												class="clear-btn"
												@click="deleteCollaborator(index)"
												v-if="product.status == 'pending'"
												>clear</v-icon
											>
										</v-layout>
									</v-flex>
								</v-flex>
								<v-flex xs12>
									<v-btn
										class="product-save-btn"
										@click.native="beforeSaveProduct()"
										:disabled="!isAvailableToUpdateProduct"
										:loading="loading"
										>Save</v-btn
									>
									<a @click="cancelToSaveProduct()" class="cancel-button">Cancel</a>
								</v-flex>
							</v-layout>
						</v-flex>

					</v-layout>
				</v-flex>

			</v-layout>
		</div>
	</div>
</template>

<script type="text/javascript" src="./edit_product.ctrl.js"></script>
<style src="../../../static/styles/sell.scss" lang="scss" scoped />
<style scoped src="../../../static/styles/album.scss" lang="scss" />

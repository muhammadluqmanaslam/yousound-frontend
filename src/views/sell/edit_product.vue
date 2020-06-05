<template>
  <v-layout row wrap class="page sell-page product-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Sell</h2>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="product">
      <v-layout row wrap content-section>
        <v-flex xs12 sm6>
          <v-flex xs12 section-title>
            <h4>Edit Product</h4>
          </v-flex>
          <v-flex xs12 product-section>
            <v-flex xs12 form-group>
              <label class="control-label">Product Name<label class="required">*</label></label>
              <input type="text" class="form-control" v-model="product.name">
            </v-flex>
            <v-flex xs12 form-group>
              <label class="control-label">Description</label>
              <textarea v-model="product.description" class="product-description form-control non-resizable" maxlength="250"></textarea>
            </v-flex>
            <v-flex xs12 form-group>
              <v-radio-group v-model="product.stock_status" row>
                <v-radio value="active" label="Active" light></v-radio>
                <v-radio value="hidden" label="Hidden" light></v-radio>
                <!-- <v-radio value="sold_out" label="Sold Out" light></v-radio>
                <v-radio value="coming_soon" label="Coming Soon" light></v-radio> -->
              </v-radio-group>
            </v-flex>
            <v-flex xs12 form-group>
              <label class="control-label">Category<span class="required">*</span></label>
              <input type="text" class="form-control" :value="productCategoryName" disabled>
              <!-- <v-select
                v-bind:items="product_categories"
                v-model="product.category"
                item-text="name"
                item-value="id"
                @change="onChangeProductCategory"
                class="pt-0"
                autocomplete
              ></v-select> -->
            </v-flex>
            <v-flex xs12 mt-4>
              <v-checkbox value="show_only_stream" label="Only For Live Stream" v-model="product.show_status"></v-checkbox>
              <span class="grey--text lighten-2">(product will not appear on user profile if checked)</span>
            </v-flex>
          </v-flex>
        </v-flex>

        <v-flex xs12 sm6>
          <v-flex xs12 section-title>
            <h4>Pricing & Options</h4>
          </v-flex>
          <v-flex xs12 product-section>
            <!-- <v-flex xs12 form-group>
              <label class="control-label">Price</label>
              <input type="text" class="form-control" v-model="product.price">
            </v-flex> -->
            <v-flex xs12 price-option-section>
              <h4 class="option-title">Price & Options({{ product.variants.length }})
                <v-btn class="add-option-btn" @click.native="addVariant()" v-if="!isDigitalProduct">
                  <v-icon>add</v-icon>
                </v-btn>
              </h4>
            </v-flex>
            <v-layout row mb-2 product-option-content form-group v-for="(variant, index) in product.variants" :key="index">
              <v-flex xs12 sm4>
                <label class="control-label">Name<label class="required">*</label></label>
                <input type="text" class="form-control" v-model="variant.name" :disabled="isDigitalProduct">
              </v-flex>
              <v-flex xs12 sm4 v-if="!isDigitalProduct">
                <label class="control-label">In Stock<label class="required">*</label></label>
                <input type="text" class="form-control" v-model="variant.quantity">
              </v-flex>
              <v-flex xs12 sm4>
                <label class="control-label">Price<label class="required">*</label></label>
                <input type="text" class="form-control" v-model="variant.price">
              </v-flex>
              <v-icon class="clear-btn" @click="deleteVariant(index)" v-if="!variant.id">clear</v-icon>
              <v-icon class="clear-btn" v-else>block</v-icon>
            </v-layout>
            <p class="d-inline-flex grey--text lighten-2">e.g. "Large - Black" "100" "$30.00"</p>
          </v-flex>
        </v-flex>

        <v-flex xs12 sm6 v-if="!isDigitalProduct">
          <v-flex xs12 section-title>
            <h4>Shipping & Tax</h4>
          </v-flex>
          <v-flex xs12 product-section>
            <v-flex xs12 price-option-section form-group>
              <h4 class="option-title">Options({{ product.shipments.length }})
                <v-btn class="add-option-btn" @click.native="addShipment()">
                  <v-icon>add</v-icon>
                </v-btn>
              </h4>
            </v-flex>
            <v-layout row mb-2 product-option-content v-for="(shipment, index) in product.shipments" :key="index">
              <v-flex xs12 sm4>
                <label class="control-label">Destination</label>
                <v-select
                  v-bind:items="destinations"
                  v-model="shipment.country"
                  item-text="name"
                  item-value="name"
                  class="pt-0"
                  autocomplete
                />
              </v-flex>
              <v-flex xs12 sm4>
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
                <vue-numeric
                  currency="$"
                  currency-symbol-position="prefix"
                  separator=","
                  :precision="2"
                  :min="0"
                  v-model="shipment.shipment_with_price"
                  class="form-control primary-input"
                />
              </v-flex>
              <v-icon class="clear-btn" @click="deleteShipment(index)" v-if="!shipment.id">clear</v-icon>
              <v-icon class="clear-btn" v-else>block</v-icon>
            </v-layout>

            <v-flex xs12 pa-0 mt-4>
              <h4 class="option-title">Tax</h4>
            </v-flex>
            <v-layout row>
              <v-flex xs12 sm4 v-if="product.is_vat">
                <label class="control-label">Sellers Country</label>
                <v-select
                  :items="countries"
                  v-model="product.seller_location"
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
                  :items="states"
                  v-model="product.seller_location"
                  item-text="name"
                  item-value="name"
                  @change="changeTaxPercent"
                  class="pt-0"
                  autocomplete
                />
              </v-flex>
              <v-flex xs12 sm4>
                <label class="control-label" v-if="product.is_vat">Tax</label>
                <label class="control-label" v-else>State Tax</label>
                <vue-numeric
                  currency="%"
                  currency-symbol-position="suffix"
                  separator=","
                  :precision="3"
                  :min="0"
                  :max="100"
                  v-model="product.tax_percent"
                  class="form-control primary-input"
                />
              </v-flex>
            </v-layout>
            <v-flex xs12 mt-2>
              <v-checkbox
                label="International seller click for VAT tax"
                v-model="product.is_vat"
                @change="resetTaxPercent"
              />
              <div class="tax-description">
                <label>*</label>
                <p class="d-inline-flex grey--text lighten-2">
                  Some countries might not have the accurate tax rate.<br/>
                  You can manually type the tax rate in the textbox.
                </p>
              </div>
            </v-flex>
          </v-flex>
        </v-flex>
        <v-flex xs12 sm6 v-else>
          <v-flex xs12 section-title>
            <h4>Digital Product Upload</h4>
          </v-flex>
          <v-flex xs12 product-section>
            <h4 class="option-title">.Zip file only, 2GB max upload</h4>
            <digital-uploader :digitalContent = "digital_content" />
          </v-flex>
        </v-flex>

        <v-flex xs12 sm6>
          <v-flex xs12 section-title>
            <h4>Images</h4>
          </v-flex>
          <v-flex xs12 product-section>
            <div class="vertical-middle-div">
              <v-layout row>
                <v-flex xs12 sm4>
                  <label class="control-label">Image 1<label class="required">*</label></label>
                  <div class="product-image-section">
                    <div class="product-image" id="product_image1"  v-if="product_image1_url" :style="`background-image:url(${product_image1_url})`"></div>
                    <div class="product-image-upload-section" v-if="!product_image1_url">
                      <input type="file" name="product_image_file1" id="product_image_file1" class="add-product-image-file" accept="image/*" @change="imageChanged('product_image1', $event)">
                      <label for="product_image_file1">
                        <v-icon class="camera">photo_camera</v-icon>Add Image
                      </label>
                    </div>
                  </div>
                  <div class="product-image-change-section">
                    <input type="file" name="product_image_file1" id="product_image_file1" class="change-product-image-file" accept="image/*" @change="imageChanged('product_image1', $event)">
                    <label for="product_image_file1" v-if="product_image1_url">Change</label><label class="text-btn" v-if="product_image1_url" @click="deleteProductImage('product_image1')"> / Delete</label>
                  </div>
                </v-flex>
                <v-flex xs12 sm4>
                  <label class="control-label">Image 2</label>
                  <div class="product-image-section">
                    <div class="product-image" id="product_image2" v-if="product_image2_url" :style="`background-image:url(${product_image2_url})`"></div>
                    <div class="product-image-upload-section" v-if="!product_image2_url">
                      <input type="file" name="product_image_file2" id="product_image_file2" class="add-product-image-file" accept="image/*" @change="imageChanged('product_image2', $event)">
                      <label for="product_image_file2">
                        <v-icon class="camera">photo_camera</v-icon>Add Image
                      </label>
                    </div>
                  </div>
                  <div class="product-image-change-section">
                    <input type="file" name="product_image_file2" id="product_image_file2" class="change-product-image-file" accept="image/*" @change="imageChanged('product_image2', $event)">
                    <label for="product_image_file2" v-if="product_image2_url">Change</label><label class="text-btn" v-if="product_image2_url" @click="deleteProductImage('product_image2')"> / Delete</label>
                  </div>
                </v-flex>
                <v-flex xs12 sm4>
                  <label class="control-label">Image 3</label>
                  <div class="product-image-section">
                    <div class="product-image" id="product_image3" v-if="product_image3_url" :style="`background-image:url(${product_image3_url})`"></div>
                    <div class="product-image-upload-section" v-if="!product_image3_url">
                      <input type="file" name="product_image_file3" id="product_image_file3" class="add-product-image-file" accept="image/*" @change="imageChanged('product_image3', $event)">
                      <label for="product_image_file3">
                        <v-icon class="camera">photo_camera</v-icon>Add Image
                      </label>
                    </div>
                  </div>
                  <div class="product-image-change-section">
                    <input type="file" name="product_image_file3" id="product_image_file3" class="change-product-image-file" accept="image/*" @change="imageChanged('product_image3', $event)">
                    <label for="product_image_file3" v-if="product_image3_url">Change</label><label class="text-btn" v-if="product_image3_url" @click="deleteProductImage('product_image3')"> / Delete</label>
                  </div>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </v-flex>
        <v-flex xs12 class="collaborator-section" v-if="['pending', 'collaborated'].indexOf(product.status) != -1">
          <v-flex xs12>
            <h4 class="option-title">Collaborators</h4>
          </v-flex>
          <v-flex xs12 v-if="product.status == 'pending' && product.collaborators.length < 3">
            <v-btn class="add-option-btn ma-0" @click.native="addCollaborator()">
              <v-icon>add</v-icon> Add another collaborator
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6 pa-0>
            <v-layout row creator-wrapper v-if="product.collaborators && product.collaborators.length > 0">
              <v-flex xs12 sm6>
                <label class="control-label">Creator<label class="required">*</label></label>
                <label class="creator-name">{{ $store.state.auth.user.display_name }}</label>
              </v-flex>
              <v-flex xs6 sm3>
                <label class="control-label">Profit Share<label class="required">*</label></label>
                <label class="creator-share">{{ creator_share }}</label>
              </v-flex>
              <v-flex xs6 sm3>
                <label class="control-label">Recoup Cost</label>
                <input type="text" class="form-control" v-model="product.creator_recoup_cost" :disabled="product.status != 'pending'">
              </v-flex>
            </v-layout>
            <v-layout row product-option-content v-for="(collaborator, index) in product.collaborators" :key="index">
              <v-flex xs12 sm6>
                <label class="control-label">Collaborators<label class="required">*</label></label>
                <v-select
                  v-bind:items="users"
                  v-model="collaborator.user_id"
                  item-text="username"
                  item-value="id"
                  chips
                  max-height="auto"
                  class="pt-0"
                  no-data-text="No collaborator available"
                  :disabled="product.status != 'pending'"
                  autocomplete>
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      class="chip--select-multi">
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url">
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.thumb.url"/>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.username"></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
                <!-- <input type="text" class="form-control" v-model="collaborator.user_id"> -->
              </v-flex>
              <v-flex xs12 sm6>
                <label class="control-label">Profit Share<label class="required">*</label></label>
                <v-select
                  :items="profit_share_types"
                  v-model="collaborator.user_share"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                  :disabled="product.status != 'pending'"
                  autocomplete></v-select>
              </v-flex>
              <v-flex xs12 sm3>
                <label class="control-label">Status</label>
                {{ collaborator.status }}
              </v-flex>
              <v-icon class="clear-btn" @click="deleteCollaborator(index)" v-if="product.status == 'pending'">clear</v-icon>
            </v-layout>
          </v-flex>
        </v-flex>
        <v-flex xs12>
          <v-btn class="product-save-btn" @click.native="beforeSaveProduct()" :disabled="!isAvailableToUpdateProduct">Save</v-btn>
          <a @click="cancelToSaveProduct()" class="cancel-button">Cancel</a>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-dialog v-model="collaborators_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Confirm Collaborators</v-card-title>
        <v-card-text>Make sure to add any collaborators to your product, once it's uploaded you won't be able to add collaborators</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="saveProduct()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="hideCollaboratorsConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script type="text/javascript" src="./edit_product.ctrl.js"></script>

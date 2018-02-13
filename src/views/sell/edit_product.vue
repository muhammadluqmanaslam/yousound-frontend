<template>
  <v-layout row wrap class="page sell-page product-page" v-if="isPageReady">
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

    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Sell</h2>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="product">
      <v-layout row wrap content-section>
        <v-flex xs12 sm6>
          <v-flex xs12 section-title>
            <h4>Edit Product</h4>
          </v-flex>
          <v-flex xs12 product-section>
            <v-flex xs12 form-group>
              <label class="control-label">Product Name</label>
              <input type="text" class="form-control" v-model="product.name">
            </v-flex>
            <v-flex xs12 form-group>
              <label class="control-label">Description</label>
              <textarea v-model="product.description" class="product-description form-control non-resizable" maxlength="250"></textarea>
            </v-flex>
            <v-flex xs6>
              <v-radio-group v-model="product.stock_status" row>
                <v-radio value="active" label="Active" light></v-radio>
                <v-radio value="hidden" label="Hidden" light></v-radio>
                <!-- <v-radio value="sold_out" label="Sold Out" light></v-radio>
                <v-radio value="coming_soon" label="Coming Soon" light></v-radio> -->
              </v-radio-group>
            </v-flex>
            <v-flex xs12>
              <label class="control-label">Category</label>
              <v-select
                v-bind:items="product_categories"
                item-text="name"
                item-value="id"
                v-model="product.category"
                class="pt-0"
                autocomplete></v-select>
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
                <v-btn class="add-option-btn" @click.native="addVariant()" v-if="isEditable">
                  <v-icon>add</v-icon>
                </v-btn>
              </h4>
            </v-flex>
            <v-layout row product-option-content form-group v-for="(variant, index) in product.variants" :key="index">
              <v-flex xs12 sm4>
                <label class="control-label">Name</label>
                <input type="text" class="form-control" v-model="variant.name" :readonly="!isEditable">              
              </v-flex>
              <v-flex xs12 sm4>
                <label class="control-label">In Stock</label>
                <input type="text" class="form-control" v-model="variant.quantity" :readonly="!isEditable">              
              </v-flex>
              <v-flex xs12 sm4>
                <label class="control-label">Price</label>
                <input type="text" class="form-control" v-model="variant.price" :readonly="!isEditable">
              </v-flex>
              <v-icon class="clear-btn" @click="deleteVariant(index)" v-if="isEditable">clear</v-icon>
            </v-layout>
          </v-flex>
        </v-flex>
        <v-flex xs12 sm6>
          <v-flex xs12 section-title>
            <h4>Shipping</h4>
          </v-flex>
          <v-flex xs12 product-section>
            <v-flex xs12 price-option-section form-group>
              <h4 class="option-title">Options({{ product.shipments.length }})
                <v-btn class="add-option-btn" @click.native="addShipment()" v-if="isEditable">
                  <v-icon>add</v-icon>
                </v-btn>
              </h4>
            </v-flex>
            <v-layout row product-option-content v-for="(shipment, index) in product.shipments" :key="index">
              <v-flex xs12 sm4>
                <label class="control-label">Destination</label>
                <v-select
                  v-bind:items="destinations"
                  v-model="shipment.country"
                  item-text="name"
                  item-value="name"
                  class="pt-0"
                  :disabled="!isEditable"
                  autocomplete></v-select>
              </v-flex>
              <v-flex xs12 sm4>
                <label class="control-label">Shipped Alone</label>
                <input type="text" class="form-control" v-model="shipment.shipment_alone_price" :readonly="!isEditable">
              </v-flex>
              <v-flex xs12 sm4>
                <label class="control-label">With others</label>
                <input type="text" class="form-control" v-model="shipment.shipment_with_price" :readonly="!isEditable">
              </v-flex>
              <v-icon class="clear-btn" @click="deleteShipment(index)" v-if="isEditable">clear</v-icon>
            </v-layout>
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
                  <label class="control-label">Image 1</label>
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
            <v-layout>
              <v-flex xs12 sm6 pa-0>
                <h4 class="option-title">Collaborators</h4>
              </v-flex>
              <v-flex xs12 sm6 pa-0>
                <a @click="learnMore()" class="cancel-button mx-0">Learn more about merch collaborators</a>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="product.status == 'pending' && product.collaborators.length < 3">
            <v-flex xs12 sm6 pa-0>
              <v-btn class="add-option-btn ma-0" @click.native="addCollaborator()">
                <v-icon>add</v-icon> Add another collaborator
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs12 sm6 pa-0>
            <v-layout row product-option-content v-for="(collaborator, index) in product.collaborators" :key="index">
              <v-flex xs12 sm6>
                <label class="control-label">Collaborators<label class="required">*</label></label>
                <v-select
                  v-bind:items="artists"
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
  </v-layout>
</template>
<script type="text/javascript" src="./edit_product.ctrl.js"></script>

<template>
  <div class="page upload-child sell-page product-page mx-5" v-if="currentUser.creator_verified">
    <topbarNotification
      :content="topBarContent"
      ctaTitle="Connect"
      :cta="{ name: 'ManageIndex', params: { tab: 'payment' } }"
    />
    <content-top-header>
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
    </content-top-header>

    <div class="page-content">
      <v-layout row wrap>
        <v-flex xs12 v-if="isPageReady">
          <v-layout wrap row content-section>
            <v-flex xs12 sm7>
              <h2 class="my-2">Info</h2>
              <v-flex xs12 product-section>
                <v-flex xs12 form-group>
                  <label class="control-label max-char-label">
                    <span class="__title">
                      <label class="required">*</label>
                      Product Name
                    </span>
                    <span class="max-char">80 char max</span>
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
                      Description
                    </span>
                    <span class="max-char">2000 char max</span>
                  </label>

                  <textarea
                    v-model="product.description"
                    class="product-description form-control non-resizable"
                    maxlength="2000"
                  ></textarea>
                </v-flex>

                <!-- <v-flex xs12 form-group>
                  <v-radio-group v-model="product.stock_status" row>
                    <v-radio value="active" label="Active" light></v-radio>
                    <v-radio value="hidden" label="Hidden" light></v-radio>
                  </v-radio-group>
                </v-flex> -->

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

                <v-flex xs12 mt-4>
                  <v-checkbox
                    value="show_only_stream"
                    label="Only For Live Stream"
                    v-model="product.show_status"
                  >
                  <template slot="label">
                    <span class="black--text">Check box if product is available for <b>live stream only</b></span>
                  </template>
                  </v-checkbox>
                  <span class="grey--text lighten-2">
                    (product will not appear on user profile if checked)
                  </span>
                </v-flex>
              </v-flex>
            </v-flex>

            <v-flex xs12 sm7>
              <v-flex xs12 product-section>
              <h2 class="my-2">
                <label class="required">*</label>
                Images
              </h2>
                <v-container grid-list-lg px-0>
                  <v-layout wrap row>
                    <v-flex xs12 sm4>
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

                    <v-flex xs12 sm4>
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

                    <v-flex xs12 sm4>
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

            <v-flex xs12 sm7>
              <v-flex xs12 product-section>
                <!-- <v-flex xs12 form-group>
                  <label class="control-label">Price</label>
                  <input type="text" class="form-control" v-model="product.price">
                </v-flex> -->
                <v-flex xs12 price-option-section>
                  <h2 class="">
                    Price & Options ({{ product.variants.length }})
                    <v-btn
                      class="add-option-btn"
                      @click.native="addVariant()"
                      v-if="!isDigitalProduct"
                    >
                      <v-icon>add</v-icon>
                    </v-btn>
                  </h2>
                </v-flex>
                <v-layout
                  row
                  product-option-content
                  form-group
                  v-for="(variant, index) in product.variants"
                  :key="index"
                >
                  <v-flex xs12 sm4>
                    <label class="control-label">
                      Option Name
                      </label>
                    <span class="dflex align-center">
                      <label class="required">*</label>
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
                    <label class="control-label">Price</label>
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
                  </v-flex>
                </v-layout>
                <!-- <p class="d-inline-flex grey--text lighten-2">
                  e.g. "Large - Black" "100" "30.00"
                </p> -->
              </v-flex>
            </v-flex>

            <v-flex xs12 sm7 v-if="!isDigitalProduct">
              <v-flex xs12 product-section>

                <v-flex xs12 pa-0 mt-4>
                  <h2 class="">Tax</h2>
                </v-flex>
                <v-layout wrap row>
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

                <v-flex xs12 mt-2 product-section>
                  <v-checkbox
                    v-model="product.is_vat"
                    @change="resetTaxPercent"
                  >
                    <template slot="label">
                      <span class="black--text">Sellers outside of US check box for VAT/GST</span>
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

                <v-flex xs12 price-option-section form-group>
                  <h2 class="">
                    <span class="my-2 mr-2">
                      Shipping & Handling ({{ product.shipments.length }})
                    </span>
                    <v-btn
                      class="add-option-btn"
                      @click.native="addShipment()"
                    >
                      <v-icon>add</v-icon>
                    </v-btn>
                  </h2>
                </v-flex>
                <v-layout
                  row
                  product-option-content
                  v-for="(shipment, index) in product.shipments"
                  :key="index"
                >
                  <v-flex xs12 sm4>
                    <label class="control-label">Destination</label>

                    <span class="dflex align-center">
                      <label class="required">*</label>
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

            <div class="divider"></div>

            <v-flex xs12 class="collaborator-section first-child">
              <v-flex xs12>
                <h2 class="">
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

                <h2 class="">
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
            <v-flex xs12 submit-section>
              <hr class="mb-4" />
              <v-btn
                class="product-save-btn"
                :class="{'app-blue': isAvailableToAddProduct, 'cursor-pointer': !isAvailableToAddProduct}"
                @click.native="beforeSaveProduct()"
                :disabled="!isAvailableToAddProduct"
                >Submit</v-btn
              >
              <!-- <a @click="cancelToSaveProduct()" class="cancel-button mr-2"
                >Cancel</a
              > -->
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
  </div>
</template>

<script type="text/javascript" src="./add_product.ctrl.js"></script>
<style src="../../../static/styles/sell.scss" lang="scss" scoped>

<template>
  <div row wrap class="page manage-album-page">
    <div class="d-flex">
      <div class="page-content" v-if="currentUser && isPageReady">
        <div>
            <product-item
            v-for="(product, index) in setProductFilter()"
            :index="index"
            :key="index"
            :product="product"
            :deleteItem="openProductDeleteConfirmDialog"
            @releaseButtonAction="releaseProduct"
            @acceptCollaboration="acceptCollaboration"
            @denyCollaboration="denyCollaboration"
            ></product-item>
        </div>
        <v-dialog v-model="showReleaseProductModal" style="margin-top: 3%" content-class="finish-modal">
          <album-finish-modal v-if="showReleaseProductModal"
            :item="releaseProduct"
            type="product"
            :promote="showPromoteModal"
            :dismiss="dismissFinishDialog"
          />
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./manageProduct.ctrl.js"></script>

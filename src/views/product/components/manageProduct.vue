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
            ></product-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./manageProduct.ctrl.js"></script>

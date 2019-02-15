<template>
  <v-flex xs12 sm12 class="ys-dialog-container">
    <v-layout row wrap class="ys-dialog-dismiss" @click="dismiss()"></v-layout>
    <v-layout row wrap class="ys-dialog ys-product-dialog">
      <v-flex xs3 pr-2>
        <div class="product-cover" :style="{'background-image': 'url(' + product.covers[0].cover.url + ')'}"/></div>
        <v-flex x12 mt-4 mb-3 py-2 border-top border-bottom>
          <h4>Product Info</h4>
        </v-flex>
        <v-flex x12 product-name>
          {{ product.name }}
        </v-flex>
        <v-flex x12>
          <label>Product id: <span></span></label>
        </v-flex>
        <v-flex x12>
          <label>Buyer transaction: <span></span></label>
        </v-flex>
        <v-flex x12 mt-4 mb-3 py-2 border-top border-bottom>
          <h4>Total Sales</h4>
        </v-flex>
      </v-flex>
      <v-flex xs9 border-left>
        <v-tabs dark class="white" v-model="active_tab">
          <v-tabs-bar class="transparent pl-4 mb-3">
            <v-tabs-item v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              ripple
            >{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="searchValue"
              append-icon="search"
              label="Search"
              class="user-serach search-input mr-4"
              single-line
              hide-details
            />
          </v-tabs-bar>
          <v-tabs-items style="border:none;">
            <v-tabs-content key="orders" id="orders">
              <v-data-table
                :headers="orders_headers"
                :items="orders"
                :pagination.sync="orders_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_orders"
                class="orders-table"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left"></td>
                  <td class="text-xs-left"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td></td>
                </template>
              </v-data-table>
            </v-tabs-content>
            <v-tabs-content key="open_cases" id="open_cases">
              <v-data-table
                :headers="open_cases_headers"
                :items="open_cases"
                :pagination.sync="open_cases_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_open_cases"
                class="open_cases-table"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td></td>
                </template>
              </v-data-table>
            </v-tabs-content>
            <v-tabs-content key="closed_cases" id="closed_cases">
              <v-data-table
                :headers="closed_cases_headers"
                :items="closed_cases"
                :pagination.sync="closed_cases_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_closed_cases"
                class="closed_cases-table"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td class="text-xs-center"></td>
                  <td></td>
                </template>
              </v-data-table>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript" src="./product_detail_dialog.ctrl.js"></script>

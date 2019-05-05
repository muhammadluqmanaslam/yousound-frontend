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
          <label>Product id: <span>{{ product.id }}</span></label>
        </v-flex>
        <v-flex x12>
          <label>Upload Date: <span>{{ product.created_at | formatDate }}</span></label>
        </v-flex>
        <v-flex x12>
          <label>Current Price: <span>${{ product.price | formatNumber }}</span></label></label>
        </v-flex>
        <v-flex x12 mt-4 mb-3 py-2 border-top border-bottom>
          <h4>Total Sales</h4>
        </v-flex>
        <v-list subheader two-line>
          <v-list-tile :key="user.slug">
            <v-list-tile-avatar class="mr-2">
              <img v-bind:src="user.avatar.url"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="user.display_name"></v-list-tile-title>
              <v-list-tile-sub-title>Uploader</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-if="product.collaborators && product.collaborators.length > 0"
            v-for="c in product.contributors"
            :key="c.user.slug"
          >
            <v-list-tile-avatar class="mr-2">
              <img v-bind:src="c.user.avatar.url"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="c.user.display_name"></v-list-tile-title>
              <v-list-tile-sub-title v-html="c.user_role"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
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
            <v-tabs-content key="items" id="items">
              <v-data-table
                :headers="items_headers"
                :items="items"
                :pagination.sync="items_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_items"
                class="table-wrapper"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image-wrapper">
                      <div class="avatar-image" :style="{'background-image': 'url(' + props.item.order.customer.avatar.url + ')'}"></div>
                      <div class="avatar-title">{{ props.item.order.customer.username }}</div>
                    </div>
                  </td>
                  <td class="text-xs-left">{{ props.item.order.created_at | formatDate }}</td>
                  <td class="text-xs-center">${{ props.item.price | formatNumber }}</td>
                  <td class="text-xs-center">{{ props.item.quantity }}</td>
                  <td class="text-xs-center">${{ props.item.shipping_cost | formatNumber }}</td>
                  <td class="text-xs-center">${{ props.item.tax_cost | formatNumber }}</td>
                  <td class="text-xs-left">{{ fullAddress(props.item.order.shipping_address) }}</td>
                </template>
              </v-data-table>
            </v-tabs-content>
            <v-tabs-content key="open_tickets" id="open_tickets">
              <v-data-table
                :headers="open_tickets_headers"
                :items="open_tickets"
                :pagination.sync="open_tickets_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_open_tickets"
                class="table-wrapper"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image-wrapper">
                      <div class="avatar-image" :style="{'background-image': 'url(' + props.item.open_user.avatar.url + ')'}"></div>
                      <div class="avatar-title">{{ props.item.open_user.username }}</div>
                    </div>
                  </td>
                  <td class="text-xs-center">{{ props.item.created_at | formatDate }}</td>
                  <td class="text-xs-center">{{ props.item.reason }}</td>
                  <td class="text-xs-center">{{ props.item.description }}</td>
                  <td class="text-xs-center">
                    <v-menu
                      down
                      offset-y
                    >
                      <v-btn round slot="activator">
                        <v-icon dark right>more_horiz</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile
                          class="default-menu-item"
                          @click.native="closeTicket(props.item)"
                        >
                          <v-list-tile-title>
                            <label>Close</label>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </td>
                </template>
              </v-data-table>
            </v-tabs-content>
            <v-tabs-content key="closed_tickets" id="closed_tickets">
              <v-data-table
                :headers="closed_tickets_headers"
                :items="closed_tickets"
                :pagination.sync="closed_tickets_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_closed_tickets"
                class="table-wrapper"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image-wrapper">
                      <div class="avatar-image" :style="{'background-image': 'url(' + props.item.open_user.avatar.url + ')'}"></div>
                      <div class="avatar-title">{{ props.item.open_user.username }}</div>
                    </div>
                  </td>
                  <td class="text-xs-center">{{ props.item.created_at | formatDate }}</td>
                  <td class="text-xs-center">{{ props.item.closed_at | formatDate }}</td>
                  <td class="text-xs-center">{{ props.item.reason }}</td>
                  <td class="text-xs-center">{{ props.item.description }}</td>
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

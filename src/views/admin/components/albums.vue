<template>
  <v-card flat v-if="isPageReady">
    <div class="normal-tab">
      <v-tabs dark v-model="albums_tab">
        <v-tabs-bar class="transparent pl-4 pt-4">
          <v-tabs-item v-for="tab in albums_tabs"
            :key="tab.id"
            :href="'#' + tab.id"
            @click.native="onTab(tab.id)"
            ripple>{{ tab.title }}</v-tabs-item>
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchValue"
            append-icon="search"
            label="Search"
            class="user-serach search-input mr-4"
            single-line
            hide-details></v-text-field>
        </v-tabs-bar>
        <v-tabs-items style="border:none;">
          <v-tabs-content key="published" id="published">
            <v-card flat>
              <v-data-table
                :headers="album_headers"
                :items="published_albums"
                :pagination.sync="published_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_published_albums"
                class="album-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="album-cover-image" :style="{'background-image': 'url(' + props.item.cover.thumb.url + ')'}"></div>
                    {{ props.item.name }}
                  </td>
                  <td class="text-xs-left">{{ props.item.user.display_name }}</td>
                  <td class="text-xs-center">{{ props.item.played }}</td>
                  <td class="text-xs-center">{{ props.item.downloaded }}</td>
                  <td class="text-xs-center">{{ props.item.reposted }}</td>
                  <td class="text-xs-center">
                    <label class="recommended-text" v-if="props.item.recommended">Yes</label>
                    <label class="unrecommended-text" v-else>No</label>
                  </td>
                  <td class="text-xs-right">
                    <v-menu offset-y class="more-menu">
                      <v-btn dark slot="activator">
                        <v-icon>settings</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile key="delete" class="default-menu-item" @click.native="deleteAlbum(props.item)">
                          <v-list-tile-title>
                            <label>Delete</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="recommended" class="default-menu-item" v-if="!props.item.recommended" @click.native="recommendAlbum(props.item)">
                          <v-list-tile-title>
                            <label>Recommend</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="unrecommended" class="default-menu-item" v-if="props.item.recommended" @click.native="unrecommendAlbum(props.item)">
                          <v-list-tile-title>
                            <label>Unrecommend</label>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }} out of {{ total_published_albums }}
                </template>
              </v-data-table>
            </v-card>
          </v-tabs-content>
          <v-tabs-content key="privated" id="privated">
            <v-card flat>
              <v-data-table
                :headers="album_headers"
                :items="privated_albums"
                :pagination.sync="privated_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_privated_albums"
                class="album-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="album-cover-image" :style="{'background-image': 'url(' + props.item.cover.thumb.url + ')'}"></div>
                    {{ props.item.name }}
                  </td>
                  <td class="text-xs-left">{{ props.item.user.display_name }}</td>
                  <td class="text-xs-center">{{ props.item.played }}</td>
                  <td class="text-xs-center">{{ props.item.downloaded }}</td>
                  <td class="text-xs-center">{{ props.item.reposted }}</td>
                  <td class="text-xs-center">
                    <label class="recommended-text" v-if="props.item.recommended">Yes</label>
                    <label class="unrecommended-text" v-else>No</label>
                  </td>
                  <td class="text-xs-right">
                    <v-menu offset-y class="more-menu">
                      <v-btn dark slot="activator">
                        <v-icon>settings</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile key="delete" class="default-menu-item" @click.native="deleteAlbum(props.item)">
                          <v-list-tile-title>
                            <label>Delete</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="recommended" class="default-menu-item" v-if="!props.item.recommended" @click.native="recommendAlbum(props.item)">
                          <v-list-tile-title>
                            <label>Recommend</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="unrecommended" class="default-menu-item" v-if="props.item.recommended" @click.native="unrecommendAlbum(props.item)">
                          <v-list-tile-title>
                            <label>Unrecommend</label>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }} out of {{ total_privated_albums }}
                </template>
              </v-data-table>
            </v-card>
          </v-tabs-content>
          <v-tabs-content key="product" id="product">
            <v-card flat>
              <v-data-table
                :headers="product_headers"
                :items="products"
                :pagination.sync="product_pagination"
                :rows-per-page-items="per_page_options"
                :total-items="total_products"
                class="product-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="album-cover-image" :style="{'background-image': 'url(' + props.item.covers[0].cover.thumb.url + ')'}"></div>
                    {{ props.item.name }}
                  </td>
                  <td class="text-xs-left">{{ props.item.merchant.display_name }}</td>
                  <td class="text-xs-center">{{ props.item.sold }}</td>
                  <td class="text-xs-center">{{ props.item.created_at | formatDate }}</td>
                  <td class="text-xs-center">{{ props.item.reposted }}</td>
                  <td class="text-xs-center">
                    <label class="recommended-text" v-if="props.item.recommended">Yes</label>
                    <label class="unrecommended-text" v-if="!props.item.recommended">No</label>
                  </td>
                  <td class="text-xs-right">
                    <v-menu offset-y class="more-menu">
                      <v-btn dark slot="activator">
                        <v-icon>settings</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile key="delete" class="default-menu-item" @click.native="deleteProduct(props.item)">
                          <v-list-tile-title>
                            <label>Delete</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="unrecommended" class="default-menu-item" v-if="props.item.recommended">
                          <v-list-tile-title>
                            <label>Unrecommend</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="recommended" class="default-menu-item" v-else>
                          <v-list-tile-title>
                            <label>Recommend</label>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }} out of {{ total_products }}
                </template>
              </v-data-table>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </div>
  </v-card>
</template>

<script type="text/javascript" src="./albums.ctrl.js"></script>

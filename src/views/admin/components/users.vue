<template> 
  <v-card flat v-if="isPageReady">
    <div class="normal-tab">
      <v-tabs dark v-model="user_tab">
        <v-tabs-bar class="transparent pl-4 pt-4">
          <v-tabs-item v-for="tab in users_tabs"
            :key="tab.id"
            :href="'#' + tab.id"
            ripple>{{ tab.title }}</v-tabs-item>
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="user_search"
            append-icon="search"
            label="Search"
            class="user-serach search-input mr-4"
            single-line
            hide-details></v-text-field>
        </v-tabs-bar>
        <v-tabs-items style="border:none;">
          <v-tabs-content v-for="tab in users_tabs" :key="tab.id" :id="tab.id">
            <v-card flat>
              <v-data-table
                :headers="user_headers"
                :items="filtered_users"
                :search="user_search"
                :pagination.syc="pagination"
                :rows-per-page-items="per_page_options"
                class="user-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image-wrapper">
                      <div class="avatar-image" :style="{'background-image': 'url(' + props.item.avatar.url + ')'}"></div>
                      <div class="avatar-title">{{ props.item.username }}</div>
                    </div>
                  </td>
                  <td class="text-xs-left"><v-switch hide-details class="setting-cell-switch" label="" v-model="props.item.enabled_live_video" @change="toggleLiveVideo(props.item)"></v-switch></td>
                  <td class="text-xs-left"><v-switch hide-details class="setting-cell-switch" label="" v-model="props.item.enabled_live_video_free" @change="toggleLiveVideoFree(props.item)"></v-switch></td>
                  <td class="text-xs-left">{{ props.item.email }}</td>
                  <td class="text-xs-left">
                    <a v-if="props.item.social_user_id"
                        :href="`https://twitter.com/intent/user?user_id=${props.item.social_user_id}`" target="_blank">
                      https://twitter.com/intent/user?user_id={{ props.item.social_user_id }}
                    </a>
                  </td>
                  <td class="text-xs-left">{{ props.item.created_at|formatDate }}</td>
                  <td class="text-xs-left">
                    <router-link :to="`/${props.item.approver.slug}`" v-if="props.item.approver">
                      {{ props.item.approver.display_name }}
                    </router-link>
                  </td>
                  <td class="text-xs-left">{{ props.item.status }}</td>
                  <td class="text-xs-right">
                    <v-menu offset-y class="more-menu" v-if="props.item.status!='inactive'">
                      <v-btn dark slot="activator">
                        <v-icon>settings</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile v-if="['suspended', 'pending'].indexOf(props.item.status)!==-1"
                            key="activate"
                            class="default-menu-item"
                            @click.native="activateAccount(props.item)">
                          <v-list-tile-title>
                            <label>Activate account</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-if="['active', 'pending'].indexOf(props.item.status)!==-1"
                          key="suspend"
                          class="default-menu-item"
                          @click.native="suspendAccount(props.item)">
                          <v-list-tile-title>
                            <label>Suspend account</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-if="props.item.user_type=='listener' && props.item.status=='active'"
                          key="convert"
                          class="default-menu-item"
                          @click.native="convertToArtist(props.item)">
                          <v-list-tile-title>
                            <label>Convert to artist</label>
                          </v-list-tile-title>
                        </v-list-tile>

                        <!-- <v-list-tile v-if="props.item.user_type=='moderator' && props.item.status=='suspended'"
                            key="activate"
                            class="default-menu-item"
                            @click.native="activateAccount(props.item)">
                          <v-list-tile-title>
                            <label>Activate moderator status</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-if="props.item.user_type=='moderator' && props.item.status=='active'"
                            key="deactivate"
                            class="default-menu-item"
                            @click.native="suspendAccount(props.item)">
                          <v-list-tile-title>
                            <label>Deactivate moderator</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-if="props.item.user_type!='moderator' && props.item.status=='suspended'"
                            key="reinstate"
                            class="default-menu-item"
                            @click.native="activateAccount(props.item)">
                          <v-list-tile-title>
                            <label>Reinstate account</label>
                          </v-list-tile-title>
                        </v-list-tile> -->
                      </v-list>
                    </v-menu>
                  </td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop}">
                  From {{ pageStart }} to {{ pageStop }} out of {{ filtered_users.length }}
                </template>
              </v-data-table>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </div>
  </v-card>
</template>

<script type="text/javascript" src="./users.ctrl.js"></script>

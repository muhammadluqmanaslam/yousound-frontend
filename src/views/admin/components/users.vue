<template> 
  <v-card flat v-if="isPageReady">
    <v-tabs dark class="white" v-model="active_tab">
      <v-tabs-bar class="transparent pl-4 mt-4">
        <v-tabs-item
          v-for="tab in users_tabs"
          @click.native="onTab(tab.id)"
          :key="tab.id"
          :href="`#${tab.id}`"
          ripple
        >{{ tab.title }}</v-tabs-item>
        <v-tabs-slider color="black"></v-tabs-slider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="user_search"
          append-icon="search"
          label="Search"
          class="user-serach search-input mr-4"
          single-line
          hide-details
        />
      </v-tabs-bar>
      <v-tabs-items style="border:none;">
        <v-tabs-content
          v-for="tab in users_tabs"
          :key="tab.id"
          :id="tab.id"
        >
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <v-card flat>
      <v-data-table
        :headers="headers"
        :items="users"
        :pagination.sync="pagination"
        :rows-per-page-items="per_page_options"
        :total-items="total_users"
        class="user-table"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">
            <div class="avatar-image-wrapper">
              <div class="avatar-image" :style="{'background-image': 'url(' + props.item.avatar.url + ')'}"></div>
              <div class="avatar-title">{{ props.item.username }}</div>
            </div>
          </td>
          <td class="text-xs-left" v-if="active_tab.id=='moderators'">
            <v-switch
              v-model="props.item.enabled_view_direct_messages"
              @change="toggleViewDirectMessages(props.item)"
              label=""
              hide-details
              class="setting-cell-switch"
            ></v-switch>
          </td>
          <td class="text-xs-left">
            <v-switch
              v-model="props.item.enabled_live_video"
              @change="toggleLiveVideo(props.item)"
              label=""
              hide-details
              class="setting-cell-switch"
            ></v-switch>
          </td>
          <td class="text-xs-left">
            <v-switch
              v-model="props.item.enabled_live_video_free"
              @change="toggleLiveVideoFree(props.item)"
              label=""
              hide-details
              class="setting-cell-switch"
            ></v-switch>
          </td>
          <td>{{ props.item.free_streamed_time | timeInHours }}</td>
          <td class="text-xs-center">
            <v-btn
              v-if="props.item.stream && props.item.stream.status === 'running'"
              @click.natvie="openStreamDeleteConfirmDialog(props.item)"
              fab
              dark
              color="pink"
              class="stop-stream-btn"
            >
              <v-icon>stop</v-icon>
            </v-btn>
          </td>
          <td>{{ props.item.free_stream_seconds | timeInHours }}</td>
          <td>{{ props.item.demand_stream_seconds | timeInHours }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">
            <a
              v-if="props.item.social_user_id"
              :href="`https://twitter.com/intent/user?user_id=${props.item.social_user_id}`"
              target="_blank"
            >
              https://twitter.com/intent/user?user_id={{ props.item.social_user_id }}
            </a>
          </td>
          <td class="text-xs-left">{{ props.item.created_at|formatDate }}</td>
          <td class="text-xs-left">
            <router-link
              v-if="props.item.approver"
              :to="`/${props.item.approver.slug}`"
            >
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

                <v-list-tile
                  v-if="['active', 'pending'].indexOf(props.item.status)!==-1"
                  @click.native="suspendAccount(props.item)"
                  key="suspend"
                  class="default-menu-item"
                >
                  <v-list-tile-title>
                    <label>Suspend account</label>
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile
                  v-if="props.item.status=='active' && ['listener', 'moderator'].indexOf(props.item.user_type) > -1"
                  @click.native="updateUserRole(props.item, 'artist')"
                  key="convert_artist"
                  class="default-menu-item"
                >
                  <v-list-tile-title>
                    <label>Convert to artist</label>
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile
                  v-if="props.item.status=='active' && ['artist', 'moderator'].indexOf(props.item.user_type) > -1"
                  @click.native="updateUserRole(props.item, 'listener')"
                  key="activate"
                  class="default-menu-item"
                >
                  <v-list-tile-title>
                    <label>Convert to listener</label>
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile
                  v-if="props.item.status=='active' && ['listener', 'artist'].indexOf(props.item.user_type) > -1"
                  @click.native="updateUserRole(props.item, 'moderator')"
                  key="convert_moderator"
                  class="default-menu-item"
                >
                  <v-list-tile-title>
                    <label>Convert to moderator</label>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </template>
        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
          From {{ pageStart }} to {{ pageStop }} out of {{ total_users }}
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="show_stream_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Stream</v-card-title>
        <v-card-text>If you click OK, the stream will no longer be available. Click OK to delete, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="red--text darken-1" flat @click.native="deleteStream()">Ok</v-btn>
          <v-btn class="green--text darken-1" flat @click.native="closeStreamDeleteConfirmDialog()">Cancel</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_free_stream_toggle_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Stream Running</v-card-title>
        <v-card-text>Stream is running for now. Please stop the stream before toggle free stream option</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="red--text darken-1" flat @click.native="closeFreeStreamToggleConfirmDialog()">Ok</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script type="text/javascript" src="./users.ctrl.js"></script>

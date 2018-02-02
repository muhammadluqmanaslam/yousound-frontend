<template>
  <v-card flat v-if="isPageReady">
    <approve-modal v-if="show_approve_modal"
      :item="user"
      :dismiss="closeApproveModal"
      :approveButtonAction="approveUser"
      :denyButtonAction="denyUser"></approve-modal>
    <deny-modal v-if="show_deny_modal"
      :item="user"
      :dismiss="closeDenyModal"
      :submission="viewSubmission"></deny-modal>

    <div class="normal-tab">
      <v-tabs dark v-model="signups_tab">
        <v-tabs-bar class="transparent pl-4 pt-4">
          <v-tabs-item v-for="tab in signups_tabs"
            :key="tab.id"
            :href="'#' + tab.id"
            ripple>{{ tab.title }}</v-tabs-item>
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="signups_search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
            class="user-serach search-input mr-4"></v-text-field>
        </v-tabs-bar>
        <v-tabs-items style="border:none;">
          <v-tabs-content v-for="tab in signups_tabs" :key="tab.id" :id="tab.id">
            <v-card flat>
              <v-data-table v-if="tab.id=='waiting'"
                v-bind:headers="waiting_headers"
                v-bind:items="filtered_items"
                v-bind:search="signups_search"
                class="user-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image" :style="{'background-image': 'url(' + props.item.avatar.url + ')'}"></div>
                    {{ props.item.display_name }}
                  </td>
                  <td class="text-xs-left">{{ props.item.request_role | capitalize }}</td>
                  <td class="text-xs-left">{{ props.item.created_at | formatDate }}</td>
                  <td class="text-xs-right">
                    <v-btn color="primary" class="signups-btn" @click.native="openApproveModal(props.item)">Verify User</v-btn>
                  </td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }}
                </template>
              </v-data-table>
              <v-data-table v-if="tab.id=='approved'"
                v-bind:headers="approved_headers"
                v-bind:items="filtered_items"
                v-bind:search="signups_search"
                class="user-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image" :style="{'background-image': 'url(' + props.item.avatar.url + ')'}"></div>
                    {{ props.item.display_name }}
                  </td>
                  <td class="text-xs-left">{{ props.item.request_role | capitalize }}</td>
                  <td class="text-xs-center">{{ props.item.created_at | formatDate }}</td>
                  <td class="text-xs-center">{{ props.item.approved_at | formatDate }}</td>
                  <td class="text-xs-left">{{ props.item.approver.display_name }}</td>
                  <td class="text-xs-left"><v-btn color="primary" class="signups-btn">Click to view</v-btn></td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }}
                </template>
              </v-data-table>
              <v-data-table v-if="tab.id=='denied'"
                v-bind:headers="denied_headers"
                v-bind:items="filtered_items"
                v-bind:search="signups_search"
                class="user-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image" :style="{'background-image': 'url(' + props.item.avatar.url + ')'}"></div>
                    {{ props.item.display_name }}
                  </td>
                  <td class="text-xs-left">{{ props.item.request_role | capitalize }}</td>
                  <td class="text-xs-center">{{ props.item.created_at | formatDate }}</td>
                  <td class="text-xs-center">{{ props.item.approved_at | formatDate }}</td>
                  <td class="text-xs-left">{{ props.item.approver.display_name }}</td>
                  <td class="text-xs-left"><v-btn color="primary" class="signups-btn">Click to view</v-btn></td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }}
                </template>
              </v-data-table>
              <v-data-table v-if="tab.id=='invite'"
                v-bind:headers="invite_headers"
                v-bind:items="filtered_items"
                v-bind:search="signups_search"
                class="user-table">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">
                    <div class="avatar-image" :style="{'background-image': 'url(' + props.item.avatar.url + ')'}"></div>
                    {{ props.item.display_name }}
                  </td>
                  <td class="text-xs-left">{{ props.item.request_role | capitalize }}</td>
                  <td class="text-xs-center">{{ props.item.created_at | formatDate }}</td>
                  <td class="text-xs-left">
                    <label :class="{'status-accepted':  props.item.status=='Accepted', 'status-expired': props.item.status=='Expired', 'status-pending': props.item.status=='Pending'}">{{ props.item.status }}</label>
                  </td>
                  <td class="text-xs-left">{{ props.item.invited_by }}</td>
                  <td class="text-xs-left"><v-btn color="primary" class="signups-btn profile">View profile</v-btn></td>
                </template>
                <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                  From {{ pageStart }} to {{ pageStop }}
                </template>
              </v-data-table>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </div>
  </v-card>
</template>

<script type="text/javascript" src="./signups.ctrl.js"></script>

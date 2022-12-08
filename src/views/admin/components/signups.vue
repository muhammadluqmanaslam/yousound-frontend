<template>
  <v-card flat v-if="isPageReady">
    <v-tabs dark class="white" v-model="active_tab">
      <v-tabs-bar class="transparent">
        <v-tabs-item
          v-for="tab in signups_tabs"
          @click.native="onTab(tab.id)"
          :key="tab.id"
          :href="'#' + tab.id"
          ripple
          >{{ tab.title }}</v-tabs-item
        >
        <!-- <v-tabs-slider color="black"></v-tabs-slider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search_value"
          @keyup.enter="onKeyEnter"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          class="user-serach search-input mr-4"
        /> -->
      </v-tabs-bar>
      <v-tabs-items style="border: none">
        <v-tabs-content v-for="tab in signups_tabs" :key="tab.id" :id="tab.id">
          <v-card flat>
            <v-data-table
              v-if="active_tab == 'waiting'"
              :headers="headers"
              :items="signups"
              :pagination.sync="pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_signups"
              class="user-table"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  <div class="avatar-image-wrapper">
                    <div
                      class="avatar-image"
                      :style="{
                        'background-image':
                          'url(' + props.item.avatar.url + ')',
                      }"
                    ></div>
                    <div class="avatar-title">{{ props.item.username }}</div>
                  </div>
                </td>
                <td class="text-xs-left">
                  {{ props.item.request_role | capitalize }}
                </td>
                <td class="text-xs-left">
                  {{ _.get(props.item, "genre.name", "") }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.created_at | formatDate }}
                </td>
                <td class="text-xs-left">
                  <router-link
                    v-if="props.item.inviter"
                    :to="`/${props.item.inviter.slug}`"
                    >{{ props.item.inviter.username }}</router-link
                  >
                </td>
                <td class="text-xs-right">
                  <v-btn
                    color="primary"
                    class="signups-btn"
                    @click.native="openApproveModal(props.item)"
                    >Verify User</v-btn
                  >
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_signups }}
              </template>
            </v-data-table>

            <v-data-table
              v-if="active_tab == 'co-signed'"
              :headers="headers"
              :items="signups"
              :pagination.sync="pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_signups"
              class="user-table"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  <div class="avatar-image-wrapper">
                    <div
                      class="avatar-image"
                      :style="{
                        'background-image':
                          'url(' + props.item.avatar.url + ')',
                      }"
                    ></div>
                    <div class="avatar-title">{{ props.item.username }}</div>
                  </div>
                </td>
                <td class="text-xs-left">
                  {{ props.item.request_role | capitalize }}
                </td>
                <td class="text-xs-left">
                  {{ _.get(props.item, "genre.name", "") }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.created_at | formatDate }}
                </td>
                <td class="text-xs-left">
                  <label
                    :class="{
                      'status-accepted': props.item.status == 'Accepted',
                      'status-expired': props.item.status == 'Expired',
                      'status-pending': props.item.status == 'Pending',
                    }"
                    >{{ props.item.status }}</label
                  >
                </td>
                <td class="text-xs-left">
                  <router-link
                    v-if="props.item.inviter"
                    :to="`/${props.item.inviter.slug}`"
                    >{{ props.item.inviter.username }}</router-link
                  >
                </td>
                <td class="text-xs-right">
                  <v-btn
                    @click.native="openApproveModal(props.item)"
                    color="primary"
                    class="signups-btn"
                    >Verify User</v-btn
                  >
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_signups }}
              </template>
            </v-data-table>

            <v-data-table
              v-if="active_tab == 'approved' || active_tab == 'denied'"
              :headers="headers"
              :items="signups"
              :pagination.syc="pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_signups"
              class="user-table"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  <div class="avatar-image-wrapper">
                    <div
                      class="avatar-image"
                      :style="{
                        'background-image':
                          'url(' + props.item.avatar.url + ')',
                      }"
                    ></div>
                    <div class="avatar-title">{{ props.item.username }}</div>
                  </div>
                </td>
                <td class="text-xs-left">
                  {{ props.item.request_role | capitalize }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.created_at | formatDate }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.approved_at | formatDate }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.approver ? props.item.approver.username : "" }}
                </td>
                <td class="text-xs-left">
                  <v-btn
                    color="primary"
                    class="signups-btn"
                    @click.native="openApproveModal(props.item)"
                    >Click to view</v-btn
                  >
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_signups }}
              </template>
            </v-data-table>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
    

    <signup-approve-modal
      v-if="show_approve_modal"
      :item="user"
      :dismiss="closeApproveModal"
      :approveButtonAction="approveUser"
      :denyButtonAction="denyUser"
      :activeTab = "active_tab"
      :loading = "loading"
    />

    <signup-deny-modal
      v-if="show_deny_modal"
      :item="user"
      :dismiss="closeDenyModal"
      :submission="viewSubmission"
      :loading="loading"
    />
  </v-card>
</template>

<script type="text/javascript" src="./signups.ctrl.js"></script>
<style src="./general.scss" lang="scss" scoped></style>

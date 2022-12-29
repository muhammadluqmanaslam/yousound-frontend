<template>
  <v-card flat v-if="isPageReady">
    <v-dialog v-model="show_verification_modal">
      <v-card>
        <v-card-title class="headline"
          >Free Account Credits</v-card-title
        >
        <v-card-text>
          Are you sure you want to make these changes?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="proceedFreeAccountCredit()"
            >Yes</v-btn
          >

          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="closeVerificationModal()"
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-tabs dark class="white" v-model="active_tab">
      <v-tabs-bar class="transparent">
        <v-tabs-item
          v-for="tab in subscriptions_tabs"
          @click.native="onTab(tab.id)"
          :key="tab.id"
          :href="'#' + tab.id"
          ripple
          >{{ tab.title }} {{ [tabs_count[tab.id]] }}</v-tabs-item
        >
       
      </v-tabs-bar>
      <v-tabs-items style="border: none">
        <v-tabs-content v-for="tab in subscriptions_tabs" :key="tab.id" :id="tab.id">
          <v-card flat>
            <v-data-table
              v-if="active_tab != 'free_credit'"
              :headers="headers"
              :items="subscriptions"
              :search="search"
              :pagination.sync="pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_subscriptions.length"
              class="user-table-x"
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
                <td class="text-xs-center">
                  {{ props.item.user_type | capitalize }}
                </td>
                <td v-if="active_tab === 'trial_drop_off'" class="text-xs-center">
                  {{ props.item.initial_signup_type }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.first_name }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.last_name }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.trial_start | formatDate }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.plan }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.email }}
                </td>
                <td class="text-xs-center">
                  {{ getNumberOfMonths(props.item.created_at) }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.trial_end | formatDate }}
                </td>
                <td v-if="active_tab == 'trial'" class="text-xs-center">
                  {{ props.item.trial_complete ? "Yes" : "No" }}
                </td>
                <td v-if="active_tab == 'trial'" class="text-xs-center">
                  {{  Math.round(Math.abs((new Date(props.item.trial_end) - new Date()) / 86400000)) }}
                </td>
                <td v-if="active_tab == 'cancelled'" class="text-xs-center">
                  {{ props.item.initial_signup_type }}
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_subscriptions }}
              </template>
            </v-data-table>

            <v-data-table
              v-if="active_tab == 'free_credit'"
              :headers="headers"
              :items="subscriptions"
              :pagination.sync="pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_subscriptions.length"
              :search="search"
              class="user-table-x"
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
                <td class="text-xs-center">
                  {{ props.item.user_type | capitalize }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.first_name }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.last_name }}
                </td>
                <td class="text-xs-center">
                  {{  Math.round(Math.abs((new Date(props.item.trial_end) - new Date()) / 86400000)) }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.plan }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.email }}
                </td>
                <td class="text-xs-center">
                  {{ getNumberOfMonths(props.item.created_at) }}
                </td>
                <td class="text-xs-center">
                  {{ props.item.trial_end | formatDate }}
                </td>
                <td class="text-xs-center width-200">
                  <div class="dflex align-center">
                    <v-select attach
                      class="month-dd"
                      :items="choose_month"
                      @change="selectMonth($event, props.item.id)"
                      ></v-select>

                      <div class="plus-icon-u ml-2">
                        <img src="../../../assets/plus.svg" width="12px" @click="increaseMonth(props.item.id)">
                      </div>

                  </div>
                </td>
                <td class="text-xs-center">
                  <v-btn
                    color="primary"
                    class="signups-btn"
                    @click.native="openVerificationModal(props.item)"
                    >Verify User</v-btn
                  >
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_subscriptions }}
              </template>
            </v-data-table>

          </v-card>
        </v-tabs-content>
      </v-tabs-items>
      <content-top-header class="bottomNav">
        <template slot="topHeader">
          <div class="dflex align-center">
            <div>
              <div class="big_view">
                <input type="text" class="search-input-general" placeholder="Search artists" v-model="search">
              </div>
              <div class="small_view">
                <div class="search_icon" @click="(small_input = !small_input)">
                  <img src="../../../assets/search.svg" width="20">
                </div>
                <div class="position_input" v-if="small_input">
                  <input type="text" class="search-input-small" placeholder="Search artists" v-model="search">
                </div>
              </div>
            </div>
            <div v-if="(active_tab == 'cancelled' || active_tab == 'trial_drop_off')" class="ml-3 dflex align-center e-main">
              <vue-json-to-csv :json-data="cancelledEmails"
                :labels="{ email: { title: 'Email' } }"
                :csv-title="active_tab == 'cancelled' ? 'Cancelled Emails' : 'Trial Drop Off Emails'"
                >
                <div class="export-emails">
                  <v-btn class="classic-btn">
                    <img src="../../../assets/export.png" width="16" class="mr-1">
                    Export emails
                  </v-btn>
                </div>
              </vue-json-to-csv>
              <div class="radio-btns">
                <input type="radio" name="same-group" value="all" :checked="selectedExportOption == 'All'" @click="filterCsvData('All')">
                <label>All</label>
              </div>
              <div class="radio-btns">
                <input type="radio" name="same-group" value="creators" @click="filterCsvData('creator')">
                <label>Creators</label>
              </div>
                <div class="radio-btns">
                <input type="radio" name="same-group" value="lilsteners" @click="filterCsvData('listener')">
                <label>Listeners</label>
              </div>
            </div>
          </div>
        </template>
      </content-top-header>
    </v-tabs>

  </v-card>
</template>

<script type="text/javascript" src="./subscriptions.ctrl.js"></script>
<style src="./general.scss" lang="scss" scoped></style>

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
      <v-tabs-bar class="transparent pl-4 mt-4">
        <v-tabs-item
          v-for="tab in subscriptions_tabs"
          @click.native="onTab(tab.id)"
          :key="tab.id"
          :href="'#' + tab.id"
          ripple
          >{{ tab.title }}</v-tabs-item
        >
        <v-tabs-slider color="black"></v-tabs-slider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search_value"
          @keyup.enter="onKeyEnter"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          class="user-serach search-input mr-4"
        />
      </v-tabs-bar>
      <v-tabs-items style="border: none">
        <v-tabs-content v-for="tab in subscriptions_tabs" :key="tab.id" :id="tab.id">
          <v-card flat>
            <v-data-table
              v-if="active_tab != 'free_credit'"
              :headers="headers"
              :items="subscriptions"
              :pagination.sync="pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_subscriptions"
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
                  {{ new Date() < new Date(props.item.trial_end) ? "Yes" : "No" }}
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
              :total-items="total_subscriptions"
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
                <td class="text-xs-center">
                  <v-select attach
                    class="month-dd"
                    :items="choose_month"
                    @change="selectMonth($event, props.item.id)"
                    ></v-select>
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
    </v-tabs>

  </v-card>
</template>

<script type="text/javascript" src="./subscriptions.ctrl.js"></script>

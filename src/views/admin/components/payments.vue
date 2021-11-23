<template>
  <v-card flat v-if="isPageReady">
    <v-tabs dark class="white" v-model="active_tab">
      <v-tabs-bar class="transparent pl-4 mt-4">
        <v-tabs-item
          v-for="tab in tabs"
          :key="tab.id"
          :href="'#' + tab.id"
          @click.native="onTab(tab.id)"
          ripple
          >{{ tab.title }}</v-tabs-item
        >
        <v-tabs-slider color="black"></v-tabs-slider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchValue"
          append-icon="search"
          label="Search"
          class="user-serach search-input mr-4"
          single-line
          hide-details
          v-on:keyup.enter="onKeyEnter"
        ></v-text-field>
      </v-tabs-bar>
      <v-tabs-items style="border: none">
        <v-tabs-content id="all">
          <v-card flat v-if="active_tab == 'all'">
            <v-data-table
              :headers="headers"
              :items="all_transactions"
              :pagination.sync="all_pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_all_transactions"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  <div
                    class="avatar-image"
                    :style="{
                      'background-image':
                        'url(' + props.item.sender.avatar.url + ')',
                    }"
                  ></div>
                  {{ props.item.sender.username }}
                </td>
                <td class="text-xs-left">
                  <div
                    class="avatar-image"
                    :style="{
                      'background-image':
                        'url(' + props.item.receiver.avatar.url + ')',
                    }"
                  ></div>
                  {{ props.item.receiver.username }}
                </td>
                <td class="text-xs-center">
                  ${{
                    (props.item.sent_amount + props.item.payment_fee)
                      | formatNumber
                  }}
                </td>
                <td class="text-xs-center">
                  ${{ props.item.received_amount | formatNumber }}
                </td>
                <td class="text-xs-center">{{ props.item.payment_type }}</td>
                <td class="text-xs-center">{{ props.item.status }}</td>
                <td class="text-xs-center">
                  {{ props.item.created_at | formatDate }}
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_all_transactions }}
              </template>
            </v-data-table>
          </v-card>
        </v-tabs-content>
        <v-tabs-content id="refunded">
          <v-card flat v-if="active_tab == 'refunded'">
            <v-data-table
              :headers="headers"
              :items="refunded_transactions"
              :pagination.sync="refunded_pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_refunded_transactions"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  <div
                    class="avatar-image"
                    :style="{
                      'background-image':
                        'url(' + props.item.sender.avatar.url + ')',
                    }"
                  ></div>
                  {{ props.item.sender.username }}
                </td>
                <td class="text-xs-left">
                  <div
                    class="avatar-image"
                    :style="{
                      'background-image':
                        'url(' + props.item.receiver.avatar.url + ')',
                    }"
                  ></div>
                  {{ props.item.receiver.username }}
                </td>
                <td class="text-xs-center">{{ props.item.sent_amount }}</td>
                <td class="text-xs-center">{{ props.item.received_amount }}</td>
                <td class="text-xs-center">{{ props.item.payment_type }}</td>
                <td class="text-xs-center">{{ props.item.status }}</td>
                <td class="text-xs-center">
                  {{ props.item.created_at | formatDate }}
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_refunded_transactions }}
              </template>
            </v-data-table>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-card>
</template>

<script type="text/javascript" src="./payments.ctrl.js"></script>

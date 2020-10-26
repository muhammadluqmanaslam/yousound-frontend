<template>
  <v-card flat v-if="isPageReady">
    <v-tabs dark class="white" v-model="active_tab">
      <v-tabs-bar class="transparent pl-4 mt-4">
        <v-tabs-item
          v-for="tab in tabs"
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
          class="search-input mr-4"
        />
      </v-tabs-bar>
      <v-tabs-items style="border: none">
        <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
          <v-card flat>
            <v-data-table
              :headers="headers"
              :items="items"
              :pagination.sync="pagination"
              :rows-per-page-items="per_page_options"
              :total-items="total_items"
              class="user-table"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  <div class="avatar-image-wrapper">
                    <div
                      class="avatar-image"
                      :style="{
                        'background-image':
                          'url(' + props.item.user.avatar.url + ')',
                      }"
                    ></div>
                    <div class="avatar-title">
                      {{ props.item.user.username }}
                    </div>
                  </div>
                </td>
                <td class="text-xs-left">
                  {{ props.item.name }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.created_at | formatDate }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.broadcast_time | timeInHours }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.total_viewers }}
                </td>
                <td class="text-xs-left">
                  {{ _.get(props.item, 'genre.name', '') }}
                </td>
                <td class="text-xs-left">
                  <template v-if="props.item.view_price > 0">
                    ${{ props.item.view_price | formatNumber }}
                  </template>
                  <template v-else> Free </template>
                </td>
                <td class="text-xs-right">
                  <v-btn
                    v-if="props.item.status === 'running'"
                    @click="openStreamStopConfirmDialog(props.item)"
                    fab
                    dark
                    color="pink"
                    class="stop-stream-btn"
                  >
                    <v-icon>stop</v-icon>
                  </v-btn>
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ total_items }}
              </template>
            </v-data-table>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <v-dialog v-model="show_stream_stop_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Stop a Stream</v-card-title>
        <v-card-text
          >If you click OK, the stream will no longer be available. Click OK to
          stop, or click Cancel.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="red--text darken-1" flat @click.native="deleteStream()"
            >Ok</v-btn
          >
          <v-btn
            class="green--text darken-1"
            flat
            @click.native="closeStreamStopConfirmDialog()"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script type="text/javascript" src="./streams.ctrl.js"></script>

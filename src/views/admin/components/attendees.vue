<template>
  <v-card flat v-if="isPageReady">
    <v-tabs dark class="white" v-model="current_tab">
      <v-tabs-bar class="transparent pl-4 mt-4">
        <v-tabs-item v-for="tab in tabs"
          :key="tab.id"
          :href="'#' + tab.id"
          ripple
        >{{ tab.title }}</v-tabs-item>
        <v-tabs-slider color="black"></v-tabs-slider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search_keyword"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          class="user-serach search-input mr-4"
        />
      </v-tabs-bar>
      <v-tabs-items style="border:none;">
        <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
          <v-card flat>
            <v-data-table v-if="tab.id == 'all'"
              :headers="attendee_headers"
              :items="attendees"
              :search="search_keyword"
              :pagination.syc="pagination"
              :rows-per-page-items="per_page_options"
              class="user-table">
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.full_name }}</td>
                <td class="text-xs-left">{{ props.item.display_name }}</td>
                <td class="text-xs-left">{{ props.item.email }}</td>
                <td class="text-xs-left">{{ props.item.account_type }}</td>
                <td class="text-xs-left">{{ props.item.referred_by }}</td>
                <td class="text-xs-center">
                  <template v-if="props.item.status == 'created'">
                    <v-btn color="primary" @click.native="inviteAttendee(props.item)">Invite</v-btn>
                  </template>
                  <template v-else>
                    {{ props.item.status | capitalize }}
                  </template>
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }}
              </template>
            </v-data-table>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-card>
</template>

<script type="text/javascript" src="./attendees.ctrl.js"></script>

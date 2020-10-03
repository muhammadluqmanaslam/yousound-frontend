<template>
  <v-card flat v-if="isPageReady">
    <v-tabs dark class="white" v-model="current_tab">
      <v-tabs-bar class="transparent pl-4 mt-4">
        <v-tabs-item
          v-for="tab in tabs"
          :key="tab.id"
          :href="'#' + tab.id"
          ripple
          >{{ tab.title }}</v-tabs-item
        >
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
      <v-tabs-items style="border: none">
        <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
          <v-card flat>
            <v-data-table
              v-if="tab.id == 'all'"
              :headers="attendee_headers"
              :items="attendees"
              :search="search_keyword"
              :rows-per-page-items="per_page_options"
              class="user-table"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.full_name }}</td>
                <td class="text-xs-left">{{ props.item.display_name }}</td>
                <td class="text-xs-left">{{ props.item.email }}</td>
                <td class="text-xs-left">{{ props.item.account_type }}</td>
                <td class="text-xs-left">{{ props.item.referred_by }}</td>
                <td class="text-xs-center">
                  <template
                    v-if="
                      ['created', 'expired'].indexOf(props.item.status) > -1
                    "
                  >
                    <v-btn
                      color="primary"
                      @click.native="inviteAttendee(props.item)"
                      >Invite</v-btn
                    >
                  </template>
                  <template v-else-if="props.item.status === 'invited'">
                    Invited by
                    {{ _.get(props.item, 'inviter.display_name', '--') }}
                  </template>
                  <template v-else>
                    {{ props.item.status | capitalize }}
                  </template>
                </td>
                <td class="text-xs-right">
                  <v-menu offset-y class="more-menu">
                    <v-btn dark slot="activator">
                      <v-icon>settings</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile
                        key="delete"
                        class="default-menu-item"
                        @click.native="
                          openAttendeeDeleteConfirmDialog(props.item)
                        "
                      >
                        <v-list-tile-title>
                          <label>Delete</label>
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </td>
              </template>
              <template slot="pageText" slot-scope="{ pageStart, pageStop }">
                From {{ pageStart }} to {{ pageStop }} out of
                {{ attendees.length }}
              </template>
            </v-data-table>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <v-dialog v-model="show_attendee_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete an Attendee</v-card-title>
        <v-card-text
          >If you click OK, the attendee will be permanently . Click OK to
          delete &lt;<b>{{ attendee.full_name }}</b
          >({{ attendee.email }})&gt;, or click Cancel.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="deleteAttendee(attendee)"
            >Ok</v-btn
          >
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="closeAttendeeDeleteConfirmDialog()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script type="text/javascript" src="./attendees.ctrl.js"></script>

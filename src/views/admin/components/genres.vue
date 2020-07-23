<template>
  <v-card flat v-if="isPageReady">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-select
          v-bind:items="genre_categories"
          v-model="genre_category"
          class="normal-input ml-4"
          item-text="name"
          item-value="id"
          autocomplete
        />
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-right pr-4">
        <v-text-field
          name="genre_search"
          label="Add New Genre"
          id="genre_search"
          class="normal-input search-input"
          v-model="genre_search"
        />
        <v-btn color="primary" @click.native="addGenre()">SUBMIT</v-btn>
      </v-flex>
    </v-layout>

    <v-data-table
      :headers="genre_headers"
      :items="filtered_genres"
      :search="genre_search"
      :rows-per-page-items="per_page_options"
      class="genre-table"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-edit-dialog @save="updateGenre(props.item)" lazy>
            {{ props.item.name }}
            <v-text-field
              slot="input"
              label="Edit"
              v-model="props.item.name"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">
          <v-menu offset-y class="more-menu">
            <v-btn dark slot="activator">
              <v-icon>settings</v-icon>
            </v-btn>
            <v-list>
              <!-- <v-list-tile key="edit" class="default-menu-item" @click.native="updateGenre(props.item)">
                <v-list-tile-title>
                  <label>Edit</label>
                </v-list-tile-title>
              </v-list-tile> -->
              <v-list-tile
                key="delete"
                class="default-menu-item"
                @click.native="deleteGenre(props.item)"
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
        {{ filtered_genres.length }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script type="text/javascript" src="./genres.ctrl.js"></script>

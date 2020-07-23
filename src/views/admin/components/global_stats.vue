<template>
  <v-card flat>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-select
          :items="globalstats_categories"
          v-model="globalstats_category"
          class="normal-input ml-4"
          autocomplete
        />
      </v-flex>
    </v-layout>

    <v-data-table
      :items="globalstats"
      class="globalstats-table"
      :rows-per-page-items="per_page_options"
      hide-headers
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.value }}</td>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script type="text/javascript" src="./global_stats.ctrl.js"></script>

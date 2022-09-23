<template>
  <div class="col-md-8 col-md-offset-2">
    <div id="people">
      <v-client-table :data="tableData" :columns="columns" :key="tableData.id">
        <!-- @row-click="onRowClick" -->
        <!-- reject button and confirm button -->
        <template slot="action" slot-scope="props">
          <v-btn flat class="my-0" @click.native="approve(props.row.id, 'approve')">
            Approve
          </v-btn>
          <v-btn flat class="my-0" @click.native="approve(props.row.id, 'reject')">
            Reject
          </v-btn>
        </template>
      </v-client-table>
    </div>
  </div>
</template>

<script type="text/javascript" src="./verifications.js"></script>
<style src="../../../static/styles/verifications.scss" lang="scss" scoped>

</style>
<template>
  <div class="col-md-8 col-md-offset-2">
      <div id="people">
          <v-client-table :data="tableData" :columns="columns" @click="Click">
            <!-- @row-click="onRowClick" -->
            <!-- reject button and confirm button -->
            <template slot="action" slot-scope="props">
              <button class="btn btn-danger" @click="reject(props.row.id)">Reject</button>
              <button class="btn btn-success" @click="confirm(props.row.id)">Confirm</button>
            </template>
          </v-client-table>
      </div>
  </div>
</template>





<script type="text/javascript" src="./verifications.js"></script>
<style src="../../../static/styles/verifications.scss" lang="scss" scoped></style>
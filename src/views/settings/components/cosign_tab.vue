<template>
  <div class="main-section">
    <v-container>
      <v-data-table
        :headers="user_headers"
        :items="users"
        :pagination.syc="pagination"
        :rows-per-page-items="per_page_options"
        :total-items="total_users"
        class="user-table">
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">
            <div class="avatar-image-wrapper">
              <div class="avatar-image" :style="{'background-image': 'url(' + props.item.avatar.url + ')'}"></div>
              <div class="avatar-title">{{ props.item.username }}</div>
            </div>
          </td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">
            <a v-if="props.item.social_user_id"
                :href="`https://twitter.com/intent/user?user_id=${props.item.social_user_id}`" target="_blank">
              https://twitter.com/intent/user?user_id={{ props.item.social_user_id }}
            </a>
          </td>
          <td class="text-xs-left">{{ props.item.created_at|formatDate }}</td>
          <!-- <td class="text-xs-left">
            <router-link :to="`/${props.item.approver.slug}`" v-if="props.item.approver">
              {{ props.item.approver.display_name }}
            </router-link>
          </td>
          <td class="text-xs-left">{{ props.item.status }}</td> -->
          <td class="text-xs-right">
            <template v-if="props.item.inviter">{{ props.item.inviter.display_name}}</template>
            <template v-else><v-btn round small color="primary" @click="coSign(props.item)">Co-Sign</v-btn></template>
          </td>
        </template>
        <template slot="pageText" slot-scope="{ pageStart, pageStop}">
          From {{ pageStart }} to {{ pageStop }} out of {{ users.length }}
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script type="text/javascript" src="./cosign_tab.ctrl.js"></script>

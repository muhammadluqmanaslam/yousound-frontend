<template>
  <div class="page payments-page">
    <send-message v-if="send_message_dialog"
      :receiver="messaging_user"
      :dismiss="hideSendMessageDialog"></send-message>

    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 relative>
      <div class="wallet-section" v-if="currentUser">
        <label class="">Available</label>
        <label class="available-money-amount">${{ currentUser.balance_amount|formatNumber }} <label class="currency">USD</label></label>
        <div class="action-section">
          <v-dialog v-model="withdraw_dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <h2>Transfer Money</h2>
              </v-card-title>
              <v-card-text class="withdraw-dialog">
                <label>Available<label class="available-money-amount"> ${{ currentUser.balance_amount|formatNumber }} <label class="currency">USD</label></label></label>
                <v-radio-group v-model="withdarw_option" :mandatory="true">
                  <v-radio label="All" value="all"></v-radio>
                  <v-radio label="Partial" value="partial"></v-radio>
                  <input 
                    type="text"
                    class="pl-2 pr-2 pt-1 pb-1 ma-1 ml-4"
                    v-model="withdraw_amount"
                    :disabled="withdarw_option=='all'"
                    placeholder="Amount"></v-text-field>
                  <label v-if="currentUser.balance_amount < withdraw_amount" class="pl-4 pr-2 error-text">Amount should be less than Avaialble Balance.</label>
                </v-radio-group>
              </v-card-text>
            <v-card-actions class="pa-3">
              <v-btn color="primary" :disabled="currentUser.balance_amount < withdraw_amount">Withdraw</v-btn>
              <v-btn color="primary" flat @click.stop="withdraw_dialog=false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <a class="link-btn" @click.self="withdraw_dialog=true">Withdraw Funds</a>
          <a class="link-btn pl-3">View Stripe Account</a>
        </div>
      </div>
      <h2 class="page-title">Payments</h2>
      <div class="payments-tab">
        <v-tabs dark v-model="activeTab">
          <v-tabs-bar class="transparent">
            <v-tabs-item v-for="tab in tabs"
              :key="tab.id"
              :href="'#' + tab.id"
              @click.native="onTab(tab.id)"
              ripple>{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
              <template v-if="!histories || histories.length == 0">
                <div class="empty-section" v-if="tab.id == 'received'">
                  <p class="empty-title">You have not received any payments</p>
                </div>
                <div class="empty-section" v-else-if="tab.id == 'sent'">
                  <p class="empty-title">You have not sent any payments</p>
                </div>
              </template>
              <table class="payment-table" v-else>
                <thead>
                  <tr>
                    <th width="40%" class="text-xs-left">Sender</th>
                    <th width="10%">Sent</th>
                    <th width="10%">Received</th>
                    <th width="10%">Type</th>
                    <th width="10%">Status</th>
                    <th width="10%">Date</th>
                    <th width="10%">Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(history, index) in histories" :key="index">
                    <td v-if="activeTab == 'received'">
                      <div class="profile-section">
                        <div class="user-avatar-image" :style="`background-image: url(${history.sender.avatar.thumb.url})`"></div>
                        <div class="user-info-section">
                          <label class="user-name">
                            {{ history.sender.display_name }}
                            <v-icon class="user-status online" v-if="history.sender.user_type == 'artist'">fa-check-circle</v-icon>
                          </label>
                          <!-- <label class="user-type" v-if="true">VERIFIED ARTIST</label> -->
                          <label class="user-type">{{ history.sender.user_type }}</label>
                        </div>
                      </div>
                    </td>
                    <td v-if="activeTab == 'sent'">
                      <div class="profile-section">
                        <div class="user-avatar-image" :style="`background-image: url(${history.receiver.avatar.thumb.url})`"></div>
                        <div class="user-info-section">
                          <label class="user-name">
                            {{ history.receiver.display_name }}
                            <v-icon class="user-status online" v-if="history.receiver.user_type == 'artist'">fa-check-circle</v-icon>
                          </label>
                          <!-- <label class="user-type" v-if="true">VERIFIED ARTIST</label> -->
                          <label class="user-type">{{ history.receiver.user_type }}</label>
                        </div>
                      </div>
                    </td>
                    <td class="text-xs-center">${{ history.sent_amount|formatNumber }}</td>
                    <td class="text-xs-center">${{ history.received_amount|formatNumber }}</td>
                    <td class="text-xs-center" style="text-transform: capitalize;">
                      <template v-if="history.payment_type == 'buy'">
                        <router-link :to="`/sell/order/${history.order_id}`">Buy</router-link>
                      </template>
                      <template v-else>
                        {{ history.description || history.payment_type }}
                      </template>
                    </td>
                    <td class="text-xs-center" :class="{'error--text': history.status == 'pending'}">{{ history.status | capitalize }}</td>
                    <td class="text-xs-center">{{ history.created_at | formatDate }}</td>
                    <td class="text-xs-center">
                      <v-btn class="send-message-btn" @click.native="showSendMessageDialog(history)">Message</v-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>

  </div>
</template>

<script type="text/javascript" src="./payments.ctrl.js"></script>

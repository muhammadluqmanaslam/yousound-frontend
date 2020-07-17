<template>
  <div class="page payments-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container pr-3">
          <h2 class="page-title">Payments</h2>

          <div class="wallet-section mb-4">
            <label class="">Total</label>
            <label class="available-money-amount">
              ${{ currentUser.balance_amount | formatNumber }}
              <label class="currency">USD</label>
            </label>
            <div class="action-section">
              <!-- a class="link-btn" @click.self="openWithdrawModal()">Withdraw Funds</a>
              <label>|</label> -->
              <a v-if="!$store.state.auth.user.stripe_connected" :href="stripeLink" target="_self">
                Connect Stripe Account
              </a>
              <!-- <a v-else class="link-btn">View Stripe Account</a> -->
            </div>
          </div>

          <ul>
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{active: isActiveTab(tab.id)}"
            ><label @click="onTab(tab.id)">{{ tab.title }}</label></li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser">
        <template v-if="!histories || histories.length == 0">
          <div class="empty-section" v-if="active_tab == 'received'">
            <p class="empty-title">You have not received any payments</p>
          </div>
          <div class="empty-section" v-else-if="active_tab == 'sent'">
            <p class="empty-title">You have not sent any payments</p>
          </div>
        </template>
        <table class="payment-table" v-else>
          <thead>
            <tr>
              <th width="25%" class="text-xs-left">{{ active_tab == 'received' ? 'Sender' : 'Receiver' }}</th>
              <th width="10%">Sent</th>
              <th width="10%">Received</th>
              <th width="25%">Type</th>
              <th width="10%">Status</th>
              <th width="10%">Date</th>
              <th width="10%" v-if="['listener', 'moderator'].indexOf(currentUser.user_type) == -1 && active_tab == 'received'">Refund</th>
              <!-- <th width="10%">Message</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in histories" :key="index">
              <td class="user">
                <user-card
                   v-if="active_tab == 'received'"
                  :user="history.sender"
                />
                <user-card
                  v-else-if="active_tab == 'sent'"
                  :user="history.receiver"
                />
              </td>
              <td class="text-xs-center">${{ history.sent_amount | formatNumber }}</td>
              <td class="text-xs-center">${{ history.received_amount | formatNumber }}</td>
              <td class="text-xs-center" style="text-transform: capitalize;">
                <template v-if="history.payment_type == 'buy'">
                  <router-link v-if="history.sent_amount == history.refund_amount"
                    :to="`/sell/order/${history.order_id}`">Full Refund</router-link>
                  <router-link v-else-if="history.refund_amount > 0"
                    :to="`/sell/order/${history.order_id}`">Partial Refund</router-link>
                  <router-link v-else
                    :to="`/sell/order/${history.order_id}`">Purchase</router-link>
                </template>
                <template v-else-if="history.payment_type == 'refund' && history.order_id">
                  <router-link :to="`/sell/order/${history.order_id}`">Refund</router-link>
                </template>
                <template v-else-if="history.payment_type == 'collaborate'">
                  <a @click="openProductModal(history)">Collaborate</a>
                </template>
                <template v-else>
                  {{ history.description || PaymentTypes[history.payment_type] || history.payment_type }}
                </template>
              </td>
              <td class="text-xs-center" :class="{'error--text': history.status == 'pending'}">{{ history.status | capitalize }}</td>
              <td class="text-xs-center">{{ history.created_at | formatDate }}</td>
              <td class="text-xs-center" v-if="['listener', 'moderator'].indexOf(currentUser.user_type) == -1 && active_tab == 'received'">
                <v-btn
                  v-if="canRefund(history) === true"
                  round dark
                  color="red"
                  class="send-refund-btn"
                  @click.native="openRefundDialog(history)"
                >Refund</v-btn>
                <span v-else class="red--text" >{{ canRefund(history) }}</span>
              </td>
              <!-- <td class="text-xs-center">
                <v-btn class="send-message-btn" @click.native="showSendMessageDialog(history)">Message</v-btn>
              </td> -->
            </tr>
          </tbody>
        </table>

        <div class="text-xs-center">
          <v-btn
            v-show="page_index < total_pages"
            @click.native="loadMore()"
            class="loadmore-btn"
          >Load More</v-btn>
        </div>
      </div>
    </div>

    <send-message
      v-if="send_message_dialog"
      :receiver="messaging_user"
      :dismiss="hideSendMessageDialog"
    />

    <product-modal
      v-if="show_product_modal"
      :item="payment.assoc"
      :dismiss="closeProductModal"
      :shareProduct="shareProduct"
    />

    <share-modal
      v-if="show_share_modal"
      :item="payment.assoc"
      :dismiss="closeShareModal"
    />

    <v-dialog v-model="show_withdraw_confirm_modal" class="my-dialog-1">
      <v-card>
        <v-card-title class="headline">Withdraw Confirmation</v-card-title>
        <v-card-text>Are you sure you want to withdraw ${{ withdrawAmount | formatNumber }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="withdrawMoney()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeWithdrawConfirmModal()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_withdraw_dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <h2>Transfer Money</h2>
        </v-card-title>
        <v-card-text class="withdraw-dialog">
          <label>Available</label>
          <label class="available-money-amount">${{ currentUser.available_amount | formatNumber }}</label>
          <label>out of&nbsp;</label>
          <label>${{ currentUser.balance_amount | formatNumber }}</label>
          <v-radio-group v-model="withdraw_option" :mandatory="true">
            <v-radio label="All" value="all"></v-radio>
            <v-radio label="Partial" value="partial"></v-radio>
            <vue-numeric v-model="withdraw_amount"
              class="withdraw-amount pl-2 pr-2 pt-1 pb-1 ma-1 ml-4"
              currency="$"
              separator=","
              :precision="2"
              :min="1"
              :disabled="withdraw_option=='all'"></vue-numeric>
            <label v-if="currentUser.balance_amount < withdraw_amount" class="pl-4 pr-2 error-text">Amount should be less than Avaialble Balance.</label>
          </v-radio-group>
        </v-card-text>
      <v-card-actions class="pa-3">
        <v-btn color="primary" :disabled="disableWithdrawButton" @click.stop="openWithdrawConfirmModal()">Withdraw</v-btn>
        <v-btn color="primary" flat @click.stop="closeWithdrawModal()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="show_refund_confirm_dialog"
      v-model="show_refund_confirm_dialog"
      class="my-dialog-1"
    >
      <v-card>
        <v-card-title class="headline">Refund Confirmation</v-card-title>
        <v-card-text>Are you sure you want to refund ${{ refund_amount | formatNumber }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="red--text darken-1" flat="flat" @click.native="refundMoney()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeRefundConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <v-dialog v-model="show_refund_dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <h2>Refund Money</h2>
        </v-card-title>
        <v-card-text class="refund-dialog">
          <div>
            <label>Recevied Amount: </label>
            <label>${{ (payment.sent_amount - payment.refund_amount) | formatNumber }}</label>
          </div>
          <v-radio-group v-model="refund_option" :mandatory="true">
            <v-radio label="All" value="all"></v-radio>
            <v-radio label="Partial" value="partial"></v-radio>
            <vue-numeric v-model="refund_amount"
              class="refund-amount pl-2 pr-2 pt-1 pb-1 ma-1 ml-4"
              currency="$"
              separator=","
              :precision="2"
              :min="1"
              :disabled="refund_option=='all'"
            ></vue-numeric>
          </v-radio-group>
          <input v-model="refund_description"
            type="text"
            class="description"
            name="description"
            placeholder="Description"
            v-validate="'required|max:255'"
          >
        </v-card-text>
        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn color="red" round flat @click.stop="openRefundConfirmDialog()">Refund</v-btn>
          <v-btn color="gray" round flat @click.stop="closeRefundDialog()">Close</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <order-refund-dialog
      v-if="show_refund_dialog"
      :value="payment"
      @input="continueRefund"
      @close="closeRefundDialog"
    />
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

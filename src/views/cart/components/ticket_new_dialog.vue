<template>
  <v-flex xs12 sm12 class="ys-dialog-container">
    <v-layout row wrap class="ys-dialog-dismiss" @click="dismiss()"></v-layout>
    <v-layout row wrap class="ys-dialog">
      <v-flex xs7 pr-2>
        <div class="user-avatar" :style="{'background-image': 'url(' + user.avatar.url + ')'}"></div>
        <div class="user-name">
          <label>{{ user.username }}</label>
          <v-icon class="user-status online" v-if="['artist', 'label', 'brand'].indexOf(user.user_type) > -1">fa-check-circle</v-icon>
        </div>
        <h3>Open Case / File complaint</h3>
        <v-flex xs12>
          <v-select
            :items="ticket_reasons"
            v-model="ticket.reason"
            v-validate="'required'"
            name="ticket_reason"
            :disabled="hasTicket"
            placeholder="Select reason for opening case..."
            class="ticket_reason_dropdown"
            autocomplete
          />
        </v-flex>
        <v-flex xs12 mt-2>
          <textarea
            v-model="ticket.description"
            v-validate="'required|max:1023'"
            name="ticket_description"
            placeholder="Write a message..."
            :disabled="hasTicket"
            class="mt-2"
          ></textarea>
        </v-flex>
        <v-flex v-if="!hasTicket" xs12 text-xs-right>
          <v-btn
            @click.native="sendTicket()"
            dark small round color="green"
            :disabled="!canSend"
          >Send</v-btn>
        </v-flex>
        <v-flex xs12 px-5 pt-3 text-xs-center>
          <p class="ma-0">
            Any disputes regarding refunds & returns can only be resolved between sellers and buyers.
            If we discover a seller has a trend of violations, we may close their account.
            <br><br>
          </p>
        </v-flex>
      </v-flex>

      <v-flex xs5 px-3 border-left>
        <div class="product-cover" :style="{'background-image': 'url(' + product.covers[0].cover.url + ')'}"/></div>
        <v-flex x12 mt-4 mb-3 py-2 border-top border-bottom>
          <h4>Product Info</h4>
        </v-flex>
        <v-flex x12 product-name>
          {{ product.name }}
        </v-flex>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
import _ from "lodash";
import ItemService from "@/services/item";
import TicketService from "@/services/ticket";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },

    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      ticket_reasons: [
        "Incorrect size",
        "Product damaged",
        "Product not received",
        "Incorrect product",
        "Other",
      ],
      ticket: {
        reason: "",
        description: "",
      },
      user: {
        avatar: {},
      },
      product: {
        covers: [
          {
            cover: {},
          },
        ],
      },
      hasTicket: false,
      isDialogReady: false,
    };
  },

  computed: {
    canSend() {
      // let b = this.ticket.reason.trim() !== '' && this.ticket.description.trim() !== ''
      // console.log('canSend', b)
      return (
        this.ticket.reason.trim() !== "" &&
        this.ticket.description.trim() !== ""
      );
    },
  },

  methods: {
    sendTicket() {
      const params = {
        ticket: {
          reason: this.ticket.reason,
          description: this.ticket.description,
          item_id: this.item.id,
        },
      };

      TicketService.createTicket(params).then((response) => {
        this.dismiss();
      });
    },
  },

  created() {
    // console.log('ticket_new_dialog', this.item)
    this.user = _.get(this.item, "product.merchant", { avatar: {} });
    this.product = _.get(this.item, "product", { covers: [{ cover: {} }] });

    this.isDialogReady = false;
    this.hasTicket = false;
    this.$store.dispatch("error/showLoadingActivity", true);
    ItemService.tickets(this.item.id)
      .then((response) => {
        if (response.body.tickets.length > 0) {
          this.ticket = response.body.tickets[0];
          this.hasTicket = true;
        }
        this.isDialogReady = true;
        this.$store.dispatch("error/showLoadingActivity", false);
      })
      .catch((e) => {
        this.isDialogReady = true;
        this.$store.dispatch("error/showLoadingActivity", false);
      });
  },
};
</script>

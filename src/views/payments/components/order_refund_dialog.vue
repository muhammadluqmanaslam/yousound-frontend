<template>
  <div class="modal-wrapper">
    <div class="my-overlay"></div>
    <div class="modal">
      <h4 class="modal__title">Refund Shopping Items</h4>

      <div class="modal__header">
        <!-- <v-checkbox
          v-model="refund_all"
          label="Refund all items"
          hide-details
          color="red"
          @change="toggleRefundAll"
        ></v-checkbox> -->
        <v-btn
          v-if="items_available"
          dark
          color="red"
          @click="toggleRefundAll(true)"
        >Refund All</v-btn>
        <label v-else>No items available to refund</label>
      </div>

      <div class="modal__content">
        <shop-item
          v-for="(item, index) in payment.order.items"
          :key="item.id"
          :value="payment.order.items[index]"
          @input="changeOrderItem"
        />
      </div>

      <div class="modal__footer">
        <v-btn
          v-if="items_selected"
          dark
          color="blue"
          @click="$emit('input', payment)"
        >Continue</v-btn>
        <v-btn
          dark
          color="grey"
          @click="$emit('close')"
        >Cancel</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  // import PaymentService from '@/services/payment'
  import ShopItem from './shop_item'

  export default {
    components: {
      ShopItem
    },

    props: {
      value: Object
    },

    data () {
      return {
        refund_all: false,
        items_available: false,
        items_selected: false,
        payment: {}
      }
    },

    computed: {},

    methods: {
      evaluate () {
        const item = this._.find(this.payment.order.items, { refund: true })
        this.items_selected = !!item
      },

      toggleRefundAll (event) {
        this.payment.order.items.forEach((item) => {
          if (item.status !== 'item_refunded') {
            item.refund = event
            const itemQuantity = item.quantity > 0 ? item.quantity : 1
            item.refund_amount_in_dollar = (item.price + item.shipping_cost) * itemQuantity / 100
          }
        })
        this.evaluate()
      },

      changeOrderItem (event) {
        const item = this._.find(this.payment.order.items, { id: event.id })
        item.refund = event.refund
        item.refund_amount_in_dollar = event.refund_amount_in_dollar
        this.evaluate()
      }
    },

    created () {
      this.payment = this.value
      this.payment.order.items.forEach((item) => {
        if (item.status !== 'item_refunded') {
          this.items_available = true
          const itemQuantity = item.quantity > 0 ? item.quantity : 1
          item.refund_amount_in_dollar = (item.price + item.shipping_cost) * itemQuantity / 100
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
.my-overlay {
  z-index: 15;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.1);
}

.modal {
  z-index: 16;
  position: fixed;
  width: 600px;
  max-height: 600px;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  padding: 15px 15px 10px 15px;
  // border: 0.75px solid #E1E1E1;
  border-left: none;
  border-top-left-radius: 7.5px;
  border-top-right-radius: 7.5px;
  background: #FFFFFF;
  box-shadow: 3px 3px 10px -4px grey;

  &__title {
    padding: 15px;
    font-size: 20px;
    color: #000000;
    letter-spacing: -0.6px;
    text-align: center;
  }

  &__header {
    margin-left: 10px;
    text-align: right;
    label {
      font-weight: 700;
      color: #E53935;
    }
  }

  &__footer {
    margin-top: 15px;
    text-align: center;
  }

  .item {
    margin-top: 12px;
  }
}
</style>

<template>
  <div class="item">
    <div class="item__header">
      <v-checkbox
        v-if="item.status != 'item_refunded'"
        v-model="item.refund"
        hide-details
        color="red"
        @change="toggleRefund"
      ></v-checkbox>
    </div>
    <div class="item__content">
      <app-card
        :image="productImage"
        :title="productName"
        :subtitle="itemPrice"
        :description="itemShippingCost"
      />
    </div>
    <div class="item__footer">
      <vue-numeric
        v-if="item.refund"
        v-model="refund_amount"
        currency="$"
        separator=","
        :precision="2"
        :min="0.01"
        @blur="changeRefundAmount"
      ></vue-numeric>
    </div>
    <div class="item__footer">
      <div>Quantity: {{ itemQuantity }}</div>
      <label :class="itemStatus.toLowerCase()">{{ itemStatus }}</label>
    </div>
  </div>
</template>

<script>
  import AppCard from '@/components/base/app_card'

  export default {
    components: {
      AppCard
    },

    props: {
      value: Object
    },

    data () {
      return {
        item: {},
        refund_amount: 0.0
      }
    },

    computed: {
      productImage () {
        return this._.get(this.item, 'product.covers[0].cover.url')
      },

      productName () {
        return this._.get(this.item, 'product.name')
      },

      itemQuantity () {
        const quantity = this._.get(this.item, 'quantity', 0)
        return quantity > 0 ? quantity : 1
      },

      itemPrice () {
        return `$${this.$options.filters.formatNumber(this._.get(this.item, 'price', 0))}`
      },

      itemShippingCost () {
        const shippingCost = this._.get(this.item, 'shipping_cost', 0)
        return shippingCost > 0 ? `$${this.$options.filters.formatNumber(shippingCost)}` : ''
      },

      itemStatus () {
        switch (this._.get(this.item, 'status')) {
          case 'item_ordered':
            return 'Unshipped'
          case 'item_shipped':
            return 'Shipped'
          case 'item_refunded':
            return 'Refunded'
        }
      }
    },

    methods: {
      toggleRefund (event) {
        if (event) {
          this.item.refund_amount = (this.item.price + this.item.shipping_cost) * this.itemQuantity
          this.refund_amount = this.item.refund_amount / 100
        }
        this.$emit('input', this.item)
      },

      changeRefundAmount (event) {
        // console.log('changeRefundAmount', event, this.refund_amount)
        this.item.refund_amount = this.refund_amount * 100
        this.$emit('input', this.item)
      }
    },

    // watch: {
    //   value: {
    //     deep: true,
    //     immediate: true,
    //     handler () {
    //       console.log('watch value', this.value.refund)
    //     }
    //   }
    // },

    created () {
      this.item = this.value
      console.log('shop_item created', this.item)
    }
  }
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  min-height: 90px;
  border: .75px solid #d7d7d7;

  &__header {
    display: flex;
    align-items: center;
    padding-left: 10px
  }

  &__content {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }

  &__footer {
    width: 100px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 5px 15px 5px 15px;
    label {
      &.shipped {
        color: #14c45b;
      }
      &.unshipped {
        color: #3a92ff;
      }
      &.refunded {
        color: #e53935;
      }
    }
  }

  input[type="tel"] {
    width: 80px;
    height: 30px;
    border: 0.75px solid #d7d7d7;
    padding: 4px 8px;
    line-height: 30px;
    text-align: right;
  }
}
</style>

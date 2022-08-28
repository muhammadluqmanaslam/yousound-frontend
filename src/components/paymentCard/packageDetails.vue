<template>
  <div class="payment-package">
    <div v-if="!hideTitle" class="package-title">{{ itemType }}</div>

    <div class="package-details" :class="{noBorder}">
      <div class="_summary dflex justify-space-between mb-3" :class="{altMeta}">
        <div class="package-subtitle">
          {{ item.title }} {{ subtitleAppend }}
        </div>

        <div class="package-pricing">
          <span class="currency">$</span>
          <span class="cost">{{ itemPrice }}/month</span>
        </div>
      </div>

      <div class="payment-note dflex">
        <v-icon style="color: black" class="mr-2">schedule</v-icon>
        <div class="__note">
          Your card will be charged each month starting on
          <strong>{{ currentDate | formatSlashedDate }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hideTitle: Boolean,
    noBorder: Boolean,
    altMeta: Boolean,
    item: {
      required: true,
      type: Object,
    },
    itemType: String,
    itemPrice: String,
  },
  computed: {
    subtitleAppend() {
      const type = this.itemType;

      switch (type) {
        case "plan":
          return "Subscription";
        default:
          break;
      }
    },
    currentDate() {
      return new Date();
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-package {
  .package {
    &-title {
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 8px;
      text-transform: capitalize;
    }

    &-details {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 10px;

      &.noBorder {
        border: none;
      }

      ._summary {
        &.altMeta {
          display: block;

          .package-pricing {
            font-size: 18px;
          }
        }
      }

      .package-subtitle,
      .package-pricing {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: -0.5px;
      }

      .payment-note {
        background-color: #f7f7f7;
        border-radius: 10px;
        padding: 10px;
      }
    }
  }
}
</style>

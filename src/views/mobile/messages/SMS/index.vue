<template>
  <div class="sms-mobile">
    <div class="sms-conversations">
      <div
        v-for="(conv, i) in smsConversations"
        :key="i"
        class="sms-conversation"
      ></div>
    </div>

    <SMS v-if="smsActive" @closeSMS="closeSMS" />

    <v-btn fab class="post-sms-btn" @click="openSMS">
      <img
        :src="require('@/assets/type-thought.svg')"
        class="thought-icon invert-color"
        width="20"
      />
    </v-btn>
  </div>
</template>

<script>
import SMS from "@/components/SMS";

export default {
  components: {
    SMS,
  },
  data() {
    return {
      smsActive: false,
      smsConversations: [{}],
      contacts: [{},{}]
    };
  },
  methods: {
    openSMS() {
      this.smsActive = true;
    },
    closeSMS() {
      this.smsActive = false
    },
  },
};
</script>

<style lang="scss" scoped>
.sms-conversations {
  .sms-conversation {
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    box-shadow: 0px 0.33000001311302185px 0px 0px #ced5dc;
    padding: 8px 13px;
    overflow: hidden;
  }
}

.post-sms-btn {
  position: fixed;
  right: 8px;
  bottom: 50px;
  z-index: 1;
  background: #000000 !important;
  font-weight: 800;
}
</style>

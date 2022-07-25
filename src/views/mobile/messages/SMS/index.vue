<template>
  <div class="sms-mobile">
    <div class="contacts-summary" @click="openContacts">
        View {{contacts.length}} contact
    </div>
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

    <Contacts v-if="contactsActive" @closeContacts="closeContacts" />
  </div>
</template>

<script>
import SMS from "@/components/SMS";
import Contacts from "@/views/mobile/components/contacts";

export default {
  components: {
    SMS,
    Contacts,
  },
  data() {
    return {
      smsActive: false,
      smsConversations: [{}],
      contacts: [{},{}],
      contactsActive: false,
    };
  },
  methods: {
    openContacts() {
      this.contactsActive = true;
    },
    closeContacts() {
      this.contactsActive = false;
    },
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
.sms-mobile {
    .contacts-summary {
        background: rgba(233, 233, 233, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        margin: 8px 13px;
        text-align: center;
        padding: 13px;
        font-weight: bold;
    }
}
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

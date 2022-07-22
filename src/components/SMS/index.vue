<template>
  <div class="sms" :class="{ onMobile }" :style="[sizeSMS]">
    <div class="creator-signup">
      <div class="join-creator" :class="{ digitEntered }">
        <div v-if="digitEntered" class="_title">Confirm Your Number</div>
        <div v-else class="_title">Join this creator community</div>

        <div class="_user">
          <user-tag
            :user="currentUser"
            showAvatar
            hideTick
            hideName
            fitContent
            height="140"
            width="140"
            :clickUser="false"
          />

          <br />

          <user-tag
            :user="currentUser"
            fitContent
            showUserType
            :clickUser="false"
          />
        </div>

        <div class="message">
          Enter your phone number to let creator send you text messages from
          this app. Phone numbers are never shared.
        </div>

        <div class="_tel">
          <br />
          <img :src="require('@/assets/us_flag.svg')" width="18" class="flag" />
          <span class="digit">+ 0 1 (</span>
          <span v-for="(input, idx) in digitsLen" :key="idx">
            <input
              v-model.number="telDigits[idx]"
              type="text"
              name=""
              :id="`input-${idx}`"
              :ref="`input${idx}`"
              class="digit _num"
              pattern="([0-9])"
              maxlength="1"
              @keydown.delete="delDigit($event, idx)"
              @keyup.enter="submitTel"
            />
            <span v-if="idx === 2" class="digit">)</span>
            <span v-if="idx === 6" class="digit">-</span>
          </span>
        </div>

        <h3 class="cursor-pointer" @click="closeSMS">
          No thanks, I’ll just follow
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import UserTag from "@/components/user_tag";
import { mapState } from "vuex";

export default {
  components: {
    UserTag,
  },
  data() {
    return {
      telDigits: [],
      digitsLen: 9,
      digitEntered: false,
    };
  },
  watch: {
    telDigits: {
      handler(val) {
        if (val.length < this.digitsLen) {
          this.$refs[`input${[val.length]}`][0].focus();
        }
      },
      deep: true,
    },
  },
  methods: {
    submitTel() {
      // const validate = this.telDigits.every((tel) => typeof tel === "number")
      const validate =
        this.telDigits.length === this.digitsLen && this.telDigits.every((tel) => typeof tel === "number");

      console.log(validate, this.telDigits);

      if (validate) {
        this.digitEntered = true;
      }
    },
    delDigit(evt, idx) {
      console.log(evt, idx);
      this.telDigits.splice(idx, 1, "");
    },
    closeSMS() {
      this.$emit("closeSMS");
    },
  },
  computed: {
    ...mapState({
      sideBarWidth: (state) => state.app.sideBarWidth,
      sideBarMini: (state) => state.app.sideBarMini,
    }),
    tel() {
      return this.telDigits.join("");
    },
    sizeSMS() {
      if (this.sidebarMini) {
        return { width: "calc(100% - " + this.sideBarWidth + "px)" };
      }
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
    isUserSubscribed() {
      return false;
    },
  },
  mounted() {
    this.$refs.input0[0].focus();
  },
};
</script>

<style lang="scss" scoped>
.sms-card {
  width: 400px;
  height: 600px;
  max-height: 70%;
  border-radius: 12px;
  margin: 0 auto;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ._title {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 10px;
  }
}
.sms {
  position: fixed;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.698);
  z-index: 99;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .join-creator {
    @extend .sms-card;
    text-align: center;
    background-color: #1b1b1bf2;
    color: #ffffff;

    &.digitEntered {
      background-color: #fffffff2;
    }

    .message {
      padding: 10px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    ._tel {
      width: 100%;
      background-color: #ffffff;
      border-radius: 6px;
      padding: 10px;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;

      .flag {
        margin-right: 10px;
      }

      input {
        outline: none;
        height: 20px;
        border: none;
        border-bottom: 1px solid #8c8c8c;
        width: 12px;
        border-radius: 0;
      }

      .digit {
        margin-right: 5px;
        text-align: center;
      }
    }

    /deep/ .user_tag {
      .user-status {
        margin-top: -16px;
      }
      .bio-wrapper {
        text-align: center;
      }
    }
  }
}
</style>

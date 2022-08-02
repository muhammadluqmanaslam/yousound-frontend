<template>
  <div class="sms" :class="{ onMobile }" :style="[sizeSMS]">
    <div v-if="sendSuccess" class="closedecoy" @click="outsideClick"></div>
    <div v-if="isUserSignedUp && !isUserSubscribed" class="subscribe-view">
      <div v-if="!showCardPanel" class="intro">
        <div>
          You have <strong>2,500</strong> people on your SMS contact list!
          <br />
          Subscribe to a <strong>Pro Plan</strong> to text your content to them
          directly.
        </div>

        <img
          :src="require('@/assets/closeIcon.svg')"
          width="16"
          class="cursor-pointer"
          @click="closeSMS"
        />
      </div>

      <hr v-if="!showCardPanel" />

      <v-container fluid px-0 grid-list-lg>
        <v-layout row wrap start-trial>
          <v-flex xs12 sm6>
            <h2 class="_title">
              Start <br />
              Free Trial
            </h2>
            <ul>
              <li>30 days</li>
              <li>Cancel anytime</li>
            </ul>
          </v-flex>

          <v-flex v-if="!showCardPanel" xs12 sm6 pro-plan>
            <h3 class="_title">Pro</h3>
            <div class="_subtitle">For professional creators & curators</div>

            <span class="plan-list">
              <v-icon class="_check">check</v-icon>
              <div>Ad-free + unlimited uploads</div>
            </span>
            <span class="plan-list">
              <v-icon class="_check">check</v-icon>
              <div>Keep 100% sales & donations</div>
            </span>
            <span class="plan-list">
              <v-icon class="_check">check</v-icon>
              <div>SMS texting*</div>
            </span>
            <span class="plan-list">
              <v-icon class="_check">check</v-icon>
              <div>Get paid to share</div>
            </span>

            <div class="pricing">
              <div class="_wrapper">
                <span class="currency">$</span>
                <span class="cost">30</span>
                <span class="duration">/month</span>
              </div>

              <v-btn class="trial-btn" @click="showCard()">Free Trial</v-btn>
            </div>
          </v-flex>

          <v-flex v-if="showCardPanel" xs12 sm6 card-panel>
            <img
              class="_logo"
              :src="require('@/assets/ys_logo_primary-black.svg')"
              width="80"
            />
            <h3 class="_subtitle mb-3">Pro Subscription</h3>

            <div class="card-details">
              <input
                v-model.number="card.number"
                type="text"
                name="cardNo"
                id="cardNo"
                class="cardNo"
                placeholder="Card number"
              />
              <input
                v-model.number="card.mm"
                type="text"
                name="mm"
                id="mm"
                class="mm"
                placeholder="MM"
              />
              <input
                v-model.number="card.yy"
                type="text"
                name="yy"
                id="yy"
                class="yy"
                placeholder="YY"
              />
            </div>

            <v-btn depressed class="addCard-btn" :disabled="false" @click="isUserSubscribed = true">
              Add card to file
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>

      <div v-if="!showCardPanel" class="footnote">
        * SMS costs $0.01 per text
      </div>
    </div>

    <div v-if="!isUserSignedUp && !isUserSubscribed" class="creator-signup">
      <div v-if="!signUpDone" class="join-creator" :class="{ digitEntered }">
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

        <div v-if="digitEntered" class="message">
          You will receive text to this number. This number will also be used
          when you sign up to other SMS communities
        </div>
        <div v-else class="message">
          Enter your phone number to let creator send you text messages from
          this app. Phone numbers are never shared.
        </div>

        <div v-if="!digitEntered" class="_tel">
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
        <div v-else class="_tel-entered">{{ telFormatted }}</div>

        <v-btn
          v-if="digitEntered"
          round
          dark
          depressed
          class="width100"
          @click="updatePhoneNo()"
        >
          Confirm
        </v-btn>

        <h3
          v-if="digitEntered"
          class="cursor-pointer"
          @click="digitEntered = false"
        >
          Update my number
        </h3>
        <h3 v-if="!digitEntered" class="cursor-pointer" @click="closeSMS">
          No thanks, I’ll just follow
        </h3>
      </div>

      <div v-else-if="signUpDone" class="signup-done">
        <img
          :src="require('@/assets/convo_icon_light.svg')"
          width="22"
          class="flag"
          alt="conversation icon"
        />

        <div>You’ve been added to this SMS list</div>

        <v-btn depressed round class="done-btn" @click="isUserSignedUp = true">Close</v-btn>
      </div>
    </div>

    <div v-if="!confirmSendSMS && !sendSuccess && isUserSignedUp && isUserSubscribed" class="post-sms">
      <div v-if="!confirmSendSMS" class="post-sms-card">
        <div class="post-sms-wrapper">
          <div v-if="!onMobile" class="_top">
            <h2 class="_title">Send SMS</h2>
            <div class="_title">to <strong>{{ 45678 | formatNumberWithComma}}</strong> SMS contacts</div>
          </div>

          <div class="post-sms-submit" :class="{onMobile}">
            <div class="cursor-pointer" @click="closeSMS">Cancel</div>

            <div class="dflex align-center">
              <div class="char-count  mr-2">
                <span
                  :class="{ 'red--text': charCount == smsMaxChar }"
                  >{{ charCount }}</span
                >
                /
                <span>{{ smsMaxChar }}</span>
              </div>
              <v-btn
                round
                depressed
                dark
                class="post-sms-btn ma-0"
                @click="confirmSend"
              >
                <span>Send</span>
              </v-btn>
            </div>
          </div>
        </div>

        <div class="post-sms-action">
          <div class="sms-layer sms-input">
            <user-tag
              showAvatar
              hideName
              hideTick
              :user="currentUser"
              width="30"
              height="30"
            />
            <textarea
              v-model.trim="textMessage"
              :maxlength="smsMaxChar"
              class="sms-input-area"
              placeholder="Enter message..."
              ref="sms"
            >
            </textarea>
          </div>

          <div v-if="!onMobile" class="char-count">
            <span
              :class="{ 'red--text': charCount == smsMaxChar }"
              >{{ charCount }}</span
            >
            /
            <span>{{ smsMaxChar }}</span>
          </div>
        </div>

        <attach-slide
          @getAttachment="getSelected"
          class="mb-0"
        />

        <div v-if="!onMobile" class="post-sms-submit">
          <div class="cursor-pointer" @click="closeSMS">Cancel</div>

          <v-btn
            round
            depressed
            dark
            class="post-sms-btn ma-0"
            @click="confirmSend"
          >
            <span>Send</span>
          </v-btn>
        </div>
      </div>
    </div>

    <div v-if="confirmSendSMS" class="confirm-sms">
      <img
        :src="require('@/assets/closeIcon.svg')"
        width="16"
        class="cursor-pointer close-icon"
        @click="closeSMS"
      />

      <div class="_title">Confirm SMS text</div>
      <img
        :src="require('@/assets/mobile_chat.svg')"
        width="35"
        class="my-4"
      />

      <div class="_message">
        This SMS text will be sent to: <strong>{{2450 | formatNumberWithComma}} people</strong>

        <br>
        <br>

        The credit card connected to this account will be charged $0.01 per text:

        <br>
        <br>

        <h2>$24.50</h2>
      </div>

      <v-btn dark round class="width100 mt-3" @click="sendSMS">Ok, send SMS</v-btn>
    </div>

    <div v-if="onMobile && sendSuccess" class="sms-success">
      <img
        :src="require('@/assets/check_success.svg')"
        width="60"
        class="m2-4"
      />
      <div class="_title">Success</div>

      <div class="_message">
        SMS text sent to: <br>
        <strong>{{2450 | formatNumberWithComma}} people</strong>
      </div>

      <br>
      <br>

      <v-btn dark depressed round class="width100 mt-3" @click="openEngagement">
        View Engagement
      </v-btn>
    </div>

    <sms-engagement v-if="smsEngagementActive" @closeEngagement="closeEngagement" />
  </div>
</template>

<script>
import UserTag from "@/components/user_tag";
import AttachSlide from "@/components/attachSlide";
import smsEngagement from "@/views/mobile/messages/SMS/smsEngagement"
import { mapState } from "vuex";
import UserService from '@/services/user'
import AuthService from '@/services/auth.js'

export default {
  components: {
    UserTag,
    AttachSlide,
    smsEngagement,
  },
  data() {
    return {
      telDigits: [],
      digitsLen: 9,
      digitEntered: false,
      signUpDone: false,
      card: {
        number: null,
        mm: null,
        yy: null,
      },
      showCardPanel: false,
      textMessage: "",
      smsMaxChar: 300,
      attachment: {},
      postSMSactive: false,
      confirmSendSMS: false,
      sendSuccess: false,
      smsEngagementActive: false,
      isUserSignedUp: false,
      isUserSubscribed: false,
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
    outsideClick() {
      console.log("outside click");
      if (this.sendSuccess) {
        this.closeSMS()
      }
    },
    openEngagement() {
      this.smsEngagementActive = true;
    },
    closeEngagement() {
      this.smsEngagementActive = false;
    },
    sendSMS() {
      this.confirmSendSMS = false;
      this.sendSuccess = true;
    },
    confirmSend() {
      this.confirmSendSMS = true;
    },
    getSelected(data) {
      console.log(data);
      this.attachment = data;
      this.toggleShowAttach = false;
      this.message.body = this.defaultRepostMessage;
    },
    showCard() {
      this.showCardPanel = true;
    },
    submitTel() {
      const validate =
        this.telDigits.length === this.digitsLen &&
        this.telDigits.every((tel) => typeof tel === "number");
      if (validate) {
        this.digitEntered = true;
      }
    },
    delDigit(evt, idx) {
      this.telDigits.splice(idx, 1, "");
    },
    closeSMS() {
      this.signUpDone = false;
      this.digitEntered = false;
      this.$emit("closeSMS");
    },
    updatePhoneNo() {
      const params = new FormData()
      let phoneNumber = "+1" + this.telDigits.join("");
      params.append('user[phone_name]', phoneNumber)
      UserService.updateUserInfo(this.currentUser.id, params)
        .then((response) => {
          AuthService.setUser(response.body)
          this.signUpDone = true
        })
        .catch((e) => {
          console.log(e)
        })
    },
  },
  computed: {
    ...mapState({
      sideBarWidth: (state) => state.app.sideBarWidth,
      sideBarMini: (state) => state.app.sideBarMini,
    }),
    charCount() {
      return this.textMessage.length;
    },
    valAddCard() {
      const valMM =
        this.card.mm.length === 2 && this.card.mm < 12 && this.card.mm > 0;
      const valYY = this.cardNo.length && this.mm.length && this.yy.length;

      const validate = valMM && valYY;
      return validate;
    },
    tel() {
      return this.telDigits.join("");
    },
    telFormatted() {
      return `+1${this.tel}`.replace(/(.{4})/g, "$1-");
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
      return this.$store.state.auth.user
    },
  },
  mounted() {
    if (!this.isUserSignedUp) {
      this.$refs.input0[0].focus();
    }
    // console.log("currentUser-->", this.currentUser)
    if (this.currentUser.stripe_subscription_id !== undefined && this.currentUser.stripe_subscription_id !== null) {
      // this.isUserSubscribed = true
    }
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

  &.onMobile {
    .join-creator {
      height: 100vh;
    }
    .subscribe-view {
      height: 100%;
      border-radius: 0;
      padding: 20px 30px;
    }
    .post-sms {
      height: 100%;
    }
  }

  .join-creator {
    @extend .sms-card;
    text-align: center;
    background-color: #1b1b1bf2;
    color: #ffffff;

    &.digitEntered {
      background-color: #fffffff2;
      color: #000000;

      ._tel-entered {
        font-weight: bold;
        font-size: 1.3rem;
      }
      .message {
        border: 0;
      }
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

  .signup-done {
    background: linear-gradient(180deg, #4d7aed 17.71%, #0f6fff 100%);
    width: 200px;
    height: 200px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-radius: 22px;
    text-align: center;
    font-weight: bold;

    .done-btn {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      width: 100%;
      margin-top: 20px;
    }
  }

  .subscribe-view {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px 50px;
    max-width: 700px;
    width: 100%;

    .intro {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    hr {
      border: 0.91px solid #0000001a;
      margin: 30px 0;
    }

    .start-trial {
      ._title {
        font-size: 2rem;
        line-height: 1;
        margin-bottom: 15px;
      }
      ul {
        margin-left: 10px;
      }
    }

    .pro-plan {
      background: rgba(117, 164, 255, 0.05);
      border: 1px solid rgba(46, 155, 255, 0.5);
      border-radius: 10px;

      ._title {
        font-size: 2rem;
        font-weight: bolder;
      }
      ._subtitle {
        margin-bottom: 15px;
      }

      .plan-list {
        display: flex;
        align-items: center;

        ._check {
          font-size: 10px;
          color: #000000;
          margin-right: 10px;
        }
      }
      .pricing {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;

        ._wrapper {
          display: flex;
          align-items: baseline;

          .cost {
            font-weight: bolder;
            font-size: 2rem;
          }
          .duration {
            font-weight: 100;
          }
        }

        .trial-btn {
          background-color: #3b3b3b;
          color: #ffffff;
          border-radius: 4px;
        }
      }
    }

    .footnote {
      text-align: right;
      font-size: 13px;
      margin-right: -8px;
    }

    .card-panel {
      border: 1px solid #0000001a;
      padding: 20px;
      border-radius: 12px;

      .card-details {
        border-bottom: 0.91px solid #0000001a;
        display: flex;

        input {
          border: none;
          outline: 0;
        }

        .cardNo {
          width: 60%;
        }
        .mm {
          width: 20%;
          text-align: center;
        }
        .yy {
          width: 20%;
          text-align: center;
        }
      }

      .addCard-btn {
        width: 100%;
        margin: 0;
        margin-top: 15px;
      }
    }
  }

  .post-sms {
    width: 400px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;

    ._top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 10px 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e4e4e4;
    }

    .post-sms-action {
      padding: 0 20px;

      .sms-layer {
        display: flex;

        .user_tag {
          align-self: baseline;
        }

        textarea {
          flex: 1;
          border: none;
          min-height: 180px;
          resize: none;

          &:hover {
            &::-webkit-scrollbar {
              width: 2px;
            }

            &::-webkit-scrollbar-track {
              box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
              border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb {
              border-radius: 10px;
              box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
            }
          }
        }
      }
    }

    .post-sms-submit {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;

      .onMobile {
        border-bottom: 1px solid #e4e4e4;
      }
    }

  }

  .confirm-sms {
    position: relative;
    padding: 25px;
    text-align: center;
    background-color: #ccff99;
    border-radius: 10px;
    margin: 20px;

    ._title {
      font-size: 2rem;
      font-weight: 600;
    }
    ._message {
      background: #ffffff;
      border: 1px solid #7ec439;
      padding: 13px;
      border-radius: 10px;
    }

    .close-icon {
      position: absolute;
      top: 13px;
      right: 15px;
    }
  }

  .sms-success {
    position: relative;
    padding: 25px;
    text-align: center;
    border-radius: 10px;
    margin: 20px;
    width: 100%;
    background: #ffffff;

    ._title {
      font-size: 2.2rem;
      font-weight: 600;
    }
  }
}
</style>

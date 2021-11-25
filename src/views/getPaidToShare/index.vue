<template>
  <div class="page partners-page mx-5">
    <v-container fluid grid-list-lg>
        <v-layout wrap align-center justify-center>
            <v-flex xs5 layer-flex flex-text>
                <h3 class="mb-2">Repost Requests</h3>
                <h1>Get paid  <br> to share.</h1>

                <span>
                <v-btn class="black white--text mt-4">
                    <v-icon class="mr-2">south</v-icon>
                    <span>Upgrade</span>
                </v-btn>
                </span>
            </v-flex>
            <v-flex xs5 layer-flex flex-img>
                <img
                width="100%"
                src="/static/images/re_share.svg"
                />
            </v-flex>
        </v-layout>

        <v-layout wrap align-center justify-center>
            <v-flex xs6 layer-flex flex-img>
                <img
                    width="80%"
                    src="/static/images/re_upgrade.svg"
                />
            </v-flex>
            <v-flex xs5 layer-flex flex-text>
                <h2>Upgrade to remove ads & get paid to share.</h2>
            </v-flex>
        </v-layout>

        <h1 class="text-center my-5">Choose the right plan for you</h1>

        <v-layout wrap align-center justify-space-between pt-5>
            <v-flex
              v-for="(plan, i) in plans"
              :key="i" 
              xs4
              plan-layer
              flex-text
            >
            <div class="plan-card" :class="plan.value">
                <h2>{{ plan.title }}</h2>
                <ul>
                  <li
                    v-for="(b, j) in plan.benefits"
                    :key="j"
                  >
                    <div>
                      <v-icon>check</v-icon>
                    </div>

                    <div>
                      <span>
                        {{ b }}
                      </span>
                    </div>
                  </li>
                </ul>

                <v-spacer></v-spacer>

                <div>
                  <span class="__currency">$</span>
                  <span class="__price">{{ plan.price }}</span>
                  <span class="__duration">/month</span>
                </div>

                <v-btn depressed class="width100 mx-0 choose__btn">Choose</v-btn>
            </div>

            </v-flex>
        </v-layout>
    </v-container>


    <div class="section-faq">
      <div class="__intro-title">FAQ</div>
      <accordion :accordions="accordions" leftIcon="add" />
    </div>
  </div>
</template>

<script type="text/javascript" src="./getPaidToShare.ctrl.js"></script>

<style lang="scss" scoped>
.plan-card {
  display: flex;
    flex-direction: column;
    min-height: 380px;
    padding: 30px;
    border-radius: 24px;
    background: #F7F7F7;
    border: 1px solid #e3dede;

    .__currency {}
    .__price {
      font-size: 20px;
      font-weight: 900;
      line-height: 1;
    }
    .__duration {}

    .choose__btn {
      background-color: #5D5FEF !important;
      color: #ffffff;
    }

    li {
      list-style: none;
      display: flex;

      .icon {
        margin-right: 10px;
        font-size: 14px;
      }
    }

    &.plus {
      color: #ffffff;
      margin-top: -80px;
      background: linear-gradient(180deg, #3B2B9D 0%, rgba(21, 12, 73, 0.85) 0.01%, rgba(23, 5, 132, 0.927083) 99.99%);
      border: 1px solid #302379;

      .icon {
        color: #ffffff;
      }
    }
}
</style>
<style src="../../../static/styles/partners.scss" lang="scss" scoped>

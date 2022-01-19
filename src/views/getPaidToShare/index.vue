<template>
  <div class="page partners-page mx-5 mt-5 pt-5">
    <v-container fluid grid-list-lg>
        <v-layout wrap align-center justify-space-between>
            <v-flex xs5 layer-flex flex-text>
                <h1>Get paid  <br> to share.</h1>
                <!-- <h3 class="mt-2">Upgrade to remove ads & accept Repost <br /> Requests.</h3> -->

                <span>
                <v-btn depressed class="choose__btn __rounded white--text mt-4" to="/plans">
                    <span>Choose Plan</span>
                </v-btn>
                </span>
            </v-flex>
            <v-flex xs5 layer-flex flex-img>
                <img
                  width="100%"
                  src="/static/images/re_sharebg.svg"
                />
            </v-flex>
        </v-layout>

        <div class="section-intro">
          <h1 class="b-h1 mt-5 mb-3 text-xs-center">How?</h1>
        </div>


        <div class="b-body-text">
          With <b>Repost Requests</b>, verified artists & brands can pay you to share their albums, videos & products to your followers. Artists and brands will send you a direct message with their content attached for you to share. Before the message is sent they will pay the repost price you set.
          <br />
          <br />
          You can charge up to <b>5k per repost</b> with the <b>Pro</b> subscription or up to <b>100k per repost</b> with a <b>Plus</b> subscription.
        </div>

        <br>
        <br>

        <h2>Go ad-free.  Support Creators.  Get Paid.</h2>

        <v-btn depressed class="choose__btn __rounded white--text mt-4 ml-0" to="/plans">
            <span>Choose Plan</span>
        </v-btn>
    </v-container>


    <!-- <div class="section-faq">
      <div class="__intro-title">FAQ</div>
      <accordion :accordions="accordions" leftIcon="add" />
    </div> -->
  </div>
</template>

<script type="text/javascript" src="./getPaidToShare.ctrl.js"></script>

<style lang="scss" scoped>
.plan-card {
  display: flex;
    flex-direction: column;
    min-height: 400px;
    padding: 60px;
    border-radius: 24px;
    background: #F7F7F7;
    border: 1px solid #e3dede;

    &_price {
      letter-spacing: -2px;
      font-weight: bolder;
      font-size: 2em;

      .__currency {}
      .__price {
        line-height: 1;
      }
      .__duration {}
    }

    li {
      list-style: none;
      display: flex;
      margin-bottom: 10px;
      font-size: 1.1em;

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

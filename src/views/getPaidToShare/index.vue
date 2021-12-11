<template>
  <div class="page partners-page mx-5">
    <v-container fluid grid-list-lg>
        <v-layout wrap align-center justify-center>
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



        <v-layout wrap align-center justify-center>
            <v-flex xs6 layer-flex flex-img>
                <img
                  width="60%"
                  src="/static/images/re_whyBg.svg"
                />
            </v-flex>
            <v-flex xs5 layer-flex flex-text>
                <h2>Why?</h2>

                <ul>
                  <li>Sharing is valuable</li>
                  <li>Content is experienced when it’s shared </li>
                  <li>You are part of the sharing process</li>
                </ul>
            </v-flex>
        </v-layout>

        <h1 class="mt-5">How?</h1>
        <div>
          Verified artists & brands can pay you to share their albums, videos & products to your followers with Repost Requests.   Artists and brands will send you a Direct Message and attach their content for you to share. Before the message is sent artists & brands will pay the repost price you set. 
          <br />
          <br />
          When you receive the message you can view the content & decide if you want to repost or deny. Accepted requests will stay on your feed for 7 days and you will receive payment in 2 days. You can charge up to <b>5k per repost</b> with the <b>Plus</b> subscription plan, or up to <b>100k per repost</b> with a <b>Pro</b> subscription plan.
        </div>

        <br>
        <br>

        <h2>Go ad-free.  Support Creators.  Get Paid.</h2>

        <v-btn depressed class="choose__btn __rounded white--text mt-4" to="/plans">
            <span>Choose Plan</span>
        </v-btn>
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

<template>
  <div class="page partners-page mx-5 mt-5 pt-5">
    <v-container fluid grid-list-lg>
        <v-layout wrap align-center justify-space-between>
            <v-flex xs5 layer-flex flex-text>
                <h2 class="mb-2">Get paid  <br> to share.</h2>
                <!-- <h3 class="mt-2">Upgrade to remove ads & accept Repost <br /> Requests.</h3> -->

                <div class="b-body-text">
                  With Repost Request verified artists & brands can pay you to share their albums, videos & products to your followers.
                </div>

                <br />

                <ul>
                  <li>
                    <b>Basic plan:</b> charge up to <b>$100</b> per repost
                  </li>
                  <li>
                    <b>Pro plan:</b> charge up to <b>10k</b> per repost
                  </li>
                  <li>
                    <b>Plus plan:</b> charge up to <b>100k</b> per repost
                  </li>
                </ul>

                <span>
                  <v-btn
                    depressed
                    round
                    class="white--text mt-4 app-blue"
                    :to="'/adfree#plans'"
                  >
                      <b>Choose Plan</b>
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

<template>
  <div class="page partners-page mx-5">
    <v-container fluid grid-list-md>
        <v-layout wrap align-center justify-center>
            <v-flex xs5 layer-flex flex-text>
                <h3 class="mb-2">YouSound Partners</h3>
                <h1>Grow your <br> audience & <br> revenue.</h1>

                <span>
                <v-btn class="black white--text mt-4">
                    <v-icon class="mr-2">south</v-icon>
                    <span>Learn More</span>
                </v-btn>
                </span>
            </v-flex>
            <v-flex xs5 layer-flex flex-img>
                <img
                width="100%"
                src="/static/images/up_partner.svg"
                />
            </v-flex>
        </v-layout>

        <v-layout wrap align-center justify-center>
            <v-flex xs6 layer-flex flex-img>
                <img
                    width="80%"
                    src="/static/images/up_growth.svg"
                />
            </v-flex>
            <v-flex xs5 layer-flex flex-text>
                <h2>Get Paid</h2>

                <ul>
                <li>Share ad & subscription revenue</li>
                <li>User-centric payouts</li>
                </ul>
            </v-flex>
        </v-layout>

        <v-layout wrap align-center justify-center>
            <v-flex xs4 layer-flex flex-text>
                <h2>Unlock Features</h2>

                <ul>
                    <li>Sell physical products
                    <li>Broadcast Live Video</li>
                </ul>
            </v-flex>
            <v-flex xs5 layer-flex flex-img>
                <img
                src="/static/images/up_features.svg"
                />
            </v-flex>
        </v-layout>
    </v-container>


    <div class="section-faq">
      <div class="__intro-title">FAQ</div>
      <accordion :accordions="accordions" leftIcon="add" />
    </div>
  </div>
</template>

<script type="text/javascript" src="./partners.ctrl.js"></script>
<style src="../../../static/styles/partners.scss" lang="scss" scoped>

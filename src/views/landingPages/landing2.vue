<template>
  <div>
    <Header></Header>
    <Banner
      :title="'The best place for artists & brands.'"
      :imgSrc="bannerImg"
    ></Banner>
    <common-section
      :title="'Upload Music '"
      :title2="'& Share '"
      :title3="'Upload Videos'"
      :title4="'& Share'"
      :imgSrc="img"
      :order1="1"
      :order2="2"
      :imgSrc1="img1"
      :order3="2"
      :order4="1"
      :bg="true"
      :list1="musicList"
      :list2="videoList"
    ></common-section>
    <common-section
      :title="'Sell Your'"
      :title2="'Products'"
      :title3="'Multiple'"
      :title4="'Revenue Streams'"
      :imgSrc="img2"
      :order1="1"
      :order2="2"
      :imgSrc1="img3"
      :order3="2"
      :order4="1"
      :bg="false"
      :list1="productList"
      :list2="streamsList"
    ></common-section>
    <common-section
      :title="'Measure & Grow'"
      :title2="'Your Audience'"
      :title3="'Become a Partner'"
      :title4="'& Earn More'"
      :imgSrc="img4"
      :order1="1"
      :order2="2"
      :imgSrc1="img5"
      :order3="2"
      :order4="1"
      :bg="false"
      :list1="growList"
      :list2="partnerList"
    ></common-section>
    <time-line></time-line>
    <join></join>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/landingPages/Header.vue";
import Banner from "@/components/landingPages/Banner.vue";
import Join from "../../components/landingPages/Join.vue";
import Footer from "../../components/landingPages/Footer.vue";
import CommonSection from "../../components/landing2/CommonSection.vue";
import TimeLine from "../../components/landing2/TimeLine.vue";
export default {
  name: "Landing2",
  components: { Header, Banner, Join, Footer, CommonSection, TimeLine },
  data() {
    return {
      bannerImg: require(`@/assets/banner.gif`),
      img: require(`@/assets/upload.svg`),
      img1: require(`@/assets/videos.svg`),
      img2: require(`@/assets/products.svg`),
      img3: require(`@/assets/streams.svg`),
      img4: require(`@/assets/grow.svg`),
      img5: require(`@/assets/wallet.svg`),
      musicList: [
        "Add collaborators",
        `Share direct-to-listeners`,
        `Attach products to albums`,
      ],
      videoList: [
        `Attach albums to videos`,
        `Attach products to videos`,
        `Accept donations`,
      ],
      productList: [
        `Sell physical & digital products`,
        `Collaborate, split revenue & recoup`,
        `Keep 100% of product sales`,
      ],
      streamsList: [
        `Sales, pay-perview, donations`,
        `Get paid to share`,
        `Become a YouSound Partner`,
      ],

      growList: [`Track your stats`, `Advanced analytics`],
      partnerList: [
        `Share Ad & Subscription revenue`,
        `User-centric payout model`,
        `Earn a liveable income without lots of plays`,
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <div>
    <Header></Header>
    <Banner :title="'Listen, watch & shop!'" :imgSrc="bannerImg"></Banner>
    <CRow
      :title="'Free Music'"
      :title2="'Streaming'"
      :imgSrc="img"
      :order1="1"
      :order2="2"
    ></CRow>
    <CRow
      :title="'Watch Videos'"
      :title2="'& Chat'"
      :imgSrc="img3"
      :order1="2"
      :order2="1"
      :bigImage="true"
    ></CRow>
    <CRow
      :title="'Shop Artists'"
      :title2="'& Brands'"
      :imgSrc="img2"
      :order1="1"
      :order2="2"
    ></CRow>

    <CRow
      :title="'Make Money'"
      :title2="'Sharing'"
      :imgSrc="img1"
      :order1="2"
      :order2="1"
      :moneyImage="true"
    ></CRow>
    <join></join>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/landingPages/Header.vue";
import Banner from "@/components/landingPages/Banner.vue";
import CRow from "@/components/landing1/CRow.vue";
import Join from "../../components/landingPages/Join.vue";
import Footer from "../../components/landingPages/Footer.vue";
export default {
  name: "Landing1",
  components: { Header, Banner, CRow, Join, Footer },
  data() {
    return {
      img: require(`@/assets/music.svg`),
      img1: require(`@/assets/money.svg`),
      img2: require(`@/assets/brands.svg`),
      img3: require(`@/assets/watch.svg`),
      bannerImg: require(`@/assets/banner.gif`),
    };
  },
};
</script>

<style lang="scss" scoped></style>

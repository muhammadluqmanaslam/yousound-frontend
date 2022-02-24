<template>
  <div>
    <Header></Header>
    <!-- <Banner
      :title="'Go ad-free.'"
      :title2="'Support creators.'"
      :title3="'Get paid.'"
    ></Banner> -->
    <CRow
      :title="'Creators Get Paid By'"
      :title2="'You Play.'"
      :ctaText="'Choose a plan'"
      :ctaAction="'#plans'"
      :imgSrc="img"
      :order1="2"
      :order2="1"
      :fullWidth="true"
    ></CRow>
    <CRow
      :title="'Track creators you support'"
      :title2="'on your dashboard'"
      :imgSrc="img1"
      :order1="1"
      :order2="2"
    ></CRow>
    <CRow
      :title="' Make money'"
      :title2="'sharing content'"
      :imgSrc="img2"
      :order1="2"
      :order2="1"
    ></CRow>
    <plans></plans>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/landingPages/Header.vue";
import Banner from "@/components/landing3/Banner.vue";
import Footer from "../../components/landingPages/Footer.vue";
import CRow from "@/components/landing1/CRow.vue";
import Plans from "../../components/landing3/Plans.vue";

export default {
  name: "Landing1",
  components: { Header, Banner, Footer, CRow, Plans },
  data() {
    return {
      img: require(`@/assets/creators.png`),
      img1: require(`@/assets/dashboard.svg`),
      img2: require(`@/assets/content.svg`),
    };
  },
};
</script>

<style lang="scss" scoped>
section {
  max-width: 1250px;
  width: 100%;
  margin: 180px auto;
}
</style>

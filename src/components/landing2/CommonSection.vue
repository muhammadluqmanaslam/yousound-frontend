<template>
  <section :class="{ bg: bg }">
    <v-container fluid px-0 class="inner-container">
      <v-layout wrap row align-center>
        <v-flex
          xs12
          md6
          :order="order1"
          :class="[`order-md-${order1}`, 'order-1']"
        >
          <div
            class="text-container d-block justify-center align-center align-md-start flex-column"
          >
            <h3 class="mb-5">
              {{ title }} <br />
              {{ title2 }}
            </h3>
            <ul class="ul-list">
              <li v-for="(list, i) in list1" :key="i">
                {{ list }}
              </li>
            </ul>
          </div>
        </v-flex>

        <v-flex
          xs12
          md6
          :order="order2"
          :class="[`order-md-${order2}`, 'order-2']"
        >
          <div class="img-container d-flex justify-center align-center">
            <img :src="imgSrc" />
          </div>
        </v-flex>
      </v-layout>

      <v-layout wrap row row-reverse _pad-first-flex align-center>
        <v-flex
          xs12
          md6
          :order="order1"
          :class="[`order-md-${order3}`, 'order-1']"
        >
          <div
            class="text-container pl-md-15 d-block justify-center align-center align-md-start flex-column"
          >
            <h3 class="mb-5">
              {{ title3 }} <br />
              {{ title4 }}
            </h3>
            <ul class="ul-list">
              <li v-for="(list, k) in list2" :key="k">
                {{ list }}
              </li>
            </ul>
          </div>
        </v-flex>

        <v-flex
          xs12
          md6
          :order="order2"
          :class="[`order-md-${order4}`, 'order-2']"
        >
          <div
            class="img-container pr-md-10 d-flex justify-center align-center"
          >
            <img :src="imgSrc1" />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "CommonSection",
  props: [
    "title",
    "title2",
    "title3",
    "title4",
    "imgSrc",
    "imgSrc1",
    "order2",
    "order1",
    "order3",
    "order4",
    "bg",
    "list1",
    "list2",
  ],
};
</script>

<style lang="scss" scoped>
section {
  padding: 30px 0px;
  .inner-container {
    max-width: 1000px;
    width: 100%;
    margin: auto;
    padding: 0px 0px;
  }
  .layout {
    // margin: 180px -12px;
    margin-bottom: 180px !important;
  }
}
.text-container {
  height: 100%;
  h3 {
    font-style: normal;
    font-weight: bold;
    font-size: 42px;
    line-height: 52px;
    letter-spacing: -0.4px;
    color: #000000;
    max-width: 544px;
    // text-align: center;
  }

  .ul-list {
    margin-left: 25px;
  }
}
.img-container {
  height: 100%;
  img {
    width: 100%;
  }
}

ul {
  li {
    font-style: normal;
    font-weight: 500;
    font-size: 22px;
    line-height: 32px;
  }
}

@media (min-width: 767px) {
  section {
    &.bg {
      margin-top: 100px;
    }
  }
}

@media (max-width: 960px) {
  .text-container {
    h3 {
      font-size: 28px;
      line-height: 36px;
      text-align: center;
    }
    .ul-list {
      display: none;
    }
  }
  section {
    margin: 0px auto !important;
    .inner-container {
      margin: auto;
      padding: 0px 0px;
    }
    &.bg {
      background: transparent;
      margin-top: 50px !important;
    }
    .row {
      margin-top: 0px;
      margin-bottom: 80px !important;
    }
    &:first-child {
      .inner-container {
        padding-top: 80px;
      }
    }
  }
  .img-container {
    img {
      width: 80%;
    }
  }
}
</style>

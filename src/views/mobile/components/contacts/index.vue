<template>
  <transition name="slide-up">
    <div class="contacts">
      <div class="_top">
        <div class="_title">Contacts</div>
        <v-icon @click="closeContacts" class="close-icon">
          keyboard_arrow_down
        </v-icon>
      </div>

      <div class="contacts-count">
        <div class="_count">
          {{ contactsLen | formatNumberWithComma }}
        </div>

        <div class="_label">SMS CONTACT LIST</div>
      </div>

      <div class="demographies">
        <h2 class="intro-title">Top Age group</h2>

        <v-container fluid grid-list-lg px-0>
          <v-layout row wrap>
            <v-flex xs6>
              <div class="bracket bracket-1">
                <div class="num">123</div>
                <div class="demography">Ages 22-24</div>
              </div>
            </v-flex>
            <v-flex xs6>
              <div class="bracket bracket-2">
                <div class="num">345</div>
                <div class="demography">Ages 14-21</div>
              </div>
            </v-flex>
            <v-flex xs6>
              <div class="bracket bracket-3">
                <div class="num">567</div>
                <div class="demography">Ages 35-49</div>
              </div>
            </v-flex>
            <v-flex xs6>
              <div class="bracket bracket-4">
                <div class="num">789</div>
                <div class="demography">Ages 50-65+</div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </div>

      <div class="top-chart">
        <div class="_title">Top Cities</div>

        <div class="top-cities">
          <div v-for="(city, i) in topCities" :key="i" class="city">
            <img
              :src="city.flag"
              :alt="city.name + ' flag'"
              class="city-flag"
            />
            <div class="city-name">{{ city.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      contacts: [{}, {}, {}],
      topCities: [
        {
          name: "Chicago, Illinois",
          flag: require("@/assets/us_flag.svg"),
        },
        {
          name: "Los Angeles, California",
          flag: require("@/assets/us_flag.svg"),
        },
        {
          name: "Illinois",
          flag: require("@/assets/us_flag.svg"),
        },
        {
          name: "California",
          flag: require("@/assets/us_flag.svg"),
        },
      ],
    };
  },
  methods: {
    closeContacts() {
      this.$emit("closeContacts");
    },
  },
  computed: {
    contactsLen() {
      return 2312356;
    },
  },
};
</script>

<style lang="scss" scoped>
.contacts {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  z-index: 9;
  padding: 20px;
  width: 100%;
  height: 100%;

  ._top {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    ._title {
      flex: 1;
      text-align: center;
      font-size: 1.3rem;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 1;
    }
    .close-icon {
      color: #00000099;
      font-size: 40px;
    }
  }

  &-count {
    background: rgba(233, 233, 233, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 9px 13px;
    font-weight: bold;
    margin-bottom: 20px;

    ._count {
      font-weight: 900;
      font-size: 1.7rem;
    }
  }

  .bracket {
    border-radius: 10px;
    padding: 20px;
    color: #ffffff;
    margin-bottom: 15px;

    .num {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .demography {
      font-weight: bold;
      font-size: 16px;
    }

    &-1 {
      background: linear-gradient(180deg, #287eff 0%, #316bff 100%);
    }
    &-2 {
      background: linear-gradient(180deg, #ff1e46 0%, #ff0d64 100%);
    }
    &-3 {
      background: linear-gradient(180deg, #ff9922 0%, #ffa216 100%);
    }
    &-4 {
      background: linear-gradient(180deg, #2ac44c 0%, #3ac761 100%);
    }
  }

  .top-chart {
    ._title {
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .top-cities {
      .city {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        padding: 9px 0;

        &-name {
          font-size: 16px;
        }
        &-flag {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
<template>
  <div class="onboarding_comp age-location">
    <div class="form-group">
      <div class="_title">Age group</div>
      <div class="selections">
        <div
          v-for="(age, index) in ageGroups"
          :key="index"
          class="selection"
          :class="{ _selected: ageRange == age.title }"
          @click="selectAgeRange(age)"
        >
          {{ age.title }}
        </div>
      </div>
    </div>

    <div class="form-group">
      <div class="_title">Country</div>
      <input
        v-model="country"
        class="_country"
        :class="{_filled: country}" 
        type="text"
        placeholder="Enter Country"
      />
      <autocomplete
        :keyword="country"
        :options="getCountryList"
        identifier="country"
        @selected="selected"
      ></autocomplete>
    </div>

    <div class="form-group">
      <div class="_title">City</div>
      <input
        v-model="city"
        class="_city"
        :class="{_filled: city}" 
        type="text"
        placeholder="Enter City"
      />
      <autocomplete
        :keyword="city"
        :options="getCityList"
        identifier="city"
        @selected="selected"
      ></autocomplete>
    </div>

    <NavFooter
      :nextValidated="validated('skipToast')"
      :current="current"
      @nextStage="handleNextStage"
      @prevStage="handlePrevStage"
    />
  </div>
</template>

<script>
import autocomplete from "@/components/autocomplete.vue";
import NavFooter from "./navFooter";
import { mapActions, mapMutations, mapState } from "vuex";
import AuthService from "@/services/auth"

export default {
  components: { 
    autocomplete,
    NavFooter,
  },
  data() {
    return {
      ageRange: null,
      ageGroups: [
        {
          id: 1,
          title: "14-21",
        },
        {
          id: 2,
          title: "22-34",
        },
        {
          id: 3,
          title: "35-49",
        },
        {
          id: 4,
          title: "50-85+",
        },
      ],
      country: "",
      city: "",
      cityAutoActive: false,
      proceedToCities: false,
    };
  },
  computed: {
    ...mapState({
      current: (state) => state.app.onboarding.current,
      countries: (state) => state.app.countries,
      cities: (state) => state.app.cities,
      getAgeRange: (state) => state.app.onboarding.ageRange,
      getCountry: (state) => state.app.onboarding.country,
      getCity: (state) => state.app.onboarding.city,
    }),
    getCountryList() {
      const getCountries = this.countries.map((c) => c.country);
      const countries = getCountries.filter((country) => {
        if (country.toLowerCase().includes(this.country.toLowerCase())) {
          return country;
        }
      });

      return countries

    },
    getCityList() {
      const cities = this.cities.filter((city) => {
        if (city.toLowerCase().includes(this.city.toLowerCase())) {
          return city;
        }
      });

      return cities

    },
  },
  watch: {
    country() {
      this.proceedToCities = false;
    },
    proceedToCities(val) {
      if (val) {
        this.getCities(this.country)
      }
    },
  },
  methods: {
    ...mapActions({
      getCountries: "app/getCountries",
      getCities: "app/getCities",
      gotoNextStage: "app/nextOnboardingStage",
      gotoPrevStage: "app/prevOnboardingStage",
    }),
    ...mapMutations({
      updateOnboarding: "app/updateOnboarding",
    }),
    validated(toastStatus) {
      const skipToast = toastStatus === "skipToast"

      const { ageRange, country, city } = this;
      const valCountry = this.getCountryList.includes(country)
      const valCity = this.getCityList.includes(city)
      const toValidate = [ageRange, valCountry, valCity];

      const errors = [
        "Please choose an age range",
        "Please select a valid country from list",
        "Please select a valid city from list",
      ]

      const isValid = toValidate.every((item, index) => {
        if (!skipToast && !item) {
          this.$store.dispatch("error/showErrorToast",[errors[index]])
          return item
        }
        return item
      });
      return isValid;
    },
    selectAgeRange(age) {
      this.ageRange = age.title;
    },
    selected(identifier, option) {
      switch (identifier) {
        case "country":
          this.country = option;
          this.city = ""

          // Bug: had to combine bothe false instance
          this.proceedToCities = true
          this.$nextTick(() => {
            this.proceedToCities = true
          })
          break;
        case "city":
          this.city = option;
          break;
        default:
          break;
      }

    },
    
    async handleNextStage() {
      if (this.validated()) {
        const data = {
          age_group: this.ageRange,
          country: this.country,
          city: this.city,
        };
        let user_params = this.$store.state.app.onboarding
        if(user_params.accountCategory === "listener") {
          let formData = new FormData();

          formData.append('user[email]', user_params.email)
          formData.append('user[password]', user_params.password)
          formData.append('user[username]', user_params.username)
          formData.append('user[display_name]', user_params.fullName)
          formData.append('user[avatar]', user_params.avatar)
          formData.append('user[first_name]', user_params.first_name)
          formData.append('user[last_name]', user_params.last_name)
          formData.append('user[country]', user_params.country)
          formData.append('user[city]', user_params.city)
          formData.append('user[age_group]', user_params.age_group)
          formData.append('user[user_type]', user_params.user_type)

          await AuthService.registerAsListener(formData).then(response => {
            this.updateOnboarding(data);
            this.gotoNextStage(this.current + 1);
          })
          .catch((e) => {
            this.$store.dispatch("error/showErrorToast", [e])
          })
        } else {
          this.updateOnboarding(data);

          this.gotoNextStage(this.current + 1);
        }
      }
    },
    handlePrevStage() {
      if (this.current !== 1) {
        this.gotoPrevStage(this.current - 1);
      }
    },
  },
  created() {
    this.getCountries();

    this.ageRange = this.getAgeRange
    this.country = this.getCountry
    this.city = this.getCity
  },
};
</script>

<style lang="scss" scoped>
.selections {
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  .selection {
    border: 1px solid #d0d0d0;
    border-radius: 3px;
    padding: 10px 10px;
    width: 100%;
    text-align: center;

    &._selected {
      border: 2px solid #000000;
    }

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}

.form-group {
  input {
    width: 100%;
    padding-left: 35px;

    &::placeholder {
      padding-left: 10px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
    }
    &:focus {
      border: 2px solid #000000;
    }
    &._fullname {
      padding-left: 10px;

      &::placeholder {
        padding-left: 0px;
      }
    }
    &._country {
      background: url("../../../../assets/globe_icon_outline.svg") no-repeat
        scroll 7px 13px;
    }
    &._city {
      background: url("../../../../assets/city_icon_outline.svg") no-repeat
        scroll 7px 13px;
    }
  }
}
</style>

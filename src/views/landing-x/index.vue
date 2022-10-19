<template>
  <div class="landing-x">
    <div class="nav-slider transparent">
      <v-container>
        <div class="nav-flex">
          <div class="nav-logo">
            <img src="../../assets/nav_logo_primary.png" width="100%">

          </div>
          <div class="nav-links">
            <router-link to="/subscribe">Subscribe</router-link>
            <router-link to="/login">Login</router-link>
            <router-link to="/signup">
              <v-btn round class="black-btn">Signup</v-btn>
            </router-link>

          </div>
        </div>

      </v-container>
    </div>

    <div class="full-width-header">
      <v-container  class="relative-container">
      <div class="header-container">
        <div class="header-content">
          <h1 class="_title">Join the world's creators <br> & music lovers.</h1>
          <router-link to="/discover">
            <v-btn round class="orange-btn">Discover</v-btn>
          </router-link>
        </div>
      </div>
      <div class="header-img">
        <img src="../../assets/landing.gif" width="100%">
      </div>
    </v-container >
    </div>

  <v-container id="learn-more" class="pt-5 mt-3">
      <learn-more pageMode setOnMobile hideFooter />
  </v-container>

  <v-container class="plans-container" id="plans">
    <div class="dflex align-center justify-space-between top-note">
      <h1 class="main-title intro-title">Choose Plan</h1>
      <div class="_right">* SMS costs $0.01 per text</div>
    </div>

      <hr class="light margin-vertical">


      <div class="plans">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="plan"
          :class="[`plan_${index}`, `plan_${plan.id}`]"
        >
        <div>
          <h2 class="plan_title">{{ plan.title }}</h2>

          <div class="plan_lists">
            <div v-for="(item, i) in plan.list" :key="i" class="plan_list">
              <div class="top_item" v-if="(typeof item === 'string')">
                <!-- <v-icon >check</v-icon> -->
                <div class="mr-2">
                  <img src="../../assets/check-black.svg" width="10">
                </div>
                <div v-html="item">
                  {{ item }}
                </div>

              </div>
              <div v-else>
                <div
                  v-for="(innerItem, i) in item"
                  :key="i"
                  class="innerItem dflex"
                >
                  <span class="_bullet">&bull;</span>
                  <span v-html="innerItem">{{ innerItem }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div class="pricing-absolute">
          <div class="pricing">
            <span class="currency">$</span>
            <span class="cost">{{ plan.price }}</span>
            <span class="per">/month</span>
          </div>

          <div class="plan_btn_wrapper">
            <v-btn
              depressed
              block
              round
              dark
              class="plan_btn py-4"
              @click.native="openPaymentModal(plan)"
            >
              <span v-if="plan.id === 'basic'">Start free 30 day trial</span>
              <span v-else>Get Verified</span>
            </v-btn>
          </div>
        </div>
        </div>
      </div>
  </v-container>

  <v-container>
      <Footer />
  </v-container>
</div>
</template>


<script>
import LearnMore from "@/views/mobile/auth/learnMore";
import Footer from "@/components/landingPages/Footer-2.vue"
import AuthPlan from "@/views/mobile/auth/onboarding/authPlan";
import { mapState } from "vuex";

export default {
  components:{
    LearnMore,
    Footer
  },
  computed: {
    ...mapState({
      plansData: (state) => state.app.plansData,
      current: (state) => state.app.onboarding.current,
    }),
    plans() {
      const plans = this.plansData.map((plan) => {
        if (plan.id == "basic") {
          plan.title = "Everyone";
        }
        return plan;
      });

      return plans;
    },
    mouonted(){
      
    }

  },
}

window.onscroll = function(e){
  
    var div = document.querySelector('#learn-more');
    var navbar = document.querySelector('.nav-slider')
    console.log(window.pageYOffset)
    if(window.pageYOffset > 10 ){
      navbar.classList.remove('transparent')
    }
    else{
      navbar.classList.add('transparent')
    }
    // example use
    var div = document.querySelector('#learn-more');
    var navbar = document.querySelector('.nav-slider')
    // var divOffset = offset(div);
    var rect = div.getBoundingClientRect()

    if(rect.top  < 120){
      navbar.classList.add('bg-white')
    }
    else{
      navbar.classList.remove('bg-white')
    }
    console.log("Scrolling");
}



</script>

<style lang="scss">

.landing-x{

  .main-title{
    font-size: 44px;
    font-weight: bold;
    letter-spacing: -2px;
  }
  .nav-slider{
    background-color: #f7eeea;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    &.bg-white{
      background-color: white;
    }
    &.transparent{
      background-color: transparent;
    }
    
    .nav-flex{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;

      .nav-logo{
        width: 165px;
      }

      .nav-links{
        display: flex;
        align-items: center;
        gap: 35px;

        .black-btn{
          color: white;
          background-color: black;
          font-size: 18px;
          font-weight: bold;
          padding: 5px 7.5px;
        }

        a{
          color: black;
          font-weight: bold;
          font-size: 18px;
        }
      }

    }
  }


  .full-width-header{
    background-color: #f7eeea;
    overflow: hidden;

    .relative-container{
      position: relative;
      padding: 200px 0 150px;
    }

    .header-content{
      width: 65%;
      position: relative;
      z-index: 5;
      ._title{
        font-size: 58px;
        line-height: 64px;
        letter-spacing: -2px;
        font-weight: 700;
      }

      .orange-btn{
        height: auto;
        color: white;
        background-color: #f85032;
        font-weight: 700;
        margin-left: 0px;
        margin-top: 35px;
        padding: 11px 25px;
        font-size: 18px;
        font-weight: bold;
        box-shadow: none;
        border: none;
      }
    }
  }
  .header-img{
    position: absolute;
    width: 50%;
    max-width: 730px;
    bottom: -10px;
    right: 0;
  }



  .plans-container {
    margin-top: 100px;
    padding-bottom: 75px;


    .top-note {
      font-weight: 400;
      ._right {
        font-size: 14px;
      }
    }
    .margin-vertical{
      margin-top: 20px;
      margin-bottom: 95px;
    }

    .plans {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      gap: 50px;

      .top_title {
        font-size: 32px;
      }
      .top_subtitle {
        font-size: 18px;
      }

      .plan {
        border-radius: 30px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        width: 45%;
        padding: 20px 0 28px;
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        &_0 {
          background: #F7EEEA;
          border: 1px solid #F7EEEA;

        }
        &_1 {
          background: rgba(251, 228, 151, 0.6);
          border: 1px solid rgba(251, 228, 151, 0.6);
        }
        &_2 {
          background: rgba(230, 217, 251, 0.8);
          border: 1px solid rgba(230, 217, 251, 0.8);
        }
        ._bullet{
          margin-right: 5px;
          margin-left: 23px;
        }

        &_title {
          font-size: 28px;
          margin: 10px 0 5px;
          padding: 0 30px;
        }

        &_lists {
          overflow: visible;
          padding: 7px 30px 0;
          margin-right: 10px;

          &::-webkit-scrollbar {
            width: 4px;
          }

          &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px transparent;
            -webkit-box-shadow: inset 0 0 6px transparent;
            border-radius: 10px;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 6px #d9d9d9;
            -webkit-box-shadow: inset 0 0 6px #d9d9d9;
          }
        }

        &_list {
          line-height: 2;

          .top_item {
            display: flex;
            align-content: flex-start;
            .icon {
              display: block;
              color: #000000;
              margin-right: 10px;
              margin-top: 5px;
              font-size: 13px;
            }
          }
        }


        .pricing {
          letter-spacing: -0.5px;
          padding: 0 30px;
          margin: 20px 0;

          .cost {
            font-size: 32px;
            font-weight: bold;
          }
          .per {
            font-size: 12px;
            color: #000000;
            opacity: 0.68;
          }
        }

        .plan_btn {
          &_wrapper {
            padding: 0 30px;
          }
        }
      }
    }
  }

  @media screen and  (min-width: 1600px) {
    .container{
      max-width: 1250px;
    }
  }



  @media screen and (max-width: 1250px) and (min-width: 960px) {
    .container{
      max-width: 1050px;

      .intro-title{
        font-size: 36px;
      }
    
      .nav-flex{
        padding: 10px 0;

        .nav-logo{
          width: 135px;
        }

        .nav-links{
          a{
            font-size:16px;
          }

          .black-btn{
            font-size: 16px;
          }
        }
      }

      .header-content{
        ._title{
          font-size: 50px;
          line-height: 55px;
        }

        .orange-btn{
          font-size: 16px;
          padding: 7.5px 20px;
        }
      }

      .plans {
        gap: 25px;
      }
    }
  }
}
</style>
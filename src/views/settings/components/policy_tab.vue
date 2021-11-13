<template>
  <v-container fluid class="main-section">
    <!-- <div class="description-section"></div> -->
    <v-layout row wrap class="content-section">
      <v-flex xs12 return-policy-section ma-0>
        <div class="form-group">
          <label class="control-label">Return Policy</label>
          <textarea
            v-model="user.return_policy"
            class="policy-area"
            placeholder="Write a return policy..."
            rows="5"
          ></textarea>
        </div>
        <div class="form-group">
          <v-btn class="update-btn" @click.native="saveReturnPolicy()"
            >Save</v-btn
          >
        </div>
      </v-flex>

      <v-flex xs12 return-policy-section ma-0>
        <div class="form-group">
          <label class="control-label">Shipping Policy</label>
          <textarea
            v-model="user.shipping_policy"
            class="policy-area"
            placeholder="Write a shipping policy..."
            rows="5"
          ></textarea>
        </div>
        <div class="form-group">
          <v-btn class="update-btn" @click.native="saveShippingPolicy()"
            >Save</v-btn
          >
        </div>
      </v-flex>

      <v-flex xs12 return-policy-section ma-0>
        <div class="form-group">
          <label class="control-label">Size Chart</label>
          <textarea
            v-model="user.size_chart"
            class="policy-area"
            placeholder="Write a size chart..."
            rows="5"
          ></textarea>
        </div>
        <div class="form-group">
          <v-btn class="update-btn" @click.native="saveSizeChart()">Save</v-btn>
        </div>
      </v-flex>

      <v-flex return-policy-section ma-0>
        <div class="form-group">
          <label class="control-label">Privacy Policy</label>
          <textarea
            v-model="user.privacy_policy"
            class="policy-area"
            placeholder="Write a privacy policy..."
            rows="5"
          ></textarea>
        </div>
        <div class="form-group">
          <v-btn class="update-btn" @click.native="savePrivacyPolicy()"
            >Save</v-btn
          >
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript" src="./policy_tab.ctrl.js"></script>
<style lang="scss" scoped>

  .content-section {
    // width: calc(100% - 262.5px);
    // padding-right: 93.75px;
    // padding-bottom: 30px;
    width: 100%;
    padding-right: 0;
    .flex.xs12.sm3.form-group {
      padding: 0 11.25px;
      margin-bottom: 24px;
    }
    .flex.xs12.sm6.form-group,
    .flex.xs12.sm12.form-group {
      margin-bottom: 12px;
      margin-top: 0px;
      padding-right: 24px;
    }
    .stripe {
      display: flex;
      img {
        height: 55px;
        margin-right: 22.5px;
      }
      & > div {
        display: inline-block;
        margin-top: 7px;
        div {
          line-height: 40px;
        }
        label {
          font-weight: bold;
        }
      }
    }
    .normal-text {
      font-size: 15px;
      color: #000000;
      letter-spacing: -0.6px;
      display: none;
    }
    .update-btn {
      height: 37.5px;
      // width: 112.5px;
      box-shadow: none;
      text-transform: none;
      margin: 0;
      background: #3a92ff !important;
      border-radius: 75px;
      font-weight: 600;
      font-size: 15px;
      color: #ffffff;
      letter-spacing: 0;
      margin-top: 0;
      .btn__content {
        padding: 0 22.5px;
      }
    }
    .profile-section {
      .profile-image-section {
        background-color: #3a92ff;
        border: 0.75px solid #d2d2d2;
        width: 165px;
        height: 165px;
        border-radius: 100%;
        position: relative;
        margin-left: 11.25px;
        margin-bottom: 15px;
        .loading-activity {
          position: absolute;
          margin-top: 0px;
          top: calc(50% - 15px);
          left: calc(50% - 15px);
        }
        .profile-image {
          position: absolute;
          top: 0px;
          left: 0px;
          background: #ffffff;
          border: 0.75px solid #d2d2d2;
          width: 100%;
          height: 100%;
          border-radius: 100%;
          background-size: cover;
          overflow: hidden;
          background-position: center;
        }
        .profile-image-upload-section {
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          .add-profile-image-file {
            width: 0.75px;
            height: 0.75px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
          }
          .add-profile-image-file + label {
            width: 100%;
            height: 100%;
            font-weight: 600;
            font-size: 15px;
            color: #ffffff;
            letter-spacing: 0;
            .camera {
              color: #ffffff;
              font-size: 28.5px;
              display: block;
              margin-top: calc(50% - 22.5px);
            }
          }
          .add-profile-image-file:focus + label,
          .add-profile-image-file + label:hover {
            color: rgba(255, 255, 255, 0.5);
            .camera {
              color: rgba(255, 255, 255, 0.5);
            }
          }
        }
        .profile-image-change-section {
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          opacity: 0;
          background-color: rgba(58, 146, 255, 0.8);
          border-radius: 100%;
          .change-profile-image-file {
            width: 0.75px;
            height: 0.75px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
          }
          .change-profile-image-file + label {
            width: 100%;
            height: 100%;
            font-weight: 600;
            font-size: 15px;
            color: #ffffff;
            letter-spacing: 0;
            .camera {
              color: #ffffff;
              font-size: 28.5px;
              display: block;
              margin-top: calc(50% - 22.5px);
            }
          }
        }
        &:hover {
          .profile-image-change-section {
            opacity: 1;
          }
        }
      }
      .cancel-account-btn {
        background: transparent !important;
        text-transform: none;
        box-shadow: none;
        margin: 0;
        font-weight: 700;
        font-size: 13.5px;
        color: #3a92ff;
        letter-spacing: 0;
        cursor: pointer;
        line-height: 37.5px;
        .btn__content {
          padding: 0;
        }
        &:hover {
          .btn__content {
            &::before {
              background: transparent;
            }
          }
        }
      }
      .regular-checkbox.settings {
        margin: 6px 7.5px;
        &.enable-alerts {
          float: right;
        }
        input:checked + label:before {
          background: #3a92ff;
        }
        input:checked + label:after {
          content: '';
          padding: 1.5px;
          text-align: center;
          position: absolute;
          width: 0.75px;
          height: 9px;
          border: solid #ffffff;
          border-width: 0 2.25px 2.25px 0;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          top: 3.75px;
          left: 5.25px;
        }
      }
    }
    .shipping-address-section {
      // .shipping-address-city-section {}
      .shipping-address-state-section {
        flex: 0 0 auto;
        width: 90px;
        margin-left: 10px;
      }
    }
    .bocked-user-section {
      .blocked-user-profile-image {
        width: 37.5px;
        height: 37.5px;
        border-radius: 100%;
        display: inline-block;
        vertical-align: middle;
        background-size: cover;
        overflow: hidden;
        background-position: center;
        border: 0.75px solid #ebebeb;
        .activity-item-profile-cover {
          margin-left: -11.25px;
        }
      }
      .blocked-user-name {
        vertical-align: middle;
        font-weight: 600;
        font-size: 15px;
        color: #000000;
        letter-spacing: 0;
        margin-left: 7.5px;
      }
      .unblock-btn {
        box-shadow: none;
        text-transform: none;
        vertical-align: middle;
        background: #3a92ff !important;
        border-radius: 75px;
        font-weight: 600;
        font-size: 15px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
    .policy-area {
      width: 100%;
      resize: none;
      border: 0.75px solid rgba(0, 0, 0, 0.2);
      padding: 10px;
      border-radius: 5px;
      font-size: 16px;
    }
  }
</style>

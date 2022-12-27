<template>
  <v-container pa-0 class="genre" v-if="isPageReady">
    <v-layout row wrap mt-3 class="pgs_area" v-if="show_selector_view">
      <div class="pgs-wrapper genre-container" v-for="(parent, index) in genres">
        <div class="pgs" :key="parent.id">
          <div
            class="pgs-inner-wrapper genre-block"
            
            @click.stop="selectParent(parent, index)"
          >
            <div class="pgs-inner">
              <div class="pgs__title">
                <label>{{ parent.name }}</label>
              </div>
              <div class="pgs__content">
                <div class="upload-info">
                  <label>{{ parent.users_size | formatNumberWithComma }}</label>
                  <span>Album Uploaded</span>
                </div>
                <div v-if="parent.value" class="pgs__badge check-o"></div>
                <div v-else class="pgs__badge check"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-layout>

    <div v-if="show_selector_view" class="text-xs-center">
      <v-btn dark color="blue" class="update-btn" @click.native="dismiss()"
        >OK</v-btn
      >
    </div>

    <div class="genre-container" v-if="!show_selector_view">
      <div class="pgs-wrapper">
        <div class="pgs" :key="parent.id">
          <div
            class="pgs-inner-wrapper genre-block"
          >
            <div class="pgs-inner">
              <div class="pgs__title">{{ parent.name }}</div>
              <div class="pgs__content">
                <div class="pgs__badge check-o" v-if="parent.value"></div>
                <div class="pgs__badge check" v-else></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="genre__content">
        <v-radio-group v-model="genre.id" :mandatory="false">
          <v-layout row wrap ma-0 :key="parent.id">
            <template
              v-if="Object.keys(groupChildrenByRegion(parent)).length == 1"
            >
              <v-flex xs12 sm4 v-for="child in parent.children" :key="child.id">
                <div class="dflex">
                  <input name="sub-genres" type="radio" :id="child.id" :value="child.id"  @change="checkChildGenre(parent, child)">
                  <label class="ml-2" :for="child.id">{{child.name}}</label>
                </div>
                <!-- <v-radio
                  :label="child.name"
                  :value="child.id"
                  @change="checkChildGenre(parent, child)"
                ></v-radio> -->
              </v-flex>
            </template>
            <template v-else>
              <template v-for="(values, key) in groupChildrenByRegion(parent)">
                <v-flex xs12
                  ><h5>{{ key }}</h5></v-flex
                >
                <v-flex xs12 sm3 v-for="child in values" :key="child.id">
                  <div class="dflex">
                    <input name="sub-genres" type="radio" :id="child.id" :value="child.id"  @change="checkChildGenre(parent, child)">
                    <label class="ml-2" :for="child.id">{{child.name}}</label>
                  </div>
                </v-flex>
              </template>
            </template>
            <v-flex xs12 class="text-xs-center mt-5">
              <v-btn
                dark
                color="grey"
                class="update-btn"
                @click.native="show_selector_view = true"
                >Back</v-btn
              >
              <v-btn
                dark
                color="blue"
                class="update-btn"
                @click.native="dismiss()"
                >Select Genre & Close</v-btn
              >
            </v-flex>
          </v-layout>
        </v-radio-group>
      </div>
    </div>
  </v-container>
</template>

<script type="text/javascript" src="./genre_single_selector.ctrl.js"></script>

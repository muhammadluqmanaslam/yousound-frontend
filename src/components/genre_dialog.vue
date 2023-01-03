<template>
  <v-container
    pa-0
    class="genre"
    :class="{onMobile}"
    v-if="isPageReady"
  >
      <div class='dflex justify-space-between align-center'>
        <div class="">
          <h3 class="_title">Genre filters</h3>
          <div class="_subtitle d-block justify-space-between" :class="{'dflex': !onMobile}">
					  <p v-if="!onMobile">
							Genres you select will appear on Discover
						</p>

						<p v-else>
							Tap and hold to select subgenres
						</p>

					</div>
        </div>
				<div class="dflex align-center"> 
					<div class="input-genre-group" v-if="show_selector_view">
						<input v-on:keyup="filterRecords()" @focus="(inputDropdown = true)" id="filter-select" class="input-genre" type="text" placeholder="Search genres"/>
						<div v-if="inputDropdown">
              <div class="genre-dropdown-overlay" @click="(inputDropdown = false)"></div>
           
            <div class="genre-dropdown" id="genre-dropdown" >
							<div class="genre-container">
								<div v-for="(parent, index) in genres" :key="parent.id">
									<div class="genre-block" v-for="child in parent.children">
										<div v-if="subGenresName.includes(child.name.toLowerCase())">
											<input type="checkbox" class="check-box" :checked="selectedSubgenresIds.includes(child.id)" @click="selectSubGenre(child, parent)" />
											<label for="check" class="text">
												<div class="title">
													{{ child.name}}
												</div>
												<div class="subtitle">
													{{ parent.name }}
												</div>
											</label>
										</div>
									</div>
								</div>
							</div>
							<div class="btn-dropdown">
								<v-btn class="btn-purple" @click="(inputDropdown = false)" >
									Select
								</v-btn>
							</div>

             

						</div>
          </div>
					</div>
					<v-btn
						v-if="!onMobile && show_selector_view"
						round
						dark
						color="black"
						class="update-btn"
						@click.native="saveGenreFilters()"
					>
						Save
					</v-btn>
          <v-btn
          v-if="!show_selector_view"
          round
          dark
          color="black"
          class="update-btn hollow mr-2"
          @click.native="(show_selector_view = true)"
        >
          Back
        </v-btn>
					<v-btn
						v-if="!show_selector_view"
						round
						dark
						color="black"
						class="update-btn"
						@click.native="(show_selector_view = true)"
					>
						Save
					</v-btn
				>

			</div>

			<img
				v-if="onMobile"
				src="../../static/images/ic_close_dark.svg"
				width="18"
				@click="dismiss()"
			/>
    </div>
    <v-container fluid grid-list-lg px-0 pt-0>
      <v-layout row wrap mt-4 class="pgs_area" v-if="show_selector_view">
        <v-flex
          class="pgs-wrapper" 
          v-for="(parent, index) in genres"
          :key="index"
          xs12
          sm2
        >
          <div class="pgs" :key="parent.id">
            <div
              :class="[selectedMainGenresIds.includes(parent.id) ? 'pgs-inner-wrapper selected' : 'pgs-inner-wrapper']"
              @click="selectParentGenre(parent)"
            >
              <div class="pgs-inner">
                <div class="pgs__title">
                  <label>{{ parent.name }}</label>
                </div>
                <div class="dflex align-center justify-space-between">
                  <div class="pgs__description">
                    <span @click.stop="selectParent(parent, index)"
                      >{{ getSelectedChildrenCount(parent) }} Subgenres</span
                    >
                  </div>
                  <div class="highlight-circle">

                  </div>
                </div>
                <div class="pgs__content">
                  <div class="upload-info">
                    <label>{{ parent.users_size | formatNumberWithComma }}</label>
                    <span>Albums</span>
                  </div>
                  <div v-if="parent.value" class="pgs__badge check-o"></div>
                  <div v-else class="pgs__badge check"></div>
                </div>
              </div>

              <div
                v-if="onMobile && parent.value"
                class="_selected"
              >
                Selected
              </div>
            </div>
          </div>
        </v-flex>
      </v-layout>
      <div v-if="onMobile" class="_save-section">
        <v-btn
          round
          dark
          color="black"
          class="update-btn"
          :loading="loading"
          @click.native="saveGenreFilters()"
        >
          Save
        </v-btn>
      </div>
    </v-container>



    <div class="genre-container" v-if="!show_selector_view">
      <div class="pgs-wrapperx">
        <div class="pgx" :key="parent.id">
          <div
            class="pgs-inner-wrapper-x"
          >
            <div class="pgs-inner-x">
              <div class="pgs__title">{{ parent.name }}</div>
              <div class="pgs__description">
                {{ getSelectedChildrenCount(parent) }} Subgenres
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="genre__content">
        <v-layout row wrap ma-0 :key="parent.id">
          <v-flex xs12 sm12>
            <p class="regular-checkbox settings parent-genre">
              <input
                :id="parent.id"
                type="checkbox"
								:checked="parent.children.every(r => selectedSubgenresIds.includes(r.id))"
								@click="checkParentGenre(parent)"
              />
              <label :for="parent.id">Select All</label>
            </p>
          </v-flex>
          <template
            v-if="Object.keys(groupChildrenByRegion(parent)).length == 1"
          >
            <v-flex xs12 sm4 v-for="child in parent.children" :key="child.id">
              <p class="regular-checkbox settings child-genre">
                <input
                  :id="child.id"
                  type="checkbox"
									:checked="selectedSubgenresIds.includes(child.id)"
                  @click="checkChildGenre(parent, child)"
                />
                <label :for="child.id">{{ child.name }}</label>
                <!-- <span>({{ child.users_size }})</span> -->
              </p>
            </v-flex>
          </template>
          <template v-else>
            <template v-for="(values, key) in groupChildrenByRegion(parent)">
              <v-flex xs12
                ><h5>{{ key }}</h5></v-flex
              >
              <v-flex xs12 sm12>
                <p class="regular-checkbox settings parent-genre">
                  <input
                    :id="`${parent.id}-${key}`"
                    type="checkbox"
                    v-model="region[`${parent.id}-${key}`]"
                    @click="checkRegionGenre(parent, key)"
                  />
                  <label :for="`${parent.id}-${key}`">Select All</label>
                </p>
              </v-flex>
              <v-flex xs12 sm3 v-for="child in values" :key="child.id">
                <p class="regular-checkbox settings child-genre">
                  <input
                    :id="child.id"
                    type="checkbox"
                    v-model="child.value"
                    @click="checkChildGenre(parent, child)"
                  />
                  <label :for="child.id">{{ child.name }}</label>
                  <!-- <span>({{ child.users_size }})</span> -->
                </p>
              </v-flex>
            </template>
          </template>
        </v-layout>
      </div>
    </div>
  </v-container>
</template>

<script type="text/javascript" src="./genre_dialog.ctrl.js"></script>

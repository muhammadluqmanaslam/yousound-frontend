<template>
  <div>
    <BannerUpload 
    v-if="!videoFile"
    MainHeading="Premiere a video" 
    MainText="Upload videos & connect your products, albums + earn subscription revenue from your streams"
    :Icon="iconImage"
    :MainImage="bannerImage"
  />

  <div class="page upload-child video-page create-page mx-5 margin-top-header" v-if="this.currentUser.creator_verified">
    <topbarNotification :content="topBarContent" ctaTitle="Connect" :cta="{ name: 'ManageIndex', params: { tab: 'payment'}}" />
  
    <content-top-header class="black-theme" v-if="videoFile">
      <template slot="topHeader">
        <ul class="pr-3">
          <li
            class="nav-li active"
          >
            <label class="nav-label" >
            <router-link to="/upload">
              
              < Back
            </router-link>
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content">
        <drag-file-uploader
          accept="video/*"
          type="file"
          category="video"
          @filePicked="pickedFile"
          :autoUpload="true"
          ref="dragFileUploader"
        ></drag-file-uploader>

        <form v-if="videoFile" v-on:submit.prevent="submit()" class="video-info-section mt-5">
          <v-layout row>
            <v-flex sm5>
              <div class="mb-4 dflex align-center mt-4">
                <span class="app-bold mr-3 _filename">{{ videoFileName }}</span>
                <span
                  class="red--text app-bold cursor-pointer"
                  @click="deleteAttachedVideo"
                >
                  delete
                </span>
              </div>
            </v-flex>
          </v-layout>
            <div class="mt-5">
                <h4 class="album-info-title">Info</h4>
              </div>
          <div class='dflex gap-15'>
            <v-flex sm8>
            <div class="dflex gap-15">
              <div class="form-group">
                <label class="control-label max-char-label">
                  <span class="__title">
                  <label class="required">*</label>
                    Video Title
                  </span>
                </label>
                <input
                  type="text"
                  class="form-control py-0 my-0"
                  name="title"
                  v-model="stream.name"
                  maxlength="80"
                  v-validate="'required'"
                />
              </div>

              <div class="form-group">
                <label class="control-label max-char-label">
                  <span class="__title">
                  <label class="required">*</label>
                    Category
                  </span>
                </label>
                <v-select
                  v-model="stream.genre_id"
                  
                  :items="genres"
                  name="genre"
                  v-validate="'required'"
                  item-text="name"
                  item-value="id"
                  class="py-0 my-0"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="control-label max-char-label">
                <span class="__title">
                  Description
                </span>
              </label>
              <textarea
                class="form-control"
                v-model="stream.description"
                maxlength="4000"
              />
            </div>

            </v-flex>
            <v-flex sm4>
              <div class="form-group">
                <label class="control-label">
                    <span>Custom video thumbnail</span>
                </label>

                <div class="video-thumbnail-container">
                  <div class="video-thumbnail-wrapper">
                    <div
                      v-if="stream_cover_url"
                      :style="{
                        'background-image': 'url(' + stream_cover_url + ')',
                      }"
                      class="video-thumbnail"
                    ></div>
                    <div v-else class="video-thumbnail">
                      <div class="cover-wrapper allChildrenCenter">
                        <label for="stream_cover_file" class="cursor-pointer">
                          <span class="texet-xs-center dflex align-center justify-center flex-column">
                            <img width="25" src="/static/images/ic_camera.svg" alt="">
                            <span class="mt-1"><b>upload</b></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="cover-wrapper">
                    {{ stream_cover_url ? 'YES' : '' }}
                    <input
                      type="file"
                      name="stream_cover_file"
                      id="stream_cover_file"
                      accept=".png, .jpg, .jpeg"
                      v-validate="'required'"
                      @change="imageChanged($event)"
                    />
                    <label for="stream_cover_file">
                      <span v-if="stream_cover_url" class="app-blue--text">Change</span>
                    </label>
                  </div>
                </div>
              </div>

            </v-flex>

          </div>


          <div class="mt-5">
            <h4 class="album-info-title">Options</h4>
          </div>


            <div class="dflex gap-15 mt-4">

              <div class="form-group">
                <label class="control-label">Attach Product/Album</label>
                <div class="panel">
                  <v-select
                    v-model="stream_assoc"
                    :items="mergedAttachmentItems"
                    item-text="name"
                    item-value="id"
                    placeholder="Type name to search your products & albums"
                    chips
                    class="pt-0"
                    autocomplete
                    clearable
                  >
                    <template slot="item" slot-scope="data">
                      <v-chip
                        @input="data.parent.selectItem(data.item)"
                        :selected="data.selected"
                        :key="JSON.stringify(data.item)"
                      >
                        <v-avatar>
                          <img v-if="data.item.album_type" :src="data.item.cover.url" />
                          <img v-else :src="data.item.covers[0].cover.url" />
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>

                    <template slot="item" slot-scope="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content
                          v-text="data.item"
                        ></v-list-tile-content>
                      </template>

                      <template v-else>
                        <div class="dflex width100 align-centermy-3">
                          <v-list-tile-avatar>
                            <img v-if="data.item.album_type" :src="data.item.cover.url" />
                            <img v-else :src="data.item.covers[0].cover.url" />
                          </v-list-tile-avatar>

                          <v-list-tile-content class=" py-3">
                            <v-list-tile-title
                              v-html="data.item.name"
                            ></v-list-tile-title>
                          </v-list-tile-content>
                        </div>
                      </template>
                    </template>
                  </v-select>
                </div>
              </div>

              <!-- <div class="form-group viewer-support mt-3">
                <label class="control-label">Allow viewer support</label>
                <ul>
                  <li>
                    Upload a small file to include anything from music to videos
                  </li>
                  <li>
                    Your viewers will be able to pay $1, $10, $100, or name
                    their own price for this file.
                  </li>
                  <li>
                    File is only available for the duration of the broadcast &
                    downloadable on direct message
                  </li>
                </ul>
                <digital-uploader
                  :digitalContent="digital_content"
                  accept=".zip, .mp3"
                />
              </div> -->


              <div class="form-group">
                <label class="control-label">Featured profiles</label>
                <v-select
                  v-model="stream.account_ids"
                  :items="friends"
                  multiple
                  item-text="name"
                  item-value="id"
                  placeholder="Select"
                  chips
                  class="pt-0"
                  autocomplete
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar.url" />
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content
                        v-text="data.item"
                      ></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.username"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </div>

              <!-- <div class="mt-5">
                <p class="regular-checkbox ma-0">
                  <input
                    id="terms"
                    type="checkbox"
                    name="terms"
                    v-model="terms"
                    v-validate="'required'"
                  />
                  <label for="terms"
                    >I have read & agree to the
                    <router-link
                      class="forgot-password"
                      to="/terms"
                      target="_blank"
                      >Terms & Conditions</router-link
                    ></label>
                </p>
              </div> -->
     

            </div>

          <div class="submit-section">
            <hr class="mb-4" />

            <v-btn
              style="background-color: #394DFF !important"
              round
              flat
              :loading="loading"
              class="release-now-btn white--text mb-5" 
              type="submit"
              :disabled="submitLoading"
            >
            Release
            </v-btn>
          </div>
        </form>
      </div>
    </div>

    <v-dialog v-if="video_upload_successfully"
			v-model="video_upload_successfully"
			content-class="collaborators-success-dialog"
		>
			<v-card>
				<v-card-title class="headline">
					<div class="dflex gap-15">
						<div>
							<img src="../../assets/black-check.svg" width="25">
						</div>
						<div class="headline-text">
							Your video was released! <a href="/upload/video" style="text-decoration: underline !important">Upload another</a> or go to <router-link to="/upload" style="text-decoration: underline !important">upload page</router-link> 
						</div>
					</div>
				</v-card-title>

				<div class="modal-body">
					<div class="dflex gap-20">
						<div class="w-30 border-round">
							<img :src="stream_cover_url" width="100%">
						</div>
						<div class="w-70">
							<div>
								<h3 class="main-head">{{ stream.name }}</h3>
								<p class="mb-0 second-head mx-0 my-0">{{ currentUser.username }}</p>
								<p class="light-text mx-0 my-0">{{ genre_name }}</p>

							</div>
							<hr class="my-4">

							<div class="dflex align-center gap-20">
								<div class="dflex align-center gap-15">
									<a href="#"><img src="../../assets/email-xcon.svg" width="16"></a>
									<a href="#"><img src="../../assets/facebook-xcon.svg" width="10"></a>
									<a href="#"><img src="../../assets/twitter-xcon.svg" width="17"></a>
									
									
		
								</div>
								<div class="url-bar">
									<p class="mx-0 my-0">{{ videoUrl }}</p>
									<div
										class="clipboard-btn"
										v-clipboard:copy="videoUrl"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
									>
										<img src="../../assets/clone.svg" width="16">
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<div class="dflex align-center justify-space-between gap-max">
						<div class="w-100">
							<h2 class="foot-head">
								Promote your profile
							</h2>
							<p class="mx-0 my-0 mt-2">
								Upload a spotlight video to promote your content to new subscribers!
							</p>

							<router-link to="/#">
								<v-btn class="mt-4 fx-btn ml-0">
									Add spotlight
								</v-btn>
							</router-link>
						</div>
						<div class="w-100">
							<img src="../../assets/album-drop.gif" width="100%">
						</div>
					</div>

				</div>
			</v-card>
		</v-dialog>

    <v-dialog v-model="show_help_dialog" content-class="my-dialog-2">
      <v-card>
        <v-card-title>
          <v-card-media src="/static/images/post1.jpg" contain></v-card-media>
          <label>Live Video</label>
        </v-card-title>
        <v-card-text>
          <ul>
            <li>
              Attach albums & products to live video to <br />let user
              <b>download</b> or <b>add to cart</b> while viewing.
            </li>
            <li>Make albums & products <b>exclusive</b> on broadcast.</li>
            <li>
              Let users view for <b>Free</b> or <b>Pay Per View</b>.<br />Charge
              up to $10,000 per user.
            </li>
            <li><b>Limit</b> the amount of viewers on your broadcast.</li>
            <li>Add users to your <b>Guest List</b> to watch for free.</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeHelpDialog()"
            class="px-4"
            >Ok, Got it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="show_stripe_connect_dialog"
      content-class="my-dailog-1"
      persistent
    >
      <v-card>
        <v-card-text>
          <div class="headline">Stripe Connect</div>
          <div>You have to connect stripe in setting page.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeStripeConnectDialog()"
            class="px-4"
            >Ok, Got it!</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="show_collaborators_dialog"
      content-class="stream-collaborators-dialog"
      persistent
    >
      <v-card>
        <v-card-title
          ><div class="headline">
            Collaborators Pay Per View Split
          </div></v-card-title
        >
        <v-card-text>
          <div>
            <div>
              <v-select
                :items="view_prices"
                v-model="stream.view_price"
                v-validate="'required'"
                item-text="name"
                item-value="id"
                class="pt-0"
              />
            </div>

            <div
              v-if="stream.view_price > 0 && stream.collaborators.length < 3"
            >
              <v-btn
                class="add-option-btn ma-0"
                @click.native="addCollaborator()"
              >
                <v-icon>add</v-icon> Add another collaborator
              </v-btn>
            </div>

            <v-layout
              row
              creator-wrapper
              v-if="stream.collaborators && stream.collaborators.length > 0"
            >
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Creator<span class="required">*</span></label
                >
                <label class="creator-name">{{ currentUser.username }}</label>
              </v-flex>
              <v-flex xs6 sm3>
                <label class="control-label"
                  >Profit Share<span class="required">*</span></label
                >
                <label class="creator-share">{{ creator_share }}</label>
              </v-flex>
              <v-flex xs6 sm3>
                <label class="control-label">Recoup Cost</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="stream.creator_recoup_cost"
                />
              </v-flex>
            </v-layout>
            <v-layout
              row
              collaborator-wrapper
              v-for="(collaborator, index) in stream.collaborators"
              :key="index"
            >
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Collaborators<span class="required">*</span></label
                >
                <v-select
                  v-model="collaborator.user_id"
                  :items="users"
                  item-text="username"
                  item-value="id"
                  chips
                  class="pt-0"
                  autocomplete
                  no-data-text="No collaborator available"
                  clearable
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      @input="data.parent.selectItem(data.item)"
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                      class="chip--select-multi"
                    >
                      <v-avatar>
                        <img :src="data.item.avatar.thumb.url" />
                      </v-avatar>
                      {{ data.item.username }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content
                        v-text="data.item"
                      ></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img v-bind:src="data.item.avatar.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title
                          v-html="data.item.username"
                        ></v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
                <!-- <input type="text" class="form-control" v-model="collaborator.user_id"> -->
              </v-flex>
              <v-flex xs12 sm6>
                <label class="control-label"
                  >Profit Share<span class="required">*</span></label
                >
                <v-select
                  v-bind:items="profit_share_types"
                  v-model="collaborator.user_share"
                  item-text="name"
                  item-value="id"
                  class="pt-0"
                  autocomplete
                ></v-select>
              </v-flex>
              <v-icon class="clear-btn" @click="deleteCollaborator(index)"
                >clear</v-icon
              >
            </v-layout>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeCollaboratorsDialog()"
            class="px-4"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <payment-modal
      v-if="show_payment_dialog"
      :amount="streamCost"
      :dismiss="closePaymentDialog"
      :finish="deposit"
    />
  </div>

</div>
</template>

<script type="text/javascript" src="./upload.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped />
<style scoped src="../../../static/styles/album.scss" lang="scss" />

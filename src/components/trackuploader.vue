<template>
  <div class="video-page create-page mx-5">
    <div class="page-content">
      <drag-file-uploader
        accept="mp3/*"
        type="file"
        category="audio"
        @filePicked="pickedFile"
        :autoUpload="true"
        ref="dragFileUploader"
      ></drag-file-uploader>
    </div>

    <div class="track-list-section" v-if="album.tracks.length">
      <h4 class="track-list-title" id="track_list">Track List</h4>
      <!-- <div class="track-list-subtitle">
        Highlight track title to rename<span class="required">*</span>
      </div> -->
      <draggable
        v-model="album.tracks"
        handle=".item-handle"
        class="track-items"
      >
        <transition-group>
          <div
            class="track-item"
            v-for="(file, index) in album.tracks"
            :key="index"
          >
            <label class="item-index">{{ index + 1 }}</label>
            <div class="item-section">
              <!-- <div class="item-progress" style="display:none;"></div> -->
              <img class="item-handle" width="18" src="/static/images/t-menu.svg" alt="">
              <input
                v-model="file.file_name"
                type="text"
                :disabled="file.status != status.success"
                @focus="onInputFocus(index, $event)"
                @blur="onInputBlur(index, $event)"
                class="item-name"
              />

              <!-- <v-icon
                v-if="file.editing"
                @click="disableEditing(file)"
                class="not_edit"
              >format_strikethrough</v-icon>
              <v-icon
                v-else
                @click="enableEditing(file)"
                class="edit"
              >title</v-icon> -->

              <!-- <label class="item-progress-value" v-if="file.status == status.uploading">28%</label> -->
              <v-progress-circular
                v-if="file.status == status.uploading"
                indeterminate
                :size="20"
                class="primary--text loading"
              ></v-progress-circular>
            </div>
              <span class="action-btns">
                <v-icon class="done" v-if="file.status == status.success"
                  >done</v-icon
                >
                <v-icon class="failed" v-if="file.status == status.failed"
                  >error_outline</v-icon
                >
              <v-icon
                class="clear-btn"
                @click="deleteTrack(index)"
                v-if="file.status != status.uploading"
                >clear</v-icon
              >
              </span>
          </div>
        </transition-group>
      </draggable>
    </div>

    <v-dialog
      v-model="show_unauthorized_content_dialog"
      content-class="my-dialog-1"
    >
      <v-card>
        <!-- <v-card-media height="125px" contain></v-card-media> -->
        <v-card-text>
          <div class="headline">Unauthorized audio content</div>
          <div>
            The song
            <span class="blue--text">{{ currentFile.track_title }}</span> by
            <span class="blue--text">{{ currentFile.artist_name }}</span> was
            detected in your upload. Please delete any unauthorized tracks in
            your album to complete your upload. if you find this message, please
            contact support.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            color="grey"
            @click.native="show_unauthorized_content_dialog = false"
            >Return to upload page</v-btn
          >
          <v-btn dark color="red" @click.native="cancelTrack()"
            >Cancel Upload</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="show_duplicate_content_dialog"
      content-class="my-dialog-1"
    >
      <v-card>
        <!-- <v-card-media height="125px" contain></v-card-media> -->
        <v-card-text>
          <div class="headline">Duplicate upload</div>
          <div>
            The song
            <span class="blue--text">{{ currentFile.track_title }}</span> by
            <span class="blue--text">{{ currentFile.artist_name }}</span> was
            detected in your upload. Only one copy of a song can exist on
            YouSound. If you are a collaborator on this song, contact the
            original uploader and request to add yourself as a collaborator then
            re-upload the album. Please delete any duplicate tracks in your
            album to complete your upload.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            color="grey"
            @click.native="show_duplicate_content_dialog = false"
            >Return to upload page</v-btn
          >
          <v-btn dark color="red" @click.native="cancelTrack()"
            >Cancel Upload</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* global $:true */

import _ from 'lodash'

import TrackService from '@/services/track.js'
import draggable from 'vuedraggable'
import contentTopHeader from '@/components/contentTopHeader'
import dragFileUploader from '@/components/dragFileUploader'
import topbarNotification from '@/components/topbarNotification'

export default {
  components: {
    draggable,
    contentTopHeader,
    dragFileUploader,
    topbarNotification,
  },

  props: {
    album: {
      type: Object,
    },

    accept: {
      type: String,
      default: '*/*',
    },

    autoUpload: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      topBarContent: 'Connect your Stripe account to start accepting payments',
      show_unauthorized_content_dialog: false,
      show_duplicate_content_dialog: false,
      currentFile: {
        track_title: '',
        artist_name: '',
      },
      status: {
        uploading: 1,
        success: 2,
        failed: 3,
      },
      currentStatus: null,
      uploadFieldName: 'files',
      file: null,
    }
  },

  computed: {
    // dragDisabled() {
    //   const hasEditing = _.find(this.album.tracks, (file) => (file.editing)) == null
    //   // console.log('dragDisabled', !hasEditing)
    //   return !hasEditing
    // }
  },

  created() {
    var files = []
    for (let index in this.album.tracks) {
      const track = this.album.tracks[index]
      var file = {
        editing: false,
        status: this.status.success,
        file_name: track.name,
        track: track,
      }
      files.push(file)
    }
    this.album.tracks = files
  },

  watch: {
    album: {
      deep: true,
      handler(val) {
        if (val.tracks.length < 1) {
          this.file = null
        }
      },
    },
  },

  methods: {
    pickedFile(file) {
      this.file = file
      this.filesChange(file)
      console.log(123)
    },
    saveTrack(file) {
      TrackService.uploadTrack(file.formData)
        .then((response) => {
          file.editing = false
          file.status = this.status.success
          file.track = response.body
        })
        .catch((e) => {
          file.editing = false
          file.status = this.status.failed
          // console.log('saveTrack', e.body)
          switch (e.body.code) {
            case 1:
              if (!this.show_unauthorized_content_dialog) {
                this.currentFile = file
                this.currentFile.track_title = e.body.track_title
                this.currentFile.artist_name = e.body.artist_name
                this.show_unauthorized_content_dialog = true
              }
              break
            case 2:
              if (!this.show_duplicate_content_dialog) {
                this.currentFile = file
                this.currentFile.track_title = e.body.track_title
                this.currentFile.artist_name = e.body.artist_name
                this.show_duplicate_content_dialog = true
              }
              break
            default:
              this.$store.dispatch(
                'error/showErrorToast',
                e.body.errors || [e.body]
              )
              break
          }
        })
    },

    deleteTrack(index) {
      const track = this.album.tracks[index].track
      this.album.tracks.splice(index, 1)
      if (track) {
        TrackService.deleteTrack(track.id)
      }
    },

    cancelTrack() {
      const idx = _.findIndex(this.album.tracks, (f) => f === this.currentFile)
      // console.log('cancelTrack', idx)
      if (idx > -1) {
        this.deleteTrack(idx)
      }

      if (this.show_unauthorized_content_dialog) {
        this.show_unauthorized_content_dialog = false
      }

      if (this.show_duplicate_content_dialog) {
        this.show_duplicate_content_dialog = false
      }
    },

    filesChange(fileList) {
      console.log(456)
      // console.log('uploader filesChange', fileList)
      const vm = this
      // handle file changes
      if (!fileList.length) return
      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        const filesize = fileList[x].size / 1024 / 1024
        var filename = fileList[x].name
        if ((fileList[x].size / 1000) < 160) {
          this.$store.dispatch('error/showErrorToast', [
            'File size too small, must be at least 160k',
          ])
        } else if (filename.toLowerCase().endsWith(this.accept)) {
          if (filesize <= 300) {
            filename = filename.replace('.mp3', '')
            filename = filename.replace('.wav', '')
            filename = filename.replace('.wma', '')
            filename = filename.replace('.ogg', '')
            const formData = new FormData()
            formData.append('track[name]', filename)
            formData.append('track[description]', fileList[x].name)
            formData.append('track[audio]', fileList[x])
            var file = {
              editing: false,
              status: vm.status.uploading,
              file_name: filename,
              new_name: '',
              formData: formData,
            }
            vm.album.tracks.push(file)
            if (vm.autoUpload) {
              vm.saveTrack(file)
            }
          } else {
            this.$store.dispatch('error/showErrorToast', [
              fileList[x].name + ' size is over 100MB.',
            ])
          }
        }
      })

      setTimeout(function () {
        if ($('#track_list').length) {
          $('html, body').animate(
            {
              scrollTop: $('#track_list').offset().top - 37.5,
            },
            700
          )
        }
      }, 100)
    },

    enableEditing(file) {
      // console.log('enableEditing', file)
      file.editing = true
    },

    disableEditing(file) {
      // console.log('disableEditing', file)
      file.editing = false
    },

    onInputFocus(index, evt) {
      // console.log('focus', $(evt.target).val())
      evt.target.select()
    },

    onInputBlur(index, evt) {
      // console.log('blur', index, $(evt.target).val())
      // this.disableEditing(this.album.tracks[index])
      this.updateTrack(index)
    },

    // onStart (evt) {
    //   // console.log('dragging start...', $(evt.item).find('input').val())
    // },

    // onEnd (evt) {
    //   // console.log('dragging end...', $(evt.item).find('input').val())
    // },

    // onClone (evt) {
    //   // console.log('dragging clone...', evt)
    // },

    updateTrack(index) {
      const file = this.album.tracks[index]
      const params = new FormData()
      params.append('track[name]', file.file_name)
      TrackService.patchTrack(file.track.id, params)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.album.tracks[index].track = response.body
          // file.file_name = ''
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },

  mounted() {
    // const vm = this
    // const uploaderBox = $('.uploaderBox')
    // uploaderBox
    //   .on(
    //     'drag dragstart dragend dragover dragenter dragleave drop',
    //     function (e) {
    //       e.preventDefault()
    //       e.stopPropagation()
    //     }
    //   )
    //   .on('dragover dragenter', function () {
    //     uploaderBox.addClass('is-dragover')
    //   })
    //   .on('dragleave dragend drop', function () {
    //     uploaderBox.removeClass('is-dragover')
    //   })
    //   .on('drop', function (e) {
    //     let droppedFiles = e.originalEvent.dataTransfer.files
    //     vm.filesChange(droppedFiles)
    //   })
  },
}
</script>

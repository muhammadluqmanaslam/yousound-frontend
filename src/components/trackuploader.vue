<template>
  <div>
    <div class="uploaderBox" id="uploaderBox">
      <div class="uploaderBox__input">
        <input type="file" id="file" class="uploaderBox__file"
          :name="uploadFieldName"
          :accept="accept"
          @change="filesChange($event.target.files)"
          multiple>
        <label for="file">
          <img src="/static/images/drop_box.png" class="uploaderBox_image" />
        </label>
      </div>
      <div class="uploaderBox__desc">
        <span class="uploaderBox__dragndrop">Click or Drag & Drop audio files</span>
        <span class="uploaderBox__filetype"> MP3 audio files only</span>
      </div>
    </div>
    <div class="track-list-section" v-if="album.tracks.length">
      <h4 class="track-list-title" id="track_list">Track List</h4>
      <!-- <div class="track-items"> -->
        <draggable v-model="album.tracks" class="track-items" @end="onEnd">
          <transition-group>
            <div class="track-item" v-for="(file, index) in album.tracks" :key="index">
              <label class="item-index">{{ index + 1 }}</label>
              <div class="item-section">
                <div class="item-progress" style="display:none;"></div>
                <!-- <label class="item-name">{{ file.file_name }}</label> -->
                <input type="text" class="item-name" v-model="file.file_name" v-if="file.status != status.success" disabled>
                <!-- <input type="text" class="item-name" v-model="file.new_name" v-if="file.status == status.success" @blur="updateTrack(index)" :placeholder="file.file_name"> -->
                <input type="text" class="item-name" v-model="file.file_name" v-if="file.status == status.success" @blur="updateTrack(index)">
                <!-- <label class="item-progress-value" v-if="file.status == status.uploading">28%</label> -->
                <v-progress-circular indeterminate v-bind:size="20" class="primary--text loading" v-if="file.status == status.uploading"></v-progress-circular>
                <v-icon class="done" v-if="file.status == status.success">done</v-icon>
                <v-icon class="failed" v-if="file.status == status.failed">error_outline</v-icon>
              </div>
              <v-icon class="clear-btn" @click="deleteTrack(index)" v-if="file.status != status.uploading">clear</v-icon>
            </div>
          </transition-group>
        </draggable>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
/* global $:true */

import TrackService from '@/services/track.js'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },

  props: {
    album: {
      type: Object
    },

    accept: {
      type: String,
      default: '*/*'
    },

    autoUpload: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      status: {
        uploading: 1,
        success: 2,
        failed: 3
      },
      currentStatus: null,
      uploadFieldName: 'files'
    }
  },

  computed: {
  },

  created () {
    var files = []
    for (let index in this.album.tracks) {
      const track = this.album.tracks[index]
      var file = {
        status: this.status.success,
        file_name: track.name,
        track: track
      }
      files.push(file)
    }
    this.album.tracks = files
  },

  methods: {
    saveTrack (file) {
      TrackService.uploadTrack(file.formData).then(response => {
        // JSON responses are automatically parsed.
        file.status = this.status.success
        file.track = response.body
      })
      .catch(e => {
        file.status = this.status.failed
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    },

    deleteTrack (index) {
      const track = this.album.tracks[index].track
      this.album.tracks.splice(index, 1)
      if (track) {
        TrackService.deleteTrack(track.id)
      }
    },

    filesChange (fileList) {
      // console.log('uploader filesChange', fileList)
      const vm = this
      // handle file changes
      if (!fileList.length) return
      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          const filesize = fileList[x].size / 1024 / 1024
          if (filesize <= 15) {
            const formData = new FormData()
            formData.append('track[name]', fileList[x].name)
            formData.append('track[description]', fileList[x].name)
            formData.append('track[audio]', fileList[x])
            var filename = fileList[x].name
            filename = filename.replace('.mp3', '')
            filename = filename.replace('.wav', '')
            filename = filename.replace('.wma', '')
            filename = filename.replace('.ogg', '')
            var file = {
              status: vm.status.uploading,
              file_name: filename,
              new_name: '',
              formData: formData
            }
            vm.album.tracks.push(file)
            if (vm.autoUpload) {
              vm.saveTrack(file)
              setTimeout(function () {
                $('html, body').animate({
                  scrollTop: $('#track_list').offset().top - 37.5
                }, 700)
              }, 100)
            }
          } else {
            this.$store.dispatch('error/showErrorToast', [fileList[x].name + ' size is over the limit.'])
          }
        })
    },

    onEnd () {
    },

    updateTrack (index) {
      const file = this.album.tracks[index]
      const params = new FormData()
      params.append('track[name]', file.file_name)
      TrackService.patchTrack(file.track.id, params).then(response => {
        // JSON responses are automatically parsed.
        this.album.tracks[index].track = response.body
        // file.file_name = ''
      })
      .catch(e => {
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    }
  },

  mounted () {
    const vm = this
    const uploaderBox = $('.uploaderBox')
    uploaderBox.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
      e.preventDefault()
      e.stopPropagation()
    })
    .on('dragover dragenter', function () {
      uploaderBox.addClass('is-dragover')
    })
    .on('dragleave dragend drop', function () {
      uploaderBox.removeClass('is-dragover')
    })
    .on('drop', function (e) {
      let droppedFiles = e.originalEvent.dataTransfer.files
      vm.filesChange(droppedFiles)
    })
  }
}
</script>

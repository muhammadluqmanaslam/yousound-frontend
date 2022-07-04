<template>
  <div v-if="category">
    <topbarNotification :content="topBarContent" ctaTitle="Connect" :cta="{ name: 'ManageIndex', params: { tab: 'payment'}}" />
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li
            v-if="category == 'audio'"
            class="active"
          >
            <span class="dflex align-center">
              <img src="/static/images/up_music.svg" width="18" class="mr-2">
              <span>Upload Album</span>
            </span>
          </li>
          <li
            v-else-if="category == 'video'"
            class="active"
          >
            Upload Video
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="uploaderBox" id="uploaderBox">
      <div class="uploaderBox__input">
        <input
          type="file"
          id="file"
          class="uploaderBox__file"
          :name="uploadFieldName"
          :accept="accept"
          @change="filesChange($event.target.files)"
          multiple
        />
        <label for="file">
          <!-- <img v-if="category == 'audio'" src="/static/images/drop_box.png" class="uploaderBox_image" /> -->
          <!-- <img v-if="category == 'video'" src="/static/images/drop_video.png" class="uploaderBox_image" /> -->
        </label>
        <div class="uploaderBox__desc">
            <div v-if="category == 'audio'">
                <b class="uploaderBox__dragndrop">
                  Drag and drop audio files
                </b>
                <span class="uploaderBox__filetype"> MP3 files only</span>
            </div>
            <div v-if="category == 'video'">
                <b v-if="category == 'video'" class="uploaderBox__dragndrop">
                  Drag and drop video files
                </b>
                <!-- <span class="uploaderBox__filetype">All popular video formats</span> -->
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $:true */

import _ from 'lodash'
import draggable from 'vuedraggable'
import contentTopHeader from '@/components/contentTopHeader'
import topbarNotification from '@/components/topbarNotification'

export default {
  components: {
    draggable,
    contentTopHeader,
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

    category: {
      type: String,
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
    }
  },

  computed: {
    // dragDisabled() {
    //   const hasEditing = _.find(this.album.tracks, (file) => (file.editing)) == null
    //   // console.log('dragDisabled', !hasEditing)
    //   return !hasEditing
    // }
  },

  created() {},

  methods: {
    fileIsPicked(status, fileList) {
      if (status) this.$emit('filePicked', fileList)
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
      let file_list = []
      for (let i = 0; i < fileList.length; i++) {
        let f = fileList[i]
        // Min. 160k
        if ((f.size / 1000) < 160) {
          this.$store.dispatch('error/showErrorToast', [
            'File size too small, must be at least 160k',
          ])
        } else {
          file_list.push(f)
        }
      }
      if (file_list.length) this.fileIsPicked(true, file_list)
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
    deleteAttachedVideo() {
      document.querySelector('#file').value = ''
    },
  },

  mounted() {
    const vm = this
    const uploaderBox = $('.uploaderBox')
    uploaderBox
      .on(
        'drag dragstart dragend dragover dragenter dragleave drop',
        function (e) {
          e.preventDefault()
          e.stopPropagation()
        }
      )
      .on('dragover dragenter', function () {
        uploaderBox.addClass('is-dragover')
      })
      .on('dragleave dragend drop', function () {
        uploaderBox.removeClass('is-dragover')
      })
      .on('drop', function (e) {
        let droppedFiles = e.originalEvent.dataTransfer.files

        // Register files on dom input after dropping
        document.querySelector('#file').files = droppedFiles
        vm.filesChange(droppedFiles)
      })
  },
}
</script>

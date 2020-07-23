<template>
  <div class="uploaderBox">
    <div class="uploaderBox__input">
      <input
        type="file"
        id="file_uploader"
        class="uploaderBox__file"
        :accept="accept"
        @change="filesChange($event.target.files)"
      />
      <label class="btn theme--dark blue" for="file_uploader">Upload</label>
    </div>
    <div class="uploaderBox__desc">
      <input type="text" v-model="fileName" readonly />
      <v-icon class="clear-btn" @click="deleteFile()">clear</v-icon>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  components: {},

  props: {
    digitalContent: {
      type: Object,
    },

    accept: {
      type: String,
      default: '.zip',
    },

    autoUpload: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {}
  },

  computed: {
    fileName() {
      return _.get(this.digitalContent, 'file.name', '')
    },
  },

  created() {},

  methods: {
    deleteFile() {
      this.digitalContent.file = null
    },

    filesChange(fileList) {
      // console.log('digital_uploader filesChange', fileList)
      const vm = this
      // handle file changes
      if (!fileList.length) return

      Array.from(Array(fileList.length).keys()).map((x) => {
        const filesize = fileList[x].size / 1024 / 1024
        if (filesize <= 2048) {
          vm.digitalContent.file = fileList[x]
          // console.log(vm.file)
        } else {
          this.$store.dispatch('error/showErrorToast', [
            fileList[x].name + ' size is over 2GB.',
          ])
        }
      })
    },
  },

  mounted() {},
}
</script>

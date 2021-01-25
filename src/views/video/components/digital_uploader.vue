<template>
  <div class="uploader">
    <input
      type="file"
      id="file_uploader"
      class="uploader__file"
      :accept="accept"
      @change="filesChange($event.target.files)"
    />
    <div v-show="fileName" class="uploader__filename">
      {{ fileName }}
    </div>
    <div>
      <label for="file_uploader" class="uploader__add">Add</label>
      <label v-show="fileName" class="uploader__remove" @click="deleteFile()"
        >remove</label
      >
    </div>
    <div class="uploader__desc">.Zip file only, 25MB max</div>
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
        if (filesize <= 25) {
          vm.digitalContent.file = fileList[x]
          // console.log(vm.file)
        } else {
          this.$store.dispatch('error/showErrorToast', [
            fileList[x].name + ' size is over 25MB.',
          ])
        }
      })
    },
  },

  mounted() {},
}
</script>

<style lang="scss" scoped>
.uploader {
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;

  &__file {
    display: none;
  }

  &__filename {
    width: 100%;
    height: 30px;
  }

  &__add {
    color: #1976d2;
    cursor: pointer;
  }

  &__remove {
    margin-left: 10px;
    color: #e53935;
    cursor: pointer;
  }

  &__desc {
    margin-top: 5px;
    font-size: 12px;
  }
}
</style>

<template>
  <div class="attach">
    <div v-if="!dataOnlyMode" class="attach__content">
      <template v-if="stream_assoc.value">
        <attach-card
          v-if="stream_assoc.type == 'Album'"
          :image="_.get(stream_assoc.value, 'cover.thumb.url', '')"
          :title="stream_assoc.value.name"
          :subtitle="`${stream_assoc.value.tracks.length} tracks`"
        />

        <attach-card
          v-if="stream_assoc.type == 'ShopProduct'"
          :image="_.get(stream_assoc.value, 'covers[0].cover.thumb.url', '')"
          :title="stream_assoc.value.name"
          :subtitle="`$${$options.filters.formatNumber(
            stream_assoc.value.price
          )}`"
        />

        <attach-card
          v-if="stream_assoc.type == 'User'"
          :image="_.get(stream_assoc.value, 'avatar.thumb.url', '')"
          :title="stream_assoc.value.username"
          :subtitle="`${stream_assoc.value.followers} followers`"
        />
      </template>
      <template v-else>
        <div class="attach__image"></div>
      </template>
    </div>

    <div v-if="!hideMetaActions" class="attach__footer">
      <template v-if="stream_assoc.value">
        <span class="attach__cta" @click="openAttachPicker()">Change</span>
        <span v-if="!dataOnlyMode" class="attach__cta danger" @click="removeAttach()">Remove</span>
      </template>
      <template v-else>
        <span class="attach__cta" @click="openAttachPicker()">{{ ctaTitle }}</span>
      </template>
    </div>

    <attach-picker
      v-if="show_attach_picker"
      @getSelected="getSelected"
      :dismiss="closeAttachPicker"
      :title="attachPickerTitle"
      :customAlbums="customAlbums"
      :customProducts="customProducts"
    />
  </div>
</template>

<script>
import AttachCard from "./attach_card";
import AttachPicker from "./attach_picker";

export default {
  components: {
    AttachCard,
    AttachPicker,
  },

  props: {
    customAlbums: {
      type: Array
    },
    customProducts: {
      type: Array
    },
    attachPickerTitle: String,
    hideMetaActions: Boolean,
    value: Object,
    dataOnlyMode: Boolean,
    ctaTitle: {
      type: String,
      default: 'Add',
    },
  },

  data() {
    return {
      stream_assoc: {
        type: "Album",
        value: null,
      },
      show_attach_picker: false,
    };
  },

  watch: {
    stream_assoc(newVal) {
      // console.log('from <attach>', newVal)
    },
    value(newVal) {
      // console.log('value changed', newVal)
      // this.stream_assoc = newVal;
    },
  },

  methods: {
    getSelected(data) {
      this.stream_assoc = data
      this.$emit("getAssoc", data);
    },
    openAttachPicker() {
      console.log('openAttach ran');
      this.show_attach_picker = true;
    },

    closeAttachPicker() {
      console.log('closeAttach ran');
      this.show_attach_picker = false;
    },

    removeAttach() {
      console.log('removeAttach ran');
      this.stream_assoc = {
        type: "Album",
        value: null,
      };
    },
  },

  created() {
    // this.stream_assoc = {
    //   type: this._props.value.type,
    //   value: this._props.value.value,
    // };
  },
};
</script>

<style lang="scss" scoped>
.attach {
  &__content {
    // margin-top: 4px;
  }

  &__footer {
    margin-top: 3px;
  }

  &__image {
    display: inline-block;
    width: 64px;
    height: 64px;
    border-radius: 3.75px;
    background-color: #d2d2d2;
    background-size: cover;
    vertical-align: middle;
  }

  &__cta {
    // margin-left: 20px;
    color: #1976d2;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }

    &.danger {
      margin-left: 10px;
      color: #f44336;
    }
  }
}
</style>

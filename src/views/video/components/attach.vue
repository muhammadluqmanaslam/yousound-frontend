<template>
  <div class="attach">
    <div class="attach__content">
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

    <div class="attach__footer">
      <template v-if="stream_assoc.value">
        <span class="attach__cta" @click="openAttachPicker()">Change</span>
        <span class="attach__cta danger" @click="removeAttach()">Remove</span>
      </template>
      <template v-else>
        <span class="attach__cta" @click="openAttachPicker()">Add</span>
      </template>
    </div>

    <attach-picker
      v-if="show_attach_picker"
      v-model="stream_assoc"
      :dismiss="closeAttachPicker"
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
    value: Object,
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
    value(newVal) {
      // console.log('attach value', newVal)
      this.stream_assoc = newVal;
    },
  },

  methods: {
    openAttachPicker() {
      this.show_attach_picker = true;
    },

    closeAttachPicker() {
      this.show_attach_picker = false;
      this.$emit("input", this.stream_assoc);
    },

    removeAttach() {
      this.stream_assoc = {
        type: "Album",
        value: null,
      };
      this.$emit("input", this.stream_assoc);
    },
  },

  created() {
    this.stream_assoc = {
      type: this._props.value.type,
      value: this._props.value.value,
    };
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

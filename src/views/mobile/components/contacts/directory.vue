<template>
  <transition name="slide-up">
    <div class="directory">
      <div class="_top">
        <div class="_title">
          <div>SMS contact list</div>
          <div class="_len">{{ directoryLen }} people</div>
        </div>
        <v-icon @click="closeDirectory" class="close-icon">
          keyboard_arrow_down
        </v-icon>
      </div>
      <div class="_listing">
        <div v-for="(contact, i) in directoryLen" :key="i" class="each-contact">
          <trackcardsimple
            :item="{}"
            :cover="''"
            :title="`Name ${i + 1}`"
            :subtitle="'Artist'"
            width="40"
            height="40"
            round
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import trackcardsimple from "@/components/trackcardsimple";

export default {
  components: { trackcardsimple },
  data() {
    return {
      directory: [],
    };
  },
  methods: {
    closeDirectory() {
      this.$emit("closeDirectory");
    },
  },
  computed: {
    directoryLen() {
      return 200;
    },
  },
};
</script>

<style lang="scss" scoped>
.directory {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  z-index: 99;
  padding: 20px;
  width: 100%;
  height: 100%;

  ._top {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    ._len {
      font-size: 15px;
    }

    ._title {
      flex: 1;
      text-align: center;
      font-size: 1.3rem;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 1;
    }
    .close-icon {
      color: #00000099;
      font-size: 40px;
    }
  }

  ._listing {
    overflow-y: auto;
    height: 88vh;

    .each-contact {
      margin-bottom: 2px;

      /deep/ .track-card-simple {
        .cover {
          background-color: #d8d8d8;
        }

        .details {
          ._subtitle {
            font-size: 12px;
            color: #00000080;
          }
        }
      }
    }
  }
}
</style>

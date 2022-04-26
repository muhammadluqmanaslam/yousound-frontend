<template>
  <div class="items">
    <div v-if="!onMobile">
      <template v-for="item in items">
        <div class="item" :key="item.id">
          <div class="item__header">
            <router-link :to="`/${item.user.slug}`">
              <div
                class="item__image"
                :style="`background-image: url(${item.user.avatar.url})`"
              ></div>
            </router-link>
          </div>
          <div class="item__content">
            <div class="item__title">
              <router-link :to="`/${item.user.slug}`">
                {{ item.user.username | capitalize }}
              </router-link>
              <span v-if="!hideDatedString">{{ toLocalTimeString(item.created_at) }}</span>
            </div>
            <div class="item__description" v-html="item.body"></div>
          </div>

          <div v-if="showShortAge" class="item__age">{{ item.created_at | formatDateFromNowShort }}</div>
        </div>
      </template>
    </div>
    <div v-else>
      <template v-for="item in items">
        <item-swipe :key="item.id">
            <template slot="leftComponent">
              <div class="item" :key="item.id">
                <div class="item__header">
                  <user-tag :user="item.user" width="42" height="42" hideName hideTick showAvatar />
                </div>
                <div class="item__content">
                  <div class="item__title">
                    <div class="created_by">
                      {{ item.user.username | capitalize }}
                    </div>
                    <span class="created_at" v-if="!hideDatedString">{{ toLocalTimeString(item.created_at) }}</span>
                  </div>
                  <div class="item__description" v-html="item.body"></div>
                </div>

                <div v-if="showShortAge" class="item__age">{{ item.created_at | formatDateFromNowShort }}</div>
              </div>
            </template>

            <template slot="rightComponent">
              <v-btn
                depressed style="background: #FF6565;"
                @click="deleteComment()"
              >
                <v-icon color="white">delete</v-icon>
              </v-btn>
            </template>   
        </item-swipe>
      </template>
    </div>
  </div>  
</template>

<script>
import { Utils } from "@/helper";
import CommentService from '@/services/comment'
import ItemSwipe from '@/components/ItemSwipe'
import UserTag from '@/components/user_tag';

export default {
  props: {
    items: Array,
    hideDatedString: Boolean,
    showShortAge: Boolean,
  },
  components: {
    ItemSwipe,
    UserTag,
  },
  data() {
    return {
      toLocalTimeString: Utils.toLocalTimeString,
    };
  },
  methods: {
    deleteComment(comment = this.coment.id) {
      CommentService.deleteComment(comment.id)
        .then((response) => {
          this.$store.dispatch("error/showSuccessToast", [
            "Comment Deleted",
          ]);
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  }
};
</script>

<style lang="scss" scoped>
.items {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.item {
  display: flex;
  min-height: 55px;
  align-items: center;

  &__header {
    width: 55px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  &__title {
    font-weight: 700;
    span {
      font-size: 12px;
      color: #ccc;
    }
  }

  &__age {
    color: #9d9a9a;
    flex-grow: 1;
    text-align: right;
  }
}
</style>

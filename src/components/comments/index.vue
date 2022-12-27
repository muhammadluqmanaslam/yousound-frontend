<template>
  <div class="comments-comp">
    <div class="box">
    <!-- <div class="box__header">
        <div class="box__title">Join the conversation</div>
    </div> -->
    <div class="box__content">
    <div class="box__initComment">
        <div class="ci">
          <div class="ci__header">
              <router-link :to="`/${currentUser.slug}`">
              <div
                class="ci__image"
                :class="{roundAvatar: roundAvatar}"
                :style="`background-image: url(${currentUser.avatar.url}); height: ${aviHeight}px; width: ${aviWidth}px;`"
              ></div>
              </router-link>
          </div>

          <div class="ci__content">
              <input
                v-model.trim="commentText"
                type="text"
                placeholder="Leave a comment..."
                :class={roundInput}
                @keyup.enter="addComment()"
              />
          </div>
        </div>
    </div>

    <div v-if="!hideCommentCount" class="comment__count">{{ comments.length }} {{ "comment" | pluralize(comments.length) }}</div>

    <chat v-if="!hideComments" :items="comments"></chat>
    </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./comments.ctrl.js"></script>

<style lang="scss" scoped>

// comments list
.box {
  position: relative;
  width: 100%;
//   border-top: 1px solid #E4E4E4;
  // height: 100%;

  &__header {
    display: flex;
    align-items: center;
    height: 60px;
  }

  &__initComment {
    display: flex;
    align-items: flex-end;
    height: 55px;
    margin: 0 0 15px 0;
  }

  &__content {
    position: relative;

    .comment__count {
      padding: 20px 0;
      border-top: none;
      font-weight: 600;
      letter-spacing: 0
    }
    
    .items {
      position: relative;
      margin-bottom: 10px;

      /deep/.item__image {
        width: 42px;
        height: 42px;
      }
      /deep/.item__title {
        a {
          color: #222
        }

        span {
          color: #808080;
          font-weight: 300;
        }
      }
    }

    input[type='text'] {
      border-radius: 4px;
      background-color: #fff;
      border: 1px solid #ccc;
    }
    input[type='text']::placeholder {
      color: #000;
      font-size: 14px;
    }
  }

  &__subtitle {
    margin-top: 4px;
  }
  &__title {
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #f3dfdf;
    font-size: 14px;
    font-weight: 700;
    margin-top: 0;
  }
}

// chat input box
.ci {
  display: flex;
  width: 100%;

  &__header {
    width: 55px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 0;
    background-size: contain;
    background-repeat: no-repeat;

    &.roundAvatar {
      border-radius: 100px;
    }
  }

  input {
    width: 100%;
    padding: 5px 10px;

    &.roundInput {
      border-radius: 90px;
    }
  }
}
</style>

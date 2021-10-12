<template>
  <div class="accordion mt-3">
    <div class="tabs">
      <div v-for="(slide, i) in accordions" :key="i" class="tab" :style="i != 0 ? 'margin-top: -1px' : ''">
        <input type="checkbox" :id="`chck${i}`">
        <label class="tab-label" :for="`chck${i}`">{{ slide.title }}</label>
        <div class="tab-content">
          {{ slide.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accordions: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: 'Title',
    },
    icon: {
      type: String,
    },
    content: {
      type: String,
      default: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, reiciendis!',
    },
  },

  data() {
    return {
      name: 'bee',
    }
  },
  mounted() {
    var acc = document.getElementsByClassName('accordion')
    var i

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('active')
        var panel = this.nextElementSibling
        if (panel.style.display === 'block') {
          panel.style.display = 'none'
        } else {
          panel.style.display = 'block'
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.panel {
  padding: 0 18px;
  display: none;
  background-color: white;
  overflow: hidden;
}
input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.accordion {
  display:flex;
  .col {
    flex:1;
    &:last-child {
      margin-left: 1em;
    }
  }
}
/* Accordion styles */
.tabs {
  // border-radius: 8px;
  overflow: hidden;
}
.tab {
  width: 100%;
  color: #000000;
  overflow: hidden;
  &-label {
    display: flex;
    justify-content: space-between;
    padding: 1em;
    font-weight: bold;
    cursor: pointer;
    /* Icon */
    &:hover {
      // background: darkslategrey;
      color: #000000
    }
    &::after {
      content: "\276F";
      width: 1em;
      height: 1em;
      text-align: center;
      transition: all .35s;
    }
  }
  &-content {
    max-height: 0;
    padding: 0 1em;
    color: #000000;
    // background: white;
    transition: all .35s;
  }
  &-close {
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    font-size: 0.75em;
    // background: #000000;
    cursor: pointer;
    &:hover {
      // background: #000000
    }
  }
}

.tab-label {
    border-top: 1px solid #e7e2e2;
    border-bottom: 1px solid #e7e2e2;
}

input:checked {
  + .tab-label {
    background: #000000;
    color: #ffffff;
    &::after {
      transform: rotate(90deg);
    }
  }
  ~ .tab-content {
    max-height: 100vh;
    padding: 1em;
  }
}

</style>

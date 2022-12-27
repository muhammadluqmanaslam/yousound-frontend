<template>
  <div
    style="
      position: relative;
      display: inline-block;
      width: auto;
      margin: 0;
      padding: 0;
    "
  >
    <div class="modal-trigger">
      {{ user.username }}
      <div class="user-modal" :style="'top: ' + y + 'px; left: ' + x + 'px;'">
        ,
        <v-layout row class="text-xs-right"
          >, <img class="pic-big" v-bind:src="user.image" />,
          <div class="user-modal-header">
            ,
            <div class="user-modal-name">{{ user.username }}</div>
            ,
            <div class="user-modal-detail"><b>2.8k</b> Followers</div>
            ,
          </div>
          , </v-layout
        >,
        <v-layout row
          >, <button class="user-modal-btn">Follow</button>,
          <button class="user-modal-btn">Message</button>, </v-layout
        >,
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["user"],
  methods: {},
  data() {
    return {
      x: -85,
      y: 40,
    };
  },
};
</script>

<style scoped>
.modal-trigger {
  font-size: 18px;
  color: #3a92ff;
  letter-spacing: 0;
  width: auto;
  display: inline-block;
}

.user-modal {
  border: 1px solid #cccccc;
  box-shadow: 0px 0px 10px grey;
  border-radius: 2px;
  padding: 10px;
  width: 300px;
  background-color: white;
  position: absolute;
  z-index: 999;
  opacity: 0;
  display: none;
}

.modal-trigger:hover .user-modal {
  display: block;
  opacity: 1;
}

.user-modal-name {
  font-size: 20px;
  color: #000000;
  letter-spacing: 0;
}

.user-modal-detail {
  font-size: 20px;
  color: #000000;
  letter-spacing: 0;
}

.user-modal-btn {
  background: #ffffff;
  border: 2px solid #3a92ff;
  border-radius: 100px;
  font-size: 18px;
  padding: 3px 30px 3px 30px;
  color: #3a92ff;
  letter-spacing: -0.8px;
  margin-right: 10px;
}

.user-modal:after {
  content: "";
  position: absolute;
  left: 50%;
  top: -10px;
  width: 20px;
  height: 20px;
  background: white;
  box-shadow: 3px 3px 10px -4px grey;
  transform: rotate(225deg);
}

.user-modal-header {
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 20px;
}

.pic-big {
  border-radius: 50%;
  width: 75px;
  height: 75px;
  margin: 0;
  background-color: #b1b1b1;
  position: relative;
  left: 25px;
}

.pic {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0;
  background-color: #b1b1b1;
}
</style>

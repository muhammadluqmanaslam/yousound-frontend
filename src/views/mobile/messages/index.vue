<template>
  <div class="messages-page">
    <pane-tabs :paneTabs="tabs" ref="paneTabs" :initSelected="initSelected" @tabClicked="tabClicked" recChip />
    <Conversations v-show="activePane === 'messages'" />

  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../../static/styles/messages.scss" lang="scss" scoped>
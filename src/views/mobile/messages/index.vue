<template>
  <div class="page messages-page">
    <pane-tabs :paneTabs="tabs" ref="paneTabs" :initSelected="initSelected" @tabClicked="tabClicked" recChip />

  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../../static/styles/messages.scss" lang="scss" scoped>

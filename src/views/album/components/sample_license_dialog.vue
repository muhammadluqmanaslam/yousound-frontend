<template>
  <div class="sample-license-dialog px-5 pt-5 pb-3">
    <div class="my-dialog__header">
      <img src="/static/images/nav_logo_primary.png"/>
      <h3 class="ml-3">Sample Clearance License</h3>
    </div>
    <div class="my-dialog__content">
      <div class="my-dialog__content__section border-bottom py-4">
        <p>YouSound Sample Clearance License allows Verified Artists to give other Verified Artists permission to sample or mix music submitted to YouSound by copyright owners for executive broadcast on YouSound.  Any song that is sampled is credited in Album Credits, which gives listeners one click discovery of album collaborator & contributor profiles.
        <br>
        <br> Read the license here</p>
      </div>
      <div class="my-dialog__content__section pt-4">
        <h4 class="mb-3">You can:</h4>
        <h6>Legally sample / mix cleared songs and upload them to YouSound</h6>
        <h6>Promote artists you sample by crediting artists</h6>
      </div>
      <div class="my-dialog__content__section border-bottom py-4">
        <h4 class="mb-3">You cannot:</h4>
        <h6>Sample content from YouSound and distribute sampled content outside of YouSound</h6>
        <h6>Sample content from YouSound and sell physical copies of sampled content</h6>
      </div>
    </div>
    <div class="my-dialog__footer">
      <v-btn color="blue" dark round @click.native="dismiss()">Ok</v-btn>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      dismiss: {
        type: Function,
        required: true
      }
    },

    data () {
      return {}
    }
  }
</script>

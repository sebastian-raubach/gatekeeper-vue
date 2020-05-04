<template>
  <div>
    <div id="banner"></div>
    <b-container fluid class="mt-3">
      <h1>About Gatekeeper</h1>
      <div v-html="$t('pageAboutText', { year: new Date().getFullYear(), forgotPassword: $t('pageLoginForgotPassword') })"></div>
      <b-row class="about-logos d-flex flex-wrap align-items-center">
        <b-col xs=12 md=4>
          <a href="https://ics.hutton.ac.uk/get-germinate/" target="_blank">
            <b-img src="./germinate-square.svg" class="align-middle" />
          </a>
        </b-col>
        <b-col xs=12 md=4>
          <a href="http://www.hutton.ac.uk/" target="_blank">
            <b-img src="./jhi.svg" class="align-middle" />
          </a>
        </b-col>
        <b-col xs=12 md=4>
          <a href="https://ics.hutton.ac.uk/" target="_blank">
            <b-img src="./ics.svg" class="align-middle" />
          </a>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  mounted: function () {
    window.jQuery('#banner').huttonBanner()
  }
}
</script>

<style>
  #banner {
    margin-left: -24px;
    margin-right: -24px;
  }
  .about-logos > div {
    text-align: center;
  }
  .about-logos > div img {
    width: 100%;
    max-height: 150px;
    height: auto;
  }
</style>

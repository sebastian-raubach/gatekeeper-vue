<template>
  <div id="notFound">
    <div class="text-center col-sm-12">
      <h1>You are lost.</h1>
      <h4>This page doesn't exist.</h4>
      <router-link to="/" class="vertical-5p lead">Take me home.</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NotFound'
}
</script>

<style>
#notFound {
  padding: 10em;
  color: white;
  min-height: calc(100vh - 37px);
}
</style>

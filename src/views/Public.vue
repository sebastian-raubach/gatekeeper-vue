<template>
  <div id="app">
    <main role="main" class="container container-fluid ml-sm-auto px-4">
      <router-view :key="$route.path" />
    </main>
  </div>
</template>
<script>
export default {
}
</script>

<style>
</style>

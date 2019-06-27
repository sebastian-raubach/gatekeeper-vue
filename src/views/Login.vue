<template>
  <div>
    <form class="form-signin" @submit.prevent="checkCreds">
      <!-- <img class="mb-4" src="{{ site.baseurl }}/docs/{{ site.docs_version }}/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"> -->
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input id="inputEmail" class="form-control" placeholder="Email address" required autofocus v-model="user.username">
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="user.password">
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    </form>

    <!-- errors -->
    <div v-if=response class="text-red"><p class="vertical-5p lead">{{response}}</p></div>
  </div>
</template>

<script>
export default {
  props: [ 'baseUrl' ],
  data: function () {
    return {
      user: {
        username: null,
        password: null
      },
      error: false,
      section: 'Login',
      response: ''
    }
  },
  methods: {
    checkCreds: function () {
      var vm = this

      this.resetResponse()

      this.apiPostToken(this.user, function (result) {
        vm.error = false
        // If it's successful, finally store them
        vm.$store.dispatch('ON_TOKEN_CHANGED', result)
        vm.$router.push('/settings')
      }, function (xhr) {
        vm.error = true
        if (xhr.status === 403) {
          vm.response = 'Invalid username or password'
        } else {
          vm.response = 'Server appears to be offline'
        }
        // If they're wrong, remove
        vm.$store.dispatch('ON_TOKEN_CHANGED', null)
      })
    },
    resetResponse () {
      this.response = ''
    }
  }
}
</script>

<style>

</style>

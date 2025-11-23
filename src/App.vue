<template>
  <div id="app">
    <NavPath />
    <router-view />
  </div>
</template>

<script>
import NavPath from './components/Navbar.vue'

export default {
  name: 'App',
  components: { NavPath }
}
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #f8f9fa;
}
</style>

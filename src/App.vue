<template>
  <div id="app">
    <NavPath />
    <ToggleSwitch class="switch-global"  />
    <router-view />
  </div>
</template>

<script>
import NavPath from './components/Navbar.vue'
import ToggleSwitch from './components/Light_Dark_Switch.vue'
export default {
  name: 'App',
  components: {ToggleSwitch, NavPath, },
}

</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #f8f9fa;
}
.switch-global {
  
  position: fixed;
  top: 10rem;
  right: 10rem;
  rotate: 90deg;
  z-index: 3; /* nổi trên mọi trang */
}

.notify-card {
  border: 1px solid #ccc;
  padding: 12px;
  margin-bottom: 10px;
}

</style>

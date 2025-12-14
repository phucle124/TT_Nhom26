<template>
  <div id="app">
    <Navbar v-if="showNavbar"/>
    <router-view />
    <ToggleSwitch class="switch-global" />
    
  </div>
  
</template>

<script >
import Navbar from './components/Navbar.vue'
import ToggleSwitch from './components/Light_Dark_Switch.vue'

export default {
  name: 'App',
  components: { Navbar, ToggleSwitch },
  computed: {
    showNavbar() {
      // Danh sách route cần hiển thị Navbar chỉ ở các trang: home, introduce, login
      const allowedRoutes = ['/', '/introduce', '/login']
      return allowedRoutes.includes(this.$route.path)
    }
  }

}
</script>

<style>

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background-color: #f5f5f5;
  
}

.switch-global {
  position: fixed;
  top: 20rem;
  right: 5rem;
  rotate: 90deg;
  z-index: 3; 
}

.notify-card {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fff;
  text-align: left; 
}

.login-background {
  top: 20px;
  height: 100vh;
  background: linear-gradient(to right, #1265ad, #000428);
}
[color-scheme="dark"] .login-background {
  background: linear-gradient(to right, #003454, #000b26);
}

.navbar {
  position: fixed;
  top: 0;              /* dính sát top */
  width: 100%;
  background-color: #b6bbc0 !important;
  border-radius: 30px;
}



</style>

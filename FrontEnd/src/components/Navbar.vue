<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid justify-content-between align-items-center">

      <!-- Logo -->
      <router-link to="/" class="logo-text">EDUPORTAL</router-link>

      

      <!-- MENU -->
      <div class="collapse navbar-collapse justify-content-end" id="mainNavbar">
        <ul class="navbar-nav">
          <li class="nav-item px-3 border-end border-2">
            <router-link class="nav-link" to="/">HOME</router-link>
          </li>
          <li class="nav-item px-3 border-end border-2">
            <router-link class="nav-link" to="/introduce">INTRODUCE</router-link>
          </li>
          <li class="nav-item px-3">
            <router-link class="nav-link" to="/login">SIGN IN</router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- Toggle button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
  </nav>
</template>

<script>
export default {
  name: 'NavigateBar'
};
</script>

<style scoped>

.navbar {
  position: absolute;
  width: 80%;
  margin: 20px auto;
  left: 0;
  right: 0;
  z-index: 3;
}

/* Logo */
.logo-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
  text-decoration: none;
}

.logo-text:hover {
  color: #007bff;
}

.nav-link {
  font-weight: 600;
  color: #333;
}

.nav-link:hover {
  color: #007bff;
}

.router-link-exact-active {
  color: #007bff;
  font-weight: bold;
}

/* Background */
.bg-body-tertiary {
  background-color: #b6bbc0 !important;
  border-radius: 30px;
}

/* Add spacing so menu không dính vào trên */
.container-fluid {
  padding-top: 10px;
  padding-bottom: 10px;
  
  width: 95%;
}
</style>
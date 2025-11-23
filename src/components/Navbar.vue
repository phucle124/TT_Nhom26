<template>
  <div class="container-fluid bg-body-tertiary">
    <div class="row">
      <div class="col-md-12">
        <div class="container">
          <div class="row justify-content-between align-items-center">

            <!-- Logo -->
            <div class="yourlogo col-md-3">
              <router-link to="/" class="logo-text">EDUPORTAL</router-link>
            </div>

            <!-- Navbar -->
            <div class="col-md-7">
              <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">

                  <!-- Toggle button -->
                  <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span class="navbar-toggler-icon"></span>
                  </button>

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
              </nav>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigateBar'
};
</script>

<style scoped>
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

/* Nav items */
.nav-link {
  font-weight: 600;
  color: #333;
}

.nav-link:hover {
  color: #007bff;
}

/* Active menu style */
.router-link-exact-active {
  color: #007bff;
  font-weight: bold;
}

/* Background */
.bg-body-tertiary {
  background-color: #f8f9fa;
}

/* Add spacing so menu không dính vào trên */
.container-fluid {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>

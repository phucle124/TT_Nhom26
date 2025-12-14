<template>
  <div class="switch-wrapper">
    <!-- Text ở trên -->
    <div class="switch-label">TOGGLE</div>

    <!-- Rounded switch -->
    <label class="switch">
      <input type="checkbox" v-model="isDark" @change="toggleDark" />
      <span class="slider round">
        <span class="label-light">Light</span>
        <span class="label-dark">Dark</span>
      </span>
    </label>
  </div>

</template>

<script>
export default {
  name: "LightDarkSwitch",
  data() {
    return { isDark: false }
  },
  methods: {
    toggleDark() {
      
      document.body.setAttribute("color-scheme", this.isDark ? "dark" : "light")
      
    }
  }
}
</script>

<style>
.switch-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center; /* căn giữa chữ và switch */
}

.switch-label {
  margin-bottom: 8px;   /* khoảng cách với switch */
  font-weight: bold;
  font-size: 1rem;
  
}

.switch {
  position: relative;
  display: inline-block;
  width: 7rem;
  height: 3rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #858585;
  transition: .4s;
  border-radius: 34px;
}

/* Chấm tròn */
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

/* Label Light/Dark */
.label-light, .label-dark {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  font-weight: bold;
  transition: opacity 0.5s ease;
}

.label-light {
  left: 40px;
  color: #000;
  opacity: 1;
}

.label-dark {
  right: 40px;
  color: #fff;
  opacity: 0;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  left: calc(100% - 30px);
}

input:checked + .slider .label-light {
  opacity: 0;
}

input:checked + .slider .label-dark {
  opacity: 1;
}


[color-scheme="dark"],
[color-scheme="light"] {
  transition:  all 0.5s ease, color 0.5s ease;
}


/* Dark / Light scheme */
[color-scheme="dark"] {
  background-color: #032032;
  color: #e0e0e0 ;
  min-height: 100vh;
  
  
}

[color-scheme="dark"] .sidebar {
  background: #1e1e1e;
  color: #e0e0e0;
}

[color-scheme="dark"] h1 {
  color: aquamarine !important; /* dùng cờ ưu tiên (specificity) hơn màu chung */
}


[color-scheme="dark"] .bg-body-tertiary {
  background-color: #F5F5F5 !important; /* nền sáng cho navbar */
}

[color-scheme="dark"] .navbar a {
    
  color: #2196F3; /* chữ sáng */
}

[color-scheme="dark"] .navbar a:hover {
  color: #04fcca; /* accent khi hover */
}

[color-scheme="dark"]  p {
  color: #b0e0e6 !important; /* chữ sáng cho đoạn văn */
  
}

[color-scheme="dark"] .btn-login {
  color: #03fff2;
  font-weight: bold;
  border: 4px solid transparent;
  background: linear-gradient(to right, #007084, #3f88c8) border-box;
}

[color-scheme="dark"] .login-page {
    color: aquamarine !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to right, #003454, #000b26);
    /* color: white; */
  }


  [color-scheme="dark"] input {
    /* border:  solid 1px #00cad1; */
    border: solid 2px #00acb2;
    background-color: #000d2f;
    color: rgb(0, 255, 68);
  }

  [color-scheme="dark"] .label-form {
    font-weight: bold;
  }

  

  [color-scheme="dark"] .btnLogin{
    background: #006a98;
    color: #00f9ff;
    font-weight: bold;
  }

  [color-scheme="dark"] .login-page h2 {
    color: aquamarine !important;
  }

[color-scheme="light"] {
  background-color: #f8f9fa; /* nền mặc định cho Home, Introduce */
  color: #000000;
  min-height: 100vh;
}

 
</style>
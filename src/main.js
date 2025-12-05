import Vue from 'vue'
import App from './App.vue'   //Truyen tat ca component vao
import router from './router' //Truyen index.js vao


Vue.config.productionTip = false

new Vue({
  router,          // dùng để điều hướng giữa các trang
  render: h => h(App),
}).$mount('#app')  // mount vào index.html

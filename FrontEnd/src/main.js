import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,          // dùng để điều hướng giữa các trang
  render: h => h(App),
}).$mount('#app')  // mount vào index.html

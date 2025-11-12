import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Introduce from '../views/Introduce.vue'
import LoginPage from '../views/LoginPage.vue'
// import AdminDashboard from '../views/Admin/AdminDashboard.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', name: 'home', component: Home },
        { path: '/introduce', name: 'introduce', component: Introduce },
        { path: '/login', name: 'login', component: LoginPage },

        // Protected route (sau đăng nhập)
        // { path: '/admin', name: 'admin', component: AdminDashboard },

        // Fallback
        { path: '*', name: 'notfound', component: () => import('../views/NotFound.vue') }
    ]
})

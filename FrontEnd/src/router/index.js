// import Vue from 'vue' //Vue 2 (KHÔNG DÙNG)
// import Router from 'vue-router'  //Vue 2 (KHÔNG DÙNG)
import Home from '../views/Home.vue'
import Introduce from '../views/Introduce.vue'
import LoginPage from '../views/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router' 

// Vue.use(Router)  //Vue 2 (KHÔNG DÙNG)


  const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/introduce', name: 'introduce', component: Introduce },
  { path: '/login', name: 'login', component: LoginPage },

  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('@/views/admin/AdminDashboard.vue') },
      { path: 'manage-accounts', component: () => import('@/views/admin/ManageAccounts.vue') },
      { path: 'manage-classes', component: () => import('@/views/admin/ManageClasses.vue') },
      { path: 'manage-subjects', component: () => import('@/views/admin/ManageSubjects.vue') },
      { path: 'manage-scores', component: () => import('@/views/admin/ManageScores.vue') },
      { path: 'manage-schedules', component: () => import('@/views/admin/ManageSchedules.vue') },
      { path: 'manage-notification', component: () => import('@/views/admin/ManageNoti.vue') },
      { path: 'teacher-subjects', component: () => import('@/views/admin/Manage_TeacherSubjects.vue') },

    ]
  },

  {
    path: '/student',
    component: () => import('@/views/student/StudentLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('@/views/student/StudentDashboard.vue') },
      { path: 'schedule', component: () => import('@/views/student/StudentSchedule.vue') },
      { path: 'materials', component: () => import('@/views/student/StudentMaterials.vue') },
      { path: 'notifications', component: () => import('@/views/student/StudentNotifications.vue') },
      { path: 'profile', component: () => import('@/views/student/StudentProfile.vue') },
    ]
  },

  {
    path: '/teacher',
    component: () => import('@/views/teacher/TeacherLayout.vue'),
    children: [
      { path: 'dashboard', name: 'TeacherDashboard', component: () => import('@/views/teacher/TeacherDashboard.vue') },
      { path: 'materials', name: 'TeacherMaterials', component: () => import('@/views/teacher/TeacherMaterials.vue') },
      { path: 'scores', name: 'TeacherScores', component: () => import('@/views/teacher/TeacherScores.vue') },
      { path: 'notifications', name: 'TeacherNotifications', component: () => import('@/views/teacher/TeacherNoti.vue') },
      { path: 'profile', name: 'TeacherProfile', component: () => import('@/views/teacher/TeacherProfile.vue') },
      { path: 'schedule', name: 'TeacherSchedule', component: () => import('@/views/teacher/TeacherSchedule.vue') },
    ]
  },


        // Protected route (sau đăng nhập)
        // { path: '/admin', name: 'admin', component: AdminDashboard },

        // Khi 1 trang nào đó không tải được nội dung sẽ chuyển qua trang NotFound (Vue 3)
        {path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') }
    ]
  

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

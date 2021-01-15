import Vue from 'vue'
import VueRouter from 'vue-router'

import axios from 'axios'

import Logs from '@/views/Logs'
import Login from '@/views/Login'
import Server from '@/views/Server'
import Matches from '@/views/Matches'
import Landing from '@/views/Landing'
import Welcome from '@/views/Welcome'
import Factories from '@/views/Factories'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },

  {
    path: '/server',
    name: 'Server',
    component: Server,

    meta: { server: true }
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,

    meta: { welcome: true }
  },
  {
    path: '/logs',
    name: 'Logs',
    component: Logs,

    meta: { logs: true }
  },
  {
    path: '/factories',
    name: 'Factories',
    component: Factories,

    meta: { factories: true }
  },
  {
    path: '/matches',
    name: 'Matches',
    component: Matches,

    meta: { matches: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,

    meta: { noAuth: true, hideHeader: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.noAuth) {
    const token = localStorage.getItem('auth:token')
    if (token) {
      const data = JSON.parse(atob(token.split('.')[1]))
      // If the token is expired, remove the token and navigate back to login
      if (new Date(data.validUntil) > new Date()){
        axios.defaults.headers['Authorization'] = `Bearer ${token}`
      } else {
        localStorage.removeItem('auth:token')
        next('/login')
      }
    } else {
      next('/login')
      return
    }
  }

  next()
})

export default router

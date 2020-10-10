import Vue from 'vue'
import VueRouter from 'vue-router'

import Logs from '@/views/Logs'
import Server from '@/views/Server'
import Landing from '@/views/Landing'
import Welcome from '@/views/Welcome'
import Factories from '@/views/Factories'
import Matches from '@/views/Matches'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

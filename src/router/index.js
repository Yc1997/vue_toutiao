import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login  = () => import('@/views/login')
const Layout  = () => import('@/views/layout')

const routes = [
  { path: '/login', component: Login},
  { path: '/', component: Layout}
]

const router = new VueRouter({
  routes
})

export default router

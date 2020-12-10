import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login  = () => import('@/views/login')
const Layout  = () => import('@/views/layout')
const Home  = () => import('@/views/layout/children/home')
const Question = () => import('@/views/layout/children/question')
const Video = () => import('@/views/layout/children/video')
const My = () => import('@/views/layout/children/my')

const routes = [
  {path:'',redirect:'/home'}, 
  { path: '/login', component: Login},
  { path: '/', component: Layout,
  children:[
    {path:'home',component:Home},
    {path:'question', component: Question},
    {path: 'video', component: Video},
    {path:'my',component:My},
    ]
  }
]

const router = new VueRouter({ 
  routes
})

export default router

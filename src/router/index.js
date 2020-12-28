import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Home = () => import('@/views/layout/children/home')
const Question = () => import('@/views/layout/children/question')
const Video = () => import('@/views/layout/children/video')
const My = () => import('@/views/layout/children/my')
const Search = () => import('@/views/search')
const ArticleDetails = () => import('@/views/article')
const UserDetails = () => import('@/views/layout/children/my/components/user-details')

const routes = [
  { path: '/', redirect: '/layout/home' },
  { path: '/login', component: Login },
  {
    path: '/layout', component: Layout, name: 'Layout',
    children: [
      { path: 'home', component: Home },
      { path: 'question', component: Question },
      { path: 'video', component: Video },
      { path: 'my', component: My },
    ]
  },
  { path: '/search', component: Search },
  { path: '/article/:articleId', name: 'article', component: ArticleDetails },
  { path: '/user-details', component: UserDetails }
]


const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // const token = window.localStorage.getItem('toutiao-user')
  // if (to.meta.check) {
  //   if (token) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // } else {
  //   next()
  // }


})
export default router

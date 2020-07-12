import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path:'/login',
    component: Login,
  },
  {
    path:'/home',
    component: Home,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载全局路由导航守卫
router.beforeEach((to, form, next) => {
  // to 将要访问的路径
  // form 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //  next() 放行， next('/login') 强制跳转
  if(to.path === '/login') return next();
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('./login')
  next()
})

export default router

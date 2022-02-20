import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/home.vue'
import welcome from './components/welcome.vue'
import users from './components/users/users.vue'
Vue.use(Router)


const router = new Router({
  routes: [


    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect:'/welcome',
      children:[{path:'/welcome', component: welcome}, {path:'/users', component: users}]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()



})

export default router
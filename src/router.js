import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from '@/auth'

Vue.use(VueRouter)

// Routes
const routes = [
  {
    path: '/gk',
    component: () => import(/* webpackChunkName: "public" */ './views/Public.vue'),
    props: { baseUrl: null },
    children: [
      {
        path: 'login',
        name: 'Login',
        props: { baseUrl: null },
        component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
      },
      {
        path: 'about',
        name: 'Public About',
        props: { baseUrl: null },
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "main" */ './views/Main.vue'),
    props: { baseUrl: null },
    beforeEnter: requireAuth,
    children: [
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "users" */ './views/Users.vue'),
        name: 'Users',
        beforeEnter: requireAuth,
        props: { baseUrl: null }
      },
      {
        path: 'about',
        name: 'About',
        props: { baseUrl: null },
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
      },
      {
        path: '',
        component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue'),
        name: 'Settings',
        beforeEnter: requireAuth,
        props: { baseUrl: null }
      },
      {
        path: 'databases',
        component: () => import(/* webpackChunkName: "databases" */ './views/Databases.vue'),
        name: 'Databases',
        beforeEnter: requireAuth,
        props: { baseUrl: null }
      },
      {
        path: 'requests',
        component: () => import(/* webpackChunkName: "requests" */ './views/Requests.vue'),
        name: 'Requests',
        beforeEnter: requireAuth,
        props: { baseUrl: null }
      }
    ]
  },
  {
    // not found handler
    path: '*',
    component: () => import(/* webpackChunkName: "notfound" */ './views/404.vue')
  }
]

function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/gk/login'
    })
  } else {
    next()
  }
}

function hasQueryParams (route) {
  return !!Object.keys(route.query).length
}

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

// Make sure the URL parameters stay between page navigations
router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({ name: to.name, query: from.query })
  } else {
    next()
  }
})

export default router

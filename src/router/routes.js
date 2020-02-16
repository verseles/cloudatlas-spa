const routes = [
  {
    path: '/login',
    component: () => import('layouts/login-layout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/login/login.vue'),
        meta: {
          unguarded: true
        }
      }
    ]
  },
  {
    path: '/logout',
    component: () => import('components/login/logout.vue')
  },
  {
    path: '/',
    component: () => import('layouts/main-layout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard', component: () => import('pages/index.vue'),
        meta: {
          title: 'Dashboard',
          // icon: "mdi-tune"
        }
      },
      {
        path: 'prefs/:tab?',
        component: () => import('pages/prefs/prefs.vue'),
        meta: {
          title: 'Preferences',
          icon: 'mdi-tune'
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/error404.vue')
  })
}

export default routes

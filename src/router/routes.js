const routes = [
  {
    path:      '/login',
    component: () => import('layouts/login-layout.vue'),
    children:  [
      {
        path:      '',
        component: () => import('pages/login/login.vue'),
        meta:      {
          unguarded: true,
        },
      },
    ],
  },
  {
    path:      '/',
    component: () => import('layouts/legal-layout.vue'),
    children:  [
      {
        path:      'about',
        component: () => import('pages/others/about.vue'),
        meta:      {
          unguarded: true,
          title: 'About CloudAtlas',
        },
      },      {
        path:      'privacy',
        component: () => import('pages/others/privacy.vue'),
        meta:      {
          unguarded: true,
          title: 'Privacy Policy',
        },
      },      {
        path:      'terms',
        component: () => import('pages/others/terms.vue'),
        meta:      {
          unguarded: true,
          title: 'Terms and Conditions',
        },
      },
    ],
  },
  {
    path:      '/logout',
    component: () => import('components/login/logout.vue'),
  },
  {
    path:      '/',
    component: () => import('layouts/main-layout.vue'),
    children:  [
      {path: '', redirect: '/dashboard'},
      {
        path: 'dashboard', component: () => import('pages/index.vue'),
        meta: {
          title: 'Dashboard',
          // icon: "mdi-tune"
        },
      },
      {
        path:      'fm',
        component: () => import('pages/storage/list-storages'),
        meta:      {
          title: 'Storage accounts',
          icon:  'mdi-server',
        },
      },
      {
        path:      'fm/:storage_id/:path(.*)?',
        name:      'fm-list-files',
        component: () => import('pages/storage/file-manager'),
        meta:      {
          title: 'File Manager',
          // subtitle: 'You can edit your code, delete, rename and move files between different clouds',
          icon:  'mdi-server',
        },
      },
      {
        path:      'deploy',
        component: () => import('pages/deploy/list-deploys'),
        meta:      {
          title: 'Deploys',
          icon:  'mdi-webhook',
        },
      },
      {
        path:      'deploy/add',
        component: () => import('pages/deploy/add-deploy'),
        meta:      {
          title: 'Add task',
          icon:  'mdi-webhook',
        },
      },
      {
        path:      'deploy/edit/:id/:tab?',
        name:      'edit-deploy',
        component: () => import('pages/deploy/add-deploy'),
        meta:      {
          title: 'Edit task',
          icon:  'mdi-webhook',
        },
      },
      {
        path:      'deploy/calls/:id',
        component: () => import('pages/deploy/calls-deploy'),
        meta:      {
          title: 'Task calls history',
          icon:  'mdi-timetable',
        },
      },
      {
        path:      'prefs/:tab?',
        component: () => import('pages/prefs/prefs.vue'),
        meta:      {
          title: 'Preferences',
          icon:  'mdi-tune',
        },
      },
    ],
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
                path:      '*',
                component: () => import('pages/error404.vue'),
              })
}

export default routes

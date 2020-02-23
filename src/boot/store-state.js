import VueGlobalVar from 'vue-global-var'

const $store = {
  title:      '',
  subtitle:   '',
  icon:       '',
  errors:     {name: '', email: '', password: '', password_confirmation: ''},
  body:       {},
  token:      null,
  tawk_hash:  null,
  afterLogin: '/fm',
  user:       {},
  connection: {
    connections:  [],
    deletingConn: [],
  },
  fm:         {
    manager:         {
      storage:   {},
      table:     [],
      path:      '',
      loading:   false,
      clipboard: {},
    },
    storages:        [],
    addStorageReset: {
      name:     '',
      type:     'ftp',
      host:     '',
      username: '',
      password: '',
      pkey:     '',
      port:     21,
      root:     '/',
      passive:  true,
      ssl:      false,
    },
    addStorage:      {},
    savingStorage:   false,
    editingStorage:  '', // ID
    deletingStorage: [],
    uploads:         {
      lastUid:       null,
      groups:        [],
      files:         [],
      someSuccess:   false,
      someFail:      false,
      totalFiles:    0,
      totalSuccess:  0,
      totalFail:     0,
      totalFinished: 0,
      status:        0,
      active:        false,
      progress:      0,
    },
  },
  globalRefs: {
    modals:   {
      fmAddStorage:    false,
      fileUploadModal: false,
    },
    tooltips: {
      fmAddStorage: {},
    },
    steppers: {
      editDeploy: {},
    },
    loaders:  {
      editDeploy: false,
      prefs:      false,
    },
    timers:   {
      tawk_chatting: 0,
    },
  },
  deploy:     {
    deploys:          [],
    actions:          [],
    notifications:    [],
    deletingTask:     [],
    togglingTask:     [],
    triggeringTask:   [],
    editingTaskReset: {
      id:             '',
      secret:         '',
      title:          '',
      git_is_enabled: '',
      repo:           '',
      branch:         'master',
      conn_id:        '',
    },
    editingTask:      {},
  },
}

export default ({Vue, app}) => {
  app.$store = $store

  Vue.use(VueGlobalVar, {
    globals: {
      $store,
    },
  })
};

const mixinFM = {
  computed: {
    goUp () {
      if (!this.$route.params.path) {
        return ''
      }
      let old_path = this.$route.params.path.split('/')
      old_path.pop()

      const path = old_path.join('/')
      return `/fm/${this.$route.params.storage_id}/${path}`
    },
    icons_table () {
      let icons_table = {}
      const icons_by_ext = [
        [
          'mdi-file-code',
          'ahk,applescript,as,au3,bat,bas,cljs,cmd,coffee,duino,egg,egt,erb,hta,ibi,ici,ijs,ipynb,itcl,js,jsfl,lua,m,mrc,ncf,nuc,nud,nut,php,php3,pl,pm,ps1,ps1xml,psc1,psd1,psm1,py,pyc,pyo,r,rb,rdp,scpt,scptd,sdl,sh,syjs,sypy,tcl,vbs,xpl,ebuild'
        ],
        [
          'mdi-file-word',
          '0,1st,600,602,abw,acl,afp,ami,ans,asc,aww,ccf,csv,cwk,dbk,dita,docm,docx,dot,dotx,egt,epub,ezw,fdx,ftm,ftx,gdoc,hwp,hwpml,log,lwp,mbp,md,me,mcw,mobi,nb,nbp,neis,odm,odt,ott,omm,pages,pap,pdax,pdf,quox,rpt,sdw,se,stw,sxw,info,uof,uoml,via,wpd,wps,wpt,wrd,wrf,wri'
        ],
        [
          'mdi-file-excel',
          '123,ab2,ab3,aws,bcsv,clf,cell,csv,gsheet,numbers,gnumeric,ods,ots,qpw,sdc,slk,stc,sxc,tab,txt,vc,wk1,wk3,wk4,wks,wks,wq1,xlk,xls,xlsb,xlsm,xlsx,xlr,xlt,xltm,xlw'
        ],
        [
          'mdi-file-powerpoint',
          'gslides,key,nb,nbp,odp,otp,pez,pot,pps,ppt,pptx,prz,sdd,shf,show,shw,slp,sspss,sti,sxi,thmx,watch'
        ],
        [
          'mdi-zip-box',
          'bz2,7z,ace,apk,android,arc,halo,ba,big,bld,cab,daa,windows,deb,dmg,promethean,jar,java,lbr,lbr,lqr,lha,pak,zip,rar,sen,sit,tar,tib,uha,zoo,zip,iso,umd,nrg,nero,sdi,mds,mdx,dmg,cdi,cue,cif,c2d,daa,b6t'
        ],
        [
          'mdi-file-music',
          'ogg,3gp,aa,aac,aax,act,aiff,amr,ape,au,awb,dct,dss,flac,gsm,m4a,m4b,m4p,mp3,mpc,opus,raw,sln,tta,vox,wav,wma,wv,webm,8svx'
        ],
        [
          'mdi-file-video',
          'webm,mkv,flv,flv,vob,ogv,drc,gif,gifv,mng,avi,mov,wmv,yuv,rm,rmvb,asf,amv,mp4,mpg,mpg,m4v,svi,3gp,3g2,mxf,roq,nsv'
        ],
        [
          'mdi-file-image',
          'svg,svgz,ase,art,blp,bmp,bti,cd5,cit,cpt,cr2,csp,cut,dds,dib,djvu,egt,exif,gpl,grf,icns,ico,iff,jpg,jpeg,jfif,jp2,jps,lbm,max,miff,mng,msp,nitf,otb,pbm,pc1,pc2,pc3,pcf,pcx,pgm,pi1,pi2,pi3,pct,png,pnm,pns,ppm,psb,psd,psp,px,pxm,pxr,qfx,raw,rle,sct,sgi,tga,tiff,tif,tiff,vtf,xbm,xcf,xpm,zif'
        ],
        ['mdi-file-pdf', 'pdf'],
        ['mdi-animation', 'gif'],
        ['mdi-file-document', 'txt,srt'],
        ['mdi-file-code', 'php,html,htm,js,vue,env,rst,md,ts'],
        ['mdi-tune', 'conf,cfg,ini']
      ]
      icons_by_ext.map(item => {
        let name = item[0]
        let exts = item[1].split(',')

        exts.map(ext => (icons_table[ext] = name))
      })

      return icons_table
    }
  },
  methods: {
    successListing (r, path = null) {
      this.$store.fm.manager.loading = false

      let d = r.data
      if (d.ok === false) {
        this.$q.notify({
          message: d.message.body || 'Operation unsuccessful',
          icon: d.message.icon ? d.message.icon : 'mdi-alert-octagon',
          type: d.message.type || 'warning'
        })
      }

      this.$store.fm.manager.path = path || this.$route.params.path || '/'

      this.$store.fm.manager.storage = d.storage || {}
      this.$store.icon = this.typeStorage(d.storage.type).icon
      this.$store.title = d.storage.name
      // this.$store.subtitle = 'File Manager - '

      this.$store.fm.manager.table = d.list || {}
    },
    failListing () {
      this.$store.fm.manager.loading = false
      this.$q.loading.hide()

      this.$q.notify({
        message: 'Operation failed',
        type: 'warning'
      })
    },
    listFiles (id, path = '', done = {}) {
      this.$store.fm.manager.loading = true

      this.$http
        .get(`fm/${id}?path=${path}`)
        .then(r => {
          this.successListing(r, path)
          done()
        })
        .catch(() => this.failListing)
    },
    deleteFiles (id, current_path, paths = {}) {
      this.$store.fm.manager.loading = true

      this.$http
        .post(`fm/delete/${id}`, { path: current_path, paths: paths })
        .then(r => this.successListing(r, current_path))
        .catch(() => this.failListing)
    },
    createDir (id, current_path, name) {
      this.$store.fm.manager.loading = true

      this.$http
        .get('fm/create', {
          params: { id: id, path: current_path, name: name }
        })
        .then(r => this.successListing(r, current_path))
        .catch(() => this.failListing)
    },
    createFile (id, current_path, name) {
      this.$store.fm.manager.loading = true

      this.$http
        .get('fm/create_file/' + id, {
          params: { path: current_path, name: name }
        })
        .then(r => this.successListing(r, current_path))
        .catch(() => this.failListing)
    },
    renameDoc (id, file_item, new_name) {
      this.$store.fm.manager.loading = true

      this.$http
        .get(`fm/${id}/edit`, {
          params: { file_item: file_item, new_name: new_name }
        })
        .then(r => this.successListing(r, this.$route.params.path))
        .catch(() => this.failListing)
    },
    toClipboard (clipboard) {
      if (typeof clipboard == 'object') {
        this.$q.sessionStorage.set('clipboard', clipboard)
        this.$store.fm.manager.clipboard = clipboard
      }
    },
    fromClipboard (operation = 'copy', baseId, folder_path) {
      if (this.$q.sessionStorage.has('clipboard')) {
        // try the copy/move
        if (!baseId) {
          baseId = this.$route.params.storage_id
        }
        if (!folder_path) {
          folder_path = this.$route.params.path
        }
        this.$store.fm.manager.loading = true
        this.$http
          .post(`fm/${operation}`, {
            from: this.$q.sessionStorage.getItem('clipboard'),
            to: { id: baseId, folder: folder_path }
          })
          .then(r => this.successListing(r, folder_path))
          .catch(() => this.failListing)

        // Clean clipboard regardless if was copied/moved
        this.$q.sessionStorage.remove('clipboard')
        this.$store.fm.manager.clipboard = {}
      } else {
        // No clipboard
        this.$q.notify({
          message: 'Nothing in clipboard',
          type: 'warning'
        })
      }
    },
    viewFile (id, file, done) {
      this.$q.loading.show()

      this.$http
        .post(`fm/read/${id}`, { file: file })
        .then(r => {
          this.$q.loading.hide()
          console.info(r.data)
          done(r.data)
        })
        .catch(() => {
          this.$q.loading.hide()
          this.failListing()
        })
    },
    saveFile (id, path, contents, done = {}) {
      this.editor.saving = true
      this.$http
        .post(`fm/saveFileEdits/${id}`, { path, contents })
        .then(() => {
          this.editor.savedCode = this.editor.code
          this.editor.saving = false
          done()
        })
        .catch(() => {
          this.editor.saving = false
          done()
          this.failListing()
        })
    }
  }
}

export default ({ Vue }) => {
  Vue.mixin(mixinFM)
}

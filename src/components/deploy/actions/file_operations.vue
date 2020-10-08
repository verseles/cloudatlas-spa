<template>
  <q-list>
    <q-item class="non-selectable">
      <q-item-section v-handle avatar class="cursor-row-resize">
        <q-icon name="mdi-file-replace-outline"/>
      </q-item-section>
      <q-item-section v-handle class="cursor-row-resize text-bold">
        File Operation
      </q-item-section>
      <q-item-section side>
        <div>
          <q-btn @click="goToAddStorage"
                 title="Add storage account"
                 icon="mdi-server-plus"
                 color="secondary"
                 class="q-mr-md"
                 flat
          />
          <q-btn @click="deleteme" dense icon="mdi-delete" color="red-4" flat></q-btn>
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <div class="row items-baseline">
          <div class="col-7">
            <q-select v-model="item.details.operation"
                      :options="operationOptions"
                      label="Operation"
                      emit-value
                      map-options
            />
          </div>
          <div class="col-5" v-if="canBeOverwrited">
            <q-checkbox class="q-mt-sm q-ml-sm "
                        v-model="item.details.overwrite"
                        :label="$q.platform.is.mobile ? 'Overwrite' : 'Overwrite if needed'"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 col-sm-12 col-xs-12 col-lg-4 q-px-xs">
            <q-select v-model="item.details.origin_server"
                      :options="serversOptions"
                      label="Origin storage"
                      emit-value
                      map-options
            />
          </div>
          <div class="col-md-12 col-sm-12 col-xs-12 col-lg-8 q-px-xs">
            <q-input :label="'Full path' + (!needsOnlyOneServer ? ' to '+ aboutType() +' in origin':'')"
                     v-model="item.details.origin_path"
            />
          </div>
          <div v-if="!needsOnlyOneServer && item.details.operation != 'rename' "
               class="col-md-12 col-sm-12 col-xs-12 col-lg-4 q-px-xs"
          >
            <q-select v-model="item.details.destiny_server"
                      :options="serversOptions"
                      label="Destiny storage"
                      emit-value
                      map-options
            />
          </div>
          <div v-if="!needsOnlyOneServer || item.details.operation == 'rename'"
               :class="item.details.operation == 'rename' ? 'offset-lg-4' : ''"
               class="col-md-12 col-sm-12 col-xs-12 col-lg-8 q-px-xs"
          >
            <q-input :label="'Full path to ' + aboutType() + ' in destiny'" v-model="item.details.destiny_path"
            />
          </div>
        </div>
        <codemirror v-show="item.details.operation == 'writeFile'"
                    class="q-mt-md"
                    v-model="item.details.contents"
                    ref="deployEditor"
                    :options="cmOptions"
        />
      </q-item-section>
    </q-item>
  </q-list>

</template>

<script>
  import { ElementMixin, HandleDirective } from 'vue-slicksort'
  import { codemirror }                    from 'vue-codemirror'
  // require styles
  import 'codemirror/lib/codemirror.css'

  import 'codemirror/mode/javascript/javascript.js'

  // Add-ons
  import 'codemirror/addon/selection/active-line.js'
  // styleSelectedText
  import 'codemirror/addon/selection/mark-selection.js'
  import 'codemirror/addon/search/searchcursor.js'
  // hint
  import 'codemirror/addon/hint/show-hint.js'
  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/addon/hint/javascript-hint.js'
  import 'codemirror/addon/selection/active-line.js'
  // highlightSelectionMatches
  import 'codemirror/addon/scroll/annotatescrollbar.js'
  import 'codemirror/addon/search/matchesonscrollbar.js'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/match-highlighter.js'
  // keyMap
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/addon/edit/matchbrackets.js'
  import 'codemirror/addon/comment/comment.js'
  import 'codemirror/addon/dialog/dialog.js'
  import 'codemirror/addon/dialog/dialog.css'
  import 'codemirror/addon/search/searchcursor.js'
  import 'codemirror/addon/search/search.js'
  import 'codemirror/keymap/sublime.js'
  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/comment-fold.js'
  import 'codemirror/addon/fold/foldcode.js'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/indent-fold.js'

  export default {
    components: {codemirror},
    mixins:     [ ElementMixin ],
    directives: {handle: HandleDirective},
    computed:   {
      serversAvailable() {
        return this.$global.fm.storages
      },
      needsOnlyOneServer() {
        return [ 'deleteFolder', 'deleteFile', 'writeFile',
                 'newFolder' ].includes(this.item.details.operation)
      },
      aboutFiles() {
        return [ 'copyFile', 'moveFile', 'deleteFile', 'writeFile' ]
      },
      canBeOverwrited() {
        return [ 'copyFile', 'moveFile', 'writeFile', 'copyFolder',
                 'moveFolder' ].includes(this.item.details.operation)
      },
      codemirror() {
        return this.$refs.deployEditor.codemirror
      },
    },
    mounted() {
      this.serversOptions = this.serversAvailable.map(s => ({label: s.name, value: s.id}))

      this.codemirror.display.wrapper.style.fontSize = "1.2rem"
      this.codemirror.display.wrapper.style.width    = "100%"
      this.codemirror.display.wrapper.style.height   = "auto"
      this.codemirror.refresh()
    },
    props:      [ 'item', 'index' ],
    data() {
      return {
        serversOptions:   [],
        operationOptions: [
          {label: 'Copy file', value: 'copyFile'},
          {label: 'Move file', value: 'moveFile'},
          {label: 'Delete file', value: 'deleteFile'},
          {label: 'Write in a file', value: 'writeFile'},
          {label: 'Rename folder or file', value: 'rename'},
          {label: 'Create folder', value: 'newFolder'},
          {label: 'Copy folder', value: 'copyFolder'},
          {label: 'Move folder', value: 'moveFolder'},
          {label: 'Delete folder', value: 'deleteFolder'},
        ],
        cmOptions:        {
          // codemirror options
          lineNumbers:             !this.$q.platform.is.mobile,
          styleActiveLine:         true,
          matchBrackets:           true,
          showCursorWhenSelecting: true,
          line:                    true,
          // viewportMargin: Infinity
        },
      }
    },
    methods:    {
      deleteme() {
        this.$emit('del')
      },
      goToAddStorage() {
        this.dialogAddStorageOpen()
        this.$router.push({path: '/fm/'})
      },
      aboutType() {
        if (this.item.details.operation === 'rename') {
          return 'folder or file'
        }
        else if (this.aboutFiles.includes(this.item.details.operation)) {
          return 'file'
        }
        else {
          return 'folder'
        }
      },
    },
  }
</script>


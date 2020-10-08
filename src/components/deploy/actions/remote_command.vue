<template>
  <q-list>
    <q-item class="non-selectable">
      <q-item-section v-handle avatar class="cursor-row-resize">
        <q-icon name="mdi-console"/>
      </q-item-section>
      <q-item-section v-handle class="cursor-row-resize text-bold">
        Remote command
      </q-item-section>
      <q-item-section side>
        <div>
          <q-btn @click="goToAddSSH" dense title="New SSH Server" icon="mdi-server-plus" color="secondary" flat
          />
          <q-btn @click="deleteme" dense icon="mdi-delete" color="red-4" flat></q-btn>
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select v-model="item.details.servers"
                  :options="serversOptions"
                  label="Run at these SSH servers"
                  multiple
                  toggle
                  filter
                  map-options
                  emit-value
        />
        <br>
        <codemirror v-model="item.details.code" ref="deployCommandEditor" :options="cmOptions"/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  import { ElementMixin, HandleDirective } from 'vue-slicksort'
  import { codemirror }                    from 'vue-codemirror'
  // require styles
  import 'codemirror/lib/codemirror.css'

  import 'codemirror/mode/shell/shell.js'

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
  // theme css
  import 'codemirror/theme/material.css'

  export default {
    components: {codemirror},
    mixins:     [ ElementMixin ],
    directives: {handle: HandleDirective},
    computed:   {
      codemirror() {
        return this.$refs.deployCommandEditor.codemirror
      },
      serversAvailable() {
        return this.$global.fm.storages.filter(s => s.type == 'sftp')
      },
    },
    mounted() {
      this.codemirror.display.wrapper.style.fontSize = "1.2rem"
      this.codemirror.display.wrapper.style.width    = "100%"
      this.codemirror.display.wrapper.style.height   = "auto"
      this.codemirror.refresh()

      this.serversOptions = this.serversAvailable.map(s => ({label: s.name, value: s.id}))
    },
    props:      [ 'item', 'index' ],
    data() {
      return {
        cmOptions:      {
          // codemirror options
          tabSize:                 2,
          mode:                    'text/x-sh',
          theme:                   'material',
          lineNumbers:             !this.$q.platform.is.mobile,
          styleActiveLine:         true,
          matchBrackets:           true,
          showCursorWhenSelecting: true,
          line:                    true,
          // viewportMargin: Infinity
        },
        serversOptions: [],
      }
    },
    methods:    {
      deleteme() {
        this.$emit('del')
      },
      goToAddSSH() {
        this.$global.fm.addStorage.type = 'sftp'
        this.dialogAddStorageOpen()
        this.$router.push({path: '/fm/'})
      },
    },
  }
</script>

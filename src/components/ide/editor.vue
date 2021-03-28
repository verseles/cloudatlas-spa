<template>
  <codemirror ref="myCm" v-model="code" :options="cmOptions" @ready="onCmReady" @focus="onCmFocus" @blur="$emit('blur')"
  ></codemirror>
</template>

<script>
  // require component
  import { codemirror } from 'vue-codemirror'

  // require styles
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/mode/htmlmixed/htmlmixed.js'
  import 'codemirror/mode/php/php.js'
  import 'codemirror/mode/markdown/markdown.js'
  import 'codemirror/mode/rst/rst.js'
  import 'codemirror/mode/shell/shell.js'
  import 'codemirror/mode/sql/sql.js'
  import 'codemirror/mode/yaml/yaml.js'
  import 'codemirror/mode/nginx/nginx.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/vue/vue.js'
  import 'codemirror/mode/stylus/stylus.js'

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
  import 'codemirror/addon/fold/markdown-fold.js'
  import 'codemirror/addon/fold/xml-fold.js'
  // theme css
  import 'codemirror/theme/monokai.css'
  import 'codemirror/theme/elegant.css'
  import 'codemirror/theme/neat.css'
  import 'codemirror/theme/material.css'

  export default {
    components: {
      codemirror,
    },
    props:      {
      value: {
        type: String,
      },
      file:  {
        type:    Object,
        default: () => ({Name: ''}),
      },
      mime:  {
        type:    String,
        default: 'text/plain',
      },
      theme: {
        type:    String,
        default: 'monokai',
      },
    },
    data() {
      return {
        code:      this.value,
        cmOptions: {
          // codemirror options
          tabSize:                 4,
          mode:                    this.mime,
          theme:                   this.theme,
          lineNumbers:             true,
          styleActiveLine:         true,
          matchBrackets:           true,
          showCursorWhenSelecting: true,
          line:                    true,
          // more codemirror options, 更多 codemirror 的高级配置...
        },
      }
    },
    methods:    {
      onCmReady(cm) {
        // console.log('the editor is readied!', cm)
      },
      onCmFocus(cm) {
        // console.log('the editor is focus!', cm)
      },
    },
    computed:   {
      codemirror() {
        return this.$refs.myCm.codemirror
      },
    },
    watch:      {
      theme(n) {
        this.codemirror.setOption('theme', n)
      },
      code(newCode) {
        this.$emit('input', newCode)
      },
    },
    mounted() {
      // console.log('this is current codemirror object', this.codemirror)

      this.codemirror.display.wrapper.style.fontSize = "1.4rem"
      this.codemirror.refresh()
      // you can use this.codemirror to do something...
    },
  }
</script>

<style>
  .CodeMirror {
    height: calc(100vh - 100px);
    width:  100vw
  }
</style>

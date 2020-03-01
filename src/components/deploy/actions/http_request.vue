<template>
  <q-item>
    <q-item-main>
      <q-item v-handle class="cursor-row-resize q-pa-none">
        <q-item-side>
          <q-item-tile>
            <q-item-tile icon="mdi-access-point-network"/>
          </q-item-tile>
        </q-item-side>
        <q-item-main class="cursor-row-resize text-bold">
          HTTP Request
        </q-item-main>
        <q-item-side>
          <q-item-tile>
            <q-btn @click.native="deleteme" icon="mdi-delete" color="red-4" flat></q-btn>
          </q-item-tile>
        </q-item-side>
      </q-item>

      <div class="row">
        <div class="col-md-2 col-xs-3">
          <q-select v-model="item.details.method" :options="methodOptions" stack-label="Method" filter
          />
        </div>
        <div class="col">
          <q-input v-model="item.details.endpoint" stack-label="Endpoint URL" class="eurl"/>
        </div>
      </div>
      <br>
      You can use:
      <q-chip dense square class="cursor-pointer"><code>query</code>
        <q-tooltip>for query string</q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>form_params</code>
        <q-tooltip>For posting data <br>Used to send an <code>application/x-www-form-urlencoded</code> POST request.
        </q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>headers</code>
        <q-tooltip>Add/change headers. Associative array of headers to add to the request.
          <br>Each key is the name of a header, and each value is a string or array of strings representing the header field values.
        </q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>http_errors</code>
        <q-tooltip>Set <code>false</code> to ignore http errors</q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>json</code>
        <q-tooltip>Option is used to easily upload JSON encoded data as the body of a request.
          <br>A Content-Type header of
          <code>application/json</code> will be added if no Content-Type header is already present on the message.
        </q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>multipart</code>
        <q-tooltip>
          <pre>
          Is an array of associative arrays, each containing the following key value pairs:

          name: (string, required) the form field name
          contents: (StreamInterface/resource/string, required) The data to use in the form element.
          headers: (array) Optional associative array of custom headers to use with the form element.
            </pre>
        </q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>verify</code>
        <q-tooltip>Set <code>false</code> to ignore SSL errors</q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>version</code>
        <q-tooltip>Protocol version to use with the request. Default: <code>1.1</code></q-tooltip>
      </q-chip>
      ,
      <q-chip dense square class="cursor-pointer"><code>body</code>
        <q-tooltip>The
          <code>body</code> option is used to control the body of an entity enclosing request (e.g., PUT, POST, PATCH).
        </q-tooltip>
      </q-chip>
      <br>
      <br>
      <codemirror v-model="item.details.data" ref="deployEditor" :options="cmOptions"/>
    </q-item-main>
  </q-item>
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
  // theme css
  import 'codemirror/theme/material.css'

  export default {
    components: {codemirror},
    mixins:     [ ElementMixin ],
    directives: {handle: HandleDirective},
    computed:   {
      codemirror() {
        return this.$refs.deployEditor.codemirror
      },
    },
    mounted() {
      this.codemirror.display.wrapper.style.fontSize = "1.2rem"
      this.codemirror.display.wrapper.style.width    = "100%"
      this.codemirror.display.wrapper.style.height   = "auto"
      this.codemirror.refresh()

    },
    props:      [ 'item', 'index' ],
    data() {
      return {
        cmOptions:     {
          // codemirror options
          tabSize:                 2,
          mode:                    'application/json',
          theme:                   'material',
          lineNumbers:             !this.$q.platform.is.mobile,
          styleActiveLine:         true,
          matchBrackets:           true,
          showCursorWhenSelecting: true,
          line:                    true,
          // viewportMargin: Infinity
        },
        methodOptions: [
          {label: 'GET', value: 'get'},
          {label: 'POST', value: 'post'},
          {label: 'PUT', value: 'put'},
          {label: 'DELETE', value: 'delete'},
          {label: 'PATCH', value: 'patch'},
        ],
      }
    },
    methods:    {
      deleteme() {
        this.$emit('del')
      },
    },
  }
</script>

<style>
  .eurl .q-input-target {
    font-family: monospace;
    font-weight: bold;
  }
</style>

<template>
   <div>
      <q-list>
         <q-item class="bg-white">
            <q-item-section>
               <q-item-label overline class="text-grey vertical-bottom">DRAG ICON TO REORDER</q-item-label>
            </q-item-section>
           <q-item-section>
             <q-dbtn-holder class="q-mr-md" color="primary" icon="mdi-plus-box">
               <q-dbtn @click="addAction('remote_command')"
                       label="Add Remote command"
                       icon="mdi-console"
                       color="secondary"
                       flat
               />
               <q-dbtn @click="addAction('http_request')"
                       label="Add HTTP Request"
                       icon="mdi-access-point-network"
                       color="secondary"
                       flat
               />
               <q-dbtn @click="addAction('file_operations')"
                       label="Add File Operations"
                       icon="mdi-file-replace-outline"
                       color="secondary"
                       flat
               />
             </q-dbtn-holder>
           </q-item-section>

         </q-item>
      </q-list>
      <slot/>
   </div>
</template>

<script>
  import { ContainerMixin, ElementMixin } from 'vue-slicksort'
  import QDbtn       from 'components/q-dbtn'
  import QDbtnHolder from 'components/q-dbtn-holder'

  export default {
    mixins:     [ ContainerMixin ],
    components: {QDbtnHolder, QDbtn},
    methods:    {},
  }
</script>

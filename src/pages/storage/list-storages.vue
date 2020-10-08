<template>
  <div>
    <q-dialog @hide="dialogAddStorageClosed" v-model="$global.globalRefs.modals.fmAddStorage">
      <q-card>
        <add-storage/>
      </q-card>

      <q-page-sticky v-show="$global.fm.addStorage.type" position="bottom-right" :offset="[18, 18]">
        <q-btn v-if="$global.fm.savingStorage" round color="primary" disabled>
          <q-spinner-bars></q-spinner-bars>
        </q-btn>
        <q-btn v-else round color="secondary" @click="addStorage" icon="mdi-content-save"/>
      </q-page-sticky>

    </q-dialog>

    <q-page padding>
      <q-inner-loading v-if="loading" :showing="loading">
        <q-spinner-puff size="10rem" color="primary"></q-spinner-puff>
      </q-inner-loading>
      <div v-else-if="!$global.fm.storages.length"
           class="text-center absolute-center cursor-pointer"
           @click="dialogAddStorageOpen"
      >
        <q-icon size="10em" color="grey-4" name="mdi-plus-network"></q-icon>
        <div class="text-grey-4 text-body1">add new one?</div>
      </div>
      <q-list v-else>
        <q-item clickable v-for="storage in $global.fm.storages" :key="storage.id">
          <q-item-section avatar @click="$router.push(`fm/${storage.id}`)">
            <q-icon :name="typeStorage(storage.type).icon" :color="typeStorage(storage.type).color"/>
          </q-item-section>
          <q-item-section @click="$router.push(`fm/${storage.id}`)">
            <q-item-label>{{ storage.name ? storage.name : storage.host }}</q-item-label>
            <q-item-label caption>
              {{ typeStorage(storage.type).desc }}
            </q-item-label>
          </q-item-section>
          <q-dbtn-holder :loading="$global.fm.deletingStorage.includes(storage.id)" color="primary">
            <q-dbtn :to="`fm/${storage.id}`" label="Browse" icon="mdi-file-tree" flat/>
            <q-dbtn @click="dialogEditStorage(storage.id)" label="Edit" icon="mdi-folder-edit" flat/>
            <q-dbtn @click="deleteStorage(storage.id)"
                    label="Delete"
                    icon="mdi-delete"
                    flat
                    color="negative"
                    :loading="$global.fm.deletingStorage.includes(storage.id)"
            />
          </q-dbtn-holder>
        </q-item>
      </q-list>
      <q-page-sticky v-show="!loading && !$global.globalRefs.modals.fmAddStorage"
                     position="bottom-right"
                     :offset="[18, 18]"
      >
        <q-btn round color="primary" @click="dialogAddStorageOpen" icon="mdi-plus"/>
      </q-page-sticky>
    </q-page>
  </div>


</template>

<script>
  import addStorage from 'src/components/storage/add-storage'

  import QDbtn       from 'components/q-dbtn'
  import QDbtnHolder from 'components/q-dbtn-holder'

  export default {
    components: {addStorage, QDbtnHolder, QDbtn},
    mounted() {
      this.listStorages()
    },
    methods:    {},
    data() {
      return {
        loading: true,
        alert:   false,
      }
    },
  }
</script>

<style></style>

<template>
    <div>
        <div class="row gutter-xs">
            <div class="col q-mb-sm">
                <q-input v-model="$global.fm.addStorage.username" :error="!!$global.errors.username"
                         :label="$global.errors.username ? $global.errors.username[0] : 'Account Name'"/>
            </div>
            <div class="col q-mb-sm">
                <q-input v-model="$global.fm.addStorage.password" label="API Key" type="password"/>
            </div>
        </div>
        <div class="row gutter-xs">
            <div class="col q-mb-sm">
                <q-input v-model="$global.fm.addStorage.bucket" label="Container" type="text"/>
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {}
        }
    }
</script>

<style></style>

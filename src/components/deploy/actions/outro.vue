<template>
    <div>
        hahahahaha
    </div>
</template>

<script>


    export default {
        computed: {},
        mounted() {
        },
        props: {
            value: {
                type: String,
            },
            mime: {
                type: String,
                default: 'text/x-sh'
            },
            theme: {
                type: String,
                default: 'material'
            },
            item: {}
        },
        data() {
            return {
                code: this.value,
            }
        },
    }
</script>
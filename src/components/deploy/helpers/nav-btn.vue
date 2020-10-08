<template>
  <div class="text-right">
    <q-btn v-if="step !== 'source'"
           color="inverted"
           size="small"
           flat
           @click="$global.globalRefs.steppers.editDeploy.previous()"
           icon="mdi-chevron-left"
           round
           title="Back"
    ></q-btn>


    <q-btn :color="btnNextColor"
           :title="btnNextTitle"
           :round="onTop"
           @click="goToNext"
           :size="btnSize"
           :icon="btnNextIcon"
    >
      {{ btnNextText }}
    </q-btn>
  </div>
</template>

<script>
  export default {
    props:    {onTop: Boolean},
    computed: {
      step() {
        return this.$route.params.tab
      },
      stepper() {
        return this.$global.globalRefs.steppers.editDeploy
      },
      btnSize() {
        return this.onTop ? 'sm' : 'md'
      },
      btnNextIcon() {
        return this.step === 'notifications' ? 'mdi-checkbox-marked-circle' : 'mdi-chevron-right'
      },
      btnNextColor() {
        return this.step === 'notifications' ? 'positive' : 'secondary'
      },
      btnNextText() {
        if (this.onTop) {
          return null
        }
        return this.btnNextTitle
      },
      btnNextTitle() {
        return this.step === 'notifications' ? 'Save' : 'Next'
      },
    },
    methods:  {
      goToNext() {
        const data = {
          task:          this.$global.deploy.editingTask,
          actions:       this.$global.deploy.actions,
          notifications: this.$global.deploy.notifications,
        }
        this.saveTask(data, () => this.step == 'notifications' ? this.$router.push('/deploy') : this.$global.globalRefs.steppers.editDeploy.next())

      },
    },
  }
</script>

<style></style>

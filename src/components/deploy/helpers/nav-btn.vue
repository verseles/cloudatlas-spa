<template>
  <div class="text-right">
    <q-btn v-if="step !== 'source'"
           color="inverted"
           size="small"
           flat
           @click="$store.globalRefs.steppers.editDeploy.previous()"
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
        return this.$store.globalRefs.steppers.editDeploy
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
          task:          this.$store.deploy.editingTask,
          actions:       this.$store.deploy.actions,
          notifications: this.$store.deploy.notifications,
        }
        this.saveTask(data, () => this.step == 'notifications' ? this.$router.push('/deploy') : this.$store.globalRefs.steppers.editDeploy.next())

      },
    },
  }
</script>

<style></style>

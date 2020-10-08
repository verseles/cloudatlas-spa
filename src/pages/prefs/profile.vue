<template>
  <div>
    <table class="q-table">
      <tr>
        <th>Name</th>
        <td>{{ $global.user.name }}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{ $global.user.email }}</td>
      </tr>
      <tr>
        <th>Happy since</th>
        <td>{{ $global.user.created_at | humanDate }}</td>
      </tr>
    </table>

    <div class="row text-center q-mt-md">
      <div class="col">
        <q-btn color="primary" outline no-caps @click="$q.notify('Soon')"
        >Change Email
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { date } from "quasar"

  export default {
    filters: {
      humanDate: v => {
        return v ? date.formatDate(v, "DD MMMM YYYY") : "-"
      },
    },
  }
</script>

<style lang="scss" scoped>
  td {
    font-weight: bold;
  }
</style>

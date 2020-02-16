<template>
  <q-page padding>
    <table class="q-table">
      <tr>
        <th>Name</th>
        <td>{{ $store.user.name }}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{ $store.user.email }}</td>
      </tr>
      <tr>
        <th>Happy since</th>
        <td>{{ $store.user.created_at | humanDate }}</td>
      </tr>
    </table>

    <div class="row text-center q-mt-md">
      <div class="col">
        <q-btn color="primary" outline no-caps @click="$q.notify('Soon')"
          >Change Email</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";

export default {
  filters: {
    humanDate: v => {
      return v ? date.formatDate(v * 1000, "DD MMM YYYY HH:mm") : "-";
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  font-weight: bold;
}
</style>

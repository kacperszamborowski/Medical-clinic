<template>
  <div class="admin-dashboard">
    <h2>Dzień dobry, {{ usersStore.patient?.firstname }} {{ usersStore.patient?.lastname }} </h2>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUsersStore } from '../../stores/user';

const usersStore = useUsersStore();

onMounted(() => {
  usersStore.fetchPatient()
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
}
</style>

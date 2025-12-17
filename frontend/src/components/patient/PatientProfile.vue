<template>
  <div class="patient-profile">
    <h2>Profil</h2>
    <p>Twoje dane</p>

    <p v-if="usersStore.loading" class="loading">
      Ładowanie…
    </p>

    <p v-if="usersStore.error" class="error">
      {{ usersStore.error }}
    </p>

    <div v-if="usersStore.patient && !usersStore.error && !usersStore.loading" class="profile-card">
      <div class="row">
        <span class="label">Imię</span>
        <span class="value">{{ usersStore.patient.firstname }}</span>
      </div>

      <div class="row">
        <span class="label">Nazwisko</span>
        <span class="value">{{ usersStore.patient.lastname }}</span>
      </div>

      <div class="row">
        <span class="label">Email</span>
        <span class="value">{{ usersStore.patient.email }}</span>
      </div>

      <div class="row">
        <span class="label">Data urodzenia</span>
        <span class="value">
          {{ usersStore.patient.birth_date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUsersStore } from "../../stores/user";

const usersStore = useUsersStore();

onMounted(() => {
  usersStore.fetchPatient();
});
</script>

<style scoped>
.patient-profile {
  max-width: 600px;
  font-family: system-ui, sans-serif;
}
</style>

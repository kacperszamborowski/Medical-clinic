<template>
  <div class="doctor-profile">
    <h2>Profil</h2>
    <p>Twoje dane</p>

    <p v-if="usersStore.loading" class="loading">
      Ładowanie…
    </p>

    <p v-if="usersStore.error" class="error">
      {{ usersStore.error }}
    </p>

    <div v-if="usersStore.doctor && !usersStore.error && !usersStore.loading" class="profile-card">
      <div class="row">
        <span class="label">Imię</span>
        <span class="value">{{ usersStore.doctor.firstname }}</span>
      </div>

      <div class="row">
        <span class="label">Nazwisko</span>
        <span class="value">{{ usersStore.doctor.lastname }}</span>
      </div>

      <div class="row">
        <span class="label">Email</span>
        <span class="value">{{ usersStore.doctor.email }}</span>
      </div>

      <div class="row">
        <span class="label">Data urodzenia</span>
        <span class="value">
          {{ usersStore.doctor.birth_date }}
        </span>
      </div>

      <div class="row">
        <span class="label">Specjalizacja</span>
        <span class="value">{{ usersStore.doctor.specialization }}</span>
      </div>

      <div class="row">
        <span class="label">Numer licencji</span>
        <span class="value">{{ usersStore.doctor.license_number }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUsersStore } from "../../stores/user";

const usersStore = useUsersStore();

onMounted(() => {
  usersStore.fetchDoctor();
});
</script>

<style scoped>
.doctor-profile {
  max-width: 600px;
}
</style>

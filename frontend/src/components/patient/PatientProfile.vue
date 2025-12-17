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

    <div v-if="usersStore.patient && !usersStore.error && !usersStore.loading">
      <div class="profile-card">
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
      <div class="password-card">
        <h3>Zmień hasło</h3>

        <label>
          Stare hasło
          <input type="password" v-model="oldPassword" placeholder="Wpisz stare hasło" />
        </label>

        <label>
          Nowe hasło
          <input type="password" v-model="newPassword" placeholder="Wpisz nowe hasło" />
        </label>

        <button class="confirm" :disabled="!oldPassword || !newPassword || usersStore.loading" @click="changePassword">
          Zmień hasło
        </button>

        <p v-if="success" class="success">
          Hasło zostało zmienione
        </p>
        <p v-if="error" class="error">
          Nie udało się zmienić hasła
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUsersStore } from "../../stores/user";
import { useAuthStore } from "../../stores/auth"
import { useRouter } from "vue-router";

const usersStore = useUsersStore();
const authStore = useAuthStore();
const router = useRouter();

const oldPassword = ref("")
const newPassword = ref("")

const error = ref(false);
const success = ref(false);

async function changePassword() {
  error.value = false
  success.value = false
  try {
    await authStore.changePassword(oldPassword.value, newPassword.value);
    success.value = true
    setTimeout(() => {
      success.value = false
      authStore.logout();
      router.push('/');
    }, 1200)
  } catch (err: any) {
    error.value = true
  }
}

onMounted(() => {
  usersStore.fetchPatient();
});
</script>

<style scoped>
.patient-profile {
  max-width: 600px;
}
</style>

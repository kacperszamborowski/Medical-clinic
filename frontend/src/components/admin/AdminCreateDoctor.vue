<template>
  <div class="admin-create-doctor">
    <h2>Dodaj konto doktora</h2>
    <p>Utwórz nowe konto doktora w systemie</p>

    <div class="form-card">
      <label>
        Imię
        <input v-model="firstname" type="text" />
      </label>

      <label>
        Nazwisko
        <input v-model="lastname" type="text" />
      </label>

      <label>
        Data urodzenia
        <input v-model="birthDate" :min="minDate" :max="maxDate" type="date" />
      </label>

      <label>
        Email
        <input v-model="email" type="email" />
      </label>

      <label>
        Hasło
        <input v-model="password" type="password" />
      </label>

      <label>
        Specjalizacja
        <input v-model="specialization" type="text" />
      </label>

      <label>
        Numer licencji
        <input v-model="licenseNumber" type="text" />
      </label>

      <button
        class="confirm"
        :disabled="usersStore.loading || !isValid"
        @click="createDoctor"
      >
        Dodaj doktora
      </button>

      <p v-if="usersStore.success" class="success">
        {{ usersStore.success }}
      </p>

      <p v-if="usersStore.error" class="error">
        {{ usersStore.error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useUsersStore } from "../../stores/user";

const usersStore = useUsersStore();

const firstname = ref("")
const lastname = ref("")
const birthDate = ref("")
const email = ref("")
const password = ref("")
const specialization = ref("")
const licenseNumber = ref("")

const today = new Date();

const maxDate = today.toISOString().split("T")[0];

const minDate = new Date(
  today.getFullYear() - 150,
  today.getMonth(),
  today.getDate()
).toISOString().split("T")[0];

const isValid = computed(() =>
  firstname.value &&
  lastname.value &&
  birthDate.value &&
  email.value &&
  password.value &&
  specialization.value &&
  licenseNumber.value
)

async function createDoctor() {
  const payload = {
    firstname: firstname.value,
    lastname: lastname.value,
    birthDate: birthDate.value,
    email: email.value,
    password: password.value,
    specialization: specialization.value,
    licenseNumber: licenseNumber.value,
  }
  await usersStore.createDoctor(payload)
}

</script>

<style scoped>
.admin-create-doctor {
  max-width: 600px;
  font-family: system-ui, sans-serif;
}

.form-card {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

button.confirm {
  margin-top: 10px;
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

button.confirm:hover {
  background: #1e40af;
}

button.confirm:disabled {
  background: #9ca3af;
  cursor: default;
}

.success {
  color: #16a34a;
}

.error {
  color: #dc2626;
}
</style>

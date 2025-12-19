<template>
  <div class="register">
    <h1>Rejestracja</h1>

    <form @submit.prevent="onSubmit">
      <button class="back-btn" @click="goBack">
        Mam już konto
      </button>
      <input v-model="firstname" type="text" placeholder="Imię" required />
      <input v-model="lastname" type="text" placeholder="Nazwisko" required />

      <input v-model="birthDate" type="date" :min="minDate" :max="maxDate" placeholder="Data urodzenia" required />

      <input v-model="email" type="email" placeholder="Email" required />

      <input v-model="password" type="password" placeholder="Hasło" required />

      <button type="submit">Zarejestruj się</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const today = new Date();

const maxDate = today.toISOString().split("T")[0];

const minDate = new Date(
  today.getFullYear() - 150,
  today.getMonth(),
  today.getDate()
).toISOString().split("T")[0];

const router = useRouter();
const auth = useAuthStore();

const firstname = ref("");
const lastname = ref("");
const birthDate = ref("");
const email = ref("");
const password = ref("");

const error = ref("");
const success = ref("");

function goBack() {
  router.back();
}

const onSubmit = async () => {
  error.value = "";
  success.value = "";

  try {
    await auth.register({
      firstname: firstname.value,
      lastname: lastname.value,
      birth_date: new Date(birthDate.value).toISOString(),
      email: email.value,
      password: password.value,
    });

    success.value = "Konto zostało utworzone";
    setTimeout(() => router.push("/"), 1200);
  } catch (err: any) {
    error.value = "Błąd rejestracji";
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, sans-serif;
}

.register {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f6f9fc;
}

.register h1 {
  margin-bottom: 28px;
  color: #0f172a;
  font-size: 32px;
  font-weight: 700;
}

.register form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 360px;
  padding: 28px;
  margin-bottom: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.register input,
.register select {
  padding: 12px 18px;
  border: 1px solid #cfd6e0;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
}

.register input:focus,
.register select:focus {
  border-color: #0f172a;
}

.register button {
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background: #0f172a;
  color: #e6eef8;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.register button:hover {
  background: #1e2a45;
}

.error,
.success {
  margin-top: 0px;
}

button.back-btn {
  background: #fcf9f9;
  border: 1px solid #e0e0e0;
  color: black;
  font-size: 16;
}

button.back-btn:hover {
  background: #e0ebf5;
  border-color: #c4d4e3;
}
</style>

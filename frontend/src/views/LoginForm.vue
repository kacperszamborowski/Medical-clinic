<template>
  <div class="login">
    <h1>Logowanie</h1>

    <form @submit.prevent="onSubmit">
      <div class="demo-buttons">
        <b>Demo login:</b>
        <button class="demo" @click="fill('patient')">Pacjent</button>
        <button class="demo" @click="fill('doctor')">Lekarz</button>
      </div>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Hasło" required />

      <button type="submit">Zaloguj</button>
      <button type="button" @click="navRegister">Zarejestruj się</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");

const auth = useAuthStore();
const router = useRouter();

const onSubmit = async () => {
  error.value = "";
  try {
    const user = await auth.login(email.value, password.value);

    // Przekierowania zależne od roli
    if (user && user.role === "patient") {
      await router.push("/patient/dashboard");
      return;
    } 
    if (user && user.role === "doctor") {
      await router.push("/doctor/dashboard");
      return;
    }
    if (user && user.role === "admin") {
      await router.push("/admin/dashboard");
      return;
    }
    await router.push("/");
  } catch (err: any) {
    error.value = "Błąd logowania";
  }
};

function navRegister() {
  router.push("/register");
}

function fill(user: "patient" | "doctor" | "admin" = "patient") {
  if (user === "patient") {
    email.value = "jan.kowalski@example.com"
    password.value = "pass123"
  }
  if (user === "doctor") {
    email.value = "anna.nowak@example.com"
    password.value = "pass123"
  }
  onSubmit()
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, sans-serif;
}

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f6f9fc;
}

.login h1 {
  margin-bottom: 28px;
  color: #0f172a;
  font-size: 32px;
  font-weight: 700;
}

.login form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 360px;
  padding: 28px;
  margin-bottom: 50px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.demo-buttons {
  display: flex;
  gap:5px;
  align-items: center;
}

.login button.demo {
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 600;
  background: #e2e8f0;
  color: #0f172a;
}

.login button.demo:hover {
  background: #cbd5e1;
}

.login input {
  padding: 12px 18px;
  border: 1px solid #cfd6e0;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
  transition: border-color 0.15s;
}

.login input:focus {
  border-color: #0f172a;
}

.login button {
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background: #0f172a;
  color: #e6eef8;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.login button:hover {
  background: #1e2a45;
}

.login p {
  margin-top: 14px;
  color: #ef4444;
  text-align: center;
  font-size: 18px;
}

.error {
  margin-top: 0px;
  margin-bottom: px;
}
</style>

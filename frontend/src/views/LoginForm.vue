<template>
  <div class="login">
    <h1>Logowanie</h1>

    <form @submit.prevent="onSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Hasło" required />

      <button type="submit">Zaloguj</button>
    </form>

    <p v-if="error" style="color:red">{{ error }}</p>
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
    if (user.role === "patient") return router.push("/patient/dashboard");
    if (user.role === "doctor") return router.push("/doctor/dashboard");
    if (user.role === "admin") return router.push("/admin/dashboard");
    return router.push("/");
  } catch (err: any) {
    error.value = err.message || "Błąd logowania";
  }
};
</script>

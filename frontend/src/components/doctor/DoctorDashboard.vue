<template>
  <div class="doctor-dashboard">
    <h2 v-if="usersStore.doctor">
      Dzień dobry, dr {{ usersStore.doctor.firstname }} {{ usersStore.doctor.lastname }}.
    </h2>
    <h2 v-else>Dzień dobry</h2>
    <div class="dashboard-card">
      <h3>Dzisiejsze wizyty</h3>

      <p v-if="loading" class="loading">
        Ładowanie…
      </p>

      <p v-if="error" class="error">
        Nie udało się pobrać danych
      </p>
      <div v-if="!error && !loading">
        <p v-if="todayAppointmentsCount === 0" class="empty">
          Dzisiaj nie masz zaplanowanych wizyt
        </p>

        <p v-else class="info">
          Zarezerwowane wizyty na dzisiaj - <b>{{ todayAppointmentsCount }}</b><br />
          Najbliższa: <b>{{ nextAppointment }}</b>
        </p>

        <button @click="goToAppointments">
          Przejdź do wizyt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUsersStore } from "../../stores/user";
import { useAppointmentsStore } from "../../stores/appointments";
import { useRouter } from "vue-router";

const usersStore = useUsersStore();
const appointmentsStore = useAppointmentsStore();
const router = useRouter();

const loading = computed(() => {
  return usersStore.loading && appointmentsStore.loading
})

const error = computed(() => {
  return usersStore.error && appointmentsStore.error
})

function todayISO() { return new Date().toISOString().slice(0, 10); }

const todayAppointments = computed(() => {
  const today = todayISO();

  return appointmentsStore.appointments.filter(a =>
    a.date.startsWith(today)
  );
})

const todayAppointmentsCount = computed(() => {
  return todayAppointments.value.length;
});

const nextAppointment = computed(() => {
  if (todayAppointments.value.length === 0) return "";

  const sorted = [...todayAppointments.value].sort((a, b) =>
    a.time.localeCompare(b.time)
  );
  const next = sorted[0];
  if (!next) return "";
  return `${next.time} - ${next.patient}`;
});

function goToAppointments() {
  router.push("/doctor/appointments");
}

onMounted(() => {
  usersStore.fetchDoctor();
  appointmentsStore.getDoctorUpcomingAppointments();
})
</script>

<style scoped>
.doctor-dashboard {
  max-width: 600px;
}
</style>

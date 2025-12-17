<template>
  <div class="patient-dashboard">
    <h2 v-if="usersStore.patient">
      Dzień dobry, {{ usersStore.patient.firstname }} {{ usersStore.patient.lastname }}.
    </h2>
    <h2 v-else>Dzień dobry.</h2>

    <div class="dashboard-card">
      <h3>Najbliższa wizyta</h3>
      <p v-if="loading" class="loading">
        Ładowanie…
      </p>

      <p v-if="error" class="error">
        Nie udało się pobrać danych
      </p>

      <div v-if="!error && !loading">
        <p v-if="!nextAppointment" class="empty">
          Brak nadchodzących wizyt
        </p>

        <p v-else class="info">
          Doktor <b>{{ nextAppointment.doctor }}</b> - <b>{{  nextAppointment.specialization }}</b><br />
          Dnia <b>{{ nextAppointment.date }}</b> o godzinie <b>{{ nextAppointment.time }}</b>
        </p>

        <button v-if="!nextAppointment" @click="goToDoctorList">
          Umów sie na wizytę
        </button>
        <button v-else @click="goToAppointments">
          Przejdź do wizyt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAppointmentsStore } from "../../stores/appointments";
import { useUsersStore } from "../../stores/user";
import { useRouter } from "vue-router";

const appointmentsStore = useAppointmentsStore();
const usersStore = useUsersStore();
const router = useRouter();

const loading = computed(() => {
  return usersStore.loading && appointmentsStore.loading
})

const error = computed(() => {
  return usersStore.error && appointmentsStore.error
})

const upcomingAppointments = computed(() =>
  appointmentsStore.patientAppointments.filter(a => a.status === "zarezerwowana")
);

const nextAppointment = computed(() => {
  return upcomingAppointments.value[0] || "";
});

function goToAppointments() {
  router.push("/patient/appointments");
}

function goToDoctorList() {
  router.push("/patient/doctor-list")
}

onMounted(() => {
  usersStore.fetchPatient();
  appointmentsStore.getPatientAppointments();
});
</script>

<style scoped>
.patient-dashboard {
  max-width: 600px;
}
</style>

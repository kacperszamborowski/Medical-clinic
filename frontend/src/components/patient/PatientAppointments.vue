<template>
  <div class="patient-appointments">
    <h2>Moje wizyty</h2>
    <p>Tutaj znajdziesz wszystkie swoje wizyty</p>

    <div v-if="!appointmentsStore.error && !appointmentsStore.loading" class="filters">
      <select v-model="filterStatus">
        <option value="">Wszystkie statusy</option>
        <option value="zarezerwowana">Zarezerwowane</option>
        <option value="zrealizowana">Zrealizowane</option>
        <option value="odwołana">Odwołane</option>
      </select>
      <input type="date" v-model="filterDate" />
      <input type="text" v-model="filterDoctor" placeholder="Imię lub nazwisko doktora" />
      <button class="reset-btn" :disabled="!filterDate && !filterDoctor" @click="resetFilters">
        Wyczyść filtry
      </button>
    </div>

    <p v-if="appointmentsStore.loading" class="loading">Ładowanie…</p>
    <p v-if="appointmentsStore.error" class="error">{{ appointmentsStore.error }}</p>

    <table v-if="!appointmentsStore.loading && appointmentsStore.patientAppointments.length" class="table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Godzina</th>
          <th>Doktor</th>
          <th>Specjalizacja</th>
          <th>Status</th>
          <th>Szczegóły wizyty</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredAppointments" :key="row.id">
          <td>{{ row.date }}</td>
          <td>{{ row.time }}</td>
          <td>{{ row.doctor }}</td>
          <td>{{ row.specialization }}</td>
          <td>{{ row.status }}</td>
          <td>
            <button class="details" :disabled="row.status === 'zarezerwowana'" @click="openModal(row)">
              Pokaż szczegóły
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="showModal" class="modal-backdrop" @click="closeModal">
    <div class="modal" @click.stop>
      <div v-if="selectedAppointment?.status === 'zrealizowana'" class="modal-content">
        <h3>Diagnoza</h3>
        <p>{{ diagnosis }}</p>
        <h3>Zalecenia</h3>
        <p>{{ recommendations }}</p>
        <h3>Recepta</h3>
        <p>{{ prescription ? "Wystawiona" : "Nie wystawiona" }}</p>
      </div>
      <div v-else class="modal-content">
        <h3>Powód odwołania wizyty</h3>
        <p>{{ cancelReason }}</p>
      </div>
      <button class="abort" @click="closeModal">Zamknij</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAppointmentsStore, type PatientAppointment } from '../../stores/appointments';

const appointmentsStore = useAppointmentsStore();
const showModal = ref(false)

const filterDate = ref("");
const filterDoctor = ref("");
const filterStatus = ref("")

const selectedAppointment = ref<PatientAppointment | null>(null)

const diagnosis = ref("");
const recommendations = ref("");
const prescription = ref(false);
const cancelReason = ref("");

const filteredAppointments = computed(() => {
  return appointmentsStore.patientAppointments.filter((a) => {
    const matchesDate = !filterDate.value || a.date === filterDate.value;
    const matchesDoctor = !filterDoctor.value || a.doctor.toLowerCase().includes(filterDoctor.value.toLowerCase());
    const matchesStatus = !filterStatus.value || a.status === filterStatus.value;
    return matchesDate && matchesDoctor && matchesStatus;
  });
});

function resetFilters() {
  filterDate.value = "";
  filterDoctor.value = "";
  filterStatus.value = "";
}

function openModal(appointment: PatientAppointment) {
  showModal.value = true;
  selectedAppointment.value = appointment
  if (appointment.status === 'zrealizowana') {
    diagnosis.value = appointment.details?.diagnosis || "";
    recommendations.value = appointment.details?.recommendations || "";
    prescription.value = !!appointment.details?.prescription;
  }
  else {
    cancelReason.value = appointment.cancelReason;
  }
}

function closeModal() {
  showModal.value = false;
  selectedAppointment.value = null;
  diagnosis.value = "";
  recommendations.value = "";
  prescription.value = false;
  cancelReason.value = "";
}

onMounted(() => {
  appointmentsStore.getPatientAppointments();
});
</script>

<style scoped>
.patient-appointments {
  max-width: 1200px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  margin-top: 12px;
}

.filters select {
  max-width: 175px;
}

.reset-btn {
  background: #6b7280;
  color: #fff;
}

.reset-btn:hover {
  background: #4b5563;
}

.details {
  background: #2563eb;
  color: #fff;
}

.details:hover {
  background: #1e40af;
}

.details:disabled {
  background: #aaaaaa;
  cursor: default;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal button.abort {
  background: #dc2626;
  color: #fff;
}

.modal button.abort:hover {
  background: #991b1b;
}
</style>
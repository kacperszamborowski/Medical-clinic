<template>
  <div class="doctor-appointments">
    <h2>Wizyty</h2>

    <div class="tabs">
      <button :class="{ active: activeTab === 'zarezerwowana' }" @click="changeTab('zarezerwowana')">
        Nadchodzące
      </button>
      <button :class="{ active: activeTab === 'zrealizowana' }" @click="changeTab('zrealizowana')">
        Zrealizowane
      </button>
    </div>

    <p v-if="appointmentsStore.loading" class="loading">Ładowanie…</p>
    <p v-if="appointmentsStore.error && !showModal" class="error">
      {{ appointmentsStore.error }}
    </p>
    <p v-if="!appointmentsStore.loading && !appointmentsStore.error && appointmentsStore.appointments.length === 0"
      class="empty">
      Brak wizyt.
    </p>

    <div v-if="activeTab === 'zrealizowana'" class="filters">
      <input type="date" v-model="filterDate" />
      <input type="text" v-model="filterPatient" placeholder="Imię lub nazwisko pacjenta" />
      <button class="reset-btn" :disabled="!filterDate && !filterPatient" @click="resetFilters">
        Wyczyść filtry
      </button>
    </div>

    <table v-if="!appointmentsStore.loading && appointmentsStore.appointments.length" class="appointments-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Godzina</th>
          <th>Pacjent</th>
          <th v-if="activeTab === 'zarezerwowana'">Zakończ wizytę</th>
          <th v-if="activeTab === 'zarezerwowana'">Odwołaj wizytę</th>
          <th v-if="activeTab === 'zrealizowana'">Status</th>
          <th v-if="activeTab === 'zrealizowana'">Diagnoza</th>
          <th v-if="activeTab === 'zrealizowana'">Zalecenia</th>
          <th v-if="activeTab === 'zrealizowana'">Recepta</th>
          <th v-if="activeTab === 'zrealizowana'">Edytuj</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredAppointments" :key="row.id">
          <td>{{ row.date }}</td>
          <td>{{ row.time }}</td>
          <td>{{ row.patient }}</td>
          <td v-if="activeTab === 'zarezerwowana'">
            <button class="finish-btn" @click="openModal('finish', row.id)">
              Zakończ wizytę
            </button>
          </td>
          <td v-if="activeTab === 'zarezerwowana'">
            <button class="cancel-btn" @click="openModal('cancel', row.id)">
              Odwołaj wizytę
            </button>
          </td>
          <td v-if="activeTab === 'zrealizowana'">{{ row.status }}</td>
          <td v-if="activeTab === 'zrealizowana'">
            {{ row.details?.diagnosis || "-" }}
          </td>
          <td v-if="activeTab === 'zrealizowana'">
            {{ row.details?.recommendations || "-" }}
          </td>
          <td v-if="activeTab === 'zrealizowana'">
            {{ row.details?.prescription ? "Tak" : "Nie" }}
          </td>
          <td v-if="activeTab === 'zrealizowana'">
            <button class="edit-btn" :disabled="row.status === 'odwołana'" @click="editAppointment(row)">
              Edytuj
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="appointmentsStore.success" class="success">
      {{ appointmentsStore.success }}
    </p>
  </div>

  <div v-if="showModal" class="modal-backdrop">
    <div class="modal">
      <h3 v-if="modalMode === 'finish'">Zakończ wizytę</h3>
      <h3 v-if="modalMode === 'cancel'">Odwołaj wizytę</h3>

      <template v-if="modalMode === 'finish'">
        <label>
          Diagnoza
          <textarea v-model="diagnosis" rows="3" />
        </label>
        <label>
          Zalecenia
          <textarea v-model="recommendations" rows="3" />
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="prescription" />
          Czy wystawiono receptę?
        </label>
        <div class="modal-actions">
          <button class="confirm" :disabled="appointmentsStore.loading || !diagnosis" @click="finishAppointment">
            Zapisz
          </button>
          <button class="abort" @click="closeModal">Anuluj</button>
        </div>
      </template>

      <template v-else-if="modalMode === 'cancel'">
        <label>
          Powód odwołania wizyty
          <textarea v-model="cancelReason" rows="3" />
        </label>
        <div class="modal-actions">
          <button class="confirm" :disabled="!cancelReason" @click="cancelAppointment">
            Odwołaj wizytę
          </button>
          <button class="abort" @click="closeModal">Anuluj</button>
        </div>
      </template>

      <p v-if="appointmentsStore.error">{{ appointmentsStore.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  useAppointmentsStore,
  type AppointmentStatus,
  type DoctorAppointment,
} from "../../stores/appointments";

type ModalMode = "finish" | "cancel";

const appointmentsStore = useAppointmentsStore();

const activeTab = ref<AppointmentStatus>("zarezerwowana");
const showModal = ref(false);
const modalMode = ref<ModalMode | null>(null);

const selectedAppointmentId = ref<number | null>(null);

const diagnosis = ref("");
const recommendations = ref("");
const prescription = ref(false);
const cancelReason = ref("");

const isEditing = ref(false);

const filterDate = ref("");
const filterPatient = ref("");

const filteredAppointments = computed(() => {
  if (activeTab.value !== "zrealizowana") {
    return appointmentsStore.appointments;
  }

  return appointmentsStore.appointments.filter((a) => {
    const matchesDate = !filterDate.value || a.date === filterDate.value;
    const matchesPatient =
      !filterPatient.value ||
      a.patient.toLowerCase().includes(filterPatient.value.toLowerCase());
    return matchesDate && matchesPatient;
  });
});

function resetFilters() {
  filterDate.value = "";
  filterPatient.value = "";
}

function changeTab(tab: AppointmentStatus) {
  activeTab.value = tab;
  tab === "zarezerwowana"
    ? appointmentsStore.getDoctorUpcomingAppointments()
    : appointmentsStore.getDoctorHistory();
}

function openModal(mode: ModalMode, appointmentId: number) {
  selectedAppointmentId.value = appointmentId;
  modalMode.value = mode;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  modalMode.value = null;
  isEditing.value = false;
  selectedAppointmentId.value = null;
  diagnosis.value = "";
  recommendations.value = "";
  prescription.value = false;
  cancelReason.value = "";
}

async function finishAppointment() {
  if (!selectedAppointmentId.value) return;

  if (!isEditing.value) {
    await appointmentsStore.createAppointmentDetails(
      selectedAppointmentId.value,
      diagnosis.value,
      recommendations.value,
      prescription.value
    );
    await appointmentsStore.finishAppointment(selectedAppointmentId.value);
    appointmentsStore.getDoctorUpcomingAppointments();
  } else {
    await appointmentsStore.updateAppointmentDetails(
      selectedAppointmentId.value,
      diagnosis.value,
      recommendations.value,
      prescription.value
    );
    isEditing.value = false;
    appointmentsStore.getDoctorHistory();
  }

  if (!appointmentsStore.error) {
    closeModal();
  }
}

async function cancelAppointment() {
  if (!selectedAppointmentId.value) return;

  await appointmentsStore.cancelAppointment(
    selectedAppointmentId.value,
    cancelReason.value
  );

  if (!appointmentsStore.error) {
    appointmentsStore.getDoctorUpcomingAppointments();
    closeModal();
  }
}

function editAppointment(appointment: DoctorAppointment) {
  selectedAppointmentId.value = appointment.id;
  modalMode.value = "finish";
  showModal.value = true;
  isEditing.value = true;
  diagnosis.value = appointment.details?.diagnosis || "";
  recommendations.value = appointment.details?.recommendations || "";
  prescription.value = !!appointment.details?.prescription;
}

onMounted(() => {
  appointmentsStore.getDoctorUpcomingAppointments();
});
</script>

<style scoped>
.doctor-appointments {
  max-width: 1200px;
  font-family: system-ui, sans-serif;
}

.tabs {
  display: flex;
  gap: 8px;
  margin: 15px 0;
}

.tabs button,
.finish-btn,
.cancel-btn,
.edit-btn,
.modal button,
.reset-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.tabs button,
.edit-btn,
.modal button.confirm {
  background: #2563eb;
  color: #fff;
}

.tabs button.active,
.tabs button:hover,
.edit-btn:hover,
.modal button.confirm:hover {
  background: #1e40af;
}

.finish-btn {
  background: #16a34a;
  color: #fff;
}

.finish-btn:hover {
  background: #15803d;
}

.cancel-btn,
.modal button.abort {
  background: #dc2626;
  color: #fff;
}

.cancel-btn:hover,
.modal button.abort:hover {
  background: #991b1b;
}

.edit-btn:disabled,
.reset-btn:disabled,
.modal button.confirm:disabled {
  background: #aaaaaa;
  cursor: default;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.filters input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.reset-btn {
  background: #6b7280;
  color: #fff;
}

.reset-btn:hover {
  background: #4b5563;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.appointments-table th,
.appointments-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.appointments-table th {
  background: #f3f4f6;
  font-weight: 600;
  text-align: left;
}

.loading,
.error,
.empty,
.success {
  margin-top: 10px;
}

.error {
  color: red;
}

.empty,
.loading {
  color: #555;
}

.success {
  color: green;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.modal textarea {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  resize: vertical;
}

.modal .checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
</style>

<template>
  <div class="doctors-list">
    <h2>Wybierz lekarza</h2>
    <div v-if="doctorsStore.error" class="error">{{ doctorsStore.error }}</div>
    <div class="grid">
      <div
        class="doctor-card"
        v-for="doctor in doctors"
        :key="doctor.id"
        @click="selectDoctor(doctor.id)"
      >
        <b>{{ doctor.name }}</b>
        <p>{{ doctor.specialization }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useDoctorsStore } from "../../stores/doctors";

const doctorsStore = useDoctorsStore();
const router = useRouter();

onMounted(() => {
  doctorsStore.fetchDoctors();
});

function selectDoctor(doctorId: number) {
  router.push(`/patient/doctor-list/${doctorId}`);
}

const doctors = computed(() => doctorsStore.doctors);
</script>

<style scoped>
.doctors-list {
  padding: 20px;
  font-family: system-ui, sans-serif;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.doctor-card {
  background: #f6f9fc;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 12px;
  width: 180px;
  cursor: pointer;
  transition: background 0.15s;
}

.doctor-card:hover {
  background: #e0ebf5;
}

.error {
  margin-top: 10px;
  color: red;
}
</style>

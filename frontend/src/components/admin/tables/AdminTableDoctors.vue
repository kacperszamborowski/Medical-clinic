<template>
  <div class="admin-table-doctors">
    <button class="back-btn" @click="goBack">
        Wróć
    </button>

    <p v-if="doctorsStore.loading" class="loading">Ładowanie...</p>
    <p v-if="doctorsStore.error" class="error">{{ doctorsStore.error }}</p>

    <div v-if="doctorsStore.table && !doctorsStore.loading &&
    !doctorsStore.error" class="table-wrapper">
        <table class="table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Id użytkownika</th>
                    <th>Specjalizacja</th>
                    <th>Numer licencji</th>              
                </tr>
            </thead>
            <tbody>
                <tr v-for="doctor in doctorsStore.table" :key="doctor.id">
                    <td>{{ doctor.id }}</td>
                    <td>{{ doctor.user_id }}</td>
                    <td>{{ doctor.specialization }}</td>
                    <td>{{ doctor.license_number }}</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDoctorsStore } from '../../../stores/doctors';

const router = useRouter();
const doctorsStore = useDoctorsStore();

function goBack() {
    router.back();
}

onMounted(() => {
  doctorsStore.fetchTable();
});
</script>

<style scoped>
.admin-table-doctors {
    max-width: 800px;
}
</style>
<template>
    <div class="admin-table-appointments">
        <button class="back-btn" @click="goBack">
            Wróć
        </button>
        <h3 class="tables-header">Tabela: Appointment</h3>

        <p v-if="appointmentsStore.loading" class="loading">Ładowanie...</p>
        <p v-if="appointmentsStore.error" class="error">{{ appointmentsStore.error }}</p>

        <div v-if="appointmentsStore.table && !appointmentsStore.loading &&
            !appointmentsStore.error" class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Id pacjenta</th>
                        <th>Id doktora</th>
                        <th>Data</th>
                        <th>Godzina</th>
                        <th>Status</th>
                        <th>Powód odwołania</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in appointmentsStore.table" :key="a.id">
                        <td>{{ a.id }}</td>
                        <td>{{ a.patient_id }}</td>
                        <td>{{ a.doctor_id }}</td>
                        <td>{{ formatDate(a.date) }}</td>
                        <td>{{ formatTime(a.time) }}</td>
                        <td>{{ a.status }}</td>
                        <td>{{ a.cancel_reason ? a.cancel_reason : "-" }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppointmentsStore } from '../../../stores/appointments';

const router = useRouter();
const appointmentsStore = useAppointmentsStore();

function goBack() {
    router.back();
}

function formatDate(date: string) {
    return date.substring(0, 10);
}

function formatTime(time: string) {
    const d = new Date(time);

    return d.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });
}

onMounted(() => {
    appointmentsStore.fetchTable();
});
</script>

<style scoped>
.admin-table-appointments {
    max-width: 1400px;
}
</style>
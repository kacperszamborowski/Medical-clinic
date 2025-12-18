<template>
    <div class="admin-table-doctors">
        <button class="back-btn" @click="goBack">
            Wróć
        </button>
        <h3 class="tables-header">Tabela: Appointment_details</h3>

        <p v-if="appointmentsStore.loading" class="loading">Ładowanie...</p>
        <p v-if="appointmentsStore.error" class="error">{{ appointmentsStore.error }}</p>

        <div v-if="appointmentsStore.detailsTable && !appointmentsStore.loading &&
            !appointmentsStore.error" class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Id wizyty</th>
                        <th>Diagonza</th>
                        <th>Zalecenia</th>
                        <th>Recepta</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="appdet in appointmentsStore.detailsTable" :key="appdet.id">
                        <td>{{ appdet.id }}</td>
                        <td>{{ appdet.appointment_id }}</td>
                        <td>{{ appdet.diagnosis }}</td>
                        <td>{{ appdet.recommendations }}</td>
                        <td>{{ appdet.prescription ? "Tak" : "Nie" }}</td>
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

onMounted(() => {
    appointmentsStore.fetchDetailsTable();
});
</script>

<style scoped>
.admin-table-doctors {
    max-width: 800px;
}
</style>
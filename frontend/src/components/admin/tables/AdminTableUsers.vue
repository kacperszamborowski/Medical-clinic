<template>
  <button class="back-btn" @click="goBack">
    Wróć
  </button>

  <div v-if="usersStore.table" class="table-wrapper">
    <table class="table">
        <thead>
            <tr>
                <th>Id</th>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Data urodzenia</th>
                <th>Email</th>
                <th>Rola</th>
                <th>Data utworzenia</th>                    
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in usersStore.table" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.firstname }}</td>
                <td>{{ user.lastname }}</td>
                <td>{{ formatDate(user.birth_date) }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ formatDateAndTime(user.created_at) }}</td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '../../../stores/user';

const router = useRouter();
const usersStore = useUsersStore();

function goBack() {
    router.back();
}

function formatDate(date: string) {
    return date.substring(0,10);
}

function formatDateAndTime(date: Date) {
  const d = new Date(date);

  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

onMounted(() => {
  usersStore.fetchTable();
});
</script>
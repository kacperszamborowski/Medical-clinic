<template>
  <div class="admin-tables">
    <h2>Tabele</h2>
    <p>Podgląd tabel z bazy</p>

    <div class="tables-grid">
      <div
        v-for="table in tables"
        :key="table.route"
        class="dashboard-card table-card"
        @click="goTo(table.route)"
      >
        <h3>{{ table.label }}</h3>
        <p class="info">{{ table.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const tables = [
  {
    label: "Użytkownicy",
    description: "Tabela użytkowników systemu",
    route: "/admin/tables/users",
  },
  {
    label: "Doktorzy",
    description: "Dane lekarzy i specjalizacje",
    route: "/admin/tables/doctors",
  },
  {
    label: "Harmonogramy",
    description: "Harmonogramy lekarzy",
    route: "/admin/tables/schedules",
  },
  {
    label: "Wizyty",
    description: "Zarezerwowane i zakończone wizyty",
    route: "/admin/tables/appointments",
  },
  {
    label: "Szczegóły wizyt",
    description: "Diagnozy, zalecenia, recepty",
    route: "/admin/tables/appointment-details",
  },
];

function goTo(path: string) {
  router.push(path);
}
</script>

<style scoped>
.admin-tables {
  max-width: 800px;
}

.tables-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.table-card {
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.table-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
}
</style>

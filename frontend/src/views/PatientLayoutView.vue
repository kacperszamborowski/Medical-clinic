<script setup lang="ts">
import LoggedInLayout from '../components/LoggedInLayout.vue'

const menu = [
    { label: 'Przegląd', to: "/patient/dashboard" },
    { label: 'Wizyty', to: "/patient/appointments" },
    { label: 'Profil', to: "/patient/profile" },
]
</script>

<template>
    <LoggedInLayout :menu="menu" title="Panel Pacjenta">
        <router-view />
    </LoggedInLayout>
</template>
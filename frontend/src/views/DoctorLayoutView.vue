<script setup lang="ts">
import LoggedInLayout from '../components/LoggedInLayout.vue'

const menu = [
    { label: 'Przegląd', to: "/doctor/dashboard" },
    { label: 'Harmonogram', to: "/doctor/schedule" },
    { label: 'Pacjenci', to: "/doctor/patients" },
    { label: 'Profil', to: "/doctor/profile" },
]
</script>

<template>
    <LoggedInLayout :menu="menu" title="Panel Doktora">
        <router-view />
    </LoggedInLayout>
</template>
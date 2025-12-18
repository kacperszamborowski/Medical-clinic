<script setup lang="ts">
import LoggedInLayout from '../components/LoggedInLayout.vue'

const menu = [
    { label: 'Przegląd', to: "/admin/dashboard" },
    { label: 'Dodaj doktora', to: "/admin/create-doctor" },
    { label: 'Tabele', to: "/admin/tables" },
]
</script>

<template>
    <LoggedInLayout :menu="menu" title="Panel Admina">
        <router-view />
    </LoggedInLayout>
</template>
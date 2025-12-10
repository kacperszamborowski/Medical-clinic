<script setup lang="ts">
import LoggedInLayout from '../components/LoggedInLayout.vue'

const menu = [
    { label: 'Przegląd', to: "/admin/dashboard" },
    { label: 'Tabele', to: "/admin/tables" },
    { label: 'Ustawienia', to: "/admin/settings" },
]
</script>

<template>
    <LoggedInLayout :menu="menu" title="Panel Admina">
        <router-view />
    </LoggedInLayout>
</template>
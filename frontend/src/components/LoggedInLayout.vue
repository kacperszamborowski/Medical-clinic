<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">Poradnia medyczna</div>
      <ul class="menu">
        <li v-for="item in menu" :key="item.to" :class="{ active: isActive(item.to) }" @click="navigate(item.to)">
          {{ item.label }}
        </li>
      </ul>
    </aside>

    <div class="main">
      <header class="header">
        <h1 class="header-title">{{ title }}</h1>

        <button class="logout" @click="logout">Wyloguj</button>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  menu: Array<{ label: string; to: string }>
  title?: string
}>()
const route = useRoute()
const router = useRouter()

const isActive = (path: string) => route.path === path
const navigate = (path: string) => router.push(path)

const auth = useAuthStore()
function logout() {
  auth.logout()
  router.push('/')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: system-ui, sans-serif;
}

.sidebar {
  width: 220px;
  background: #0f172a;
  color: #e6eef8;
  padding: 18px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.brand {
  font-weight: 700;
  margin-bottom: 18px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.menu li {
  padding: 10px 12px;
  margin-bottom: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: background .12s;
}

.menu li:hover {
  background: rgba(255, 255, 255, 0.03);
}

.menu li.active {
  background: rgba(255, 255, 255, 0.06);
  font-weight: 600
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f6f9fc;
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  box-shadow: 0 1px 0 rgba(16, 24, 40, 0.04);
  background: white;
}

.header-title {
  margin: 0;
  font-size: 24px
}

.logout {
  background: #ededf5;
  border: 1px solid #a8a7a7;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.logout:hover {
  background: #f3f4f6;
}

.content {
  padding: 18px;
  overflow: auto;
}

@media (max-width: 800px) {
  .sidebar {
    width: 64px
  }

  .menu li {
    padding: 10px 6px;
    font-size: 13px
  }
}
</style>

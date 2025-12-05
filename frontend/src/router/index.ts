import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginForm from "../views/LoginForm.vue";
import PatientDashboard from "../views/PatientDashboard.vue";
import DoctorDashboard from "../views/DoctorDashboard.vue";
import AdminDashboard from "../views/AdminDashboard.vue";

const routes = [
  { path: "/", name: "login", component: LoginForm },

  {
    path: "/patient/dashboard",
    component: PatientDashboard,
    meta: { requiresAuth: true, role: "patient" },
  },

  {
    path: "/doctor/dashboard",
    component: DoctorDashboard,
    meta: { requiresAuth: true, role: "doctor" },
  },

  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware
router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    return "/";
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return "/";
  }

  return true;
});

export default router;

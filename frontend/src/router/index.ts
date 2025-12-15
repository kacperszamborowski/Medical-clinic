import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginForm from "../views/LoginForm.vue";
import PatientLayoutView from "../views/PatientLayoutView.vue";
import DoctorLayoutView from "../views/DoctorLayoutView.vue";
import AdminLayoutView from "../views/AdminLayoutView.vue";
import PatientDashboard from "../components/patient/PatientDashboard.vue";
import PatientProfile from "../components/patient/PatientProfile.vue";
import PatientDoctorList from "../components/patient/PatientDoctorList.vue";
import PatientReserveAppointment from "../components/patient/PatientReserveAppointment.vue";
import DoctorDashboard from "../components/doctor/DoctorDashboard.vue";
import DoctorAppointments from "../components/doctor/DoctorAppointments.vue";
import DoctorProfile from "../components/doctor/DoctorProfile.vue";
import DoctorSchedule from "../components/doctor/DoctorSchedule.vue";
import AdminDashboard from "../components/admin/AdminDashboard.vue";
import AdminSettings from "../components/admin/AdminSettings.vue";
import AdminTables from "../components/admin/AdminTables.vue";

const routes = [
  { path: "/", name: "login", component: LoginForm },

  {
    path: "/patient",
    component: PatientLayoutView,
    meta: { requiresAuth: true, role: "patient" },
    children: [
      { path: "dashboard", component: () => PatientDashboard },
      { path: "profile", component: () => PatientProfile },
      { path: "doctor-list", component: () => PatientDoctorList },
      { path: "doctor-list/:id", component: () => PatientReserveAppointment },
    ]
  },

  {
    path: "/doctor",
    component: DoctorLayoutView,
    meta: { requiresAuth: true, role: "doctor" },
    children: [
      { path: "dashboard", component: () => DoctorDashboard },
      { path: "appointments", component: () => DoctorAppointments },
      { path: "profile", component: () => DoctorProfile },
      { path: "schedule", component: () => DoctorSchedule },
    ]
  },

  {
    path: "/admin",
    component: AdminLayoutView,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "dashboard", component: () => AdminDashboard },
      { path: "settings", component: () => AdminSettings },
      { path: "tables", component: () => AdminTables },
    ]
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

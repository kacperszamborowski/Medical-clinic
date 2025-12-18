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
import PatientAppointments from "../components/patient/PatientAppointments.vue";
import DoctorDashboard from "../components/doctor/DoctorDashboard.vue";
import DoctorAppointments from "../components/doctor/DoctorAppointments.vue";
import DoctorProfile from "../components/doctor/DoctorProfile.vue";
import DoctorSchedule from "../components/doctor/DoctorSchedule.vue";
import AdminDashboard from "../components/admin/AdminDashboard.vue";
import AdminCreateDoctor from "../components/admin/AdminCreateDoctor.vue";
import AdminTables from "../components/admin/AdminTables.vue";
import AdminTableUsers from "../components/admin/tables/AdminTableUsers.vue";
import AdminTableDoctors from "../components/admin/tables/AdminTableDoctors.vue";
import AdminTableSchedules from "../components/admin/tables/AdminTableSchedules.vue";
import AdminTableAppointments from "../components/admin/tables/AdminTableAppointments.vue";
import AdminTableAppointmentDetails from "../components/admin/tables/AdminTableAppointmentDetails.vue";
import RegisterView from "../views/RegisterView.vue";

const routes = [
  { path: "/", name: "login", component: LoginForm },
  { path: "/register", name: "register", component: RegisterView},

  {
    path: "/patient",
    component: PatientLayoutView,
    meta: { requiresAuth: true, role: "patient" },
    children: [
      { path: "dashboard", component: () => PatientDashboard },
      { path: "profile", component: () => PatientProfile },
      { path: "doctor-list", component: () => PatientDoctorList },
      { path: "doctor-list/:id", component: () => PatientReserveAppointment },
      { path: "appointments", component: () => PatientAppointments },
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
      { path: "create-doctor", component: () => AdminCreateDoctor },
      { path: "tables", component: () => AdminTables },
      { path: "tables/users", component: () => AdminTableUsers},
      { path: "tables/doctor", component: () => AdminTableDoctors},
      { path: "tables/schedules", component: () => AdminTableSchedules},
      { path: "tables/appointments", component: () => AdminTableAppointments},
      { path: "tables/appointment-details", component: () => AdminTableAppointmentDetails},
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

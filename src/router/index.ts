import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginPage from '../pages/LoginPage.vue'
import SupporterLayout from '../layouts/SupporterLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import KioskLayout from '../layouts/KioskLayout.vue'
import DashboardPage from '../pages/supporter/DashboardPage.vue'
import OperationsPage from '../pages/supporter/OperationsPage.vue'
import OperationDetailPage from '../pages/supporter/OperationDetailPage.vue'
import EventsPage from '../pages/supporter/EventsPage.vue'
import EventDetailPage from '../pages/supporter/EventDetailPage.vue'
import ReconciliationPage from '../pages/supporter/ReconciliationPage.vue'
import GatesPage from '../pages/supporter/GatesPage.vue'
import KioskPage from '../pages/kiosk/KioskPage.vue'
import AdminOverviewPage from '../pages/admin/AdminOverviewPage.vue'
import AdminUsersPage from '../pages/admin/AdminUsersPage.vue'
import AdminGatesPage from '../pages/admin/AdminGatesPage.vue'
import AdminObjectTypesPage from '../pages/admin/AdminObjectTypesPage.vue'
import AdminReportsPage from '../pages/admin/AdminReportsPage.vue'
import AdminAuditPage from '../pages/admin/AdminAuditPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: AuthLayout,
      children: [{ path: '', name: 'login', component: LoginPage }]
    },
    {
      path: '/app',
      component: SupporterLayout,
      children: [
        { path: '', redirect: '/app/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: DashboardPage },
        { path: 'operations', name: 'operations', component: OperationsPage },
        { path: 'operations/:id', name: 'operation-detail', component: OperationDetailPage },
        { path: 'events', name: 'events', component: EventsPage },
        { path: 'events/:id', name: 'event-detail', component: EventDetailPage },
        { path: 'reconciliation', name: 'reconciliation', component: ReconciliationPage },
        { path: 'gates', name: 'gates', component: GatesPage }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', redirect: '/admin/overview' },
        { path: 'overview', name: 'admin-overview', component: AdminOverviewPage },
        { path: 'users', name: 'admin-users', component: AdminUsersPage },
        { path: 'gates', name: 'admin-gates', component: AdminGatesPage },
        { path: 'object-types', name: 'admin-object-types', component: AdminObjectTypesPage },
        { path: 'reports', name: 'admin-reports', component: AdminReportsPage },
        { path: 'audit', name: 'admin-audit', component: AdminAuditPage }
      ]
    },
    {
      path: '/kiosk',
      component: KioskLayout,
      children: [{ path: '', name: 'kiosk', component: KioskPage }]
    },
    { path: '/', redirect: '/login' }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (!authStore.currentUser) {
    authStore.loadFromStorage()
  }
  const isLoggedIn = authStore.isAuthenticated
  if (to.path !== '/login' && !isLoggedIn) {
    return '/login'
  }
  if (to.path.startsWith('/admin') && authStore.currentUser?.role !== 'ADMIN') {
    return '/app/dashboard'
  }
  if (to.path === '/login' && isLoggedIn) {
    return authStore.currentUser?.role === 'ADMIN' ? '/admin/overview' : '/app/dashboard'
  }
  return true
})

export default router

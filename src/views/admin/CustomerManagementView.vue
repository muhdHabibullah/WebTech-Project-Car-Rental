<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Customer Management</h1>
        <p class="page-subtitle">View registered customers</p>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon-box" style="background: var(--primary-light); color: var(--primary);">
          👥
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Customers</span>
          <span class="metric-value">{{ totalCustomers }}</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box" style="background: var(--status-success-bg); color: var(--status-success);">
          ✨
        </div>
        <div class="metric-info">
          <span class="metric-label">New This Month</span>
          <span class="metric-value">{{ newThisMonth }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <input 
        type="text" 
        v-model="searchQuery" 
        class="form-control" 
        placeholder="🔍 Search by name or email..." 
        style="max-width: 400px;"
      />
    </div>

    <!-- Data Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Join Date</th>
            <th>Total Bookings</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
              No customers match your search.
            </td>
          </tr>
          <tr v-for="c in filteredCustomers" :key="c.id">
            <td style="font-weight: 600;">{{ c.name }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.phone || 'N/A' }}</td>
            <td>{{ c.joinDate }}</td>
            <td>
              <span class="badge badge-success">{{ c.totalBookings }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Toast Notification -->
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast-${toast.type}`">
        <span>{{ toast.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/axios';

const customers = ref([]);
const searchQuery = ref('');
const toasts = ref([]);
const isLoading = ref(true);

// Fetch customers from API
const fetchCustomers = async () => {
  try {
    isLoading.value = true;
    console.log('[CUSTOMER MANAGEMENT] Fetching customers from API...');
    const res = await api.get('/admin/customers');
    customers.value = res.data || [];
    console.log('[CUSTOMER MANAGEMENT] Customers loaded:', customers.value.length);
  } catch (error) {
    console.error('[CUSTOMER MANAGEMENT] Error fetching customers:', error);
    addToast('Failed to load customers', 'danger');
  } finally {
    isLoading.value = false;
  }
};

const totalCustomers = computed(() => customers.value.length);
const newThisMonth = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  return customers.value.filter(c => c.created_at && c.created_at.startsWith(currentMonth)).length;
});

const filteredCustomers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return customers.value;
  return customers.value.filter(c => 
    (c.name && c.name.toLowerCase().includes(query)) || 
    (c.email && c.email.toLowerCase().includes(query))
  );
});

const addToast = (text, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, text, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
};

onMounted(() => {
  fetchCustomers();
});
</script>

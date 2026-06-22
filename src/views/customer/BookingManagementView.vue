<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Booking Management</h1>
        <p class="page-subtitle">Manage existing bookings and confirm reservations.</p>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="card">
      <h3 class="card-title">Active Bookings</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Vehicle</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td style="font-weight: 600;">{{ booking.customerName }}</td>
              <td>{{ booking.carInfo }}</td>
              <td>{{ booking.startDate }}</td>
              <td>{{ booking.endDate }}</td>
              <td style="font-weight: 600; color: var(--primary-dark);">RM{{ booking.totalPrice }}</td>
              <td>
                <span class="badge" :class="getBadgeClass(booking)">
                  {{ getDisplayStatus(booking) }}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button
                    v-if="isAdmin && booking.status === 'pending'"
                    @click="updateBookingStatus(booking.id, 'confirmed')"
                    class="btn btn-success btn-sm"
                  >
                    Confirm
                  </button>
                  <button
                    v-if="['pending', 'confirmed'].includes(booking.status)"
                    @click="cancelBooking(booking.id)"
                    class="btn btn-danger btn-sm"
                  >
                    Cancel
                  </button>
                  <span v-if="booking.status === 'cancelled'" style="font-size: 0.75rem; color: var(--text-muted);">—</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="bookings.length === 0" style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
        <p style="font-weight: 500;">No bookings yet</p>
        <p style="font-size: 0.9rem; margin-top: 0.25rem;">Create one to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/axios';
import { currentUser } from '@/utils/session';

const bookings = ref([]);
const cars = ref([]);
const customers = ref([]);
const isLoading = ref(true);

const user = computed(() => currentUser.value);
const isAdmin = computed(() => user.value?.role === 'admin');

const getDisplayStatus = (booking) => {
  if (booking.status === 'pending') return 'pending booking';
  if (booking.status === 'confirmed' && booking.paymentStatus !== 'paid') return 'pending payment';
  return booking.status;
};

const getBadgeClass = (booking) => {
  const status = getDisplayStatus(booking);
  if (status === 'pending booking') return 'badge-pending';
  if (status === 'pending payment') return 'badge-warning';
  return `badge-${booking.status}`;
};

// Fetch bookings and cars from API
const fetchData = async () => {
  try {
    isLoading.value = true;
    console.log('[BOOKING MANAGEMENT] Fetching data from API...');
    
    const promises = [
      api.get('/bookings'),
      api.get('/cars')
    ];
    
    const results = await Promise.all(promises);
    bookings.value = results[0].data || [];
    cars.value = results[1].data || [];
    
    console.log('[BOOKING MANAGEMENT] Bookings:', bookings.value.length, 'Cars:', cars.value.length);
  } catch (error) {
    console.error('[BOOKING MANAGEMENT] Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
};



// Update booking status
const updateBookingStatus = async (id, status) => {
  try {
    await api.put(`/bookings/${id}`, { status });
    const booking = bookings.value.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      alert(`Booking ${status}!`);
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    alert('Failed to update booking');
  }
};

// Cancel booking
const cancelBooking = async (id) => {
  const booking = bookings.value.find((b) => b.id === id);
  if (booking && confirm('Are you sure you want to cancel this booking?')) {
    try {
      await api.delete(`/bookings/${id}`);
      bookings.value = bookings.value.filter(b => b.id !== id);
      alert('Booking cancelled!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
input[type='date']::-webkit-outer-spin-button,
input[type='date']::-webkit-inner-spin-button {
  display: none;
}
</style>

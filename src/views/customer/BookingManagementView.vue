<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Booking Management</h1>
        <p class="page-subtitle">Create new bookings for customers, confirm reservations, or manage existing bookings.</p>
      </div>
      <div>
        <button @click="showForm = !showForm" class="btn btn-primary">
          {{ showForm ? '✕ Hide Form' : '➕ New Booking' }}
        </button>
      </div>
    </div>

    <!-- Create Booking Form -->
    <div v-if="showForm" class="card" style="margin-bottom: 2rem;">
      <h3 class="card-title">Create New Booking</h3>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
        Select a customer and available car, then choose your rental dates. The total price will be calculated automatically.
      </p>
      <form @submit.prevent="handleSubmit" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <!-- Customer Select -->
        <div class="form-group">
          <label class="form-label">Customer Name</label>
          <select
            v-model.number="formData.customerId"
            class="form-control"
            required
          >
            <option :value="0">Select a customer...</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
        </div>

        <!-- Car Select -->
        <div class="form-group">
          <label class="form-label">Vehicle</label>
          <select
            v-model.number="formData.carId"
            @change="updateTotalPrice"
            class="form-control"
            required
          >
            <option :value="0">Select a vehicle...</option>
            <option v-for="car in availableCars" :key="car.id" :value="car.id">
              {{ car.brand }} {{ car.model }} - RM{{ car.pricePerDay }}/day
            </option>
          </select>
        </div>

        <!-- Start Date -->
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input
            v-model="formData.startDate"
            @change="updateTotalPrice"
            type="date"
            class="form-control"
            required
          />
        </div>

        <!-- End Date -->
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input
            v-model="formData.endDate"
            @change="updateTotalPrice"
            type="date"
            class="form-control"
            required
          />
        </div>

        <!-- Total Price Display -->
        <div v-if="formData.carId && formData.startDate && formData.endDate" style="grid-column: 1 / -1;">
          <div style="background: var(--primary-light); padding: 1rem; border-radius: var(--radius-sm); border-left: 4px solid var(--primary);">
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 0.25rem;">Total Rental Price</div>
            <div style="font-size: 1.75rem; font-weight: 800; color: var(--primary);">RM{{ formData.totalPrice }}</div>
          </div>
        </div>

        <!-- Buttons -->
        <div style="grid-column: 1 / -1; display: flex; gap: 1rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">
            Create Booking
          </button>
          <button
            type="button"
            @click="showForm = false"
            class="btn btn-outline"
            style="flex: 1;"
          >
            Cancel
          </button>
        </div>
      </form>
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
                <span class="badge" :class="`badge-${booking.status}`">
                  {{ booking.status }}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button
                    v-if="booking.status === 'pending'"
                    @click="updateBookingStatus(booking.id, 'confirmed')"
                    class="btn btn-success btn-sm"
                  >
                    Confirm
                  </button>
                  <button
                    v-if="booking.status !== 'cancelled'"
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

const bookings = ref([]);
const cars = ref([]);
const isLoading = ref(true);

const showForm = ref(false);
const formData = ref({
  carId: 0,
  startDate: '',
  endDate: '',
  totalPrice: 0,
  status: 'pending',
});

// Fetch bookings and cars from API
const fetchData = async () => {
  try {
    isLoading.value = true;
    console.log('[BOOKING MANAGEMENT] Fetching data from API...');
    const [bookingsRes, carsRes] = await Promise.all([
      api.get('/bookings'),
      api.get('/cars')
    ]);
    bookings.value = bookingsRes.data || [];
    cars.value = carsRes.data || [];
    console.log('[BOOKING MANAGEMENT] Bookings:', bookings.value.length, 'Cars:', cars.value.length);
  } catch (error) {
    console.error('[BOOKING MANAGEMENT] Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
};

// Filter only available cars
const availableCars = computed(() => {
  return cars.value.filter((car) => car.availability_status === 'available');
});

// Calculate price based on car and dates
const calculatePrice = (carId, startDate, endDate) => {
  const car = cars.value.find((c) => c.id === carId);
  if (!car || !startDate || !endDate) return 0;
  const days = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  return days * (car.price_per_day || 0);
};

// Update total price when car or dates change
const updateTotalPrice = () => {
  if (formData.value.carId && formData.value.startDate && formData.value.endDate) {
    formData.value.totalPrice = calculatePrice(
      formData.value.carId,
      formData.value.startDate,
      formData.value.endDate
    );
  }
};

// Submit form to add booking
const handleSubmit = async () => {
  if (!formData.value.carId) {
    alert('Please select a car');
    return;
  }

  try {
    const res = await api.post('/bookings', {
      car_id: formData.value.carId,
      start_date: formData.value.startDate,
      end_date: formData.value.endDate,
      total_price: formData.value.totalPrice,
      status: 'pending'
    });
    
    bookings.value.push(res.data);

    // Reset form
    formData.value = {
      carId: 0,
      startDate: '',
      endDate: '',
      totalPrice: 0,
      status: 'pending',
    };
    showForm.value = false;
    alert('Booking created successfully!');
  } catch (error) {
    console.error('Error creating booking:', error);
    alert('Failed to create booking');
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

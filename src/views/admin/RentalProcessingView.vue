<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Rental Processing</h1>
        <p class="page-subtitle">Manage the rental lifecycle: start booked rentals, complete ongoing ones, and track completed transactions.</p>
      </div>
    </div>

    <!-- Rental Status Sections -->
    <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
      <!-- Booked Rentals Section -->
      <div class="card">
        <div style="display: flex; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--primary-light);">
          <h3 class="card-title" style="margin: 0;">📅 Booked Rentals</h3>
          <span class="badge" style="margin-left: auto;">{{ bookedRentals.length }}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div
            v-for="rental in bookedRentals"
            :key="rental.id"
            style="background: var(--white); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; transition: var(--transition-fast);"
            class="rental-card"
          >
            <div>
              <h4 style="font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">{{ rental.customerName }}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);">{{ rental.carInfo }}</p>
              <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.5rem;">{{ rental.startDate }} → {{ rental.endDate }}</p>
            </div>
            <button
              @click="startRental(rental.id)"
              class="btn btn-success"
              style="width: 100%;"
            >
              ▶ Start Rental
            </button>
          </div>
          <div v-if="bookedRentals.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📭</div>
            <p style="font-weight: 500;">No booked rentals</p>
          </div>
        </div>
      </div>

      <!-- Ongoing Rentals Section -->
      <div class="card">
        <div style="display: flex; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f97316;">
          <h3 class="card-title" style="margin: 0;">🚗 Ongoing Rentals</h3>
          <span class="badge" style="margin-left: auto; background: #fed7aa; color: #92400e;">{{ ongoingRentals.length }}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div
            v-for="rental in ongoingRentals"
            :key="rental.id"
            style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-md); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; transition: var(--transition-fast);"
            class="rental-card"
          >
            <div>
              <h4 style="font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">{{ rental.customerName }}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);">{{ rental.carInfo }}</p>
              <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.5rem;">{{ rental.startDate }} → {{ rental.endDate }}</p>
            </div>
            <button
              @click="endRental(rental.id)"
              class="btn btn-primary"
              style="width: 100%;"
            >
              ⏹ End Rental
            </button>
          </div>
          <div v-if="ongoingRentals.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🚫</div>
            <p style="font-weight: 500;">No ongoing rentals</p>
          </div>
        </div>
      </div>

      <!-- Completed Rentals Section -->
      <div class="card">
        <div style="display: flex; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--status-success);">
          <h3 class="card-title" style="margin: 0;">✓ Completed Rentals</h3>
          <span class="badge badge-success" style="margin-left: auto;">{{ completedRentals.length }}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
          <div
            v-for="rental in completedRentals"
            :key="rental.id"
            style="background: var(--status-success-bg); border: 1px solid #86efac; border-radius: var(--radius-md); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; opacity: 0.8;"
          >
            <div>
              <h4 style="font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">{{ rental.customerName }}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);">{{ rental.carInfo }}</p>
              <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.5rem;">{{ rental.startDate }} → {{ rental.endDate }}</p>
            </div>
            <div style="text-align: center; padding: 0.75rem; background: rgba(5, 150, 105, 0.15); border-radius: var(--radius-sm); font-weight: 600; color: var(--status-success); font-size: 0.9rem;">
              Completed
            </div>
          </div>
          <div v-if="completedRentals.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
            <p style="font-weight: 500;">No completed rentals yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rental-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
</style>

<script setup>
import { ref, computed } from 'vue';
import { mockData } from '@/utils/mockData';

const rentals = ref(mockData.rentals);

// Compute rentals by status
const bookedRentals = computed(() => {
  return rentals.value.filter((rental) => rental.status === 'booked');
});

const ongoingRentals = computed(() => {
  return rentals.value.filter((rental) => rental.status === 'ongoing');
});

const completedRentals = computed(() => {
  return rentals.value.filter((rental) => rental.status === 'completed');
});

// Start a rental (move from booked to ongoing)
const startRental = (id) => {
  const rental = rentals.value.find((r) => r.id === id);
  if (rental && confirm(`Start rental for ${rental.customerName}?`)) {
    rental.status = 'ongoing';
    alert('Rental started successfully!');
  }
};

// End a rental (move from ongoing to completed)
const endRental = (id) => {
  const rental = rentals.value.find((r) => r.id === id);
  if (rental && confirm(`End rental for ${rental.customerName}?`)) {
    rental.status = 'completed';
    alert('Rental completed successfully!');
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

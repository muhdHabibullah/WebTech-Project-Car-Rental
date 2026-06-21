<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Browse Our Fleet</h1>
        <p class="page-subtitle">Discover the perfect vehicle for your next journey</p>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="search-bar-container">
        <span class="search-bar-icon">🔍</span>
        <input
          id="car-search"
          type="text"
          class="search-bar"
          placeholder="Search by name, brand, or category..."
          v-model="searchQuery"
          @input="debouncedSearch"
        />
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <select id="filter-category" v-model="filters.category" @change="loadCars" class="filter-select">
          <option value="all">All Categories</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Sports">Sports</option>
          <option value="Electric">Electric</option>
          <option value="Luxury">Luxury</option>
        </select>

        <select id="filter-transmission" v-model="filters.transmission" @change="loadCars" class="filter-select">
          <option value="all">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        <select id="filter-sort" v-model="filters.sort" @change="loadCars" class="filter-select">
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name: A → Z</option>
          <option value="year">Newest First</option>
        </select>


      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="car-grid">
      <div v-for="n in 6" :key="n" class="skeleton skeleton-card"></div>
    </div>

    <!-- Car Grid -->
    <div v-else-if="carList.length > 0" class="car-grid">
      <div
        v-for="car in carList"
        :key="car.id"
        class="car-card"
        @click="goToDetail(car.id)"
        :id="`car-card-${car.id}`"
      >
        <div class="car-card-image">
          <img v-if="car.imageUrl" :src="car.imageUrl" :alt="car.name" style="width: 100%; height: 100%; object-fit: cover;" />
          <span v-else style="font-size: 4rem;">🚗</span>
        </div>
        <div class="car-card-body">
          <div class="car-card-brand">{{ car.brand }}</div>
          <div class="car-card-name">{{ car.name }}</div>
          <div class="car-card-specs">
            <span class="spec-pill">👤 {{ car.seats }} seats</span>
            <span class="spec-pill">⚙️ {{ car.transmission }}</span>
            <span class="spec-pill">⛽ {{ car.fuelType }}</span>
            <span class="spec-pill">📅 {{ car.year }}</span>
          </div>
          <div class="car-card-footer">
            <div class="price-tag">RM{{ car.pricePerDay.toFixed(2) }} <span>/day</span></div>
            <div class="availability-dot" :class="car.available ? 'available' : 'unavailable'">
              {{ car.available ? 'Available' : 'Unavailable' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <h3 class="empty-state-title">No cars found</h3>
      <p class="empty-state-text">
        Try adjusting your search or filter criteria to find the perfect vehicle.
      </p>
      <button @click="resetFilters" class="btn btn-outline" style="margin-top: 1rem;">
        Clear All Filters
      </button>
    </div>

    <!-- Results count -->
    <div v-if="!isLoading && carList.length > 0" style="margin-top: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
      Showing {{ carList.length }} vehicle{{ carList.length !== 1 ? 's' : '' }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../utils/axios';

const router = useRouter();
const carList = ref([]);
const allCars = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

const filters = reactive({
  category: 'all',
  transmission: 'all',
  sort: '',
  availableOnly: true
});

let debounceTimer = null;

const debouncedSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    filterCars();
  }, 350);
};

// Apply filters to the loaded cars
const filterCars = () => {
  let result = [...allCars.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.brand && c.brand.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q))
    );
  }
  if (filters.category && filters.category !== 'all') {
    result = result.filter(c => c.category === filters.category);
  }
  if (filters.transmission && filters.transmission !== 'all') {
    result = result.filter(c => c.transmission === filters.transmission);
  }
  if (filters.availableOnly) {
    result = result.filter(c => c.availability_status === 'available');
  }
  if (filters.sort === 'price-asc') {
    result.sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0));
  } else if (filters.sort === 'price-desc') {
    result.sort((a, b) => (b.price_per_day || 0) - (a.price_per_day || 0));
  } else if (filters.sort === 'name') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (filters.sort === 'year') {
    result.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  carList.value = result;
};

// Fetch cars from API
const loadCars = async () => {
  isLoading.value = true;
  try {
    console.log('[BROWSE CARS] Fetching cars from API...');
    const res = await api.get('/cars');
    allCars.value = res.data || [];
    console.log('[BROWSE CARS] Cars loaded:', allCars.value.length);
    filterCars();
  } catch (err) {
    console.error('[BROWSE CARS] Failed to load cars:', err);
  } finally {
    isLoading.value = false;
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  filters.category = 'all';
  filters.transmission = 'all';
  filters.sort = '';
  filters.availableOnly = true;
  filterCars();
};

const goToDetail = (carId) => {
  router.push({ name: 'CarDetail', params: { id: carId } });
};

onMounted(() => {
  loadCars();
});
</script>

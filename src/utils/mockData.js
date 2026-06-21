import { ref, computed, reactive } from 'vue';
import api from './axios.js';
import { currentUser } from './session.js';

// Reactive refs for data
export const payments = ref([]);
export const feedbacks = ref([]);
export const cars = ref([]);
export const bookings = ref([]);
export const customers = ref([]);
export const activeBookingPendingFeedback = ref(null);

export const mockData = reactive({
  customers: [],
  cars: [],
  bookings: [],
  rentals: []
});

// Load all data from API
export const loadRealData = async () => {
  try {
    const carsRes = await api.get('/cars').catch(() => ({ data: [] }));
    cars.value = carsRes.data || [];
    mockData.cars = cars.value;

    const token = localStorage.getItem('auth_token');
    if (token) {
      const [bkRes, rntRes, payRes, fdbRes, custRes] = await Promise.allSettled([
        api.get('/bookings'),
        api.get('/admin/rentals').catch(() => api.get('/rentals')),
        api.get('/payments'),
        api.get('/feedback'),
        api.get('/admin/customers').catch(() => ({ data: [] }))
      ]);

      if (bkRes.status === 'fulfilled' && bkRes.value?.data) {
        bookings.value = bkRes.value.data;
        mockData.bookings = bkRes.value.data;
      }
      if (rntRes.status === 'fulfilled' && rntRes.value?.data) {
        mockData.rentals = rntRes.value.data;
      }
      if (payRes.status === 'fulfilled' && payRes.value?.data) payments.value = payRes.value.data;
      if (fdbRes.status === 'fulfilled' && fdbRes.value?.data) feedbacks.value = fdbRes.value.data;
      if (custRes.status === 'fulfilled' && custRes.value?.data) {
        customers.value = custRes.value.data;
        mockData.customers = custRes.value.data;
      }
    }
  } catch (err) {
    console.error('API Error', err);
  }
};
// Trigger initial load
setTimeout(loadRealData, 100);

// --- Cars ---
export const fetchCars = async (filters = {}) => {
  await loadRealData();
  let result = [...cars.value];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }
  if (filters.category && filters.category !== 'all') result = result.filter(c => c.category === filters.category);
  if (filters.transmission && filters.transmission !== 'all') result = result.filter(c => c.transmission === filters.transmission);
  if (filters.fuelType && filters.fuelType !== 'all') result = result.filter(c => c.fuelType === filters.fuelType);
  if (filters.availableOnly) result = result.filter(c => c.available);
  if (filters.sort === 'price-asc') result.sort((a, b) => a.pricePerDay - b.pricePerDay);
  else if (filters.sort === 'price-desc') result.sort((a, b) => b.pricePerDay - a.pricePerDay);
  else if (filters.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  else if (filters.sort === 'year') result.sort((a, b) => b.year - a.year);
  return result;
};

export const fetchCarById = async (id) => {
  const res = await api.get('/cars/' + id).catch(()=>null);
  return res ? res.data : null;
};

export const addCar = async (payload) => {
  const res = await api.post('/admin/cars', payload);
  await loadRealData();
  return res.data;
};

export const updateCar = async (id, payload) => {
  const res = await api.put('/admin/cars/' + id, payload);
  await loadRealData();
  return res.data;
};

export const deleteCar = async (id) => {
  await api.delete('/admin/cars/' + id);
  await loadRealData();
  return true;
};

export const toggleCarAvailability = async (id) => {
  const res = await api.put('/admin/cars/' + id + '/toggle');
  await loadRealData();
  return res.data;
};

// --- Bookings ---
export const createBooking = async (payload) => {
  const res = await api.post('/bookings', payload);
  await loadRealData();
  return res.data;
};

// --- Payments ---
export const addPayment = async (payload) => {
  const res = await api.post('/payments', payload);
  await loadRealData();
  return res.data;
};

export const clearPayment = async (id) => {
  await api.put('/payments/' + id, { status: 'paid' });
  await loadRealData();
};

export const flagPayment = async (id) => {
  await api.put('/payments/' + id, { status: 'flagged' });
  await loadRealData();
};

// --- Feedback ---
export const addFeedback = async (payload) => {
  const res = await api.post('/feedback', payload);
  await loadRealData();
  activeBookingPendingFeedback.value = null;
  return res.data;
};

export const updateFeedback = async (id, payload) => {
  const res = await api.put('/feedback/' + id, payload);
  await loadRealData();
  return res.data;
};

export const deleteFeedback = async (id) => {
  await api.delete('/feedback/' + id);
  await loadRealData();
  return true;
};

// --- Customers ---
export const addCustomer = async (payload) => {
  const res = await api.post('/admin/customers', payload);
  await loadRealData();
  return res.data;
};

export const updateCustomer = async (id, payload) => {
  const res = await api.put('/admin/customers/' + id, payload);
  await loadRealData();
  return res.data;
};

export const deleteCustomer = async (id) => {
  await api.delete('/admin/customers/' + id);
  await loadRealData();
  return true;
};

export const updateCurrentUserProfile = async (payload) => {
  const res = await api.put('/profile', payload);
  currentUser.value = { ...currentUser.value, ...res.data };
  localStorage.setItem('user_session', JSON.stringify(currentUser.value));
  await loadRealData();
  return currentUser.value;
};

// --- Computed Analytics ---
export const totalRevenue = computed(() => payments.value.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0));
export const pendingClearancesCount = computed(() => payments.value.filter(p => p.status === 'pending').length);
export const averageRating = computed(() => feedbacks.value.length ? parseFloat((feedbacks.value.reduce((tot, f) => tot + f.stars, 0) / feedbacks.value.length).toFixed(1)) : 0);
export const ratingBreakdown = computed(() => {
  const b = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.value.forEach(f => { if (b[f.stars] !== undefined) b[f.stars]++; });
  return b;
});
export const totalCarsCount = computed(() => cars.value.length);
export const availableCarsCount = computed(() => cars.value.filter(c => c.available).length);
export const totalBookingsCount = computed(() => bookings.value.length);
export const averageCarPrice = computed(() => cars.value.length ? parseFloat((cars.value.reduce((tot, c) => tot + c.pricePerDay, 0) / cars.value.length).toFixed(2)) : 0);
export const categoryBreakdown = computed(() => {
  const b = {};
  cars.value.forEach(c => b[c.category] = (b[c.category] || 0) + 1);
  return b;
});

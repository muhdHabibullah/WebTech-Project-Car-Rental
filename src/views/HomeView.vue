<template>
  <div class="home-page">
    <!-- Hero Section -->
    <header class="home-hero">
      <div class="hero-content">
        <div class="badge-pill mb-3">🚗 Drive Your Dream Today</div>
        <h1 class="hero-title">Premium Cars.<br><span class="text-highlight">Seamless Booking.</span></h1>
        <p class="hero-subtitle">
          Experience the ultimate convenience with DriveEase. Browse hundreds of high-quality vehicles, book instantly, and hit the road with zero hassle.
        </p>
        <div class="hero-actions">
          <router-link to="/cars" class="btn btn-primary btn-lg">
            🚘 Browse Our Fleet
          </router-link>
          <router-link to="/signup" class="btn btn-outline btn-lg">
            Create Account
          </router-link>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">50+</span>
            <span class="stat-lbl">Premium Vehicles</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">10k+</span>
            <span class="stat-lbl">Happy Rentals</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">4.9★</span>
            <span class="stat-lbl">Customer Reviews</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-card">
          <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop" alt="Featured Car" class="visual-img" />
          <div class="visual-badge">
            <span class="badge-icon">⚡</span>
            <div>
              <div class="badge-title">BMW 330i Sport</div>
              <div class="badge-subtitle">RM75.00 / day</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Why Choose Us Section -->
    <section class="section-container">
      <div class="section-header text-center">
        <h2 class="section-title">Why Drive with DriveEase?</h2>
        <p class="section-subtitle">We have re-engineered the car rental experience to be faster, transparent, and completely digital.</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3 class="feature-title">Fully Insured Fleet</h3>
          <p class="feature-text">Drive with total peace of mind. Every vehicle in our inventory includes comprehensive coverage options.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💸</div>
          <h3 class="feature-title">Transparent Pricing</h3>
          <p class="feature-text">No hidden fees, no credit card block deposits. What you see is what you pay, including flexible cancellation.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⏱️</div>
          <h3 class="feature-title">Instant Approvals</h3>
          <p class="feature-text">Skip the counter. Upload documents, process payments, and receive clearance details in minutes.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⛽</div>
          <h3 class="feature-title">Fuel Options</h3>
          <p class="feature-text">Return the car with a full tank or let us handle refuelling at local market rates. You choose.</p>
        </div>
      </div>
    </section>

    <!-- Featured Fleet Section -->
    <section class="section-container" style="background: rgba(255, 255, 255, 0.4); border-radius: var(--radius-lg); padding: 3rem 2rem;">
      <div class="section-header d-flex justify-content-between align-items-end">
        <div>
          <h2 class="section-title">Featured Fleet</h2>
          <p class="section-subtitle">Hand-picked vehicles for business, luxury, or weekend getaways.</p>
        </div>
        <router-link to="/cars" class="btn btn-outline">
          View All Fleet &rarr;
        </router-link>
      </div>

      <!-- Car Grid -->
      <div v-if="isLoading" class="car-grid">
        <div v-for="n in 3" :key="n" class="skeleton skeleton-card"></div>
      </div>
      <div v-else-if="featuredCars.length > 0" class="car-grid">
        <div
          v-for="car in featuredCars"
          :key="car.id"
          class="car-card"
          @click="goToDetail(car.id)"
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
            </div>
            <div class="car-card-footer">
              <div class="price-tag">RM{{ car.pricePerDay.toFixed(2) }} <span>/day</span></div>
              <span class="badge badge-success" v-if="car.available">Available</span>
              <span class="badge badge-danger" v-else>Rented</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section-container">
      <div class="section-header text-center">
        <h2 class="section-title">What Our Drivers Say</h2>
        <p class="section-subtitle">Real feedback from actual bookings processed through our secure dashboard system.</p>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"The Tesla Model 3 was absolutely clean and fully charged! The pick-up and drop-off process was extremely smooth. Will definitely rent again!"</p>
          <div class="author">
            <div class="author-avatar">SJ</div>
            <div>
              <div class="author-name">Sarah Jenkins</div>
              <div class="author-meta">Verified Driver</div>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"Great service. The vehicle (BMW 3 Series) performed flawlessly. Only issue was a small scratch on the door which was already documented. Clear invoicing!"</p>
          <div class="author">
            <div class="author-avatar">DV</div>
            <div>
              <div class="author-name">David Vance</div>
              <div class="author-meta">Verified Driver</div>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="quote">"Amazing pricing compared to the counter rates at the airport. Instantly paid via Mobile Wallet, administrative clearance was approved in under 10 minutes!"</p>
          <div class="author">
            <div class="author-avatar">MJ</div>
            <div>
              <div class="author-name">Mike Johnson</div>
              <div class="author-meta">Verified Driver</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner">
      <div class="cta-content">
        <h2 class="cta-title">Ready to hit the road?</h2>
        <p class="cta-text">Sign up today and get your vehicle approved for rental in less than 15 minutes.</p>
        <div class="cta-buttons">
          <router-link to="/signup" class="btn btn-white btn-lg">Get Started</router-link>
          <router-link to="/login" class="btn btn-outline-white btn-lg">Sign In</router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="footer-grid">
        <div>
          <div class="logo-container mb-3" style="color: var(--white);">
            <div class="logo-icon">🚗</div>
            <span>DriveEase</span>
          </div>
          <p style="color: var(--text-light); font-size: 0.85rem;">Providing high-fidelity, premium car rentals powered by secure JWT clearances and automated web technologies.</p>
        </div>
        <div>
          <h4 class="footer-title">Fleet Categories</h4>
          <ul class="footer-links">
            <li><router-link to="/cars?category=Sedan">Premium Sedans</router-link></li>
            <li><router-link to="/cars?category=SUV">Family SUVs</router-link></li>
            <li><router-link to="/cars?category=Sports">Sport Coupes</router-link></li>
            <li><router-link to="/cars?category=Electric">Electric Vehicles</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-title">Support & Safety</h4>
          <ul class="footer-links">
            <li><a href="#">Roadside Assistance</a></li>
            <li><a href="#">Rental Agreement</a></li>
            <li><a href="#">Insurance Terms</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 DriveEase Car Rental Systems. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/axios';

const router = useRouter();
const featuredCars = ref([]);
const isLoading = ref(true);

const loadFeaturedCars = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/cars', { params: { availableOnly: true } });
    const list = res.data || [];
    // Take first 3 cars as featured
    featuredCars.value = list.slice(0, 3);
  } catch (error) {
    console.error('Failed to load featured cars:', error);
  } finally {
    isLoading.value = false;
  }
};

const goToDetail = (carId) => {
  router.push({ name: 'CarDetail', params: { id: carId } });
};

onMounted(() => {
  loadFeaturedCars();
});
</script>

<style scoped>
.home-page {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Hero section spacing & layout */
.home-hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 4rem 0;
  min-height: calc(100vh - 80px);
}

@media (max-width: 991px) {
  .home-hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 0;
  }
}

.badge-pill {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(37, 99, 235, 0.15);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.15;
  color: var(--text-main);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.text-highlight {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

@media (max-width: 991px) {
  .hero-actions {
    justify-content: center;
  }
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

@media (max-width: 991px) {
  .hero-stats {
    justify-content: center;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-dark);
}

.stat-lbl {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  background: var(--border-color);
  align-self: stretch;
}

/* Visual Card Styles */
.hero-visual {
  display: flex;
  justify-content: center;
}

.visual-card {
  position: relative;
  background: var(--white);
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  max-width: 450px;
  width: 100%;
}

.visual-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.visual-badge {
  position: absolute;
  bottom: 2rem;
  left: -1rem;
  background: var(--white);
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-icon {
  font-size: 1.5rem;
  background: var(--primary-light);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main);
}

.badge-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Section styling */
.section-container {
  padding: 5rem 0;
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--text-muted);
  max-width: 600px;
}

.text-center .section-subtitle {
  margin: 0 auto;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  padding: 2.5rem 2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.25rem;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.75rem;
}

.feature-text {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Testimonials Grid */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stars {
  margin-bottom: 1rem;
}

.quote {
  font-size: 0.95rem;
  font-style: italic;
  color: var(--text-main);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  background: var(--primary-light);
  color: var(--primary-dark);
  font-weight: 800;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.author-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main);
}

.author-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* CTA Banner */
.cta-banner {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: var(--radius-lg);
  padding: 4rem 2rem;
  margin: 4rem 0;
  text-align: center;
  color: var(--white);
  box-shadow: var(--shadow-lg);
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-text {
  max-width: 600px;
  margin: 0 auto 2.5rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-white {
  background: var(--white);
  color: var(--primary-dark);
}

.btn-white:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.btn-outline-white {
  background: transparent;
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.btn-outline-white:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Footer styling */
.home-footer {
  background: var(--text-main);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: 4rem 3rem 2rem;
  color: var(--white);
  margin-top: 5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--white);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--white);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  text-align: center;
  color: var(--text-light);
  font-size: 0.8rem;
}
</style>

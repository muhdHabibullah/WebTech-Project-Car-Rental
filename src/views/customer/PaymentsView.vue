<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">My Payments</h1>
        <p class="page-subtitle">Track your rental charges, view digital invoices, or submit a new payment reference.</p>
      </div>
    </div>

    <!-- Main Dynamic Grid Layout -->
    <div class="view-grid-two-cols">
      <!-- Left Column: Payment Ledger & Receipt History -->
      <div>
        <div class="card" style="padding: 1.5rem; margin-bottom: 2rem;">
          <h3 class="card-title">Rental Charges Ledger</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pay in payments" :key="pay.id">
                  <td style="font-weight: 700;">{{ pay.id }}</td>
                  <td>{{ pay.bookingId }}</td>
                  <td>{{ pay.date }}</td>
                  <td>{{ pay.method }}</td>
                  <td style="font-weight: 600; color: var(--primary-dark);">RM{{ pay.amount.toFixed(2) }}</td>
                  <td>
                    <span class="badge" :class="`badge-${pay.status}`">
                      {{ pay.status }}
                    </span>
                  </td>
                  <td>
                    <button 
                      v-if="pay.status === 'pending' && (pay.method === 'Pending' || !pay.method)"
                      @click="startPayNow(pay)" 
                      class="btn btn-primary btn-sm"
                    >
                      Pay Now
                    </button>
                    <button 
                      v-else
                      @click="viewReceipt(pay)" 
                      class="btn btn-outline btn-sm"
                      :disabled="pay.status !== 'paid'"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Payment Form (Slide In or Toggled) -->
      <div v-if="showForm || true" style="transition: all 0.3s ease;">
        <div class="card" :class="{ 'shake': formHasError }">
          <h3 class="card-title">{{ editingPayment ? 'Complete Payment' : 'Submit Rental Payment' }}</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
            Provide your payment proof details here. Once submitted, our administrator will verify the clearance.
          </p>

          <form @submit.prevent="submitForm">
            <!-- Booking ID Input -->
            <div class="form-group">
              <label class="form-label" for="booking-id">Booking ID Reference</label>
              <input 
                type="text" 
                id="booking-id" 
                v-model="form.bookingId" 
                @blur="v.bookingId.$touch()"
                class="form-control" 
                :class="{ 
                  'is-valid': formDirty.bookingId && !formErrors.bookingId, 
                  'is-invalid': formDirty.bookingId && formErrors.bookingId 
                }"
                placeholder="e.g. BKG-7492" 
                :disabled="!!editingPayment"
              />
              <span v-if="formDirty.bookingId && formErrors.bookingId" class="invalid-feedback">
                Booking ID is required and must follow 'BKG-XXXX' format.
              </span>
            </div>

            <!-- Amount Input -->
            <div class="form-group">
              <label class="form-label" for="amount">Payment Amount (RM)</label>
              <input 
                type="text" 
                id="amount" 
                v-model="form.amount" 
                @blur="v.amount.$touch()"
                class="form-control" 
                :class="{ 
                  'is-valid': formDirty.amount && !formErrors.amount, 
                  'is-invalid': formDirty.amount && formErrors.amount 
                }"
                placeholder="e.g. 150.50" 
                :disabled="!!editingPayment"
              />
              <span v-if="formDirty.amount && formErrors.amount" class="invalid-feedback">
                Please enter a valid numeric decimal amount (e.g. 150 or 150.50).
              </span>
            </div>

            <!-- Payment Method Dropdown -->
            <div class="form-group">
              <label class="form-label" for="payment-method">Payment Method</label>
              <select 
                id="payment-method" 
                v-model="form.method" 
                @change="v.method.$touch()"
                class="form-control" 
                :class="{ 
                  'is-valid': formDirty.method && !formErrors.method, 
                  'is-invalid': formDirty.method && formErrors.method 
                }"
              >
                <option value="">-- Select Payment Option --</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Wallet">Mobile Wallet</option>
              </select>
              <span v-if="formDirty.method && formErrors.method" class="invalid-feedback">
                Please choose a payment method.
              </span>
            </div>

            <!-- Card/Reference Details -->
            <div class="form-group">
              <label class="form-label" for="ref-details">Card Number / Bank Reference Details</label>
              <textarea 
                id="ref-details" 
                v-model="form.details" 
                @blur="v.details.$touch()"
                rows="3"
                class="form-control" 
                :class="{ 
                  'is-valid': formDirty.details && !formErrors.details, 
                  'is-invalid': formDirty.details && formErrors.details 
                }"
                placeholder="e.g. Visa ending 4242 or Transaction Reference #991203"
              ></textarea>
              <span v-if="formDirty.details && formErrors.details" class="invalid-feedback">
                Card or reference details are required for authorization verification.
              </span>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <button 
                type="submit" 
                class="btn btn-primary" 
                style="flex-grow: 1;"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Processing Transaction...</span>
                <span v-else>{{ editingPayment ? 'Confirm Payment' : 'Pay Now' }}</span>
              </button>
              <button type="button" @click="resetForm" class="btn btn-outline">
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Receipt / Invoice Modal Window -->
    <div v-if="activeReceipt" class="modal-overlay" @click.self="activeReceipt = null">
      <div class="modal-content">
        <button class="modal-close" @click="activeReceipt = null">&times;</button>
        
        <div class="receipt-header">
          <div class="receipt-title">BLUEDRIVE RENTALS INC.</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
            100 Innovation Way, Suite A, Silicon Valley
          </div>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--status-success); margin-top: 0.5rem; letter-spacing: 0.05em;">
            ★★ OFFICIAL RECEIPT ★★
          </div>
        </div>

        <div class="receipt-row">
          <span class="receipt-label">Invoice Number</span>
          <span class="receipt-value" style="font-family: monospace;">INV-{{ activeReceipt.id }}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Date of Payment</span>
          <span class="receipt-value">{{ activeReceipt.date }}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Booking Reference</span>
          <span class="receipt-value" style="font-family: monospace;">{{ activeReceipt.bookingId }}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Method Authorized</span>
          <span class="receipt-value">{{ activeReceipt.method }}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Verification Details</span>
          <span class="receipt-value" style="font-size: 0.8rem; font-style: italic;">{{ activeReceipt.details }}</span>
        </div>

        <div class="receipt-total">
          <span>TOTAL AMOUNT PAID</span>
          <span>RM{{ activeReceipt.amount.toFixed(2) }}</span>
        </div>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px dotted var(--border-color); padding-top: 1rem;">
          Thank you for driving with BlueDrive. Have a safe journey!
        </div>
      </div>
    </div>

    <!-- Reactive Toast Notification -->
    <div class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast-${toast.type}`">
        <span>{{ toast.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '../../utils/axios';

const showForm = ref(true);
const isSubmitting = ref(false);
const formHasError = ref(false);
const activeReceipt = ref(null);
const editingPayment = ref(null);
const toasts = ref([]);
const payments = ref([]);

const form = reactive({
  bookingId: '',
  amount: '',
  method: '',
  details: ''
});

// Simple immediate client-side validation logic
const formErrors = reactive({
  bookingId: false,
  amount: false,
  method: false,
  details: false
});

const formDirty = reactive({
  bookingId: false,
  amount: false,
  method: false,
  details: false
});

// Validation rules
const v = {
  bookingId: {
    $dirty: computed(() => formDirty.bookingId),
    $error: computed(() => formErrors.bookingId),
    $touch: () => {
      formDirty.bookingId = true;
      const bkgRegex = /^BKG-\d{4}$/;
      formErrors.bookingId = !form.bookingId || !bkgRegex.test(form.bookingId.trim());
    }
  },
  amount: {
    $dirty: computed(() => formDirty.amount),
    $error: computed(() => formErrors.amount),
    $touch: () => {
      formDirty.amount = true;
      const amtRegex = /^\d+(\.\d{1,2})?$/;
      const val = parseFloat(form.amount);
      formErrors.amount = !form.amount || !amtRegex.test(form.amount) || isNaN(val) || val <= 0;
    }
  },
  method: {
    $dirty: computed(() => formDirty.method),
    $error: computed(() => formErrors.method),
    $touch: () => {
      formDirty.method = true;
      formErrors.method = !form.method;
    }
  },
  details: {
    $dirty: computed(() => formDirty.details),
    $error: computed(() => formErrors.details),
    $touch: () => {
      formDirty.details = true;
      formErrors.details = !form.details || form.details.trim().length < 5;
    }
  }
};

const isFormValid = computed(() => {
  return formDirty.bookingId && !formErrors.bookingId &&
         formDirty.amount && !formErrors.amount &&
         formDirty.method && !formErrors.method &&
         formDirty.details && !formErrors.details;
});

// Load payments
const loadPayments = async () => {
  try {
    const res = await api.get('/payments');
    payments.value = res.data || [];
  } catch (error) {
    console.error('Failed to load payments:', error);
  }
};

// View Receipt Modal
const viewReceipt = (pay) => {
  activeReceipt.value = pay;
};

// Reset Form
const resetForm = () => {
  form.bookingId = '';
  form.amount = '';
  form.method = '';
  form.details = '';
  editingPayment.value = null;
  
  Object.keys(formDirty).forEach(k => formDirty[k] = false);
  Object.keys(formErrors).forEach(k => formErrors[k] = false);
};

// Pre-fill form for pending payment
const startPayNow = (pay) => {
  editingPayment.value = pay;
  form.bookingId = pay.bookingId;
  form.amount = pay.amount.toFixed(2);
  form.method = '';
  form.details = '';
  showForm.value = true;
  
  // Reset dirty/errors so user can fill method and details
  Object.keys(formDirty).forEach(k => formDirty[k] = false);
  Object.keys(formErrors).forEach(k => formErrors[k] = false);
  // Pre-validate bookingId and amount since they're already filled
  formDirty.bookingId = true;
  formErrors.bookingId = false;
  formDirty.amount = true;
  formErrors.amount = false;
};

// Submitting transaction
const submitForm = async () => {
  Object.keys(v).forEach(k => v[k].$touch());

  if (formErrors.bookingId || formErrors.amount || formErrors.method || formErrors.details) {
    triggerFormShake();
    addToast('Please correct the validation errors first.', 'danger');
    return;
  }

  isSubmitting.value = true;
  
  try {
    if (editingPayment.value) {
      // Update existing pending payment with method and details
      const payload = {
        method: form.method,
        details: form.details.trim()
      };
      await api.put(`/payments/${editingPayment.value.id}`, payload);
      addToast(`Payment ${editingPayment.value.id} submitted successfully! Awaiting admin verification.`, 'success');
    } else {
      // Create a brand new payment
      const payload = {
        bookingId: form.bookingId.trim(),
        amount: parseFloat(form.amount),
        method: form.method,
        details: form.details.trim()
      };
      const response = await api.post('/payments', payload);
      addToast(`Payment of RM${response.data.amount.toFixed(2)} submitted successfully! ID: ${response.data.id}`, 'success');
    }
    resetForm();
    await loadPayments();
  } catch (error) {
    triggerFormShake();
    const errMsg = error.response?.data?.message || 'API Connection Error. Transaction suspended.';
    addToast(errMsg, 'danger');
  } finally {
    isSubmitting.value = false;
  }
};

const triggerFormShake = () => {
  formHasError.value = true;
  setTimeout(() => {
    formHasError.value = false;
  }, 450);
};

const addToast = (text, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, text, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
};

onMounted(() => {
  loadPayments();
});
</script>

// Order Tracking Functionality
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById("trackOrderForm");
  const resultDiv = document.getElementById("orderResult");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const orderIdInput = document.getElementById("orderId");

  // API endpoint URL - adjust this if your XAMPP is on a different port
  const API_URL = 'http://localhost/Helana%20Printers%20(Pvt)%20Ltd/api/get_order.php';

  // Form submission handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const orderId = orderIdInput.value.trim();

    if (!validateOrderId(orderId)) {
      showError("Please enter a valid order reference like HEL123456789");
      return;
    }

    trackOrder(orderId);
  });

  // Validate order ID format
  function validateOrderId(orderId) {
    return /^HEL\d{9}$/.test(orderId);
  }

  // Show error message
  function showError(message) {
    alert(message);
    orderIdInput.focus();
  }

  // Track order function - now using real API
  function trackOrder(orderId) {
    // Show loading spinner
    loadingSpinner.style.display = "block";
    resultDiv.style.display = "none";

    // Make API call to fetch order details
    fetch(`${API_URL}?order_ref=${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        loadingSpinner.style.display = "none";

        if (data.success) {
          displayOrderDetails(data.order);
        } else {
          displayOrderNotFound(orderId, data.error);
        }

        resultDiv.style.display = "block";
      })
      .catch(error => {
        loadingSpinner.style.display = "none";
        console.error('Error fetching order:', error);
        displayError('Failed to connect to the server. Please make sure XAMPP is running and try again.');
        resultDiv.style.display = "block";
      });
  }

  // Display order details from API response
  function displayOrderDetails(order) {
    // Format the order date
    const orderDate = new Date(order.order_date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Format estimated completion date if available
    let estimatedCompletion = 'Not specified';
    if (order.estimated_completion) {
      const estDate = new Date(order.estimated_completion);
      estimatedCompletion = estDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    resultDiv.className = "order-result card p-4 mt-4 shadow-sm";
    resultDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0"><i class="bi bi-receipt-cutoff text-primary"></i> Order Details</h5>
        <span class="badge bg-light text-dark border">${order.order_ref}</span>
      </div>
      
      <div class="order-details-grid">
        <div class="detail-item">
          <i class="bi bi-person-circle"></i>
          <div class="detail-label">Client Name</div>
          <div class="detail-value">${order.customer_name}</div>
        </div>
        <div class="detail-item">
          <i class="bi bi-telephone"></i>
          <div class="detail-label">Contact</div>
          <div class="detail-value">${order.customer_phone || 'Not provided'}</div>
        </div>
        ${order.customer_email ? `
        <div class="detail-item">
          <i class="bi bi-envelope"></i>
          <div class="detail-label">Email</div>
          <div class="detail-value">${order.customer_email}</div>
        </div>
        ` : ''}
        <div class="detail-item">
          <i class="bi bi-briefcase"></i>
          <div class="detail-label">Order Description</div>
          <div class="detail-value">${order.order_description}</div>
        </div>
        <div class="detail-item">
          <i class="bi bi-calendar-event"></i>
          <div class="detail-label">Order Date</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-item">
          <i class="bi bi-calendar-check"></i>
          <div class="detail-label">Estimated Completion</div>
          <div class="detail-value">${estimatedCompletion}</div>
        </div>
      </div>
      
      <div class="order-status mt-4 p-3 bg-light rounded">
        <div class="d-flex align-items-center mb-2">
          <i class="${order.status.icon} ${order.status.color} fs-4"></i>
          <h6 class="mb-0 ms-2">Current Status</h6>
        </div>
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <span class="status-badge ${order.status.badge}">${order.status.text}</span>
            <p class="text-muted mt-2 mb-0">${order.status.description}</p>
          </div>
          <div class="mt-2 mt-md-0">
            <small class="text-muted">Last updated: ${new Date().toLocaleTimeString()}</small>
          </div>
        </div>
      </div>
      
      ${order.notes ? `
      <div class="mt-4 p-3 bg-info bg-opacity-10 rounded border border-info">
        <p class="mb-0">
          <i class="bi bi-sticky me-2 text-info"></i>
          <strong>Notes:</strong> ${order.notes}
        </p>
      </div>
      ` : ''}
      
      <div class="mt-4 p-3 bg-light rounded">
        <p class="text-muted mb-0">
          <i class="bi bi-info-circle me-2"></i>
          If you have any questions about your order, please contact us at 
          <strong>0711414103</strong> or visit our premises.
        </p>
      </div>
    `;
  }

  // Display order not found
  function displayOrderNotFound(orderId, errorMessage = '') {
    resultDiv.className = "order-result card p-4 mt-4 shadow-sm";
    resultDiv.innerHTML = `
      <div class="order-not-found text-center">
        <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
        <h5>Order Not Found</h5>
        <p>We couldn't find an order with reference number <strong class="text-dark">${orderId}</strong>.</p>
        <p class="text-muted">Please check the number and try again, or contact us if you believe this is an error.</p>
        ${errorMessage ? `<p class="text-danger small">${errorMessage}</p>` : ''}
        <button class="btn btn-outline-primary mt-3" id="retryButton">
          <i class="bi bi-arrow-repeat me-2"></i>Try Again
        </button>
      </div>
    `;

    // Add event listener to the button after it's rendered
    const retryButton = document.getElementById('retryButton');
    retryButton.addEventListener('click', function () {
      orderIdInput.value = '';
      orderIdInput.focus();
      resultDiv.style.display = 'none';
    });
  }

  // Display general error
  function displayError(message) {
    resultDiv.className = "order-result card p-4 mt-4 shadow-sm";
    resultDiv.innerHTML = `
      <div class="order-not-found text-center">
        <i class="bi bi-exclamation-circle fs-1 text-danger mb-3"></i>
        <h5>Connection Error</h5>
        <p class="text-muted">${message}</p>
        <button class="btn btn-outline-primary mt-3" id="retryButton">
          <i class="bi bi-arrow-repeat me-2"></i>Try Again
        </button>
      </div>
    `;

    const retryButton = document.getElementById('retryButton');
    retryButton.addEventListener('click', function () {
      orderIdInput.value = '';
      orderIdInput.focus();
      resultDiv.style.display = 'none';
    });
  }

  // Add input formatting for better UX
  orderIdInput.addEventListener('input', function (e) {
    let value = e.target.value.toUpperCase();
    e.target.value = value;
  });
});
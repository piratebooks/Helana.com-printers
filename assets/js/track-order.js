// Order Tracking Functionality
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById("trackOrderForm");
  const resultDiv = document.getElementById("orderResult");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const orderIdInput = document.getElementById("orderId");

  // Sample data for demonstration
  const sampleTypes = [
    "Book Order", "Book Order + Binding", "Hard Binding", "Plan Print", "Graphic Design",
    "Mug Print", "UV - Keytag", "UV - Bottle", "UV - Pen", "UV - Tile", "UV - Plain Glass",
    "Screen Printing", "Typesetting"
  ];

  const statuses = [
    { 
      text: "Processing", 
      icon: "bi bi-gear", 
      color: "text-secondary",
      badge: "status-processing",
      description: "Est. completion time: 3 hours"
    },
    { 
      text: "Finalising", 
      icon: "bi bi-hourglass-split", 
      color: "text-warning",
      badge: "status-finalising",
      description: "Quality check in progress"
    },
    { 
      text: "Ready for Collection", 
      icon: "bi bi-box-seam", 
      color: "text-success",
      badge: "status-ready",
      description: "Please come to premises to collect"
    },
    { 
      text: "Out for Delivery", 
      icon: "bi bi-truck", 
      color: "text-primary",
      badge: "status-shipped",
      description: "Sent to delivery service"
    }
  ];

  const fakeClients = [
    { name: "R. Perera", phone: "0712345678" },
    { name: "S. Fernando", phone: "0776543210" },
    { name: "A. Kumar", phone: "0751234567" },
    { name: "N. Silva", phone: "0729876543" },
    { name: "D. Rajapaksha", phone: "0765432198" }
  ];

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

  // Track order function
  function trackOrder(orderId) {
    // Show loading spinner
    loadingSpinner.style.display = "block";
    resultDiv.style.display = "none";

    // Simulate API call delay
    setTimeout(() => {
      loadingSpinner.style.display = "none";
      
      // Randomly decide if order is found (90% chance) or not (10% chance)
      if (Math.random() > 0.1) {
        displayOrderDetails(orderId);
      } else {
        displayOrderNotFound(orderId);
      }
      
      resultDiv.style.display = "block";
      //resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1500);
  }

  // Display order details
  function displayOrderDetails(orderId) {
    const randomClient = fakeClients[Math.floor(Math.random() * fakeClients.length)];
    const randomType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 7));

    resultDiv.className = "order-result card p-4 mt-4 shadow-sm";
    resultDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0"><i class="bi bi-receipt-cutoff text-primary"></i> Order Details</h5>
        <span class="badge bg-light text-dark border">${orderId}</span>
      </div>
      
      <div class="order-details-grid">
        <div class="detail-item">
          <i class="bi bi-person-circle"></i>
          <div class="detail-label">Client Name</div>
          <div class="detail-value">${randomClient.name}</div>
        </div>
        <div class="detail-item">
          <i class="bi bi-telephone"></i>
          <div class="detail-label">Contact</div>
          <div class="detail-value">${randomClient.phone}</div>
        </div>
        <div class="detail-item">
          <i class="bi bi-briefcase"></i>
          <div class="detail-label">Order Type</div>
          <div class="detail-value">${randomType}</div>
        </div>
        <div class="detail-item">
          <i class="bi bi-calendar-event"></i>
          <div class="detail-label">Order Date</div>
          <div class="detail-value">${orderDate.toLocaleDateString()}</div>
        </div>
      </div>
      
      <div class="order-status mt-4 p-3 bg-light rounded">
        <div class="d-flex align-items-center mb-2">
          <i class="${randomStatus.icon} ${randomStatus.color} fs-4"></i>
          <h6 class="mb-0 ms-2">Current Status</h6>
        </div>
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <span class="status-badge ${randomStatus.badge}">${randomStatus.text}</span>
            <p class="text-muted mt-2 mb-0">${randomStatus.description}</p>
          </div>
          <div class="mt-2 mt-md-0">
            <small class="text-muted">Last updated: ${new Date().toLocaleTimeString()}</small>
          </div>
        </div>
      </div>
      
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
 // Display order not found
function displayOrderNotFound(orderId) {
  resultDiv.className = "order-result card p-4 mt-4 shadow-sm";
  resultDiv.innerHTML = `
    <div class="order-not-found text-center">
      <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
      <h5>Order Not Found</h5>
      <p>We couldn't find an order with reference number <strong class="text-dark">${orderId}</strong>.</p>
      <p class="text-muted">Please check the number and try again, or contact us if you believe this is an error.</p>
      <button class="btn btn-outline-primary mt-3" id="retryButton">
        <i class="bi bi-arrow-repeat me-2"></i>Try Again
      </button>
    </div>
  `;

  // Add event listener to the button after it's rendered
  const retryButton = document.getElementById('retryButton');
  retryButton.addEventListener('click', function() {
    orderIdInput.value = '';
    orderIdInput.focus();
    resultDiv.style.display = 'none'; // hide previous result
  });
}


  // Add input formatting for better UX
  orderIdInput.addEventListener('input', function(e) {
    let value = e.target.value.toUpperCase();
    e.target.value = value;
  });
});
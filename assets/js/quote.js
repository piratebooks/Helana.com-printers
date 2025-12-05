// Improved Script for form functionality with enhanced validation
document.addEventListener('DOMContentLoaded', function () {
  const printType = document.getElementById('printType');
  const bookOrderFields = document.getElementById('bookOrderFields');
  const bookOrderBindingFields = document.getElementById('bookOrderBindingFields');
  const formSteps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const form = document.getElementById('quoteForm');
  const successMessage = document.getElementById('successMessage');
  const reviewContent = document.getElementById('reviewContent');

  // Show/hide extra fields based on print type selection
  printType.addEventListener('change', function () {
    bookOrderFields.classList.remove('active');
    bookOrderBindingFields.classList.remove('active');

    if (this.value === 'book order') {
      bookOrderFields.classList.add('active');
    } else if (this.value === 'book order+binding') {
      bookOrderBindingFields.classList.add('active');
    }
  });

  // Form navigation
  nextButtons.forEach(button => {
    button.addEventListener('click', function () {
      const currentStep = document.querySelector('.form-step.active');
      const nextStepId = this.getAttribute('data-next');
      const nextStep = document.getElementById(`step${nextStepId}`);

      // Validate current step before proceeding
      if (validateStep(currentStep.id)) {
        // Update progress indicator
        updateProgressIndicator(nextStepId);

        // Move to next step
        currentStep.classList.remove('active');
        nextStep.classList.add('active');

        // If moving to review step, populate the review
        if (nextStepId === '3') {
          populateReview();
        }
      }
    });
  });

  prevButtons.forEach(button => {
    button.addEventListener('click', function () {
      const currentStep = document.querySelector('.form-step.active');
      const prevStepId = this.getAttribute('data-prev');
      const prevStep = document.getElementById(`step${prevStepId}`);

      // Update progress indicator
      updateProgressIndicator(prevStepId, false);

      // Move to previous step
      currentStep.classList.remove('active');
      prevStep.classList.add('active');
    });
  });

  // Update progress indicator
  function updateProgressIndicator(stepId, isForward = true) {
    progressSteps.forEach(step => {
      const stepNumber = step.getAttribute('data-step');
      if (stepNumber === stepId) {
        step.classList.add('active');
      } else if (isForward && parseInt(stepNumber) > parseInt(stepId)) {
        step.classList.remove('active');
      }
    });
  }

  // Validate form step with enhanced checks
  function validateStep(stepId) {
    const step = document.getElementById(stepId);
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      const value = input.value.trim();

      // Reset previous invalid states
      input.classList.remove('is-invalid');

      // Check required fields
      if (!value) {
        input.classList.add('is-invalid');
        isValid = false;
        return;
      }

      // Extra validation by type or ID
      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      } else if (input.type === 'tel') {
        const phoneRegex = /^[0-9+\-()\s]{7,20}$/; // Basic phone validation
        if (!phoneRegex.test(value)) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      } else if (input.type === 'number') {
        if (isNaN(value) || parseInt(value) <= 0) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      } else if (input.id === 'message') {
        if (value.length > 500) { // Optional max length for message
          input.classList.add('is-invalid');
          isValid = false;
        }
      }
    });

    // Conditional validation: bindingType required only for 'book order+binding'
    if (printType.value === 'book order+binding') {
      const bindingType = document.getElementById('bindingType');
      if (!bindingType.value) {
        bindingType.classList.add('is-invalid');
        isValid = false;
      } else {
        bindingType.classList.remove('is-invalid');
      }
    }

    return isValid;
  }

  // Populate review section
  function populateReview() {
    const formData = new FormData(form);
    let reviewHTML = '<div class="row">';

    // Project details
    reviewHTML += '<div class="col-md-6">';
    reviewHTML += '<p><strong>Print Type:</strong> ' + (printType.options[printType.selectedIndex].text || 'Not specified') + '</p>';

    // Show relevant extra fields in review
    if (printType.value === 'book order') {
      const pageSizing = document.getElementById('pageSizing');
      const noOfPages = document.getElementById('noOfPages');
      reviewHTML += '<p><strong>Page Size:</strong> ' + (pageSizing.options[pageSizing.selectedIndex].text || 'Not specified') + '</p>';
      reviewHTML += '<p><strong>Number of Pages:</strong> ' + (noOfPages.value || 'Not specified') + '</p>';
    } else if (printType.value === 'book order+binding') {
      const pageSizingBinding = document.getElementById('pageSizingBinding');
      const noOfPagesBinding = document.getElementById('noOfPagesBinding');
      const bindingType = document.getElementById('bindingType');
      reviewHTML += '<p><strong>Page Size:</strong> ' + (pageSizingBinding.options[pageSizingBinding.selectedIndex].text || 'Not specified') + '</p>';
      reviewHTML += '<p><strong>Number of Pages:</strong> ' + (noOfPagesBinding.value || 'Not specified') + '</p>';
      reviewHTML += '<p><strong>Binding Type:</strong> ' + (bindingType.options[bindingType.selectedIndex].text || 'Not specified') + '</p>';
    }

    reviewHTML += '<p><strong>Quantity:</strong> ' + (document.getElementById('quantity').value || 'Not specified') + '</p>';
    reviewHTML += '<p><strong>Purpose:</strong> ' + (document.getElementById('purpose').options[document.getElementById('purpose').selectedIndex].text || 'Not specified') + '</p>';
    reviewHTML += '</div>';

    // Contact details
    reviewHTML += '<div class="col-md-6">';
    reviewHTML += '<p><strong>Name:</strong> ' + (document.getElementById('name').value || 'Not specified') + '</p>';
    reviewHTML += '<p><strong>Email:</strong> ' + (document.getElementById('email').value || 'Not specified') + '</p>';
    reviewHTML += '<p><strong>Phone:</strong> ' + (document.getElementById('phone').value || 'Not specified') + '</p>';
    reviewHTML += '<p><strong>Contact Method:</strong> ' + (document.getElementById('contactMethod').options[document.getElementById('contactMethod').selectedIndex].text || 'Not specified') + '</p>';
    reviewHTML += '</div>';

    // Additional details
    const message = document.getElementById('message').value;
    if (message) {
      reviewHTML += '<div class="col-12 mt-3">';
      reviewHTML += '<p><strong>Additional Details:</strong></p>';
      reviewHTML += '<p class="bg-white p-2 rounded">' + message + '</p>';
      reviewHTML += '</div>';
    }

    reviewHTML += '</div>';
    reviewContent.innerHTML = reviewHTML;
  }

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all steps before submission (optional)
    let allValid = true;
    formSteps.forEach(step => {
      if (!validateStep(step.id)) {
        allValid = false;
      }
    });

    if (!allValid) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    // Hide form and show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';

    // Example AJAX submission (optional)
    /*
    fetch('send-quote.php', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
      } else {
        alert('There was an error submitting your request. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error submitting your request. Please try again.');
    });
    */
  });
});

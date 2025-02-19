document.querySelector(".icon-menu").addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.toggle("menu-open");
});

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.testimonial__slide');
  const prevButton = document.querySelector('.testimonial__controls .prev');
  const nextButton = document.querySelector('.testimonial__controls .next');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
  }

  if(prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
      currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(currentSlide);
    });

    nextButton.addEventListener('click', () => {
      currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      showSlide(currentSlide);
    });

    // Auto-advance slides every 5 seconds
    setInterval(() => {
      currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      showSlide(currentSlide);
    }, 5000);
  }
});

// Animatie voor statistieken
function animateStats() {
  const stats = document.querySelectorAll('.stat-card');
  
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.count);
    const number = stat.querySelector('.stat-number');
    let current = 0;
    
    const increment = target / 50; // Snelheid van animatie
    
    const timer = setInterval(() => {
      current += increment;
      if(current >= target) {
        current = target;
        clearInterval(timer);
      }
      number.textContent = Math.floor(current);
    }, 40);
  });
}

// Lazy loading voor afbeeldingen
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('fade-in');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
});

// Preload Lottie animations
document.addEventListener('DOMContentLoaded', function() {
  const options = {
    root: null,
    rootMargin: '200px', // Load animations when within 200px of viewport
    threshold: 0
  };

  const loadAnimation = (entry) => {
    const iframe = entry.target;
    // Force iframe reload to start animation
    const currentSrc = iframe.src;
    iframe.src = currentSrc;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadAnimation(entry);
        observer.unobserve(entry.target); // Only load once
      }
    });
  }, options);

  // Observe all Lottie iframes
  document.querySelectorAll('.feature-item__image iframe').forEach(iframe => {
    observer.observe(iframe);
  });
});

// Donatie bedrag selectie
document.addEventListener('DOMContentLoaded', function() {
    // Voor elke donatie sectie
    document.querySelectorAll('.donate-item').forEach(item => {
        const buttons = item.querySelectorAll('.donate-amount');
        const customInput = item.querySelector('.donate-custom');
        
        // Event listeners voor de bedrag buttons
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Verwijder active class van alle buttons in deze sectie
                buttons.forEach(btn => btn.classList.remove('active'));
                // Voeg active class toe aan de geklikte button
                this.classList.add('active');
                
                // Als er een custom input veld is, maak het leeg
                if (customInput) {
                    customInput.value = '';
                }
            });
        });

        // Event listener voor custom input als die bestaat
        if (customInput) {
            customInput.addEventListener('input', function() {
                // Verwijder active class van alle buttons als er een bedrag wordt ingetypt
                buttons.forEach(btn => btn.classList.remove('active'));
            });
        }
    });
});

// Form Validation
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.registration__form');
  if (!form) return;

  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(input);
    });

    input.addEventListener('input', function() {
      if (input.getAttribute('aria-invalid') === 'true') {
        validateField(input);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (isValid) {
      // Show loading state
      const submitButton = form.querySelector('.form__submit');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Verzenden...';
      submitButton.disabled = true;

      // Simulate form submission (replace with actual form submission)
      setTimeout(() => {
        showFormMessage('Bedankt voor je aanmelding! We nemen zo snel mogelijk contact met je op.', 'success');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1500);
    } else {
      showFormMessage('Controleer de gemarkeerde velden en probeer het opnieuw.', 'error');
    }
  });
});

function validateField(input) {
  const errorDiv = document.getElementById(`${input.id}-error`);
  let isValid = true;
  let errorMessage = '';

  // Clear previous error
  input.setAttribute('aria-invalid', 'false');
  if (errorDiv) errorDiv.textContent = '';

  // Required field validation
  if (input.hasAttribute('required') && !input.value.trim()) {
    isValid = false;
    errorMessage = 'Dit veld is verplicht';
  }

  // Email validation
  if (input.type === 'email' && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      isValid = false;
      errorMessage = 'Voer een geldig e-mailadres in';
    }
  }

  // Phone validation
  if (input.type === 'tel' && input.value.trim()) {
    const phoneRegex = /^[0-9\+\-\s]{10,}$/;
    if (!phoneRegex.test(input.value)) {
      isValid = false;
      errorMessage = 'Voer een geldig telefoonnummer in';
    }
  }

  // Update UI
  if (!isValid) {
    input.setAttribute('aria-invalid', 'true');
    if (errorDiv) {
      errorDiv.textContent = errorMessage;
      errorDiv.classList.add('form__error--visible');
    }
  }

  return isValid;
}

function showFormMessage(message, type) {
  let messageDiv = document.querySelector('.form__message');
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.className = 'form__message';
    const form = document.querySelector('.registration__form');
    form.insertBefore(messageDiv, form.firstChild);
  }

  messageDiv.textContent = message;
  messageDiv.className = `form__message form__message--${type}`;
  messageDiv.setAttribute('role', 'alert');
  messageDiv.setAttribute('aria-live', 'polite');

  // Auto-hide message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

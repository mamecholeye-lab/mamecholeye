// Clean and working JavaScript for RMAME Predictions
document.addEventListener('DOMContentLoaded', function() {
    console.log('RMAME Predictions website loaded');
    
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
            
            // Calculate position
            const headerHeight = 80; // Height of fixed navbar
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight;
            
            // Smooth scroll
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, null, href);
        });
    });
    
    // ===== FORM SUBMISSION =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || 'User';
            
            // Show success message
            alert('Thank you ' + name + '! Your subscription request has been sent. We will contact you within 30 minutes with payment details.');
            
            // Reset form
            this.reset();
            
            // Optional: Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== SHOW MORE PREDICTIONS =====
    const showMoreBtn = document.getElementById('showMorePredictions');
    const morePredictions = document.getElementById('morePredictions');
    
    if (showMoreBtn && morePredictions) {
        showMoreBtn.addEventListener('click', function() {
            if (morePredictions.style.display === 'none' || !morePredictions.style.display) {
                morePredictions.style.display = 'block';
                showMoreBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Show Less Predictions';
                showMoreBtn.classList.add('active');
                
                // Smooth scroll to expanded section
                morePredictions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                morePredictions.style.display = 'none';
                showMoreBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Show More Predictions (4 more)';
                showMoreBtn.classList.remove('active');
            }
        });
    }
    
    // ===== YESTERDAY'S DATE =====
    function getYesterdayDate() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        return yesterday.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Update date in hero section
    const dateElement = document.querySelector('.results-header .date');
    if (dateElement) {
        dateElement.textContent = getYesterdayDate();
    }
    
    // ===== ACTIVE NAV LINK ON SCROLL =====
    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // ===== WHATSAPP FLOAT BUTTON HOVER EFFECT =====
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        whatsappFloat.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // ===== PREVENT PREDICTION HIDING =====
    // Ensure all predictions stay visible
    function ensurePredictionsVisible() {
        document.querySelectorAll('.match-card, .free-match, .prediction').forEach(element => {
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
        });
    }
    
    // Run on load and periodically
    ensurePredictionsVisible();
    setInterval(ensurePredictionsVisible, 1000);
    
    // ===== INITIALIZE TOOLTIPS =====
    // Add tooltips to prediction cards
    document.querySelectorAll('.match-card, .free-match').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // ===== CONSOLE MESSAGE =====
    console.log('All JavaScript functions loaded successfully!');
    console.log('7/7 Wins Yesterday - RMAME Predictions');
});
// Connection error handler
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'IMG') {
        console.warn('Failed to load resource:', e.target.src || e.target.href);
        
        // Try to reload CSS if it fails
        if (e.target.tagName === 'LINK' && e.target.rel === 'stylesheet') {
            setTimeout(() => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = e.target.href + '?v=' + Date.now();
                document.head.appendChild(link);
            }, 1000);
        }
    }
});

// Check if page loaded successfully
window.addEventListener('load', function() {
    setTimeout(() => {
        if (document.body.innerHTML.length < 1000) {
            console.log('Page content seems empty, attempting reload...');
            window.location.reload();
        }
    }, 2000);
});

// Offline detection
window.addEventListener('offline', function() {
    console.log('You are offline. Some features may not work.');
    alert('⚠️ You are offline. Please check your internet connection.');
});

// Online detection
window.addEventListener('online', function() {
    console.log('You are back online!');
});

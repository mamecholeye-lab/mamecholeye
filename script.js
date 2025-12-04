// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Change icon
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Show More Predictions
const showMoreBtn = document.getElementById('showMorePredictions');
const morePredictions = document.getElementById('morePredictions');

if (showMoreBtn && morePredictions) {
    showMoreBtn.addEventListener('click', function() {
        if (morePredictions.style.display === 'none' || morePredictions.style.display === '') {
            morePredictions.style.display = 'block';
            showMoreBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Show Less Predictions';
        } else {
            morePredictions.style.display = 'none';
            showMoreBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Show More Predictions (4 more)';
        }
    });
}

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        
        if (!name || !email) {
            alert('Please fill in all required fields');
            return;
        }
        
        alert(`Thank you ${name}! We will contact you at ${email} within 30 minutes.`);
        
        // Reset form
        this.reset();
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = 60;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile-friendly touch events
document.addEventListener('DOMContentLoaded', function() {
    console.log('RMAME Predictions Mobile Ready!');
    
    // Make buttons easier to tap on mobile
    document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(btn => {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
    });
});

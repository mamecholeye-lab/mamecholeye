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
// ===== AUTO UPDATE DATES =====
function updateDates() {
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format date like "December 3rd, 2024"
    const options = { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    };
    
    let day = yesterday.getDate();
    let suffix = "th";
    
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    
    const formattedDate = yesterday.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }).replace(',', '') + ` ${day}${suffix}, ${yesterday.getFullYear()}`;
    
    // Update ALL date elements on page
    document.querySelectorAll('.date').forEach(element => {
        element.textContent = formattedDate;
    });
    
    console.log('Dates updated to:', formattedDate);
}

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateDates();
    
    // Also update every day at midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - now;
    
    setTimeout(function() {
        updateDates();
        // Update every 24 hours
        setInterval(updateDates, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
});
// ===== LOADING ANIMATION CONTROL =====
window.addEventListener('load', function() {
    // Wait 1 second then hide loader (makes it feel smoother)
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500); // Match CSS transition time
        }
    }, 1000);
});

// Show loader when page starts loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('RMAME Predictions loading...');
    
    // If page takes too long, hide loader anyway
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }, 5000); // Max 5 seconds loading time
});

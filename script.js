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

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== WHATSAPP SHARE FUNCTION =====
function shareOnWhatsApp(type) {
    const websiteUrl = 'https://mamecholeye-lab.github.io/mamecholeye/';
    
    let message = '';
    
    if (type === 'free') {
        message = `🎯 *FREE FOOTBALL PREDICTIONS* 🎯\n\n`;
        message += `RMAME Predictions is giving away 6 FREE premium predictions today!\n\n`;
        message += `🔥 *Today's Free Predictions:*\n`;
        message += `• 14:00 🇧🇬 FC Dobrudzha vs Ludogorets - BTTS @2.06\n`;
        message += `• 15:30 🇹🇷 Igdir vs Orduspor - 1X @1.04\n`;
        message += `• 19:00 🇧🇬 Slavia Sofia vs Levski Sofia - X2 @1.07\n`;
        message += `• 19:00 🇧🇬 Slavia Sofia vs Levski Sofia - BTTS @2.02\n`;
        message += `• 23:15 🇵🇹 Porto vs Vitoria - 1 @1.36\n`;
        message += `• 02:00 🇧🇷 Palmeiras vs Internacional - 1 @1.62\n\n`;
        message += `✅ *Yesterday's Results: 7/7 WINS!*\n`;
        message += `Get more predictions: ${websiteUrl}`;
        
    } else if (type === 'all') {
        message = `⚽ *PROFESSIONAL FOOTBALL PREDICTIONS* ⚽\n\n`;
        message += `RMAME Predictions - 100% Win Rate Yesterday!\n\n`;
        message += `📊 *Yesterday's Perfect Record:* 7/7 WINS\n`;
        message += `🎯 *Today's Top Pick:* Slavia Sofia vs Levski Sofia\n`;
        message += `💰 *Free Predictions Available*\n\n`;
        message += `Join the winning team and get accurate predictions daily!\n`;
        message += `${websiteUrl}`;
    }
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    if (type === 'free') {
        alert('Sharing free predictions on WhatsApp...');
    } else {
        alert('Sharing all predictions on WhatsApp...');
    }
}

// ===== COPY WEBSITE LINK =====
function shareWebsite() {
    const websiteUrl = 'https://mamecholeye-lab.github.io/mamecholeye/';
    
    // Copy to clipboard
    navigator.clipboard.writeText(websiteUrl)
        .then(() => {
            alert('✅ Website link copied to clipboard!\n\nShare: ' + websiteUrl);
        })
        .catch(err => {
            // Fallback for older browsers
            const tempInput = document.createElement('input');
            tempInput.value = websiteUrl;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('✅ Website link copied to clipboard!\n\nShare: ' + websiteUrl);
        });
}

// ===== SUBSCRIPTION FORM WITH WHATSAPP =====
const subscriptionForm = document.getElementById('subscribe');

if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop form from reloading page
        
        // Get all form values
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const phone = this.querySelector('input[type="tel"]').value.trim();
        const packageSelect = this.querySelector('select');
        const package = packageSelect ? packageSelect.value : '';
        const paymentMethod = this.querySelector('input[name="payment"]:checked') ? 
                            this.querySelector('input[name="payment"]:checked').value : '';
        
        // Debug: Show what values we got
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Phone:', phone);
        console.log('Package:', package);
        console.log('Payment Method:', paymentMethod);
        
        // Check if all fields are filled
        if (!name) {
            alert('❌ Please enter your name!');
            this.querySelector('input[type="text"]').focus();
            return;
        }
        
        if (!email) {
            alert('❌ Please enter your email address!');
            this.querySelector('input[type="email"]').focus();
            return;
        }
        
        if (!phone) {
            alert('❌ Please enter your WhatsApp number!');
            this.querySelector('input[type="tel"]').focus();
            return;
        }
        
        if (!package || package === '') {
            alert('❌ Please select a package (Daily, Weekly, or Monthly)!');
            if (packageSelect) packageSelect.focus();
            return;
        }
        
        // Clean phone number (remove spaces, plus sign)
        let cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
        
        // Ensure it starts with country code
        if (!cleanPhone.startsWith('251')) {
            alert('❌ Please enter a valid Ethiopian phone number starting with 251\n\nExample: +251 912 345 678');
            this.querySelector('input[type="tel"]').focus();
            return;
        }
        
        // Set package prices
const prices = {
    'daily': '$0.99 per day',
    'weekly': '$9.99 per week', 
    'monthly': '$19.99 per month'
};
        
        // Create WhatsApp message (automatically formatted)
        const message = `📋 *NEW SUBSCRIPTION REQUEST* 📋%0A%0A` +
                       `*👤 Name:* ${name}%0A` +
                       `*📧 Email:* ${email}%0A` +
                       `*📱 WhatsApp:* ${phone}%0A` +
                       `*💰 Package:* ${package.toUpperCase()} - ${prices[package]}%0A` +
                       `*💳 Payment Method:* ${paymentMethod.toUpperCase()}%0A%0A` +
                       `*📍 Request:* Please send payment details for ${package} package`;
        
        // Your WhatsApp number - CORRECT FORMAT
        const whatsappNumber = '251979380726'; // NO + sign here
        
        // Create WhatsApp link - CORRECT FORMAT
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;
        
        // Show success message
        alert(`✅ Thank you ${name}!\n\nWe will send payment details to your WhatsApp (${phone}) within 5 minutes.\n\nClick OK to open WhatsApp and confirm.`);
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        this.reset();
        
        // Set default payment method
        this.querySelector('#mobile-money').checked = true;
        
        // Reset select to first option
        if (packageSelect) packageSelect.selectedIndex = 0;
    });
            }

// ===== AUTO-FORMAT PHONE NUMBER =====
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        
        // Format as +251 XXX XXX XXX
        if (value.startsWith('251')) {
            value = '+251 ' + value.slice(3);
        }
        
        // Add space after every 3 digits
        if (value.length > 11) {
            value = value.slice(0, 7) + ' ' + value.slice(7, 10);
        }
        if (value.length > 12) {
            value = value.slice(0, 11) + ' ' + value.slice(11, 13);
        }
        
        e.target.value = value;
    });
    
    // Set placeholder example
    phoneInput.placeholder = '+251 912 345 678';
}

// Mobile-friendly touch events
document.addEventListener('DOMContentLoaded', function() {
    console.log('RMAME Predictions Mobile Ready!');
    
    // Make buttons easier to tap on mobile
    document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(btn => {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
    });
    
    // Initialize form
    console.log('Subscription form ready!');
});

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("RMAME Predictions Script Loaded");
    
    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // ===== SHOW MORE PREDICTIONS =====
    const showMoreBtn = document.getElementById('showMorePredictions');
    const morePredictions = document.getElementById('morePredictions');
    
    if (showMoreBtn && morePredictions) {
        showMoreBtn.addEventListener('click', function() {
            if (morePredictions.style.display === 'none' || morePredictions.style.display === '') {
                morePredictions.style.display = 'block';
                showMoreBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Show Less Predictions';
            } else {
                morePredictions.style.display = 'none';
                showMoreBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Show More Predictions (11 more)';
            }
        });
    }
    
    // ===== FORM SUBMISSION =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            
            if (name && email) {
                alert(`Thank you ${name}! We will contact you at ${email} within 30 minutes.`);
                this.reset();
            } else {
                alert('Please fill in all required fields');
            }
        });
    }
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== BACK TO TOP =====
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ===== WHATSAPP SHARE FUNCTIONS =====
    window.shareOnWhatsApp = function(type) {
        const websiteUrl = 'https://mamecholeye-lab.github.io/mamecholeye/';
        let message = '';
        
        if (type === 'free') {
            message = `🎯 *FREE FOOTBALL PREDICTIONS* 🎯\n\n`;
            message += `RMAME Predictions - Get winning tips!\n${websiteUrl}`;
        } else {
            message = `⚽ *PROFESSIONAL FOOTBALL PREDICTIONS* ⚽\n\n`;
            message += `RMAME Predictions - 100% Win Rate!\n${websiteUrl}`;
        }
        
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };
    
    window.shareWebsite = function() {
        const websiteUrl = 'https://mamecholeye-lab.github.io/mamecholeye/';
        
        // Try modern clipboard API first
        if (navigator.clipboard) {
            navigator.clipboard.writeText(websiteUrl)
                .then(() => {
                    alert('✅ Website link copied to clipboard!\n\nShare: ' + websiteUrl);
                })
                .catch(err => {
                    // Fallback for older browsers
                    fallbackCopy(websiteUrl);
                });
        } else {
            // Fallback for older browsers
            fallbackCopy(websiteUrl);
        }
        
        function fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ Website link copied to clipboard!\n\nShare: ' + websiteUrl);
        }
    };
    
    // ===== AUTO UPDATE DATES =====
    function updateDates() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const options = { 
            month: 'long', 
            year: 'numeric' 
        };
        
        let day = yesterday.getDate();
        let suffix = "th";
        
        if (day === 1 || day === 21 || day === 31) suffix = "st";
        else if (day === 2 || day === 22) suffix = "nd";
        else if (day === 3 || day === 23) suffix = "rd";
        
        const monthYear = yesterday.toLocaleDateString('en-US', options);
        const formattedDate = monthYear.replace(',', '') + ` ${day}${suffix}, ${yesterday.getFullYear()}`;
        
        // Update all date elements
        document.querySelectorAll('.date').forEach(element => {
            element.textContent = formattedDate;
        });
        
        console.log('Dates updated to:', formattedDate);
    }
    
    // Update dates on load
    updateDates();
    
    // Update every 24 hours
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - now;
    
    setTimeout(function() {
        updateDates();
        setInterval(updateDates, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
    
    console.log("All JavaScript functions loaded successfully!");
});

// ===== RMAME Predictions - Main JavaScript =====
// Fully compatible with your index.html and style.css
// No CSS conflicts - only adds functionality

console.log('📱 RMAME Predictions Script - Loading...');

// ===== INITIALIZE WEBSITE =====
function initializeWebsite() {
    console.log('🏁 Initializing all website features...');
    
    // Setup all functionality
    setupMobileMenu();
    setupShowMorePredictions();
    setupBackToTop();
    setupWhatsAppSharing();
    setupSubscriptionForm();
    setupSmoothScrolling();
    loadResultsTable();
    setupVisitorCounter();
    hideLoader();
    
    console.log('✅ Website fully initialized');
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// ===== SHOW MORE PREDICTIONS =====
function setupShowMorePredictions() {
    const showMoreBtn = document.getElementById('showMorePredictions');
    const morePredictions = document.getElementById('morePredictions');
    
    if (showMoreBtn && morePredictions) {
        showMoreBtn.addEventListener('click', function() {
            if (morePredictions.style.display === 'none' || morePredictions.style.display === '') {
                morePredictions.style.display = 'block';
                this.innerHTML = '<i class="fas fa-arrow-up"></i> Show Less Predictions';
            } else {
                morePredictions.style.display = 'none';
                this.innerHTML = '<i class="fas fa-arrow-down"></i> Show More Predictions (8 more)';
            }
            
            // Smooth scroll to show/hide
            morePredictions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
}

// ===== BACK TO TOP BUTTON =====
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== LOAD RESULTS TABLE =====
async function loadResultsTable() {
    const resultsTableBody = document.getElementById('results-table-body');
    
    if (!resultsTableBody) return;
    
    try {
        // Try to load from JSON first
        const response = await fetch('results.json?v=' + Date.now());
        
        if (response.ok) {
            const results = await response.json();
            
            // Clear loading message
            resultsTableBody.innerHTML = '';
            
            // Add results to table
            results.forEach(result => {
                const row = document.createElement('div');
                row.className = 'table-row';
                
                // Add appropriate class based on outcome
                if (result.outcome?.toLowerCase() === 'won') {
                    row.classList.add('won');
                } else if (result.outcome?.toLowerCase() === 'lost') {
                    row.classList.add('lost');
                }
                
                row.innerHTML = `
                    <div>${result.fixture || ''}</div>
                    <div>${result.betType || ''}</div>
                    <div>${result.odds || ''}</div>
                    <div>${result.result || ''}</div>
                    <div class="status ${result.outcome?.toLowerCase() || ''}">${result.outcome || ''}</div>
                `;
                
                resultsTableBody.appendChild(row);
            });
            
            console.log('✅ Results loaded from JSON');
        } else {
            throw new Error('JSON file not found');
        }
    } catch (error) {
        console.log('📋 Using hardcoded results (JSON not available)');
        // Fallback to hardcoded results
        resultsTableBody.innerHTML = `
            <div class="table-row won">
                <div>Stevenage 0-1 Cardiff</div>
                <div>1X (Double Chance)</div>
                <div>@1.41</div>
                <div>0-1</div>
                <div class="status lost">Lost</div>
            </div>
            <div class="table-row won">
                <div>Penybont 2-2 Barry Town</div>
                <div>BTTS Yes</div>
                <div>@1.60</div>
                <div>2-2</div>
                <div class="status won">Won</div>
            </div>
            <div class="table-row won">
                <div>Leyton Orient 1-1 Luton</div>
                <div>1X (Double Chance)</div>
                <div>@1.46</div>
                <div>1-1</div>
                <div class="status won">Won</div>
            </div>
            <div class="table-row won">
                <div>Atalanta 2-1 Chelsea</div>
                <div>BTTS Yes</div>
                <div>@1.54</div>
                <div>2-1</div>
                <div class="status won">Won</div>
            </div>
            <div class="table-row won">
                <div>QPR 0-0 Birmingham</div>
                <div>1X (Double Chance)</div>
                <div>@1.46</div>
                <div>0-0</div>
                <div class="status won">Won</div>
            </div>
        `;
    }
}

// ===== WHATSAPP SHARING =====
function setupWhatsAppSharing() {
    // Share Free Predictions
    window.shareOnWhatsApp = function(type) {
        let message = '';
        const url = 'https://mamecholeye-lab.github.io/mamecholeye/';
        
        if (type === 'free') {
            message = `⚽️ FREE FOOTBALL PREDICTIONS ⚽️\n\n`;
            message += `🔥 RMAME Predictions - Today's Top Picks:\n\n`;
            message += `1️⃣ Stevenage v Cardiff\n   Bet: 1X (Double Chance)\n   Odds: @1.41\n\n`;
            message += `2️⃣ Penybont v Barry Town\n   Bet: BTTS Yes\n   Odds: @1.60\n\n`;
            message += `3️⃣ Leyton Orient v Luton\n   Bet: 1X (Double Chance)\n   Odds: @1.46\n\n`;
            message += `🎯 Join our VIP group for all 12 predictions!\n`;
            message += `💰 83.3% Win Rate Yesterday\n`;
            message += `💵 163.9 Total Odds Potential\n\n`;
            message += `👉 Get Premium Predictions: ${url}`;
        } else {
            message = `⚽️ RMAME PREDICTIONS ⚽️\n\n`;
            message += `✅ Professional Football Betting Tips\n`;
            message += `✅ 83.3% Win Rate\n`;
            message += `✅ 10/12 Wins Yesterday\n`;
            message += `✅ 163.9 Total Odds Accumulator\n`;
            message += `✅ Daily Premium Predictions\n\n`;
            message += `🎯 Join the winning team today!\n`;
            message += `👉 Visit: ${url}`;
        }
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    // Share Website Link
    window.shareWebsite = function() {
        const url = 'https://mamecholeye-lab.github.io/mamecholeye/';
        
        // Try clipboard API first
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    showNotification('✅ Website link copied to clipboard!');
                })
                .catch(err => {
                    fallbackCopy(url);
                });
        } else {
            fallbackCopy(url);
        }
        
        function fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showNotification('✅ Link copied!');
            } catch (err) {
                showNotification('❌ Failed to copy link');
            }
            
            document.body.removeChild(textArea);
        }
    };
}

// ===== SUBSCRIPTION FORM =====
function setupSubscriptionForm() {
    const form = document.getElementById('subscribe');
    
    if (form) {
        // Phone number formatting
        const phoneInput = document.getElementById('phoneInput');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                // Format for Ethiopian numbers
                if (value.startsWith('251')) {
                    value = '+251' + value.substring(3);
                } else if (value.startsWith('0')) {
                    value = '+251' + value.substring(1);
                }
                
                // Limit to +251 followed by 9 digits
                if (value.length > 13) {
                    value = value.substring(0, 13);
                }
                
                e.target.value = value;
                
                // Validate
                const pattern = /^\+251[0-9]{9}$/;
                if (pattern.test(value)) {
                    e.target.classList.remove('invalid');
                    e.target.classList.add('valid');
                } else {
                    e.target.classList.remove('valid');
                    e.target.classList.add('invalid');
                }
            });
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]')?.value.trim();
            const email = this.querySelector('input[type="email"]')?.value.trim();
            const phone = this.querySelector('input[type="tel"]')?.value.trim();
            const packageType = this.querySelector('select')?.value;
            const paymentMethod = this.querySelector('input[name="payment"]:checked')?.value;
            
            // Validate phone number
            const phonePattern = /^\+251[0-9]{9}$/;
            if (phone && !phonePattern.test(phone)) {
                showNotification('❌ Please enter a valid Ethiopian phone number (+251XXXXXXXXX)');
                return;
            }
            
            // Create WhatsApp message
            let message = `*NEW SUBSCRIPTION REQUEST* 📋\n\n`;
            message += `👤 Name: ${name || 'Not provided'}\n`;
            message += `📧 Email: ${email || 'Not provided'}\n`;
            message += `📱 Phone: ${phone || 'Not provided'}\n`;
            message += `📦 Package: ${packageType || 'Not selected'}\n`;
            message += `💳 Payment Method: ${paymentMethod || 'Not selected'}\n\n`;
            message += `✅ Please send payment details for this subscription.`;
            
            // Open WhatsApp
            const whatsappUrl = `https://wa.me/251979380726?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                const originalBg = submitBtn.style.background;
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
                submitBtn.style.background = 'linear-gradient(90deg, #00B894, #00E6A1)';
                submitBtn.disabled = true;
                
                // Reset after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = originalBg;
                    submitBtn.disabled = false;
                }, 3000);
            }
            
            // Reset form
            this.reset();
            
            // Reset phone validation classes
            if (phoneInput) {
                phoneInput.classList.remove('valid', 'invalid');
            }
        });
    }
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's not a section ID or if it's a button/link with special function
            if (href === '#' || href === '#backToTop' || href === '#subscribe' || this.classList.contains('nav-btn')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', debounce(() => {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        updateActiveNavLink(current);
    }, 100));
}

function updateActiveNavLink(currentSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== VISITOR COUNTER =====
function setupVisitorCounter() {
    const visitorCountElement = document.querySelector('.stat-number');
    
    if (visitorCountElement) {
        // Simulate visitor count with localStorage
        let count = localStorage.getItem('rmame_visitors');
        
        if (!count) {
            // Start with base number + random
            count = 1327 + Math.floor(Math.random() * 100);
            localStorage.setItem('rmame_visitors', count);
        } else {
            // Increment slightly each visit
            count = parseInt(count) + Math.floor(Math.random() * 5) + 1;
            localStorage.setItem('rmame_visitors', count);
        }
        
        // Update display
        visitorCountElement.textContent = count.toLocaleString();
        
        // Animate the update
        visitorCountElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            visitorCountElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// ===== LOADER =====
function hideLoader() {
    const loader = document.getElementById('loader');
    
    if (loader) {
        // Add a small delay for better UX
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B35, #FF8B4D);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    // Add keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== INITIALIZE WHEN DOCUMENT LOADS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM fully loaded and parsed');
    
    // Initialize all features
    initializeWebsite();
    
    // Add CSS for notifications
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #FF6B35, #FF8B4D);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 9999;
                font-weight: 600;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update visitor counter every minute
    setInterval(setupVisitorCounter, 60000);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('⚠️ JavaScript Error:', e.message, e.filename, e.lineno);
    
    // Don't break the site if there's an error
    if (document.getElementById('loader')) {
        document.getElementById('loader').style.display = 'none';
    }
});

// ===== TOUCH DEVICE SUPPORT =====
document.addEventListener('touchstart', function() {}, {passive: true});
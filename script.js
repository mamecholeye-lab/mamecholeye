console.log('📱 RMAME Predictions Script - Loaded');

// ===== MAIN WEBSITE UPDATER =====
async function updateWebsiteFromJSON() {
    console.log('🔄 Updating website from JSON data...');
    
    try {
        // Load your data.json file
        const response = await fetch('data.json?v=' + Date.now());
        if (!response.ok) throw new Error('Failed to load data.json');
        
        const data = await response.json();
        console.log('✅ JSON data loaded:', data);
        
        // 1. UPDATE HERO SECTION
        updateHeroSection(data);
        
        // 2. UPDATE TOP PREDICTION SECTION
        updateTopPredictionSection(data);
        
        // 3. HIDE LOADING ANIMATION
        hideLoadingAnimation();
        
        console.log('🎉 Website updated successfully!');
        
    } catch (error) {
        console.error('❌ Error updating website:', error);
        showErrorToUser('Data loading failed. Showing default content.');
    }
}

// ===== UPDATE HERO SECTION =====
function updateHeroSection(data) {
    if (!data.hero) {
        console.warn('⚠️ No hero data in JSON');
        return;
    }
    
    console.log('🎯 Updating hero section...');
    
    // Update hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && data.hero.title) {
        heroTitle.innerHTML = data.hero.title.replace('ACCUMULATOR', '<span class="highlight">ACCUMULATOR</span>');
        console.log('✅ Hero title updated');
    }
    
    // Update hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && data.hero.subtitle) {
        heroSubtitle.textContent = data.hero.subtitle;
        console.log('✅ Hero subtitle updated');
    }
    
    // Update hero stats (4 stats)
    const statElements = document.querySelectorAll('.hero-stats .stat h3');
    if (statElements.length >= 4 && data.hero.stats) {
        statElements[0].textContent = data.hero.stats[0]?.value || '3/3';
        statElements[1].textContent = data.hero.stats[1]?.value || '103.12';
        statElements[2].textContent = data.hero.stats[2]?.value || '34.37';
        statElements[3].textContent = data.hero.stats[3]?.value || '100%';
        console.log('✅ Hero stats updated (4 stats)');
    }
}

// ===== UPDATE TOP PREDICTION SECTION =====
function updateTopPredictionSection(data) {
    if (!data.topPrediction || !data.topPrediction.mainMatch) {
        console.warn('⚠️ No top prediction data in JSON');
        return;
    }
    
    console.log('🎯 Updating top prediction section...');
    const match = data.topPrediction.mainMatch;
    
    // Update team names (looking for .team-name elements)
    const teamNameElements = document.querySelectorAll('.team-name');
    if (teamNameElements.length >= 2) {
        teamNameElements[0].textContent = match.team1?.name || 'Team 1';
        teamNameElements[1].textContent = match.team2?.name || 'Team 2';
        console.log('✅ Team names updated');
    }
    
    // Update prediction text (looking for .type-value)
    const predictionElement = document.querySelector('.type-value');
    if (predictionElement && match.prediction) {
        predictionElement.textContent = match.prediction;
        console.log('✅ Prediction text updated');
    }
    
    // Update odds (looking for .odds-value)
    const oddsElement = document.querySelector('.odds-value');
    if (oddsElement && match.odds) {
        oddsElement.textContent = '@' + match.odds;
        console.log('✅ Odds updated');
    }
    
    // Update confidence bar if exists
    const confidenceBar = document.querySelector('.confidence-fill');
    if (confidenceBar && match.confidence) {
        confidenceBar.style.width = match.confidence + '%';
        console.log('✅ Confidence bar updated');
    }
    
    // Update confidence text if exists
    const confidenceText = document.querySelector('.confidence-percent');
    if (confidenceText && match.confidence) {
        confidenceText.textContent = match.confidence + '% Confidence';
        console.log('✅ Confidence text updated');
    }
}

// ===== SUBSCRIPTION FORM HANDLER =====
function setupSubscriptionForm() {
    console.log('🔄 Setting up subscription form...');
    
    const subscribeForm = document.getElementById('subscribe');
    if (!subscribeForm) {
        console.error('❌ No subscription form found (ID: #subscribe)');
        return;
    }
    
    console.log('✅ Found subscription form');
    
    // Phone input formatting (Ethiopian numbers)
    const phoneInput = subscribeForm.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Auto-format to Ethiopian format
            if (value.startsWith('0') && value.length > 1) {
                value = '+251' + value.substring(1);
            } else if (!value.startsWith('+251') && value.length >= 9) {
                value = '+251' + value;
            }
            
            if (value.length > 13) value = value.substring(0, 13);
            e.target.value = value;
        });
    }
    
    // Form submission
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        // Get form values
        const formData = new FormData(this);
        const name = formData.get('name')?.trim() || 'Customer';
        const phone = formData.get('phone')?.trim() || '';
        const packageType = formData.get('package') || 'daily';
        const paymentMethod = formData.get('payment') || 'mobile-money';
        
        // Validation
        if (!name || !phone || !packageType) {
            showFormMessage('Please fill all required fields', 'error');
            return;
        }
        
        // Phone validation (Ethiopian format)
        if (!phone.startsWith('+251') || phone.length !== 13) {
            showFormMessage('Please use valid Ethiopian number: +251XXXXXXXXX', 'error');
            return;
        }
        
        console.log(`📦 Subscription details: ${name}, ${phone}, ${packageType}, ${paymentMethod}`);
        
        // Create WhatsApp message
        const packageNames = {
            'daily': 'Daily Package ($0.99/day)',
            'weekly': 'Weekly Package ($9.99/week)',
            'monthly': 'Monthly VIP ($19.99/month)'
        };
        
        const paymentNames = {
            'mobile-money': 'Mobile Money',
            'bank-transfer': 'Bank Transfer'
        };
        
        const whatsappMessage = `Hello RMAME Predictions!%0A%0A`
            + `I want to subscribe to your predictions service.%0A%0A`
            + `👤 Name: ${name}%0A`
            + `📱 Phone: ${phone}%0A`
            + `📦 Package: ${packageNames[packageType] || packageType}%0A`
            + `💳 Payment Method: ${paymentNames[paymentMethod] || paymentMethod}%0A%0A`
            + `Please send me payment details.`;
        
        // Show success message
        showFormMessage('Opening WhatsApp with your details...', 'success');
        
        // Open WhatsApp after delay
        setTimeout(() => {
            window.open(`https://wa.me/251979380726?text=${whatsappMessage}`, '_blank');
            
            // Reset form after successful submission
            setTimeout(() => {
                subscribeForm.reset();
                // Reset radio buttons to default (Mobile Money)
                const mobileMoneyRadio = document.getElementById('mobile-money');
                if (mobileMoneyRadio) mobileMoneyRadio.checked = true;
            }, 1000);
            
        }, 1500);
    });
    
    console.log('✅ Subscription form ready');
}

// ===== FORM MESSAGES =====
function showFormMessage(message, type = 'info') {
    const form = document.getElementById('subscribe');
    if (!form) return;
    
    // Remove existing messages
    const existingMsg = form.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.style.cssText = `
        padding: 12px 20px;
        border-radius: 8px;
        margin: 15px 0;
        text-align: center;
        font-weight: 600;
        background: ${type === 'error' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(0, 184, 148, 0.1)'};
        color: ${type === 'error' ? '#FF4757' : '#00B894'};
        border: 1px solid ${type === 'error' ? 'rgba(255, 71, 87, 0.3)' : 'rgba(0, 184, 148, 0.3)'};
    `;
    messageDiv.textContent = message;
    
    form.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// ===== MOBILE MENU TOGGLE =====
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) {
        console.warn('⚠️ Mobile menu elements not found');
        return;
    }
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
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
    
    console.log('✅ Mobile menu ready');
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== BACK TO TOP BUTTON =====
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('✅ Back to top button ready');
}

// ===== LOADING ANIMATION =====
function hideLoadingAnimation() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// ===== ERROR DISPLAY =====
function showErrorToUser(message) {
    console.error('❌ Showing error to user:', message);
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: rgba(255, 107, 53, 0.9);
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 9999;
        text-align: center;
        font-family: Arial, sans-serif;
    `;
    errorDiv.innerHTML = `
        <strong>⚠️ Notice</strong><br>
        ${message}
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 Website DOM loaded - Initializing...');
    
    // 1. Setup mobile navigation
    setupMobileMenu();
    
    // 2. Setup smooth scrolling
    setupSmoothScrolling();
    
    // 3. Setup back to top button
    setupBackToTop();
    
    // 4. Setup subscription form
    setupSubscriptionForm();
    
    // 5. Load and update from JSON data
    setTimeout(updateWebsiteFromJSON, 800);
    
    console.log('✅ All scripts initialized');
});

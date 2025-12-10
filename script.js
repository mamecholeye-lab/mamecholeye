console.log('📱 RMAME Predictions Script - Loaded');

// ===== MAIN FUNCTION =====
async function loadWebsiteData() {
    console.log('🔍 Loading data from data.json...');
    
    try {
        // Load your data.json
        const response = await fetch('data.json?v=' + Date.now());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Data loaded successfully:', data);
        
        // Check what structure your data.json has
        console.log('📊 Data structure check:');
        console.log('- Has hero?', !!data.hero);
        console.log('- Has topPrediction?', !!data.topPrediction);
        console.log('- Has lastUpdated?', data.lastUpdated);
        
        // Update website based on your actual data.json structure
        updateWebsiteContent(data);
        
        // Hide loading animation
        hideLoader();
        
    } catch (error) {
        console.error('❌ Failed to load data.json:', error);
        showError('Cannot load predictions data. Please check data.json file.');
    }
}

// ===== UPDATE WEBSITE CONTENT =====
function updateWebsiteContent(data) {
    console.log('🔄 Updating website content...');
    
    // 1. UPDATE LAST UPDATED DATE (if exists in your data)
    if (data.lastUpdated) {
        console.log('📅 Last updated:', data.lastUpdated);
        // You can display this somewhere if you want
    }
    
    // 2. UPDATE HERO SECTION
    updateHero(data);
    
    // 3. UPDATE TOP PREDICTION
    updateTopPrediction(data);
    
    console.log('✅ Website updated!');
}

// ===== UPDATE HERO =====
function updateHero(data) {
    console.log('🎯 Updating hero section...');
    
    // Check what hero data you actually have
    if (!data.hero) {
        console.warn('⚠️ No hero data found in data.json');
        return;
    }
    
    // Update hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && data.hero.title) {
        console.log('📝 Hero title found:', data.hero.title);
        heroTitle.innerHTML = data.hero.title.replace('ACCUMULATOR', '<span class="highlight">ACCUMULATOR</span>');
    }
    
    // Update hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && data.hero.subtitle) {
        console.log('📝 Hero subtitle found:', data.hero.subtitle);
        heroSubtitle.textContent = data.hero.subtitle;
    }
    
    // Update hero stats
    const statElements = document.querySelectorAll('.hero-stats .stat h3');
    if (statElements.length >= 4 && data.hero.stats && Array.isArray(data.hero.stats)) {
        console.log('📊 Found', data.hero.stats.length, 'stats');
        
        // Update each stat that exists
        data.hero.stats.forEach((stat, index) => {
            if (statElements[index] && stat.value) {
                statElements[index].textContent = stat.value;
            }
        });
    }
}

// ===== UPDATE TOP PREDICTION =====
function updateTopPrediction(data) {
    console.log('🎯 Updating top prediction...');
    
    if (!data.topPrediction) {
        console.warn('⚠️ No topPrediction data found');
        return;
    }
    
    // Check your exact data structure
    console.log('📋 Top prediction data:', data.topPrediction);
    
    // Try different possible structures
    const matchData = data.topPrediction.mainMatch || data.topPrediction;
    
    if (!matchData) {
        console.warn('⚠️ No match data found in topPrediction');
        return;
    }
    
    console.log('⚽ Match data:', matchData);
    
    // Update team names
    const teamElements = document.querySelectorAll('.team-name');
    if (teamElements.length >= 2) {
        // Check different possible property names
        const team1Name = matchData.team1?.name || matchData.team1Name || 'Team 1';
        const team2Name = matchData.team2?.name || matchData.team2Name || 'Team 2';
        
        teamElements[0].textContent = team1Name;
        teamElements[1].textContent = team2Name;
        console.log('✅ Teams updated:', team1Name, 'vs', team2Name);
    }
    
    // Update prediction text
    const predictionElement = document.querySelector('.type-value');
    if (predictionElement && matchData.prediction) {
        predictionElement.textContent = matchData.prediction;
        console.log('✅ Prediction updated:', matchData.prediction);
    }
    
    // Update odds
    const oddsElement = document.querySelector('.odds-value');
    if (oddsElement && matchData.odds) {
        oddsElement.textContent = '@' + matchData.odds;
        console.log('✅ Odds updated:', matchData.odds);
    }
    
    // Update confidence
    const confidenceBar = document.querySelector('.confidence-fill');
    const confidenceText = document.querySelector('.confidence-percent');
    
    if (confidenceBar && matchData.confidence) {
        confidenceBar.style.width = matchData.confidence + '%';
        console.log('✅ Confidence bar updated:', matchData.confidence + '%');
    }
    
    if (confidenceText && matchData.confidence) {
        confidenceText.textContent = matchData.confidence + '% Confidence';
    }
    
    // Update league if exists
    const leagueElement = document.querySelector('.match-league');
    if (leagueElement && matchData.league) {
        leagueElement.innerHTML = `<i class="fas fa-crown"></i> ${matchData.league}`;
    }
}

// ===== SUBSCRIPTION FORM =====
function setupSubscriptionForm() {
    console.log('📋 Setting up subscription form...');
    
    const form = document.getElementById('subscribe');
    if (!form) {
        console.error('❌ No form with ID "subscribe" found');
        return;
    }
    
    // Phone formatting
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Auto-format Ethiopian numbers
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
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        const formData = new FormData(this);
        const name = formData.get('name')?.trim() || 'Customer';
        const phone = formData.get('phone')?.trim() || '';
        const packageType = formData.get('package') || 'daily';
        
        // Validation
        if (!phone) {
            alert('Please enter your phone number');
            return;
        }
        
        // Format phone
        let formattedPhone = phone;
        if (!phone.startsWith('+251')) {
            if (phone.startsWith('0')) {
                formattedPhone = '+251' + phone.substring(1);
            } else if (phone.length >= 9) {
                formattedPhone = '+251' + phone;
            }
        }
        
        // Create WhatsApp message
        const packageNames = {
            'daily': 'Daily Package ($0.99/day)',
            'weekly': 'Weekly Package ($9.99/week)',
            'monthly': 'Monthly VIP ($19.99/month)'
        };
        
        const message = `Hello RMAME Predictions!%0A%0A`
            + `I want to subscribe.%0A%0A`
            + `Name: ${name}%0A`
            + `Phone: ${formattedPhone}%0A`
            + `Package: ${packageNames[packageType] || packageType}%0A%0A`
            + `Please send payment details.`;
        
        // Open WhatsApp
        window.open(`https://wa.me/251979380726?text=${message}`, '_blank');
        
        // Show confirmation
        alert('WhatsApp opening with your details. Please send the message.');
    });
}

// ===== HIDE LOADER =====
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// ===== SHOW ERROR =====
function showError(message) {
    console.error('❌ Error:', message);
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        background: #FF6B35;
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 9999;
        text-align: center;
        font-family: Arial;
    `;
    errorDiv.innerHTML = `
        <strong>⚠️ Error</strong><br>
        ${message}
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 DOM loaded - Starting website...');
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup subscription form
    setupSubscriptionForm();
    
    // Load data from JSON
    setTimeout(loadWebsiteData, 500);
});

console.log('📱 RMAME Predictions Script - Working Version');

// ===== MAIN FUNCTION =====
async function updateWebsite() {
    console.log('🔄 Updating website from JSON...');
    
    try {
        // Load data.json
        const response = await fetch('data.json?v=' + Date.now());
        const data = await response.json();
        console.log('✅ Data loaded:', data);
        
        // REMOVE old content and UPDATE with new data
        clearAndUpdateContent(data);
        
        hideLoader();
        console.log('🎉 Update complete!');
        
    } catch (error) {
        console.error('❌ Update failed:', error);
    }
}

// ===== CLEAR OLD CONTENT AND UPDATE =====
function clearAndUpdateContent(data) {
    console.log('🧹 Clearing old content...');
    
    // 1. UPDATE HERO SECTION (CLEAR OLD, ADD NEW)
    updateHeroSection(data);
    
    // 2. UPDATE TOP PREDICTION SECTION (CLEAR OLD, ADD NEW)
    updateTopPrediction(data);
}

// ===== UPDATE HERO SECTION =====
function updateHeroSection(data) {
    if (!data.hero) return;
    
    console.log('🏆 Updating hero section...');
    
    // Clear existing hardcoded text and update with JSON data
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && data.hero.title) {
        heroTitle.innerHTML = ''; // CLEAR old
        heroTitle.innerHTML = data.hero.title.replace('ACCUMULATOR', '<span class="highlight">ACCUMULATOR</span>'); // ADD new
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && data.hero.subtitle) {
        heroSubtitle.textContent = ''; // CLEAR old
        heroSubtitle.textContent = data.hero.subtitle; // ADD new
    }
    
    // Update stats
    const statElements = document.querySelectorAll('.hero-stats .stat h3');
    if (statElements.length >= 4 && data.hero.stats) {
        data.hero.stats.forEach((stat, index) => {
            if (statElements[index] && stat.value) {
                statElements[index].textContent = ''; // CLEAR
                statElements[index].textContent = stat.value; // ADD new
            }
        });
    }
}

// ===== UPDATE TOP PREDICTION =====
function updateTopPrediction(data) {
    if (!data.topPrediction || !data.topPrediction.mainMatch) return;
    
    console.log('🎯 Updating top prediction...');
    const match = data.topPrediction.mainMatch;
    
    // CLEAR old team names and ADD new
    const teamElements = document.querySelectorAll('.team-name');
    if (teamElements.length >= 2) {
        teamElements[0].textContent = ''; // CLEAR old
        teamElements[0].textContent = match.team1?.name || 'Team 1'; // ADD new
        
        teamElements[1].textContent = ''; // CLEAR old
        teamElements[1].textContent = match.team2?.name || 'Team 2'; // ADD new
    }
    
    // CLEAR old prediction and ADD new
    const predictionElement = document.querySelector('.type-value');
    if (predictionElement && match.prediction) {
        predictionElement.textContent = ''; // CLEAR
        predictionElement.textContent = match.prediction; // ADD
    }
    
    // CLEAR old odds and ADD new
    const oddsElement = document.querySelector('.odds-value');
    if (oddsElement && match.odds) {
        oddsElement.textContent = ''; // CLEAR
        oddsElement.textContent = '@' + match.odds; // ADD
    }
    
    // CLEAR old confidence and ADD new
    const confidenceBar = document.querySelector('.confidence-fill');
    const confidenceText = document.querySelector('.confidence-percent');
    
    if (confidenceBar && match.confidence) {
        confidenceBar.style.width = '0%'; // CLEAR
        setTimeout(() => {
            confidenceBar.style.width = match.confidence + '%'; // ADD new
        }, 100);
    }
    
    if (confidenceText && match.confidence) {
        confidenceText.textContent = ''; // CLEAR
        confidenceText.textContent = match.confidence + '% Confidence'; // ADD
    }
    
    // ADD VISUAL INDICATOR THAT DATA IS FROM JSON
    const topSection = document.getElementById('top-prediction');
    if (topSection) {
        // Remove any existing indicator
        const oldIndicator = topSection.querySelector('.json-indicator');
        if (oldIndicator) oldIndicator.remove();
        
        // Add new indicator
        const indicator = document.createElement('div');
        indicator.className = 'json-indicator';
        indicator.style.cssText = `
            background: #00B894;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin: 10px auto;
            text-align: center;
            display: inline-block;
        `;
        indicator.textContent = '✅ LIVE DATA FROM JSON';
        topSection.prepend(indicator);
    }
}

// ===== SUBSCRIPTION FORM =====
function setupSubscription() {
    const form = document.getElementById('subscribe');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]')?.value || '';
        const phone = this.querySelector('input[type="tel"]')?.value || '';
        const packageType = this.querySelector('select')?.value || 'daily';
        
        // Simple WhatsApp message
        const message = `Name: ${name}%0APhone: ${phone}%0APackage: ${packageType}`;
        window.open(`https://wa.me/251979380726?text=${message}`, '_blank');
    });
}

// ===== HIDE LOADER =====
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }
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

// ===== START EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 Website loaded');
    
    setupMobileMenu();
    setupSubscription();
    
    // Wait a bit then update from JSON
    setTimeout(updateWebsite, 800);
});

console.log('📱 RMAME Script Loaded');

// ===== SIMPLE TEST FUNCTION =====
async function testWebsite() {
    console.log('🔍 Testing website...');
    
    try {
        // 1. Test if we can load data.json
        console.log('Step 1: Loading data.json...');
        const response = await fetch('data.json?v=' + Date.now());
        console.log('✅ Fetch status:', response.status);
        
        const data = await response.json();
        console.log('✅ Data loaded:', data);
        
        // 2. Update Hero Section
        console.log('Step 2: Updating hero...');
        updateHero(data);
        
        // 3. Update Top Prediction
        console.log('Step 3: Updating top prediction...');
        updateTopPrediction(data);
        
        // 4. Hide loading animation
        hideLoader();
        
        console.log('🎉 Website updated successfully!');
        
    } catch (error) {
        console.error('❌ ERROR:', error);
        showError(error.message);
    }
}

// ===== UPDATE HERO SECTION =====
function updateHero(data) {
    if (!data.hero) {
        console.error('❌ No hero data found');
        return;
    }
    
    // Update title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = data.hero.title.replace('ACCUMULATOR', '<span class="highlight">ACCUMULATOR</span>');
        console.log('✅ Hero title updated');
    }
    
    // Update subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = data.hero.subtitle;
        console.log('✅ Hero subtitle updated');
    }
    
    // Update stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats && data.hero.stats) {
        // You can update stats here
        console.log('✅ Hero stats found');
    }
}

// ===== UPDATE TOP PREDICTION =====
function updateTopPrediction(data) {
    console.log('🔍 Updating top prediction...');
    
    if (!data.topPrediction || !data.topPrediction.mainMatch) {
        console.error('❌ No top prediction data found');
        return;
    }
    
    const match = data.topPrediction.mainMatch;
    console.log('Match data:', match);
    
    // Method 1: Update team names if .team-name elements exist
    const teamNames = document.querySelectorAll('.team-name');
    if (teamNames.length >= 2) {
        teamNames[0].textContent = match.team1.name;
        teamNames[1].textContent = match.team2.name;
        console.log('✅ Team names updated');
    }
    
    // Method 2: Try different selectors
    const predictionType = document.querySelector('.prediction-value, .type-value, .prediction-text');
    if (predictionType) {
        predictionType.textContent = match.prediction;
        console.log('✅ Prediction type updated');
    }
    
    // Method 3: Try to find odds element
    const oddsElement = document.querySelector('.odds-value, .prediction-odd, .odds');
    if (oddsElement) {
        oddsElement.textContent = '@' + match.odds;
        console.log('✅ Odds updated');
    }
    
    // Method 4: Update confidence bar
    const confidenceBar = document.querySelector('.confidence-fill, .confidence-bar div');
    const confidenceText = document.querySelector('.confidence-percent, .confidence span');
    
    if (confidenceBar) {
        confidenceBar.style.width = match.confidence + '%';
        console.log('✅ Confidence bar updated');
    }
    
    if (confidenceText) {
        confidenceText.textContent = match.confidence + '% Confidence';
        console.log('✅ Confidence text updated');
    }
    
    // Method 5: Direct HTML manipulation for testing
    const topSection = document.getElementById('top-prediction');
    if (topSection) {
        // Create a test message
        const testMsg = document.createElement('div');
        testMsg.style.cssText = 'background:#00B894;color:white;padding:10px;border-radius:5px;margin:10px 0;';
        testMsg.innerHTML = `
            <strong>✅ Top Prediction Loaded!</strong><br>
            ${match.team1.name} vs ${match.team2.name}<br>
            Prediction: ${match.prediction}<br>
            Odds: ${match.odds} | Confidence: ${match.confidence}%
        `;
        topSection.appendChild(testMsg);
        console.log('✅ Test message added');
    }
}

// ===== HIDE LOADER =====
function hideLoader() {
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

// ===== SHOW ERROR =====
function showError(message) {
    console.error('❌ Website Error:', message);
    
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
        font-family: Arial;
    `;
    errorDiv.innerHTML = `
        <strong>⚠️ Website Error:</strong><br>
        ${message}<br>
        <small>Check console for details</small>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 10 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 10000);
}

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// ===== START WEBSITE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 DOM loaded, starting website...');
    
    // Start testing
    setTimeout(() => {
        testWebsite();
    }, 1000);
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

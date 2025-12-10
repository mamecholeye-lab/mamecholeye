console.log('📱 RMAME Predictions Script Loaded');

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
        
        // 4. Update Today's Predictions
        console.log('Step 4: Updating today\'s predictions...');
        updateTodayPredictions(data);
        
        // 5. Update Results
        console.log('Step 5: Updating results...');
        updateResults(data);
        
        // 6. Hide loading animation
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
    const heroStats = document.querySelectorAll('.hero-stats .stat h3');
    if (heroStats.length >= 4 && data.hero.stats) {
        heroStats[0].textContent = data.hero.stats[0]?.value || '3/3';
        heroStats[1].textContent = data.hero.stats[1]?.value || '103.12';
        heroStats[2].textContent = data.hero.stats[2]?.value || '34.37';
        heroStats[3].textContent = data.hero.stats[3]?.value || '100%';
        console.log('✅ Hero stats updated');
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
    
    // Try to update based on visible HTML structure
    // Look for team names in the prediction section
    const teamContainers = document.querySelectorAll('#top-prediction .team span');
    if (teamContainers.length >= 2) {
        teamContainers[0].textContent = match.team1.name;
        teamContainers[1].textContent = match.team2.name;
        console.log('✅ Team names updated via team spans');
    }
    
    // Look for prediction text
    const predictionElements = document.querySelectorAll('#top-prediction p, #top-prediction div');
    predictionElements.forEach(element => {
        const text = element.textContent.trim();
        if (text.includes('PREDICTION:')) {
            element.textContent = 'PREDICTION: ' + match.prediction;
            console.log('✅ Prediction text updated');
        }
        if (text.includes('ODDS:')) {
            element.textContent = 'ODDS: @' + match.odds;
            console.log('✅ Odds text updated');
        }
    });
    
    // Update confidence if exists
    const confidenceElements = document.querySelectorAll('#top-prediction strong, #top-prediction .confidence');
    confidenceElements.forEach(element => {
        if (element.textContent.includes('%') && element.textContent.includes('Confidence')) {
            element.textContent = match.confidence + '% Confidence';
            console.log('✅ Confidence updated');
        }
    });
    
    // Add test message to verify update
    const topSection = document.getElementById('top-prediction');
    if (topSection) {
        // Remove any previous test message
        const oldTestMsg = topSection.querySelector('.dynamic-test-message');
        if (oldTestMsg) oldTestMsg.remove();
        
        const testMsg = document.createElement('div');
        testMsg.className = 'dynamic-test-message';
        testMsg.style.cssText = 'background:#00B894;color:white;padding:10px;border-radius:5px;margin:10px 0;text-align:center;';
        testMsg.innerHTML = `
            <strong>✅ Data Dynamically Loaded!</strong><br>
            <small>Teams: ${match.team1.name} vs ${match.team2.name}</small>
        `;
        topSection.insertBefore(testMsg, topSection.firstChild);
        console.log('✅ Test message added');
    }
}

// ===== UPDATE TODAY'S PREDICTIONS =====
function updateTodayPredictions(data) {
    if (!data.todayPredictions || !data.todayPredictions.predictions) {
        console.log('⚠️ No today predictions data found');
        return;
    }
    
    console.log('🔍 Updating today\'s predictions...');
    const predictions = data.todayPredictions.predictions;
    
    // Update first 4 match cards if they exist
    const matchCards = document.querySelectorAll('.match-card');
    for (let i = 0; i < Math.min(matchCards.length, predictions.length); i++) {
        const pred = predictions[i];
        const card = matchCards[i];
        
        // Update league
        const leagueElement = card.querySelector('.match-league');
        if (leagueElement) {
            leagueElement.textContent = pred.league;
        }
        
        // Update teams - look for team-name spans
        const teamSpans = card.querySelectorAll('.team-name');
        if (teamSpans.length >= 2) {
            teamSpans[0].textContent = pred.team1?.name || pred.fixture.split(' v ')[0] || 'Team 1';
            teamSpans[1].textContent = pred.team2?.name || pred.fixture.split(' v ')[1] || 'Team 2';
        }
        
        // Update prediction
        const predictionElement = card.querySelector('.prediction-value, [class*="tip"]');
        if (predictionElement) {
            predictionElement.textContent = pred.prediction;
        }
        
        // Update odds
        const oddsElement = card.querySelector('.prediction-odd, [class*="odds"]');
        if (oddsElement) {
            oddsElement.textContent = '@' + pred.odds;
        }
        
        // Update confidence
        const confidenceBar = card.querySelector('.confidence-fill');
        if (confidenceBar && pred.confidence) {
            confidenceBar.style.width = pred.confidence + '%';
        }
    }
    
    console.log(`✅ Updated ${Math.min(matchCards.length, predictions.length)} match cards`);
}

// ===== UPDATE RESULTS =====
function updateResults(data) {
    if (!data.yesterdayResults || !data.yesterdayResults.results) {
        console.log('⚠️ No results data found');
        return;
    }
    
    console.log('🔍 Updating results...');
    const results = data.yesterdayResults.results;
    const resultsContainer = document.getElementById('results-table-body');
    
    if (!resultsContainer) {
        console.log('❌ Results container not found');
        return;
    }
    
    // Clear loading message
    resultsContainer.innerHTML = '';
    
    // Add each result
    results.forEach((result, index) => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.style.cssText = 'display: flex; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);';
        
        // Create outcome badge
        const outcomeClass = result.outcome === 'won' ? 'won' : 'lost';
        const outcomeBadge = result.outcome === 'won' ? '✅' : '❌';
        
        row.innerHTML = `
            <div style="flex: 3; color: white;">${result.fixture || 'Match'}</div>
            <div style="flex: 2; color: #FF9E6D;">${result.betType || 'N/A'}</div>
            <div style="flex: 1; color: #FFD700;">${result.odds || '0.00'}</div>
            <div style="flex: 1; color: #64D2FF;">${result.result || 'N/A'}</div>
            <div style="flex: 1; color: ${result.outcome === 'won' ? '#00E6A1' : '#FF6B6B'};">
                <span class="status ${outcomeClass}">${outcomeBadge} ${result.outcome || 'pending'}</span>
            </div>
        `;
        
        resultsContainer.appendChild(row);
    });
    
    // Update stats summary
    if (data.yesterdayResults.stats) {
        const stats = data.yesterdayResults.stats;
        const statBoxes = document.querySelectorAll('.stat-box .stat-value');
        
        if (statBoxes.length >= 4) {
            statBoxes[0].textContent = stats.record || '0-0-0';
            statBoxes[1].textContent = stats.winRate || '0%';
            statBoxes[2].textContent = stats.totalOdds || '0.00';
            statBoxes[3].textContent = stats.status === 'Good' ? '✅ Good' : '❌ Poor';
            
            console.log('✅ Results stats updated');
        }
    }
    
    console.log(`✅ Loaded ${results.length} results`);
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
        text-align: center;
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
    console.log('🔍 Checking page structure...');
    
    // Log what elements we find
    const elementsToCheck = [
        { selector: '.hero-title', desc: 'Hero Title' },
        { selector: '#top-prediction', desc: 'Top Prediction Section' },
        { selector: '.match-card', desc: 'Match Cards' },
        { selector: '#results-table-body', desc: 'Results Table' }
    ];
    
    elementsToCheck.forEach(item => {
        const found = document.querySelectorAll(item.selector);
        console.log(`${found.length > 0 ? '✅' : '❌'} ${item.desc}: ${found.length} found`);
    });
    
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

ok// ===== RMAME Predictions - Updated JavaScript for Your data.json =====
console.log('📱 RMAME Predictions Script - Loading...');

// ===== INITIALIZE WEBSITE =====
function initializeWebsite() {
    console.log('🏁 Initializing website...');
    
    // Setup all functionality
    setupMobileMenu();
    setupShowMorePredictions();
    setupBackToTop();
    setupWhatsAppSharing();
    setupSubscriptionForm();
    setupSmoothScrolling();
    loadResultsFromJSON(); // Updated to use your JSON
    loadHeroData(); // Load hero data from JSON
    loadTodayPredictions(); // Load today's predictions
    setupVisitorCounter();
    hideLoader();
    
    console.log('✅ Website fully initialized');
}

async function loadHeroData() {
    try {
        const response = await fetch('data.json?v=' + Date.now());
        const data = await response.json();

        if (data.hero) {
            updateHeroSection(data.hero);
        }

        if (data.topPrediction) {
            updateTopPrediction(data.topPrediction);  // ← THIS LINE MUST EXIST
        }

        // Show success indicator
        showDataLoadedIndicator();

    } catch (error) {
        console.log('📋 Using hardcoded data (JSON error)');
        // Fallback data here
    }
}

// ===== UPDATE HERO SECTION =====
function updateHeroSection(heroData) {
    console.log('🏆 Updating hero section...');
    
    // Update title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroData.title) {
        // Check if title contains "WON" for highlighting
        if (heroData.title.includes('WON')) {
            const parts = heroData.title.split('WON');
            heroTitle.innerHTML = `${parts[0]}<span class="highlight">WON</span>${parts[1] || ''}`;
        } else {
            heroTitle.innerHTML = heroData.title.replace('ACCUMULATOR', '<span class="highlight">ACCUMULATOR</span>');
        }
    }
    
    // Update subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && heroData.subtitle) {
        heroSubtitle.textContent = heroData.subtitle;
    }
    
    // Update date
    const heroDate = document.querySelector('.results-header .date');
    if (heroDate && heroData.date) {
        heroDate.textContent = heroData.date + ' • 3-Match Accumulator';
    }
    
    // Update stats
    const stats = document.querySelectorAll('.hero-stats .stat h3');
    if (stats.length >= 2 && heroData.stats) {
        heroData.stats.forEach((stat, index) => {
            if (stats[index]) {
                stats[index].textContent = stat.value;
                
                // Update label if available
                const label = stats[index].parentElement.querySelector('p');
                if (label && stat.label) {
                    label.textContent = stat.label;
                }
            }
        });
    }
    
    // Update results list
    updateHeroResults(heroData.results);
    
    // Update calculations
    updateHeroCalculations(heroData.calculations);
}

// ===== UPDATE HERO RESULTS =====
function updateHeroResults(results) {
    const resultsList = document.querySelector('.results-list');
    if (!resultsList || !results) return;
    
    // Clear existing results except the first one (for template)
    const existingResults = resultsList.querySelectorAll('.result-item');
    if (existingResults.length > 0) {
        // Keep first as template, remove others
        for (let i = 1; i < existingResults.length; i++) {
            existingResults[i].remove();
        }
        
        // Update first result
        const firstResult = existingResults[0];
        if (results[0]) {
            updateResultItem(firstResult, results[0], true);
        }
        
        // Add remaining results
        for (let i = 1; i < results.length; i++) {
            const newResult = firstResult.cloneNode(true);
            updateResultItem(newResult, results[i]);
            resultsList.appendChild(newResult);
        }
    }
}

function updateResultItem(item, data, isFirst = false) {
    if (!item || !data) return;
    
    // Update match info
    const matchInfo = item.querySelector('.match-info');
    if (matchInfo) {
        const timeSpan = matchInfo.querySelector('.match-time');
        if (timeSpan) {
            timeSpan.textContent = `🏴󠁧󠁢󠁥󠁮󠁧󠁿 ${data.time}`;
        }
        
        const teamsSpan = matchInfo.querySelector('.match-teams');
        if (teamsSpan) {
            teamsSpan.textContent = data.fixture;
        }
        
        // Update league if it's the first item (featured)
        if (isFirst) {
            const detail = matchInfo.querySelector('.match-detail');
            if (detail) {
                const label = detail.querySelector('.detail-label');
                const value = detail.querySelector('.detail-value');
                if (label) label.textContent = data.league?.toUpperCase() || 'LEAGUE TWO';
                if (value) value.textContent = data.betType || '';
            }
        }
    }
    
    // Update bet info
    const betInfo = item.querySelector('.bet-info');
    if (betInfo) {
        const betType = betInfo.querySelector('.bet-type');
        if (betType) {
            betType.textContent = data.betType || '';
            betType.style.background = data.betColor ? 
                `linear-gradient(90deg, ${data.betColor}, ${adjustColor(data.betColor, 20)})` : 
                'rgba(255, 255, 255, 0.1)';
            betType.style.color = data.betColor === '#FFD700' ? '#000' : 'white';
        }
        
        const oddsSpan = betInfo.querySelector('.bet-odds');
        if (oddsSpan && data.odds) {
            oddsSpan.textContent = `@${data.odds}`;
        }
        
        const statusSpan = betInfo.querySelector('.status');
        if (statusSpan) {
            statusSpan.textContent = data.status === 'won' ? '✅' : '❌';
            statusSpan.className = `status ${data.status}`;
        }
    }
    
    // Update status classes
    item.className = 'result-item';
    if (data.status === 'won') {
        item.classList.add('won');
    }
    if (isFirst) {
        item.classList.add('featured');
    }
}

// ===== UPDATE HERO CALCULATIONS =====
function updateHeroCalculations(calculations) {
    if (!calculations) return;
    
    // Update total odds in summary
    const summaryStats = document.querySelectorAll('.summary-stat strong');
    if (summaryStats.length >= 4 && calculations.totalOdds) {
        // Update accumulator odds
        summaryStats[3].textContent = calculations.totalOdds;
        summaryStats[3].className = 'won';
    }
    
    // Update winning calculations
    const calcGrid = document.querySelector('.calculation-grid');
    if (calcGrid && calculations.winningExamples) {
        const calcItems = calcGrid.querySelectorAll('.calc-item');
        calculations.winningExamples.forEach((example, index) => {
            if (calcItems[index]) {
                const span = calcItems[index].querySelector('span');
                const strong = calcItems[index].querySelector('strong');
                
                if (span) {
                    span.textContent = `With $${example.stake} Stake:`;
                }
                
                if (strong) {
                    strong.textContent = `$${example.win?.toLocaleString() || example.win}`;
                    strong.className = 'won';
                }
            }
        });
    }
    
    // Update profit note
    const profitNote = document.querySelector('.profit-note');
    if (profitNote && calculations.profitNote) {
        profitNote.textContent = calculations.profitNote;
    }
}

// ===== UPDATE TOP PREDICTION SECTION =====
function updateTopPrediction(topData) {
    console.log('🎯 Updating top prediction...');
    
    const topPredictionContent = document.getElementById('top-prediction-content');
    if (!topPredictionContent) {
        console.log('❌ Top prediction container not found');
        return;
    }
    
    // If no data, show error
    if (!topData) {
        console.log('❌ No top prediction data');
        topPredictionContent.innerHTML = `
            <div class="loading-top">
                <div class="loading-spinner"></div>
                <p>No prediction data available</p>
            </div>
        `;
        return;
    }
    
    // Update subtitle
    const subtitle = document.getElementById('top-subtitle');
    if (subtitle && topData.subtitle) {
        subtitle.textContent = topData.subtitle;
    }
    
    // Update badge
    const badge = document.getElementById('top-badge');
    if (badge && topData.badge) {
        badge.innerHTML = `<i class="fas fa-fire"></i> ${topData.badge}`;
    }
    
    // Create HTML content
    const match = topData.mainMatch || {};
    
    const html = `
        <div class="top-prediction-card">
            <div class="match-details">
                <div class="match-header">
                    <span class="match-league"><i class="fas fa-crown"></i> ${match.league || 'Premium Match'}</span>
                    <span class="match-time">${match.time || '21:00'}</span>
                    <span class="match-date">Today, ${topData.date || 'December 9, 2025'}</span>
                </div>
                
                <div class="teams">
                    <div class="team">
                        <div class="team-logo" style="background-color: ${match.team1?.color || '#FF6B35'}; color: white;">
                            ${match.team1?.code || 'HOME'}
                        </div>
                        <span class="team-name">${match.team1?.name || 'Home Team'}</span>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo" style="background-color: ${match.team2?.color || '#0984E3'}; color: white;">
                            ${match.team2?.code || 'AWAY'}
                        </div>
                        <span class="team-name">${match.team2?.name || 'Away Team'}</span>
                    </div>
                </div>
                
                <div class="prediction-main">
                    <div class="prediction-type">
                        <span class="type-label">RMAME PREDICTION:</span>
                        <span class="type-value">${match.prediction || '1X (Double Chance)'}</span>
                    </div>
                    <div class="prediction-odds">
                        <span class="odds-label">ODDS:</span>
                        <span class="odds-value">@${match.odds || '1.41'}</span>
                    </div>
                </div>
                
                <div class="confidence-high">
                    <div class="confidence-header">
                        <i class="fas fa-bullseye"></i>
                        <span>${match.riskLevel || 'MEDIUM RISK'}</span>
                    </div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${match.confidence || 75}%"></div>
                    </div>
                    <span class="confidence-percent">${match.confidence || 75}% Confidence</span>
                </div>
                
                <div class="profit-info">
                    <div class="profit-item">
                        <span>Stake:</span>
                        <strong>$20.00</strong>
                    </div>
                    <div class="profit-item">
                        <span>Potential Win:</span>
                        <strong class="won">$${(20 * (match.odds || 1.41)).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    topPredictionContent.innerHTML = html;
    console.log('✅ Top prediction updated successfully');
}

// ===== LOAD TODAY'S PREDICTIONS =====
async function loadTodayPredictions() {
    try {
        const response = await fetch('data.json?v=' + Date.now());
        const data = await response.json();
        
        if (data.todayPredictions) {
            updateTodayPredictions(data.todayPredictions);
        }
        
        if (data.yesterdayResults) {
            updateYesterdayResults(data.yesterdayResults);
        }
        
    } catch (error) {
        console.log('📋 Using hardcoded predictions');
    }
}

function updateTodayPredictions(predictionsData) {
    const predictionsSection = document.getElementById('predictions');
    if (!predictionsSection || !predictionsData) return;
    
    // Update section subtitle
    const subtitle = predictionsSection.querySelector('.section-subtitle');
    if (subtitle && predictionsData.subtitle) {
        subtitle.textContent = predictionsData.subtitle;
    }
    
    // Update predictions grid
    const predictionsGrid = document.querySelector('.predictions-grid');
    if (predictionsGrid && predictionsData.predictions) {
        // Clear existing cards except first (template)
        const cards = predictionsGrid.querySelectorAll('.match-card');
        if (cards.length > 0) {
            // Update first card
            if (cards[0] && predictionsData.predictions[0]) {
                updateMatchCard(cards[0], predictionsData.predictions[0]);
            }
            
            // Remove extra cards if we have less predictions
            if (predictionsData.predictions.length < cards.length) {
                for (let i = predictionsData.predictions.length; i < cards.length; i++) {
                    cards[i].remove();
                }
            }
        }
        
        // Update premium offer
        updatePremiumOffer(predictionsData);
    }
}

function updateMatchCard(card, data) {
    if (!card || !data) return;
    
    // Update match header
    const header = card.querySelector('.match-header');
    if (header) {
        const leagueSpan = header.querySelector('.match-league');
        if (leagueSpan && data.league) {
            leagueSpan.innerHTML = `<i class="fas fa-trophy"></i> ${data.league}`;
        }
        
        const timeSpan = header.querySelector('.match-time');
        if (timeSpan && data.time) {
            timeSpan.textContent = data.time;
        }
    }
    
    // Update teams
    const teamsContainer = card.querySelector('.teams');
    if (teamsContainer && data.team1 && data.team2) {
        const teamDivs = teamsContainer.querySelectorAll('.team');
        
        // Team 1
        if (teamDivs[0]) {
            const logo = teamDivs[0].querySelector('.team-logo');
            const name = teamDivs[0].querySelector('.team-name');
            
            if (logo && data.team1.code) {
                logo.textContent = data.team1.code;
                logo.style.backgroundColor = data.team1.color || '#FF69B4';
                logo.style.color = 'white';
            }
            if (name && data.team1.name) {
                name.textContent = data.team1.name;
            }
        }
        
        // Team 2
        if (teamDivs[1]) {
            const logo = teamDivs[1].querySelector('.team-logo');
            const name = teamDivs[1].querySelector('.team-name');
            
            if (logo && data.team2.code) {
                logo.textContent = data.team2.code;
                logo.style.backgroundColor = data.team2.color || '#FF6600';
                logo.style.color = 'white';
            }
            if (name && data.team2.name) {
                name.textContent = data.team2.name;
            }
        }
    }
    
    // Update prediction
    const predictionDiv = card.querySelector('.prediction');
    if (predictionDiv) {
        const valueSpan = predictionDiv.querySelector('.prediction-value');
        const oddSpan = predictionDiv.querySelector('.prediction-odd');
        
        if (valueSpan && data.prediction) {
            valueSpan.textContent = data.prediction;
        }
        if (oddSpan && data.odds) {
            oddSpan.textContent = `@${data.odds}`;
        }
    }
    
    // Update confidence
    const confidenceDiv = card.querySelector('.confidence');
    if (confidenceDiv && data.confidence) {
        const fill = confidenceDiv.querySelector('.confidence-fill');
        const text = confidenceDiv.querySelector('span');
        
        if (fill) {
            fill.style.width = `${data.confidence}%`;
        }
        if (text) {
            text.textContent = `${data.confidence}% Confidence`;
        }
    }
}

function updatePremiumOffer(predictionsData) {
    const premiumOffer = document.querySelector('.premium-offer');
    if (!premiumOffer || !predictionsData.totalOdds) return;
    
    // Update note
    const note = premiumOffer.querySelector('.note');
    if (note && predictionsData.totalPredictions && predictionsData.totalOdds) {
        note.innerHTML = `🔥 <strong>${predictionsData.totalPredictions} Match Accumulator:</strong> Total Odds: ${predictionsData.totalOdds} - Potential ${(parseFloat(predictionsData.totalOdds) * 100 - 100).toFixed(0)}% Return!`;
    }
    
    // Update winning calculations
    if (predictionsData.winningExamples) {
        const calculationGrid = premiumOffer.querySelector('.calculation-grid');
        if (calculationGrid) {
            const calcItems = calculationGrid.querySelectorAll('.calc-item');
            predictionsData.winningExamples.forEach((example, index) => {
                if (calcItems[index]) {
                    const span = calcItems[index].querySelector('span');
                    const strong = calcItems[index].querySelector('strong');
                    
                    if (span) {
                        span.textContent = `With $${example.stake} Stake:`;
                    }
                    if (strong) {
                        strong.textContent = `$${example.win}`;
                        strong.className = 'won';
                    }
                }
            });
        }
    }
}

// ===== UPDATE YESTERDAY RESULTS =====
function updateYesterdayResults(resultsData) {
    const resultsSection = document.getElementById('results');
    if (!resultsSection || !resultsData) return;
    
    // Update subtitle
    const subtitle = resultsSection.querySelector('.section-subtitle');
    if (subtitle && resultsData.subtitle) {
        subtitle.textContent = resultsData.subtitle;
    }
    
    // Update stats
    updateResultsStats(resultsData.stats);
    
    // Update analysis
    updateResultsAnalysis(resultsData);
}

function updateResultsStats(statsData) {
    const statBoxes = document.querySelectorAll('.stat-box');
    if (!statBoxes.length || !statsData) return;
    
    // Update each stat box
    statBoxes.forEach((box, index) => {
        const valueDiv = box.querySelector('.stat-value');
        const p = box.querySelector('p');
        
        switch(index) {
            case 0: // Yesterday's Record
                if (valueDiv && statsData.record) {
                    valueDiv.textContent = statsData.record;
                }
                if (p) {
                    p.textContent = 'W-D-L Record';
                }
                break;
            case 1: // Win Rate
                if (valueDiv && statsData.winRate) {
                    valueDiv.textContent = statsData.winRate;
                }
                if (p && statsData.wins && statsData.total) {
                    p.textContent = `${statsData.wins}/${statsData.total} Wins`;
                }
                break;
            case 2: // Total Odds
                if (valueDiv && statsData.totalOdds) {
                    valueDiv.textContent = statsData.totalOdds;
                }
                if (p) {
                    p.textContent = 'Accumulator Value';
                }
                break;
            case 3: // Slip Status
                if (valueDiv && statsData.status) {
                    valueDiv.textContent = statsData.status;
                    valueDiv.className = 'stat-value ' + statsData.status.toLowerCase();
                }
                if (p && statsData.losses) {
                    p.textContent = `${statsData.losses} losses broke accumulator`;
                }
                break;
        }
    });
}

function updateResultsAnalysis(resultsData) {
    const analysisDiv = document.querySelector('.results-analysis');
    if (!analysisDiv || !resultsData) return;
    
    // Update analysis text
    const p = analysisDiv.querySelector('p');
    if (p && resultsData.analysis) {
        p.innerHTML = `Excellent performance with <strong style="color: #00E6A1;">${resultsData.analysis}</strong>`;
    }
    
    // Update insight
    const insightDiv = analysisDiv.querySelector('.analysis-tips p');
    if (insightDiv && resultsData.insight) {
        insightDiv.innerHTML = `<i class="fas fa-lightbulb"></i> <strong>Key Insight:</strong> ${resultsData.insight}`;
    }
}

// ===== LOAD RESULTS FROM JSON =====
async function loadResultsFromJSON() {
    try {
        const response = await fetch('data.json?v=' + Date.now());
        const data = await response.json();
        
        if (data.yesterdayResults && data.yesterdayResults.results) {
            updateResultsTable(data.yesterdayResults.results);
        }
        
    } catch (error) {
        loadFallbackResults();
    }
}

function updateResultsTable(results) {
    const tableBody = document.getElementById('results-table-body');
    if (!tableBody || !results) return;
    
    tableBody.innerHTML = '';
    
    results.forEach(result => {
        const row = document.createElement('div');
        row.className = 'table-row';
        
        if (result.outcome === 'won') {
            row.classList.add('won');
        } else if (result.outcome === 'lost') {
            row.classList.add('lost');
        }
        
        row.innerHTML = `
            <div>${result.fixture || ''}</div>
            <div>${result.betType || ''}</div>
            <div>@${result.odds || ''}</div>
            <div>${result.result || ''}</div>
            <div class="status ${result.outcome || ''}">${result.outcome?.toUpperCase() || ''}</div>
        `;
        
        tableBody.appendChild(row);
    });
}

function loadFallbackResults() {
    const tableBody = document.getElementById('results-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = `
        <div class="table-row lost">
            <div>Stevenage 0-1 Cardiff</div>
            <div>Double Chance: 1X</div>
            <div>@1.41</div>
            <div>0-1</div>
            <div class="status lost">LOST</div>
        </div>
    `;
}

// ===== SHOW DATA LOADED INDICATOR =====
function showDataLoadedIndicator() {
    const existingIndicator = document.querySelector('.data-update-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'data-update-indicator';
    indicator.style.cssText = `
        background: linear-gradient(90deg, #00B894, #FF6B35);
        color: white;
        padding: 10px 25px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 700;
        margin: 15px auto;
        text-align: center;
        display: inline-block;
        animation: pulse 2s infinite;
    `;
    indicator.innerHTML = '<i class="fas fa-sync-alt"></i> LIVE DATA LOADED • UPDATED JUST NOW';
    
    const heroSection = document.querySelector('.hero .container');
    if (heroSection) {
        heroSection.prepend(indicator);
    }
    
    // Add pulse animation
    if (!document.querySelector('#pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== UTILITY FUNCTIONS =====
function adjustColor(color, amount) {
    // Simple color adjustment
    return color; // For now, return same color
}

// ===== OTHER FUNCTIONS (SAME AS BEFORE) =====

// Mobile Menu
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
}

// Show More Predictions
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
        });
    }
}

// Back to Top
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            backToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// WhatsApp Sharing
function setupWhatsAppSharing() {
    window.shareOnWhatsApp = function(type) {
        const url = 'https://mamecholeye-lab.github.io/mamecholeye/';
        let message = '';
        
        if (type === 'free') {
            message = `⚽️ FREE FOOTBALL PREDICTIONS ⚽️\n\nCheck out RMAME Predictions!\n👉 ${url}`;
        } else {
            message = `⚽️ RMAME PREDICTIONS ⚽️\n\nProfessional Betting Tips\n✅ High Win Rate\n✅ Daily Predictions\n👉 ${url}`;
        }
        
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };
    
    window.shareWebsite = function() {
        const url = 'https://mamecholeye-lab.github.io/mamecholeye/';
        navigator.clipboard.writeText(url)
            .then(() => alert('✅ Website link copied!'))
            .catch(() => {
                const tempInput = document.createElement('input');
                tempInput.value = url;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('✅ Link copied!');
            });
    };
}

// Subscription Form
function setupSubscriptionForm() {
    const form = document.getElementById('subscribe');
    if (!form) return;
    
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('251')) {
                value = '+251' + value.substring(3);
            } else if (value.startsWith('0')) {
                value = '+251' + value.substring(1);
            }
            
            if (value.length > 13) {
                value = value.substring(0, 13);
            }
            
            e.target.value = value;
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]')?.value || '';
        const phone = this.querySelector('input[type="tel"]')?.value || '';
        const packageType = this.querySelector('select')?.value || '';
        
        const message = `Name: ${name}%0APhone: ${phone}%0APackage: ${packageType}`;
        window.open(`https://wa.me/251979380726?text=${message}`, '_blank');
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#backToTop' || this.classList.contains('nav-btn')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Visitor Counter
function setupVisitorCounter() {
    const visitorCountElement = document.querySelector('.stat-number');
    if (!visitorCountElement) return;
    
    let count = localStorage.getItem('rmame_visitors');
    if (!count) {
        count = 1327 + Math.floor(Math.random() * 100);
    } else {
        count = parseInt(count) + Math.floor(Math.random() * 3) + 1;
    }
    
    localStorage.setItem('rmame_visitors', count);
    visitorCountElement.textContent = count.toLocaleString();
}

// Hide Loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Website loading...');
    
    // Initialize everything
    initializeWebsite();
    
    // Update visitor counter every minute
    setInterval(setupVisitorCounter, 60000);
});
// Test function to verify top prediction is updating
function testTopPredictionUpdate() {
    console.log('Testing top prediction update...');
    
    // Check if old Monaco/Galatasaray content exists
    const oldContent = document.querySelector('.top-prediction-card');
    if (oldContent) {
        console.log('✅ Old content found, will be replaced by JavaScript');
    } else {
        console.log('❌ No old content found - check HTML structure');
    }
    
    // Check if new container exists
    const newContainer = document.getElementById('top-prediction-content');
    if (newContainer) {
        console.log('✅ New container found:', newContainer);
    } else {
        console.log('❌ New container not found - check HTML');
    }
}

// Run test after page loads
setTimeout(() => {
    testTopPredictionUpdate();
}, 2000);

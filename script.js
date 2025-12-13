// ===== RMAME Predictions - Clean Working Version =====
console.log('📱 RMAME Predictions - Loading...');

// ===== GLOBAL LOADING STATE =====
let isCurrentlyLoading = false;
let lastLoadTime = 0;

// ===== INITIALIZE WEBSITE (PREVENT MULTIPLE LOADS) =====
function initializeWebsite() {
    // Prevent multiple simultaneous loads
    if (isCurrentlyLoading) {
        console.log('🔄 Already loading, skipping duplicate call');
        return;
    }

    // Prevent loading too frequently (at least 2 seconds between loads)
    const now = Date.now();
    if (now - lastLoadTime < 2000) {
        console.log('⏰ Loading too fast, waiting...');
        return;
    }

    isCurrentlyLoading = true;
    lastLoadTime = now;

    console.log('🏁 Initializing website (fresh start)...');

    // Setup all functionality
    setupMobileMenu();
    setupShowMorePredictions();
    setupBackToTop();
    setupWhatsAppSharing();
    setupSubscriptionForm();
    setupSmoothScrolling();
    setupVisitorCounter();
    clearHardcodedContent();  // <-- ADDED THIS LINE
    hideLoader();

    // Load data ONCE
    loadAllData().finally(() => {
        isCurrentlyLoading = false;
        console.log('✅ Website fully initialized');
    });
}

// ===== CLEAR HARDCODED CONTENT =====
function clearHardcodedContent() {
    console.log('🧹 Marking hardcoded content for update');
    // Add attribute to help with caching
    document.querySelectorAll('.stat-value, .stat-box p').forEach(el => {
        el.setAttribute('data-updated', 'true');
    });
}

// ===== OVERRIDE HARDCODED STATS =====
function overrideHardcodedStats(resultsData) {
    console.log('🎯 Overriding hardcoded stats with JSON data');
    
    if (!resultsData || !resultsData.stats) {
        console.log('⚠️ No stats data found');
        return;
    }
    
    const stats = resultsData.stats;
    const statBoxes = document.querySelectorAll('.stat-box');
    
    if (statBoxes.length >= 4) {
        // Box 1: Yesterday's Record
        const recordValue = statBoxes[0].querySelector('.stat-value');
        if (recordValue) recordValue.textContent = stats.record || '7-0-3';
        
        // Box 2: Win Rate
        const winRateValue = statBoxes[1].querySelector('.stat-value');
        const winRateLabel = statBoxes[1].querySelector('p');
        if (winRateValue) winRateValue.textContent = stats.winRate || '70.0%';
        if (winRateLabel) winRateLabel.innerHTML = `${stats.wins || 7}/${stats.total || 10} Wins`;
        
        // Box 3: Total Odds
        const oddsValue = statBoxes[2].querySelector('.stat-value');
        if (oddsValue) oddsValue.textContent = stats.totalOdds || '65.18';
        
        // Box 4: Slip Status
        const statusValue = statBoxes[3].querySelector('.stat-value');
        const statusLabel = statBoxes[3].querySelector('p');
        if (statusValue) {
            statusValue.textContent = stats.status || 'Good';
            if (stats.status === 'Lost') {
                statusValue.style.color = '#FF6B6B';
            } else {
                statusValue.style.color = '#00E6A1';
            }
        }
        if (statusLabel) statusLabel.innerHTML = `${stats.losses || 3} losses broke accumulator`;
    }
    
    // Update analysis text
    const analysisParagraph = document.querySelector('.results-analysis p');
    if (analysisParagraph && resultsData.analysis) {
        analysisParagraph.innerHTML = resultsData.analysis;
    }
    
    // Update insight text
    const insightParagraph = document.querySelector('.analysis-tips p');
    if (insightParagraph && resultsData.insight) {
        insightParagraph.innerHTML = `<i class="fas fa-lightbulb"></i> <strong>Key Insight:</strong> ${resultsData.insight}`;
    }
    
    // Update subtitle
    const resultsSubtitle = document.querySelector('.results-section .section-subtitle');
    if (resultsSubtitle && resultsData.subtitle) {
        resultsSubtitle.textContent = resultsData.subtitle;
    }
}

    // ===== REMOVE WRONG WINNING CALCULATIONS =====
function removeWrongWinningCalculations() {
    console.log('🔄 Looking for old $1,639 calculation...');
    
    // Wait for page to load completely
    setTimeout(() => {
        // Find ONLY the paragraph that says "12 Match Accumulator"
        const allParagraphs = document.querySelectorAll('p');
        
        allParagraphs.forEach(p => {
            const text = p.textContent || '';
            
            // ONLY target the EXACT paragraph that has this text:
            if (text === '🔥 12 Match Accumulator: Total Odds: 163.9 - Potential 16,390% Return!') {
                console.log('✅ Found and removing old calculation note');
                p.remove();
            }
        });
        
        // Find ONLY the calculation grid with $1,639.00
        const calcItems = document.querySelectorAll('.calc-item');
        
        calcItems.forEach(item => {
            const text = item.textContent || '';
            if (text.includes('$1,639.00')) {
                console.log('✅ Found and removing $1,639.00 calculation');
                // Remove the parent container (the whole calculation grid)
                const parent = item.closest('.winning-calculation, .calculation-grid');
                if (parent) {
                    parent.remove();
                }
            }
        });
        
    }, 2000); // Wait 2 seconds to be safe
}

// ===== LOAD ALL DATA (FIXED - NO CACHE MIXING) =====
async function loadAllData() {
    try {
        console.log('🧹 Clearing all old data first...');

        // IMPORTANT: Clear all dynamic content before loading new data
        clearAllDynamicContent();

        console.log('📥 Loading FRESH data from JSON...');

        // Force fresh fetch with timestamp
        const timestamp = new Date().getTime();
        const response = await fetch('data.json?t=' + new Date().getTime() + '&r=' + Math.random());

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Fresh data loaded, now updating...');

        // Update sections ONE BY ONE (not overlapping)
        if (data.hero) {
            updateHeroSection(data.hero);
        }

        if (data.topPrediction) {
            updateTopPrediction(data.topPrediction);
        }

        if (data.todayPredictions) {
            updateTodayPredictions(data.todayPredictions);
            updateMorePredictions(data.todayPredictions);
            updateWinningExamples(data.todayPredictions);
            removeWrongWinningCalculations(); // <-- ADDED THIS LINE
        }

        if (data.yesterdayResults) {
            // Clear results table COMPLETELY before adding new data
            clearResultsTableCompletely();

            overrideHardcodedStats(data.yesterdayResults);  // <-- ADDED THIS LINE
            updateYesterdayResults(data.yesterdayResults);

            // Wait a tiny bit to ensure previous data is gone
            await new Promise(resolve => setTimeout(resolve, 50));

            // Now add FRESH results
            if (data.yesterdayResults.results && Array.isArray(data.yesterdayResults.results)) {
                updateResultsTable(data.yesterdayResults.results);
            } else {
                console.log('⚠️ No results array found');
                showNoResultsMessage();
            }
        }

        console.log('✅ All fresh data loaded successfully - NO OLD DATA MIXING');

    } catch (error) {
        console.error('❌ Error loading data:', error);
        loadFallbackData();
    }
}

// ===== CLEAR ALL DYNAMIC CONTENT =====
function clearAllDynamicContent() {
    console.log('🧹 Clearing all dynamic content...');

    // 1. Clear results table
    const resultsBody = document.getElementById('results-table-body');
    if (resultsBody) {
        resultsBody.innerHTML = '<div class="loading-results"><div class="loading-spinner"></div><p>Loading fresh results...</p></div>';
    }

    // 2. Clear top prediction
    const topContent = document.getElementById('top-prediction-content');
    if (topContent) {
        topContent.innerHTML = '<div class="loading-top"><div class="loading-spinner"></div><p>Loading fresh prediction...</p></div>';
    }

    // 3. Clear any other cache-sensitive elements
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach(el => {
        el.innerHTML = '';
    });
}

// ===== CLEAR RESULTS TABLE COMPLETELY =====
function clearResultsTableCompletely() {
    const tableBody = document.getElementById('results-table-body');
    if (tableBody) {
        // Use textContent instead of innerHTML for complete removal
        tableBody.textContent = '';
        console.log('✅ Results table completely cleared');
    }
}

// ===== SHOW NO RESULTS MESSAGE =====
function showNoResultsMessage() {
    const tableBody = document.getElementById('results-table-body');
    if (tableBody) {
        tableBody.innerHTML = `
            <div class="table-row no-results">
                <div colspan="5">No results data available. Please check back later.</div>
            </div>
        `;
    }
}

// ===== UPDATE HERO SECTION =====
function updateHeroSection(heroData) {
    if (!heroData) return;

    // Update title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroData.title) {
        heroTitle.innerHTML = heroData.title.replace('WON', '<span class="highlight">WON</span>');
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
    if (stats.length >= 4 && heroData.stats) {
        stats[0].textContent = heroData.stats[0]?.value || '3/3';
        stats[1].textContent = heroData.stats[1]?.value || '103.12';
        stats[2].textContent = heroData.stats[2]?.value || '34.37';
        stats[3].textContent = heroData.stats[3]?.value || '100%';
    }
}

// ===== UPDATE TOP PREDICTION =====
function updateTopPrediction(topData) {
    console.log('🎯 Updating top prediction');

    const topContent = document.getElementById('top-prediction-content');
    if (!topContent) return;

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

    // Get match data
    const match = topData.mainMatch || {};

    // Create HTML
    const html = `
        <div class="top-prediction-card">
            <div class="match-details">
                <div class="match-header">
                    <span class="match-league"><i class="fas fa-crown"></i> ${match.league || 'Champions League 🇪🇺'}</span>
                    <span class="match-time">${match.time || '21:00'}</span>
                    <span class="match-date">Today, ${topData.date || 'December 9, 2025'}</span>
                </div>
                
                <div class="teams">
                    <div class="team">
                        <div class="team-logo" style="background-color: ${match.team1?.color || '#0000FF'}; color: white;">
                            ${match.team1?.code || 'ATA'}
                        </div>
                        <span class="team-name">${match.team1?.name || 'Atalanta'}</span>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo" style="background-color: ${match.team2?.color || '#034694'}; color: white;">
                            ${match.team2?.code || 'CHE'}
                        </div>
                        <span class="team-name">${match.team2?.name || 'Chelsea'}</span>
                    </div>
                </div>
                
                <div class="prediction-main">
                    <div class="prediction-type">
                        <span class="type-label">RMAME PREDICTION:</span>
                        <span class="type-value">${getPredictionText(match.prediction) || 'BTTS Yes'}</span>
                    </div>
                    <div class="prediction-odds">
                        <span class="odds-label">ODDS:</span>
                        <span class="odds-value">@${match.odds || '1.54'}</span>
                    </div>
                </div>
                
                <div class="confidence-high">
                    <div class="confidence-header">
                        <i class="fas fa-bullseye"></i>
                        <span>${match.riskLevel || 'MEDIUM RISK'}</span>
                    </div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${match.confidence || 87}%"></div>
                    </div>
                    <span class="confidence-percent">${match.confidence || 87}% Confidence</span>
                </div>
                
                <div class="profit-info">
                    <div class="profit-item">
                        <span>Stake:</span>
                        <strong>$20.00</strong>
                    </div>
                    <div class="profit-item">
                        <span>Potential Win:</span>
                        <strong class="won">$${(20 * (match.odds || 1.54)).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;

    topContent.innerHTML = html;
    console.log('✅ Top prediction updated');
}

// ===== UPDATE TODAY'S PREDICTIONS (FIXED FOR YOUR JSON) =====
function updateTodayPredictions(predictionsData) {
    console.log('⚽ Loading today\'s predictions...');

    const predictionsGrid = document.querySelector('.predictions-grid');
    if (!predictionsGrid) {
        console.error('❌ Predictions grid not found');
        return;
    }

    // ===== FIX 1: UPDATE DATE FROM JSON =====
    const predictionsSubtitle = document.querySelector('.predictions-section .section-subtitle');
    if (predictionsSubtitle && predictionsData.subtitle) {
        predictionsSubtitle.textContent = predictionsData.subtitle;
    }
    // ===== END FIX 1 =====

    // Check if we have data
    if (!predictionsData || !predictionsData.predictions || predictionsData.predictions.length === 0) {
        console.log('⚠️ No predictions data available');
        predictionsGrid.innerHTML = `
            <div class="no-predictions" style="grid-column: 1/-1; text-align:center; padding:40px; color:#FF6B35;">
                <h3>📅 No Predictions for Today</h3>
                <p>Check back later for today's matches</p>
            </div>
        `;
        return;
    }

    console.log(`✅ Found ${predictionsData.predictions.length} predictions`);

    // Clear and rebuild
    predictionsGrid.innerHTML = '';

    let html = '';
    predictionsData.predictions.slice(0, 4).forEach((pred, index) => {
        // Extract team names from fixture if team1/team2 not available
        let team1Name = pred.team1?.name || 'Team 1';
        let team2Name = pred.team2?.name || 'Team 2';

        // Clean up names (remove extra spaces)
        team1Name = team1Name.trim();
        team2Name = team2Name.trim();

        // Get team codes
        const team1Code = pred.team1?.code || team1Name.substring(0, 3).toUpperCase();
        const team2Code = pred.team2?.code || team2Name.substring(0, 3).toUpperCase();

        // Clean league name
        const league = (pred.league || 'Europa League').trim();

        html += `
            <div class="match-card">
                <div class="match-header">
                    <span class="match-league"><i class="fas fa-trophy"></i> ${league}</span>
                    <span class="match-time">${pred.time || '20:45'}</span>
                </div>
                <div class="teams">
                    <div class="team">
                        <div class="team-logo" style="background-color: #${getTeamColor(team1Code)}; color: white;">${team1Code}</div>
                        <span class="team-name">${team1Name}</span>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo" style="background-color: #${getTeamColor(team2Code)}; color: white;">${team2Code}</div>
                        <span class="team-name">${team2Name}</span>
                    </div>
                </div>
                <div class="prediction">
                    <span class="prediction-label">RMAME TIP:</span>
                    <span class="prediction-value">${getPredictionText(pred.prediction)}</span>
                    <span class="prediction-odd">@${pred.odds || '1.00'}</span>
                </div>
                <div class="confidence">
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${pred.confidence || 70}%"></div>
                    </div>
                    <span>${pred.confidence || 70}% Confidence</span>
                </div>
            </div>
        `;
    });

    predictionsGrid.innerHTML = html;
    console.log('✅ Today\'s predictions displayed');
}

// ===== UPDATE SHOW MORE PREDICTIONS =====
function updateMorePredictions(predictionsData) {
    console.log('📋 Updating "Show More" predictions...');

    const moreContainer = document.getElementById('morePredictions');
    if (!moreContainer) {
        console.error('❌ More predictions container not found');
        return;
    }

    // Check if we have data
    if (!predictionsData || !predictionsData.predictions || predictionsData.predictions.length <= 4) {
        console.log('⚠️ Not enough predictions for "Show More"');
        moreContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#FF6B35;">No additional predictions available</p>';
        return;
    }

    console.log(`📋 Loading predictions 5-${predictionsData.predictions.length} for "Show More"`);

    // Create new grid for additional predictions
    let html = '<div class="predictions-grid" style="margin-top: 40px;">';

    // Start from index 4 (prediction 5)
    predictionsData.predictions.slice(4).forEach((pred, index) => {
        const actualIndex = index + 5; // Prediction number (5, 6, 7...)

        // Clean up data
        const team1Name = (pred.team1?.name || 'Team 1').trim();
        const team2Name = (pred.team2?.name || 'Team 2').trim();
        const team1Code = pred.team1?.code || team1Name.substring(0, 3).toUpperCase();
        const team2Code = pred.team2?.code || team2Name.substring(0, 3).toUpperCase();
        const league = (pred.league || 'Europa League').trim();

        html += `
            <div class="match-card">
                <div class="match-header">
                    <span class="match-league"><i class="fas fa-trophy"></i> ${league}</span>
                    <span class="match-time">${pred.time || '20:45'}</span>
                </div>
                <div class="teams">
                    <div class="team">
                        <div class="team-logo" style="background-color: #${getTeamColor(team1Code)}; color: white;">${team1Code}</div>
                        <span class="team-name">${team1Name}</span>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo" style="background-color: #${getTeamColor(team2Code)}; color: white;">${team2Code}</div>
                        <span class="team-name">${team2Name}</span>
                    </div>
                </div>
                <div class="prediction">
                    <span class="prediction-label">RMAME TIP:</span>
                    <span class="prediction-value">${getPredictionText(pred.prediction)}</span>
                    <span class="prediction-odd">@${pred.odds || '1.00'}</span>
                </div>
                <div class="confidence">
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${pred.confidence || 70}%"></div>
                    </div>
                    <span>${pred.confidence || 70}% Confidence</span>
                </div>
            </div>
        `;
    });

    html += '</div>';
    moreContainer.innerHTML = html;
    console.log(`✅ "Show More" section updated with ${predictionsData.predictions.length - 4} additional predictions`);
}

// ===== UPDATE WINNING EXAMPLES (NEW FUNCTION) =====
function updateWinningExamples(predictionsData) {
    console.log('💰 Updating winning examples...');

    // First, try to find existing winning-examples container
    let examplesContainer = document.querySelector('.winning-examples');

    // If it doesn't exist, create it and insert it in the right place
    if (!examplesContainer) {
        console.log('📦 Creating winning-examples container...');

        // Find the predictions section
        const predictionsSection = document.querySelector('.predictions-section .container');
        if (!predictionsSection) {
            console.error('❌ Predictions section not found');
            return;
        }

        // Create the winning examples container
        examplesContainer = document.createElement('div');
        examplesContainer.className = 'winning-examples';

        // Insert it after the morePredictions div
        const morePredictionsDiv = document.getElementById('morePredictions');
        if (morePredictionsDiv) {
            morePredictionsDiv.insertAdjacentElement('afterend', examplesContainer);
        } else {
            // If morePredictions doesn't exist, add at end of container
            predictionsSection.appendChild(examplesContainer);
        }
    }

    // Check if we have winning examples
    if (!predictionsData.winningExamples || !Array.isArray(predictionsData.winningExamples)) {
        console.log('⚠️ No winning examples data');
        examplesContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#FF6B35;">No winning examples available</p>';
        return;
    }

    // Create HTML for winning examples
    let html = `
        <div class="examples-header">
            <h3><i class="fas fa-calculator"></i> ${predictionsData.totalPredictions || 9}-Match Accumulator Calculator</h3>
            <p>Total Odds: <strong>${predictionsData.totalOdds || '26.07'}</strong></p>
        </div>
        <div class="examples-grid">
    `;

    predictionsData.winningExamples.forEach((example, index) => {
        html += `
            <div class="example-item">
                <div class="example-stake">
                    <span>Stake:</span>
                    <strong>$${example.stake}</strong>
                </div>
                <div class="example-win">
                    <span>Potential Win:</span>
                    <strong class="won">$${example.win}</strong>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div class="profit-note">
            <p><i class="fas fa-chart-line"></i> ${predictionsData.totalPredictions || 9}-match accumulator = ${((parseFloat(predictionsData.totalOdds || 26.07) - 1) * 100).toFixed(2)}% PROFIT!</p>
        </div>
    `;

    examplesContainer.innerHTML = html;
    console.log('✅ Winning examples updated and placed correctly');
}

// ===== UPDATE YESTERDAY RESULTS =====
function updateYesterdayResults(resultsData) {
    console.log('📊 Yesterday results updated');
}

// ===== UPDATE RESULTS TABLE (FIXED - NO CACHE) =====
function updateResultsTable(results) {
    console.log('📊 Updating results table with FRESH data...');

    const tableBody = document.getElementById('results-table-body');
    if (!tableBody) {
        console.error('❌ Results table body not found');
        return;
    }

    // FINAL CLEAR - just to be 100% sure
    tableBody.innerHTML = '';

    // Validate input
    if (!results || !Array.isArray(results) || results.length === 0) {
        console.log('⚠️ No valid results array provided');
        showNoResultsMessage();
        return;
    }

    console.log(`✅ Building ${results.length} FRESH rows from scratch`);

    // Generate UNIQUE HTML with timestamp to prevent caching
    const uniqueId = Date.now();
    let html = '';

    results.forEach((result, index) => {
        // Create unique ID for each row to prevent cache matching
        const rowId = `result-${uniqueId}-${index}`;

        html += `
            <div class="table-row ${result.outcome || ''}" id="${rowId}" data-timestamp="${uniqueId}">
                <div>${result.fixture || 'No fixture'}</div>
                <div>${result.betType || 'No bet type'}</div>
                <div>@${result.odds || '0.00'}</div>
                <div>${result.result || '-'}</div>
                <div class="status ${result.outcome || ''}">${(result.outcome || '').toUpperCase()}</div>
            </div>
        `;
    });

    // Set the COMPLETELY NEW HTML
    tableBody.innerHTML = html;

    // Remove any old rows that might still exist
    removeOldTableRows(uniqueId);

    console.log(`✅ Results table updated with ${results.length} FRESH rows (ID: ${uniqueId})`);
}

// ===== REMOVE OLD TABLE ROWS =====
function removeOldTableRows(currentTimestamp) {
    const allRows = document.querySelectorAll('.table-row');
    allRows.forEach(row => {
        const rowTimestamp = row.getAttribute('data-timestamp');
        if (rowTimestamp && parseInt(rowTimestamp) < currentTimestamp) {
            row.remove();
            console.log('🧹 Removed old cached row');
        }
    });
}

// ===== HELPER FUNCTIONS =====

// Helper function for team colors
function getTeamColor(teamCode) {
    const colors = {
        'LUD': '0000FF', 'PAO': 'FF0000', 'MID': '008000', 'GEN': 'FFA500',
        'NIC': 'FF69B4', 'BRA': '800080', 'STU': '000080', 'MAC': 'FFD700',
        'UTR': '00CED1', 'NOT': 'DC143C', 'YOU': '32CD32', 'LIL': '8A2BE2',
        'SAM': 'FF4500', 'AEK': '0000CD', 'SHK': 'FF1493', 'SLO': '2E8B57',
        'HAM': 'FF6347', 'SHA': '4682B4', 'CRE': '8B0000',
        'SCH': '0000FF', 'ST.': 'FF0000', 'CFR': '0000CD', 'CSI': 'FF0000',
        'ROU': '0000FF', 'QUE': 'FF0000', 'TOP': '008000', 'ADO': 'FF0000',
        'PAU': '0000FF', 'AMI': 'FF0000', 'AAR': '0000CD', 'ETO': 'FF0000',
        'COL': '0000FF', 'BAN': 'FF0000', 'PSG': '0000CD', 'MON': 'FF0000'
    };
    return colors[teamCode] || '333333';
}

// Helper function to get prediction text
function getPredictionText(predictionCode) {
    if (!predictionCode) return 'Home Win';

    if (predictionCode === '1') return 'Home Win';
    if (predictionCode === '2') return 'Away Win';
    if (predictionCode === 'X') return 'Draw';
    return predictionCode;
}

// ===== FALLBACK DATA =====
function loadFallbackData() {
    console.log('📋 Loading fallback data');

    // Update top prediction with fallback
    const topContent = document.getElementById('top-prediction-content');
    if (topContent) {
        topContent.innerHTML = `
            <div class="top-prediction-card">
                <div class="match-details">
                    <div class="match-header">
                        <span class="match-league"><i class="fas fa-crown"></i> Champions League 🇪🇺</span>
                        <span class="match-time">21:00</span>
                        <span class="match-date">Today, December 9, 2025</span>
                    </div>
                    
                    <div class="teams">
                        <div class="team">
                            <div class="team-logo" style="background-color: #0000FF; color: white;">ATA</div>
                            <span class="team-name">Atalanta</span>
                        </div>
                        <div class="vs">VS</div>
                        <div class="team">
                            <div class="team-logo" style="background-color: #034694; color: white;">CHE</div>
                            <span class="team-name">Chelsea</span>
                        </div>
                    </div>
                    
                    <div class="prediction-main">
                        <div class="prediction-type">
                            <span class="type-label">RMAME PREDICTION:</span>
                            <span class="type-value">BTTS Yes</span>
                        </div>
                        <div class="prediction-odds">
                            <span class="odds-label">ODDS:</span>
                            <span class="odds-value">@1.54</span>
                        </div>
                    </div>
                    
                    <div class="confidence-high">
                        <div class="confidence-header">
                            <i class="fas fa-bullseye"></i>
                            <span>MEDIUM RISK</span>
                        </div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: 87%"></div>
                        </div>
                        <span class="confidence-percent">87% Confidence</span>
                    </div>
                    
                    <div class="profit-info">
                        <div class="profit-item">
                            <span>Stake:</span>
                            <strong>$20.00</strong>
                        </div>
                        <div class="profit-item">
                            <span>Potential Win:</span>
                            <strong class="won">$30.80</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update badge and subtitle
    const badge = document.getElementById('top-badge');
    if (badge) badge.innerHTML = '<i class="fas fa-fire"></i> 87% CONFIDENCE • MEDIUM RISK';

    const subtitle = document.getElementById('top-subtitle');
    if (subtitle) subtitle.textContent = "Today's best betting opportunity with 87% confidence";
}

// ===== OTHER FUNCTIONS (UNCHANGED) =====

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

// ===== SUBSCRIPTION FORM =====
function setupSubscriptionForm() {
    const form = document.getElementById('subscribe');
    if (!form) return;

    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
  // Change placeholder for global numbers
phoneInput.placeholder = "Phone with country code";

// Allow ANY phone number from ANY country
phoneInput.addEventListener('input', function(e) {
    // Allow: numbers, plus sign, spaces, dashes
    let value = e.target.value;
    value = value.replace(/[^\d+\s\-]/g, '');
    e.target.value = value;
});

// Add help text below the input
const helpText = document.createElement('small');
helpText.textContent = "Examples: +1 2345678900 (USA), +44 7911123456 (UK), +251 912345678 (Ethiopia)";
helpText.style.display = "block";
helpText.style.marginTop = "5px";
helpText.style.color = "#666";
helpText.style.fontSize = "12px";
phoneInput.parentNode.appendChild(helpText);     
}
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = this.querySelector('input[type="text"]')?.value || '';
        const email = this.querySelector('input[type="email"]')?.value || '';
        const phone = this.querySelector('input[type="tel"]')?.value || '';
        const packageSelect = this.querySelector('select');
        const packageType = packageSelect?.value || '';
        const packageText = packageSelect?.options[packageSelect.selectedIndex]?.text || '';

        // Get selected payment method
        const paymentMethod = this.querySelector('input[name="payment"]:checked')?.value || 'mobile-money';
        const paymentText = paymentMethod === 'mobile-money' ? 'Mobile Money' : 'Bank Transfer';

        // Create formatted WhatsApp message
        const message = `📋 NEW SUBSCRIPTION REQUEST

Name: ${name}
Email: ${email}
Phone: ${phone}
Package: ${packageText}
Payment: ${paymentText}

Please send payment details.`;

        // Send via WhatsApp
        const whatsappNumber = '251979380726';
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

        // Show confirmation
        setTimeout(() => {
            alert('✅ Subscription request sent! Check WhatsApp for payment details.');
        }, 500);
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

// ===== FIX INLINE STYLES FROM CONTROL PANEL =====
function fixInlineStyles() {
    console.log('🎨 Fixing inline styles from control panel...');

    // Fix results table
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        if (row.style.background || row.style.color) {
            row.removeAttribute('style');
        }
    });

    // Fix status colors
    const statusElements = document.querySelectorAll('.status');
    statusElements.forEach(el => {
        if (el.style.color) {
            el.removeAttribute('style');
        }
    });

    // Fix stat boxes
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach(box => {
        if (box.style.background || box.style.border) {
            box.removeAttribute('style');
        }
    });

    console.log('✅ Inline styles fixed');
}

// Run after page loads
setTimeout(fixInlineStyles, 1000);

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Website loading...');
    initializeWebsite();
});
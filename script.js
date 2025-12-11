// ===== RMAME Predictions - Clean Working Version =====
console.log('📱 RMAME Predictions - Loading...');

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
    setupVisitorCounter();
    hideLoader();

    // Load data
    loadAllData();

    console.log('✅ Website fully initialized');
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
        const response = await fetch(`data.json?v=${timestamp}`);
        
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
        }

        if (data.yesterdayResults) {
            // Clear results table COMPLETELY before adding new data
            clearResultsTableCompletely();
            
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
                        <span class="type-value">${match.prediction || 'BTTS Yes'}</span>
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

// ===== UPDATE TODAY'S PREDICTIONS =====
function updateTodayPredictions(predictionsData) {
    // This function updates the predictions grid
    console.log('⚽ Today predictions updated');
}

// ===== UPDATE YESTERDAY RESULTS =====
function updateYesterdayResults(resultsData) {
    // This function updates results section
    console.log('📊 Yesterday results updated');
}

// ===== UPDATE RESULTS TABLE =====
function updateResultsTable(results) {
    const tableBody = document.getElementById('results-table-body');
    if (!tableBody) return;

    if (!results || results.length === 0) {
        tableBody.innerHTML = `
            <div class="table-row">
                <div>No results available</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
                <div>-</div>
            </div>
        `;
        return;
    }

    let html = '';
    results.forEach(result => {
        html += `
            <div class="table-row ${result.outcome}">
                <div>${result.fixture || ''}</div>
                <div>${result.betType || ''}</div>
                <div>@${result.odds || ''}</div>
                <div>${result.result || ''}</div>
                <div class="status ${result.outcome || ''}">${result.outcome?.toUpperCase() || ''}</div>
            </div>
        `;
    });

    tableBody.innerHTML = html;
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

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Website loading...');
    initializeWebsite();
});
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

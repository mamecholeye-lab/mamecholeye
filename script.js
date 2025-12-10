// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Change icon
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Show More Predictions
const showMoreBtn = document.getElementById('showMorePredictions');
const morePredictions = document.getElementById('morePredictions');

if (showMoreBtn && morePredictions) {
    showMoreBtn.addEventListener('click', function() {
        if (morePredictions.style.display === 'none' || morePredictions.style.display === '') {
            morePredictions.style.display = 'block';
            showMoreBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Show Less Predictions';
        } else {
            morePredictions.style.display = 'none';
            showMoreBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Show More Predictions (4 more)';
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = 60;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== AUTO UPDATE DATES =====
function updateDates() {
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format date like "December 3rd, 2024"
    const options = { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    };
    
    let day = yesterday.getDate();
    let suffix = "th";
    
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    
    const formattedDate = yesterday.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }).replace(',', '') + ` ${day}${suffix}, ${yesterday.getFullYear()}`;
    
    // Update ALL date elements on page
    document.querySelectorAll('.date').forEach(element => {
        element.textContent = formattedDate;
    });
    
    console.log('Dates updated to:', formattedDate);
}

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateDates();
    
    // Also update every day at midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - now;
    
    setTimeout(function() {
        updateDates();
        // Update every 24 hours
        setInterval(updateDates, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
});

// ===== LOADING ANIMATION CONTROL =====
window.addEventListener('load', function() {
    // Wait 1 second then hide loader (makes it feel smoother)
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500); // Match CSS transition time
        }
    }, 1000);
});

// Show loader when page starts loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('RMAME Predictions loading...');
    
    // If page takes too long, hide loader anyway
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }, 5000); // Max 5 seconds loading time
});

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== WHATSAPP SHARE FUNCTION =====
function shareOnWhatsApp(type) {
    const websiteUrl = 'https://mamecholeye-lab.github.io/mamecholeye/';
    
    let message = '';
    
    if (type === 'free') {
        message = `🎯 *FREE FOOTBALL PREDICTIONS* 🎯\n\n`;
        message += `RMAME Predictions is giving away 6 FREE premium predictions today!\n\n`;
        message += `🔥 *Today's Free Predictions:*\n`;
        message += `• 14:00 🇧🇬 FC Dobrudzha vs Ludogorets - BTTS @2.06\n`;
        message += `• 15:30 🇹🇷 Igdir vs Orduspor - 1X @1.04\n`;
        message += `• 19:00 🇧🇬 Slavia Sofia vs Levski Sofia - X2 @1.07\n`;
        message += `• 19:00 🇧🇬 Slavia Sofia vs Levski Sofia - BTTS @2.02\n`;
        message += `• 23:15 🇵🇹 Porto vs Vitoria - 1 @1.36\n`;
        message += `• 02:00 🇧🇷 Palmeiras vs Internacional - 1 @1.62\n\n`;
        message += `✅ *Yesterday's Results: 7/7 WINS!*\n`;
        message += `Get more predictions: ${websiteUrl}`;
        
    } else if (type === 'all') {
        message = `⚽ *PROFESSIONAL FOOTBALL PREDICTIONS* ⚽\n\n`;
        message += `RMAME Predictions - 100% Win Rate Yesterday!\n\n`;
        message += `📊 *Yesterday's Perfect Record:* 7/7 WINS\n`;
        message += `🎯 *Today's Top Pick:* Slavia Sofia vs Levski Sofia\n`;
        message += `💰 *Free Predictions Available*\n\n`;
        message += `Join the winning team and get accurate predictions daily!\n`;
        message += `${websiteUrl}`;
    }
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    if (type === 'free') {
        alert('Sharing free predictions on WhatsApp...');
    } else {
        alert('Sharing all predictions on WhatsApp...');
    }
}

// ===== COPY WEBSITE LINK =====
function shareWebsite() {
    const websiteUrl = 'https://mamecholeye-lab.github.io/mamecholeye/';
    
    // Copy to clipboard
    navigator.clipboard.writeText(websiteUrl)
        .then(() => {
            alert('✅ Website link copied to clipboard!\n\nShare: ' + websiteUrl);
        })
        .catch(err => {
            // Fallback for older browsers
            const tempInput = document.createElement('input');
            tempInput.value = websiteUrl;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('✅ Website link copied to clipboard!\n\nShare: ' + websiteUrl);
        });
}

// ===== SUBSCRIPTION FORM =====
const subscriptionForm = document.getElementById('subscribe');

if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const package = this.querySelector('select').value;
        const paymentMethod = this.querySelector('input[name="payment"]:checked') ? 
                            this.querySelector('input[name="payment"]:checked').value : 'mobile-money';
        
        // Check if all fields are filled
        if (!name || !email || !phone || !package) {
            alert('Please fill all fields!');
            return;
        }
        
        // Prices
        const prices = {
            'daily': '$0.99 per day',
            'weekly': '$9.99 per week', 
            'monthly': '$19.99 per month'
        };
        
        // Create WhatsApp message
        const message = `📋 NEW SUBSCRIPTION REQUEST%0A%0A` +
                       `Name: ${name}%0A` +
                       `Email: ${email}%0A` +
                       `Phone: ${phone}%0A` +
                       `Package: ${package} - ${prices[package]}%0A` +
                       `Payment: ${paymentMethod}%0A%0A` +
                       `Please send payment details.`;
        
        // WhatsApp URL
        const whatsappUrl = `https://wa.me/251979380726?text=${message}`;
        
        // Show success and open WhatsApp
        alert('Opening WhatsApp to send payment details...');
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        this.reset();
        this.querySelector('#mobile-money').checked = true;
    });
}

// Mobile-friendly touch events
document.addEventListener('DOMContentLoaded', function() {
    console.log('RMAME Predictions Mobile Ready!');
    
    // Make buttons easier to tap on mobile
    document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(btn => {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
    });
    
    // Set phone placeholder
    const phoneInput = document.querySelector('#subscribe input[type="tel"]');
    if (phoneInput) {
        phoneInput.placeholder = '+251979380726';
    }
});
// ===== PHONE NUMBER VALIDATION =====
const phoneInput = document.getElementById('phoneInput');

if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        const value = this.value;
        
        // Auto-format: Add +251 if not present
        if (value && !value.startsWith('+251')) {
            if (value.startsWith('0')) {
                // Convert 09... to +2519...
                this.value = '+251' + value.substring(1);
            } else if (value.length > 0 && value.startsWith('9')) {
                // Convert 9... to +2519...
                this.value = '+251' + value;
            }
        }
        
        // Validate Ethiopian number pattern
        const pattern = /^\+251[0-9]{9}$/;
        if (pattern.test(this.value)) {
            this.classList.remove('invalid');
            this.classList.add('valid');
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
        }
    });
    
    // Show Ethiopian format on focus
    phoneInput.addEventListener('focus', function() {
        if (!this.value) {
            this.value = '+251';
        }
    });
                       }
// ===== JSON DATABASE FOR RESULTS =====

async function loadResultsFromJSON() {
    try {
        console.log('Loading results from JSON database...');
        
        // Fetch the JSON file from your GitHub repository
        const response = await fetch('results.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load results: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Results loaded successfully:', data);
        
        // Display the results
        displayResults(data);
        
    } catch (error) {
        console.error('Error loading results from JSON:', error);
        
        // Fallback: Show static results
        showFallbackResults();
        showErrorMessage('Could not load live results. Showing cached data.');
    }
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results-table-body');
    
    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }
    
    // Clear loading message
    resultsContainer.innerHTML = '';
    
    // Check if we have predictions
    if (!data.predictions || data.predictions.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <h4>No results available</h4>
                <p>Check back later for updated results.</p>
            </div>
        `;
        return;
    }
    
    // Create each result row
    data.predictions.forEach(prediction => {
        const resultRow = createResultRow(prediction);
        resultsContainer.appendChild(resultRow);
    });
    
    // Update summary statistics
    updateSummaryStatistics(data);
    
    console.log(`Displayed ${data.predictions.length} results`);
}

function createResultRow(prediction) {
    const row = document.createElement('div');
    row.className = `table-row ${prediction.outcome}`;
    
    // Set background based on outcome
    if (prediction.outcome === 'won') {
        row.style.background = 'rgba(0, 184, 148, 0.05)';
        row.style.borderLeft = '3px solid #00B894';
    } else {
        row.style.background = 'rgba(255, 107, 53, 0.05)';
        row.style.borderLeft = '3px solid #FF4757';
    }
    
    // Set row content
    row.innerHTML = `
        <div data-label="Fixture" style="color: #FFFFFF; font-weight: 600;">
            ${prediction.fixture}
            <br>
            <span class="league" style="color: ${prediction.outcome === 'won' ? '#64D2FF' : '#FF9E6D'};">
                ${prediction.league}
            </span>
        </div>
        <div data-label="Bet Type" style="color: #E8EAEF;">${prediction.betType}</div>
        <div data-label="Odds" style="color: #FFD700; font-weight: 700;">${prediction.odds}</div>
        <div data-label="Result" style="color: ${prediction.outcome === 'won' ? '#64D2FF' : '#FF9E6D'}; font-weight: 700;">${prediction.result}</div>
        <div data-label="Outcome">
            <span class="status ${prediction.outcome}" style="background: ${prediction.outcome === 'won' ? 'rgba(0, 184, 148, 0.2)' : 'rgba(255, 71, 87, 0.2)'}; color: ${prediction.outcome === 'won' ? '#00E6A1' : '#FF6B6B'}; border: 1px solid ${prediction.outcome === 'won' ? 'rgba(0, 230, 161, 0.4)' : 'rgba(255, 107, 107, 0.4)'};">
                ${prediction.outcome === 'won' ? '✅ WIN' : '❌ LOSE'}
            </span>
        </div>
    `;
    
    return row;
}

function updateSummaryStatistics(data) {
    // Update the stats boxes
    const totalWins = data.totalWins || 0;
    const totalLosses = data.totalLosses || 0;
    const winRate = data.winRate || '0%';
    const totalOdds = data.totalOdds || 0;
    
    // Find and update stat boxes
    document.querySelectorAll('.stat-box').forEach((box, index) => {
        switch(index) {
            case 0: // Yesterday's Record
                box.querySelector('.stat-value').textContent = `${totalWins}-${totalLosses}`;
                break;
            case 1: // Win Rate
                box.querySelector('.stat-value').textContent = winRate;
                break;
            case 2: // Total Odds
                box.querySelector('.stat-value').textContent = totalOdds;
                break;
            case 3: // Slip Status
                const slipStatus = totalLosses > 0 ? 'Lost' : 'Won';
                box.querySelector('.stat-value').textContent = slipStatus;
                box.querySelector('.stat-value').style.color = slipStatus === 'Won' ? '#00E6A1' : '#FF6B6B';
                box.querySelector('p').textContent = totalLosses > 0 ? `${totalLosses} losses broke accumulator` : 'Perfect accumulator won!';
                break;
        }
    });
    
    // Update section subtitle
    const subtitle = document.querySelector('#results .section-subtitle');
    if (subtitle) {
        subtitle.textContent = `${data.lastUpdated} - ${totalWins} Wins out of ${totalWins + totalLosses} Predictions`;
    }
}

function showFallbackResults() {
    const resultsContainer = document.getElementById('results-table-body');
    
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="table-row won">
            <div data-label="Fixture" style="color: #FFFFFF; font-weight: 600;">Fleetwood v Salford<br><span class="league" style="color: #FF9E6D;">League Two 🏴󠁧󠁢󠁥󠁮󠁧󠁿</span></div>
            <div data-label="Bet Type" style="color: #E8EAEF;">Draw & BTTS</div>
            <div data-label="Odds" style="color: #FFD700; font-weight: 700;">4.33</div>
            <div data-label="Result" style="color: #FF9E6D; font-weight: 700;">1-1</div>
            <div data-label="Outcome"><span class="status won">✅ WIN</span></div>
        </div>
        <div class="table-row won">
            <div data-label="Fixture" style="color: #FFFFFF; font-weight: 600;">Barrow v Tranmere<br><span class="league" style="color: #FF9E6D;">League Two 🏴󠁧󠁢󠁥󠁮󠁧󠁿</span></div>
            <div data-label="Bet Type" style="color: #E8EAEF;">Away & Over 2.5</div>
            <div data-label="Odds" style="color: #FFD700; font-weight: 700;">4.33</div>
            <div data-label="Result" style="color: #FF9E6D; font-weight: 700;">0-3</div>
            <div data-label="Outcome"><span class="status won">✅ WIN</span></div>
        </div>
        <div class="table-row won">
            <div data-label="Fixture" style="color: #FFFFFF; font-weight: 600;">Notts Co v MK Dons<br><span class="league" style="color: #FF9E6D;">League Two 🏴󠁧󠁢󠁥󠁮󠁧󠁿</span></div>
            <div data-label="Bet Type" style="color: #E8EAEF;">Home & BTTS</div>
            <div data-label="Odds" style="color: #FFD700; font-weight: 700;">5.50</div>
            <div data-label="Result" style="color: #FF9E6D; font-weight: 700;">3-2</div>
            <div data-label="Outcome"><span class="status won">✅ WIN</span></div>
        </div>
    `;
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'json-error-alert';
    alertDiv.style.cssText = `
        background: rgba(255, 107, 53, 0.1);
        border: 2px solid #FF6B35;
        color: #FF6B35;
        padding: 10px 15px;
        border-radius: 8px;
        margin: 10px 0;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    // Insert at the beginning of results section
    const resultsSection = document.querySelector('#results .container');
    if (resultsSection) {
        resultsSection.insertBefore(alertDiv, resultsSection.firstChild);
        
        // Remove after 10 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 10000);
    }
}

// ===== UPDATE PREDICTIONS FROM JSON =====
async function loadPredictionsFromJSON() {
    try {
        // You can create a separate predictions.json file for today's predictions
        const response = await fetch('predictions.json');
        const data = await response.json();
        
        if (data && data.predictions) {
            updatePredictionsDisplay(data.predictions);
        }
    } catch (error) {
        console.log('Using static predictions:', error);
        // Keep existing static predictions
    }
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Load results from JSON
    setTimeout(() => {
        loadResultsFromJSON();
    }, 1500); // Delay to show loading animation
    
    // Load predictions from JSON (optional)
    // loadPredictionsFromJSON();
});

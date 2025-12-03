// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (navMenu) navMenu.classList.remove('active');
            if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FORM SUBMISSION =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert('Subscription request sent successfully! We will contact you within 30 minutes with payment details.');
            
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Log data
            console.log('Subscription Data:', data);
            
        }, 1500);
    });
}

// ===== GOOGLE SHEETS INTEGRATION =====
(function() {
    // Your Google Sheet ID
    const SHEET_ID = '1eNPegfdMCRhyT11d-4n7uawIJmHkHIaMyQmFD-o-bBc';
    const SHEET_NAME = 'Sheet1';
    
    // CSV URL for your sheet
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
    
    async function loadPredictions() {
        console.log('Loading predictions from Google Sheets...');
        
        try {
            const response = await fetch(CSV_URL);
            if (!response.ok) throw new Error('Failed to fetch sheet');
            
            const csvText = await response.text();
            console.log('Sheet data loaded successfully');
            
            // Parse CSV
            const rows = csvText.trim().split('\n');
            if (rows.length < 2) {
                console.log('No data in sheet - using defaults');
                return;
            }
            
            // Get headers
            const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            // Parse first 3 predictions
            const predictions = [];
            for (let i = 1; i < Math.min(rows.length, 4); i++) {
                const row = rows[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
                if (row.length === headers.length) {
                    const pred = {};
                    headers.forEach((header, idx) => {
                        pred[header] = row[idx] || '';
                    });
                    predictions.push(pred);
                }
            }
            
            console.log('Predictions loaded:', predictions);
            updateWebsite(predictions);
            
        } catch (error) {
            console.error('Error loading predictions:', error);
            // Keep default predictions
        }
    }
    
    function updateWebsite(predictions) {
        if (!predictions || predictions.length === 0) return;
        
        const matchCards = document.querySelectorAll('.match-card');
        
        predictions.forEach((pred, index) => {
            if (index < matchCards.length) {
                const card = matchCards[index];
                
                // Extract data - try different column name variations
                const team1 = pred['Team 1'] || pred['team1'] || pred['Team1'] || pred['Home'] || pred['HOME'] || '';
                const team2 = pred['Team 2'] || pred['team2'] || pred['Team2'] || pred['Away'] || pred['AWAY'] || '';
                const league = pred['League'] || pred['league'] || pred['Competition'] || pred['COMPETITION'] || '';
                const tip = pred['Prediction'] || pred['Tip'] || pred['prediction'] || pred['Pick'] || pred['PICK'] || '';
                const odds = pred['Odds'] || pred['odds'] || pred['Odd'] || pred['ODDS'] || '';
                const confidence = pred['Confidence'] || pred['confidence'] || pred['Prob'] || pred['PROB'] || '75';
                
                updateCard(card, team1, team2, league, tip, odds, confidence);
            }
        });
    }
    
    function updateCard(card, team1, team2, league, tip, odds, confidence) {
        // Update league
        const leagueEl = card.querySelector('.match-league');
        if (leagueEl && league) {
            leagueEl.innerHTML = `<i class="fas fa-trophy"></i> ${league}`;
        }
        
        // Update teams
        const teamNames = card.querySelectorAll('.team-name');
        if (teamNames.length >= 2) {
            if (team1) teamNames[0].textContent = team1;
            if (team2) teamNames[1].textContent = team2;
            
            // Update logos
            const logos = card.querySelectorAll('.team-logo');
            if (logos.length >= 2) {
                logos[0].textContent = (team1 || 'T1').substring(0, 3).toUpperCase();
                logos[1].textContent = (team2 || 'T2').substring(0, 3).toUpperCase();
            }
        }
        
        // Update tip
        const tipEl = card.querySelector('.prediction-value');
        if (tipEl && tip) tipEl.textContent = tip;
        
        // Update odds
        const oddsEl = card.querySelector('.prediction-odd');
        if (oddsEl && odds) oddsEl.textContent = `@${odds}`;
        
        // Update confidence
        const confNum = parseInt(confidence);
        if (!isNaN(confNum) && confNum > 0 && confNum <= 100) {
            const confBar = card.querySelector('.confidence-fill');
            const confText = card.querySelector('.confidence span');
            
            if (confBar) confBar.style.width = `${confNum}%`;
            if (confText) confText.textContent = `${confNum}% Confidence`;
        }
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Load predictions after page loads
        setTimeout(loadPredictions, 1000);
        
        // Auto-refresh every 10 minutes
        setInterval(loadPredictions, 10 * 60 * 1000);
    });
})();
// ===== END OF FILE =====

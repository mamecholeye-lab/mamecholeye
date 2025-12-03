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
// ===== SMART GOOGLE SHEETS PARSER =====
async function loadPredictions() {
    const SHEET_ID = '1eNPegfdMCRhyT11d-4n7uawIJmHkHIaMyQmFD-o-bBc';
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
    
    try {
        console.log('Loading predictions from Google Sheets...');
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        
        // Parse CSV
        const rows = csvText.split('\n');
        if (rows.length < 2) {
            console.log('No data in sheet');
            return;
        }
        
        // Get headers (first row)
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        console.log('Sheet headers:', headers);
        
        // Find column indices
        const team1Index = findColumnIndex(headers, ['team1', 'home', 'team 1', 'team_1']);
        const team2Index = findColumnIndex(headers, ['team2', 'away', 'team 2', 'team_2']);
        const predictionIndex = findColumnIndex(headers, ['prediction', 'tip', 'pick', 'bet', 'forecast']);
        const oddsIndex = findColumnIndex(headers, ['odds', 'odd', 'value', 'price']);
        const leagueIndex = findColumnIndex(headers, ['league', 'competition', 'tournament']);
        const confidenceIndex = findColumnIndex(headers, ['confidence', 'prob', 'probability', 'chance']);
        
        console.log('Column indices:', {
            team1Index, team2Index, predictionIndex, 
            oddsIndex, leagueIndex, confidenceIndex
        });
        
        // Process predictions (first 3 rows after header)
        const matchCards = document.querySelectorAll('.match-card');
        
        for (let i = 1; i < Math.min(rows.length, 4); i++) {
            const row = rows[i].split(',');
            if (row.length >= Math.max(team1Index, team2Index, predictionIndex, oddsIndex, leagueIndex, confidenceIndex)) {
                
                // Extract data using found indices
                const team1 = team1Index >= 0 ? row[team1Index]?.trim() : '';
                const team2 = team2Index >= 0 ? row[team2Index]?.trim() : '';
                const prediction = predictionIndex >= 0 ? row[predictionIndex]?.trim() : '';
                const odds = oddsIndex >= 0 ? row[oddsIndex]?.trim() : '';
                const league = leagueIndex >= 0 ? row[leagueIndex]?.trim() : '';
                const confidence = confidenceIndex >= 0 ? row[confidenceIndex]?.trim() : '75';
                
                console.log(`Row ${i}:`, { team1, team2, prediction, odds, league, confidence });
                
                // Update website if we have a match card
                if (i-1 < matchCards.length) {
                    updateMatchCard(matchCards[i-1], team1, team2, league, prediction, odds, confidence);
                }
            }
        }
        
    } catch (error) {
        console.error('Error loading predictions:', error);
    }
}

// Helper function to find column index
function findColumnIndex(headers, possibleNames) {
    for (const name of possibleNames) {
        const index = headers.indexOf(name.toLowerCase());
        if (index !== -1) return index;
    }
    return -1; // Not found
}

// Update match card with correct data
function updateMatchCard(card, team1, team2, league, prediction, odds, confidence) {
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
    
    // Update league
    const leagueEl = card.querySelector('.match-league');
    if (leagueEl && league) {
        leagueEl.innerHTML = `<i class="fas fa-trophy"></i> ${league}`;
    }
    
    // Update prediction (THIS IS WHAT YOU WANT TO SHOW!)
    const predValue = card.querySelector('.prediction-value');
    if (predValue && prediction) {
        predValue.textContent = prediction; // Will show "Home wins" or whatever you write
    }
    
    // Update odds
    const oddsEl = card.querySelector('.prediction-odd');
    if (oddsEl && odds) {
        oddsEl.textContent = `@${odds}`;
    }
    
    // Update confidence
    const confNum = parseInt(confidence);
    if (!isNaN(confNum)) {
        const confBar = card.querySelector('.confidence-fill');
        const confText = card.querySelector('.confidence span');
        
        if (confBar) confBar.style.width = `${confNum}%`;
        if (confText) confText.textContent = `${confNum}% Confidence`;
    }
}

// Load on page ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadPredictions, 1000);
    setInterval(loadPredictions, 10 * 60 * 1000); // Refresh every 10 minutes
});
})();
// ===== END OF FILE =====

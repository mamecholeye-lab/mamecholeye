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
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Subscription request sent successfully! We will contact you within 30 minutes with payment details.');
            
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            console.log('Subscription Data:', data);
            
        }, 1500);
    });
}

// ===== SMART GOOGLE SHEETS PARSER - SHOWS "Home wins" =====
async function loadPredictions() {
    const SHEET_ID = '1eNPegfdMCRhyT11d-4n7uawIJmHkHIaMyQmFD-o-bBc';
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
    
    try {
        console.log('📡 Loading predictions from Google Sheets...');
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        
        const rows = csvText.split('\n');
        if (rows.length < 2) {
            console.log('No data in sheet');
            return;
        }
        
        // Get headers
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        console.log('📊 Sheet headers:', headers);
        
        // Find columns
        const team1Index = findColumnIndex(headers, ['team1', 'home', 'team 1']);
        const team2Index = findColumnIndex(headers, ['team2', 'away', 'team 2']);
        const predictionIndex = findColumnIndex(headers, ['prediction', 'tip', 'pick']);
        const oddsIndex = findColumnIndex(headers, ['odds', 'odd']);
        const leagueIndex = findColumnIndex(headers, ['league', 'competition']);
        const confidenceIndex = findColumnIndex(headers, ['confidence', 'prob']);
        
        console.log('📍 Column positions:', { team1Index, team2Index, predictionIndex, oddsIndex, leagueIndex, confidenceIndex });
        
        // Update match cards
        const matchCards = document.querySelectorAll('.match-card');
        
        for (let i = 1; i < Math.min(rows.length, 4); i++) {
            const row = rows[i].split(',');
            
            const team1 = team1Index >= 0 ? cleanCell(row[team1Index]) : '';
            const team2 = team2Index >= 0 ? cleanCell(row[team2Index]) : '';
            const prediction = predictionIndex >= 0 ? cleanCell(row[predictionIndex]) : '';
            const odds = oddsIndex >= 0 ? cleanCell(row[oddsIndex]) : '';
            const league = leagueIndex >= 0 ? cleanCell(row[leagueIndex]) : '';
            const confidence = confidenceIndex >= 0 ? cleanCell(row[confidenceIndex]) : '75';
            
            console.log(`🎯 Row ${i} prediction: "${prediction}"`);
            
            if (i-1 < matchCards.length) {
                updateMatchCard(matchCards[i-1], team1, team2, league, prediction, odds, confidence);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

function findColumnIndex(headers, possibleNames) {
    for (const name of possibleNames) {
        const index = headers.indexOf(name.toLowerCase());
        if (index !== -1) return index;
    }
    return -1;
}

function cleanCell(cell) {
    if (!cell) return '';
    return cell.toString().replace(/"/g, '').trim();
}

function updateMatchCard(card, team1, team2, league, prediction, odds, confidence) {
    // Update teams
    const teamNames = card.querySelectorAll('.team-name');
    if (teamNames.length >= 2) {
        if (team1) teamNames[0].textContent = team1;
        if (team2) teamNames[1].textContent = team2;
        
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
    
    // ⭐⭐⭐⭐ THIS IS THE IMPORTANT PART ⭐⭐⭐⭐
    const predValue = card.querySelector('.prediction-value');
    if (predValue) {
        predValue.textContent = prediction || 'Tip';
        console.log(`✅ Set prediction to: "${prediction}"`);
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadPredictions, 1000);
    setInterval(loadPredictions, 5 * 60 * 1000);
});
// Show/Hide More Predictions
document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('showMorePredictions');
    const morePredictions = document.getElementById('morePredictions');
    
    if (showMoreBtn && morePredictions) {
        showMoreBtn.addEventListener('click', function() {
            if (morePredictions.style.display === 'none') {
                morePredictions.style.display = 'block';
                showMoreBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Show Less Predictions';
                showMoreBtn.classList.remove('btn-primary');
                showMoreBtn.classList.add('btn-secondary');
            } else {
                morePredictions.style.display = 'none';
                showMoreBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Show More Predictions (4 more)';
                showMoreBtn.classList.remove('btn-secondary');
                showMoreBtn.classList.add('btn-primary');
            }
        });
    }
});

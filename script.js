// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Update active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling in CSS
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: #2563eb !important;
        font-weight: bold;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            display: none;
        }
        
        .nav-links a {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .nav-links a:last-child {
            border-bottom: none;
        }
    }
`;
document.head.appendChild(style);
// EASY UPDATE TEMPLATE - Add to your script.js

const todaysPredictions = [
    {
        match: "Man United vs Chelsea",
        league: "Premier League",
        time: "20:00",
        tip: "GG",
        odds: "1.95",
        confidence: 78
    },
   // Google Sheets Integration for Predictions
async function loadPredictionsFromGoogleSheets() {
    // Your published Google Sheets CSV URL
    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEvEwgk32vX6A4i1Cxb88QLPV3ESa56hY5Hdd_33x-7hT7wIKkI9P7I0TKGKb9R1lQ/pub?output=csv';
    
    try {
        const response = await fetch(sheetURL);
        const csvText = await response.text();
        const predictions = parseCSV(csvText);
        
        // Update website with predictions
        updateWebsitePredictions(predictions);
    } catch (error) {
        console.log('Error loading predictions:', error);
        // Keep default predictions if sheet fails
    }
}

function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');
    
    const predictions = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        if (row.length === headers.length) {
            const prediction = {};
            headers.forEach((header, index) => {
                prediction[header.trim()] = row[index]?.trim();
            });
            predictions.push(prediction);
        }
    }
    return predictions;
}

function updateWebsitePredictions(predictions) {
    // Update Today's Predictions section
    const todayPredictions = predictions.filter(p => p.Status === 'Today');
    
    todayPredictions.forEach((pred, index) => {
        if (index < 3) { // Update first 3 match cards
            updateMatchCard(index + 1, pred);
        }
    });
    
    // Update Results table
    updateResultsTable(predictions);
}

function updateMatchCard(cardNumber, prediction) {
    const matchCard = document.querySelectorAll('.match-card')[cardNumber - 1];
    if (!matchCard) return;
    
    // Update league
    const leagueElement = matchCard.querySelector('.match-league');
    if (leagueElement) {
        leagueElement.innerHTML = `<i class="fas fa-trophy"></i> ${prediction.League || 'League'}`;
    }
    
    // Update teams
    const teamNames = matchCard.querySelectorAll('.team-name');
    if (teamNames.length >= 2) {
        teamNames[0].textContent = prediction['Team 1'] || 'Team 1';
        teamNames[1].textContent = prediction['Team 2'] || 'Team 2';
    }
    
    // Update team logos (abbreviations)
    const teamLogos = matchCard.querySelectorAll('.team-logo');
    if (teamLogos.length >= 2) {
        teamLogos[0].textContent = (prediction['Team 1'] || 'T1').substring(0, 3).toUpperCase();
        teamLogos[1].textContent = (prediction['Team 2'] || 'T2').substring(0, 3).toUpperCase();
    }
    
    // Update prediction
    const predValue = matchCard.querySelector('.prediction-value');
    if (predValue) predValue.textContent = prediction.Prediction || 'Tip';
    
    // Update odds
    const predOdds = matchCard.querySelector('.prediction-odd');
    if (predOdds) predOdds.textContent = `@${prediction.Odds || '1.80'}`;
    
    // Update confidence
    const confidenceBar = matchCard.querySelector('.confidence-fill');
    const confidenceText = matchCard.querySelector('.confidence span');
    const confidence = parseInt(prediction.Confidence) || 75;
    
    if (confidenceBar) confidenceBar.style.width = `${confidence}%`;
    if (confidenceText) confidenceText.textContent = `${confidence}% Confidence`;
}

function updateResultsTable(predictions) {
    const completedPredictions = predictions.filter(p => p.Status === 'WON' || p.Status === 'LOST');
    
    completedPredictions.slice(0, 4).forEach((pred, index) => {
        const rowNumber = index + 1;
        const dateElement = document.getElementById(`date-${rowNumber}`);
        const matchElement = document.getElementById(`match-${rowNumber}`);
        const predictionElement = document.getElementById(`prediction-${rowNumber}`);
        const oddsElement = document.getElementById(`odds-${rowNumber}`);
        const resultElement = document.getElementById(`result-${rowNumber}`);
        const statusElement = document.getElementById(`status-${rowNumber}`);
        
        if (dateElement) dateElement.textContent = pred.Date || 'Today';
        if (matchElement) matchElement.textContent = `${pred['Team 1'] || ''} vs ${pred['Team 2'] || ''}`;
        if (predictionElement) predictionElement.textContent = pred.Prediction || '';
        if (oddsElement) oddsElement.textContent = pred.Odds || '';
        if (resultElement) resultElement.textContent = pred.Result || '';
        
        if (statusElement && pred.Status) {
            statusElement.textContent = pred.Status;
            statusElement.className = `status ${pred.Status.toLowerCase()}`;
        }
    });
}

// Load predictions when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPredictionsFromGoogleSheets();
    
    // Auto-refresh predictions every 5 minutes
    setInterval(loadPredictionsFromGoogleSheets, 300000);
}); 
https://docs.google.com/spreadsheets/d/1eNPegfdMCRhyT11d-4n7uawIJmHkHIaMyQmFD-o-bBc/edit?usp=drivesdk

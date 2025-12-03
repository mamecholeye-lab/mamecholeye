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
    {
        match: "Real Madrid vs Barcelona",
        league: "La Liga",
        time: "21:00",
        tip: "Over 2.5",
        odds: "1.80",
        confidence: 82
    },
    {
        match: "Juventus vs AC Milan",
        league: "Serie A",
        time: "19:45",
        tip: "2 Draw No Bet",
        odds: "2.10",
        confidence: 75
    }
];

function updateAllPredictions() {
    todaysPredictions.forEach((pred, index) => {
        const teams = pred.match.split(' vs ');
        updatePrediction(index + 1, teams[0], teams[1], pred.tip, pred.odds, pred.confidence);
        
        // Update league and time
        const matchCards = document.querySelectorAll('.match-card');
        const card = matchCards[index];
        const league = card.querySelector('.match-league');
        const time = card.querySelector('.match-time');
        if (league) league.innerHTML = `<i class="fas fa-trophy"></i> ${pred.league}`;
        if (time) time.textContent = pred.time;
    });
}

// Update predictions daily
updateAllPredictions();

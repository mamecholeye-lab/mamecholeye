/* ===== FIX NAVIGATION & SCROLLING ===== */
.nav-menu {
    transition: all 0.3s ease-in-out !important;
}

.nav-menu.active {
    display: flex !important;
    flex-direction: column !important;
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
    background: rgba(26, 26, 46, 0.98) !important;
    padding: 20px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
    backdrop-filter: blur(20px) !important;
    border-top: 2px solid #FF6B35 !important;
    z-index: 1000 !important;
}

.nav-menu.active .nav-link {
    padding: 12px 0 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    width: 100% !important;
    text-align: center !important;
}

.nav-menu.active .nav-btn {
    margin-top: 15px !important;
    width: 100% !important;
    text-align: center !important;
}

/* Fix scrolling issue */
html {
    scroll-behavior: smooth !important;
}

/* Active link styling */
.nav-link.active {
    color: #FF6B35 !important;
    font-weight: 700 !important;
}

.nav-link.active::after {
    content: '' !important;
    position: absolute !important;
    bottom: -5px !important;
    left: 0 !important;
    width: 100% !important;
    height: 3px !important;
    background: #FF6B35 !important;
    border-radius: 2px !important;
}

/* Mobile menu button */
.menu-toggle {
    display: none !important;
    background: none !important;
    border: 2px solid rgba(255, 107, 53, 0.3) !important;
    color: white !important;
    width: 45px !important;
    height: 45px !important;
    border-radius: 10px !important;
    font-size: 20px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
}

.menu-toggle:hover {
    border-color: #FF6B35 !important;
    background: rgba(255, 107, 53, 0.1) !important;
}

/* Responsive navigation */
@media (max-width: 992px) {
    .nav-menu {
        display: none !important;
    }
    
    .menu-toggle {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
}

@media (min-width: 993px) {
    .nav-menu {
        display: flex !important;
    }
    
    .menu-toggle {
        display: none !important;
    }
}

/* Fix z-index issues */
.navbar {
    z-index: 9999 !important;
}

section {
    scroll-margin-top: 100px !important;
}

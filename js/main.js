document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn'); // User menu dropdown icon
    const logoutDropdown = document.getElementById('logout-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Mobile Menu Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Handle Login State
    if (isLoggedIn === 'true') {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
    }

    // Handle User Menu Dropdown (Logout)
    if (hamburgerBtn && logoutDropdown) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = logoutDropdown.style.display === 'block';
            logoutDropdown.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.reload();
        });
    }

    // Handle Mobile Menu Toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
        });
    }

    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        // Close logout dropdown
        if (logoutDropdown && logoutDropdown.style.display === 'block' && userMenu && !userMenu.contains(e.target)) {
            logoutDropdown.style.display = 'none';
        }
        
        // Close mobile menu
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('open');
            }
        }
    });
});

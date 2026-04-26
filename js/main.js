import { auth, db } from './firebase-config.js';
import { 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn'); // User menu dropdown icon
    const logoutDropdown = document.getElementById('logout-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Mobile Menu Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Handle Firebase Auth State Globally
    onAuthStateChanged(auth, async (user) => {
        const loginBtn = document.getElementById('login-btn');
        const userMenu = document.getElementById('user-menu');
        const userNameDisplay = document.getElementById('user-name-display');
        
        // Only consider the user "logged in" if they have verified their email
        if (user && user.emailVerified) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';

            // Fetch user name from Firestore to display in header
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userNameDisplay) {
                    const userData = userDoc.data();
                    // Display first name or full name
                    userNameDisplay.textContent = userData.name.split(' ')[0];
                }
            } catch (error) {
                console.error("Error fetching user name for header:", error);
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userMenu) userMenu.style.display = 'none';
        }
    });

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
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await signOut(auth);
                // Redirect to home or reload
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Logout error:", error);
            }
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

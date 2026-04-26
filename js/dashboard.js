import { auth, db } from './firebase-config.js';
import { 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { 
    doc, 
    getDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function() {
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const displayRoll = document.getElementById('display-roll');
    const displayYear = document.getElementById('display-year');
    const displaySection = document.getElementById('display-section');
    const profileInitials = document.getElementById('profile-initials');
    
    const updateForm = document.getElementById('profile-update-form');
    const updateYearField = document.getElementById('update-year');
    const updateSectionField = document.getElementById('update-section');
    const updateMsg = document.getElementById('update-msg');

    // Stats Placeholders
    const countUploads = document.getElementById('count-uploads');
    const countBookmarks = document.getElementById('count-bookmarks');
    const displayContributions = document.getElementById('display-contributions');

    // Protect Dashboard Page - Check Auth State
    onAuthStateChanged(auth, async (user) => {
        if (user && user.emailVerified) {
            // Fetch User Data from Firestore
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    
                    // Update Sidebar UI
                    displayName.textContent = data.name || 'Student';
                    displayEmail.textContent = user.email;
                    displayRoll.textContent = data.rollNumber || '---';
                    displayYear.textContent = data.year || 'Not set';
                    displaySection.textContent = data.section || 'Not set';
                    
                    // Set Initials
                    const nameParts = (data.name || 'User').trim().split(' ');
                    const initials = nameParts.length > 1 
                        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                        : nameParts[0][0].toUpperCase();
                    profileInitials.textContent = initials;

                    // Prefill form fields
                    if (updateYearField) updateYearField.value = data.year || '';
                    if (updateSectionField) updateSectionField.value = data.section || '';

                    // Initialize Placeholders
                    if (countUploads) countUploads.textContent = data.uploadsCount || 0;
                    if (countBookmarks) countBookmarks.textContent = (data.bookmarks || []).length;
                    if (displayContributions) displayContributions.textContent = data.contributionsCount || 0;
                } else {
                    console.warn("User profile document not found in Firestore.");
                    displayName.textContent = "Profile Not Found";
                    displayEmail.textContent = user.email;
                    updateMsg.textContent = "Your profile details are missing. Please try re-registering or check database rules.";
                    updateMsg.style.display = 'block';
                    updateMsg.style.color = '#ef4444';
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                displayName.textContent = "Error Loading Profile";
                updateMsg.textContent = "Permission denied or database error. Check your Firestore rules.";
                updateMsg.style.display = 'block';
                updateMsg.style.color = '#ef4444';
            }
        } else {
            // Not logged in, redirect to login page
            window.location.href = 'login.html';
        }
    });

    // Handle Profile Update Form
    if (updateForm) {
        updateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) return;

            const newYear = updateYearField.value;
            const newSection = updateSectionField.value.trim();

            try {
                updateMsg.textContent = 'Saving changes...';
                updateMsg.style.color = '#3b82f6';
                updateMsg.style.display = 'block';

                // Update Firestore
                await updateDoc(doc(db, "users", user.uid), {
                    year: newYear,
                    section: newSection
                });

                // Update Local UI
                displayYear.textContent = newYear || 'Not set';
                displaySection.textContent = newSection || 'Not set';

                updateMsg.textContent = 'Profile updated successfully!';
                updateMsg.style.color = '#10b981';
                
                // Hide message after 3 seconds
                setTimeout(() => {
                    updateMsg.style.display = 'none';
                }, 3000);

            } catch (error) {
                console.error("Update error:", error);
                updateMsg.textContent = 'Failed to update profile. Please try again.';
                updateMsg.style.color = '#ef4444';
            }
        });
    }
});

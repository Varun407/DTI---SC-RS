import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const toggleRegister = document.getElementById('toggle-register');
    const toggleLogin = document.getElementById('toggle-login');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');

    const emailRegex = /^24b91a05[0-9a-wA-W][0-9]@srkrec\.ac\.in$/;

    function validateEmail(email) {
        return emailRegex.test(email);
    }

    // Toggle between Login and Register
    if (toggleRegister) {
        toggleRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
            if (loginError) loginError.style.display = 'none';
            if (registerSuccess) registerSuccess.style.display = 'none';
        });
    }

    if (toggleLogin) {
        toggleLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
            if (registerError) registerError.style.display = 'none';
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();
            const password = document.getElementById('password').value;

            if (!validateEmail(email)) {
                loginError.innerHTML = `<strong>Invalid ID Format!</strong><br>Your ID must follow the SRKREC pattern: 24b91a05xx@srkrec.ac.in`;
                loginError.style.display = 'block';
                return;
            }

            try {
                loginError.style.display = 'none';
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Check if email is verified
                if (!user.emailVerified) {
                    loginError.innerHTML = `<strong>Email Not Verified!</strong><br>Please check your inbox and verify your email before logging in.`;
                    loginError.style.display = 'block';
                    await signOut(auth); // Sign them out so they don't stay logged in unverified
                    return;
                }

                window.location.href = 'index.html';
            } catch (error) {
                console.error("Login error:", error);
                loginError.textContent = getFriendlyErrorMessage(error.code);
                loginError.style.display = 'block';
            }
        });
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const emailInput = document.getElementById('reg-email');
            const email = emailInput.value.trim();
            const password = document.getElementById('reg-password').value;

            if (!validateEmail(email)) {
                registerError.innerHTML = `<strong>Invalid ID Format!</strong><br>Your ID must follow the SRKREC pattern: 24b91a05xx@srkrec.ac.in`;
                registerError.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                registerError.textContent = "Password should be at least 6 characters long.";
                registerError.style.display = 'block';
                return;
            }

            try {
                registerError.style.display = 'none';
                registerSuccess.style.display = 'none';
                
                console.log("Starting registration for:", email);
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("User created successfully:", user.uid);
                
                // 1. Send Verification Email
                try {
                    await sendEmailVerification(user);
                    console.log("Verification email sent");
                } catch (verifyError) {
                    console.error("Verification email error:", verifyError);
                    // Don't stop if verification fails to send, but log it
                }

                // 2. Extract Roll Number from email
                const rollNumber = email.split('@')[0].toUpperCase();

                // 3. Store additional data in Firestore
                try {
                    await setDoc(doc(db, "users", user.uid), {
                        name: name,
                        email: email,
                        rollNumber: rollNumber,
                        role: 'student',
                        year: '',
                        section: '',
                        createdAt: new Date()
                    });
                    console.log("User data stored in Firestore");
                } catch (firestoreError) {
                    console.error("Firestore storage error:", firestoreError);
                    // If Firestore fails, we should still show the verification message 
                    // because the account WAS created in Auth.
                }

                // 4. Show success feedback
                registerForm.style.display = 'none';
                const registerTitle = document.querySelector('#register-section h2');
                if (registerTitle) registerTitle.textContent = 'Registration Successful!';
                
                registerSuccess.innerHTML = `
                    <div style="text-align: center; padding: 20px 0;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #10b981; margin-bottom: 15px; display: block;"></i>
                        <p style="font-size: 16px; color: #111827; margin-bottom: 10px;">A verification link has been sent to:</p>
                        <strong style="font-size: 18px; color: #2563eb; display: block; margin-bottom: 20px;">${email}</strong>
                        <p style="color: #6b7280; margin-bottom: 20px;">Please check your inbox (and spam folder). You must verify your email before you can log in.</p>
                        <button onclick="location.reload()" class="btn" style="background-color: #111827;">Back to Login</button>
                    </div>
                `;
                registerSuccess.style.display = 'block';
                
                // Sign out the user so they have to login AFTER verifying
                await signOut(auth);
                console.log("User signed out after registration");

            } catch (error) {
                console.error("Registration overall error:", error);
                registerError.textContent = getFriendlyErrorMessage(error.code) + (error.message ? " (" + error.message + ")" : "");
                registerError.style.display = 'block';
            }
        });
    }

    function getFriendlyErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please login instead.';
            case 'auth/invalid-email':
                return 'The email address is not valid.';
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled.';
            case 'auth/weak-password':
                return 'The password is too weak.';
            case 'auth/user-disabled':
                return 'This user account has been disabled.';
            case 'auth/user-not-found':
                return 'No user found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/invalid-credential':
                return 'Invalid email or password.';
            default:
                return 'An error occurred. Please try again later.';
        }
    }
});

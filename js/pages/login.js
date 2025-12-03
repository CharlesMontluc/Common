// Login Page

(function() {
    console.log('Login page loaded');
    
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('Login form not found');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('formError');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Disable button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
        }
        
        try {
            errorDiv.style.display = 'none';
            
            // Sign in with Firebase
            const result = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful:', result.user.email);
            
            // Get user profile to check type
            const userDoc = await db.collection('users').doc(result.user.uid).get();
            
            if (userDoc.exists) {
                const profile = userDoc.data();
                if (profile.userType === 'student') {
                    window.location.hash = '/student/dashboard';
                } else if (profile.userType === 'recruiter') {
                    window.location.hash = '/recruiter/dashboard';
                } else {
                    window.location.hash = '/onboarding';
                }
            } else {
                window.location.hash = '/onboarding';
            }
            
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        }
    });
})();

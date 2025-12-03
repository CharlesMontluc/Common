// Signup Page

(function() {
    console.log('Signup page loaded');
    
    const form = document.getElementById('signupForm');
    if (!form) {
        console.error('Signup form not found');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('formError');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Clear errors
        errorDiv.style.display = 'none';
        
        // Validate passwords
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Disable button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';
        }
        
        try {
            // Create user with Firebase
            const result = await auth.createUserWithEmailAndPassword(email, password);
            console.log('Signup successful:', result.user.email);
            
            // Go to onboarding
            window.location.hash = '/onboarding';
            
        } catch (error) {
            console.error('Signup error:', error);
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
            }
        }
    });
})();

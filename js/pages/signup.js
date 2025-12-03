// Signup page logic

function initSignup() {
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

        // Clear previous errors
        errorDiv.style.display = 'none';
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('confirmPasswordError').textContent = '';

        // Validate
        let hasError = false;
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            hasError = true;
        }
        if (password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
            hasError = true;
        }

        if (hasError) return;

        try {
            console.log('Attempting signup with:', email);
            await authManager.signUp(email, password);
            console.log('Signup successful, navigating to onboarding');
            window.location.hash = '/onboarding';
        } catch (error) {
            console.error('Signup error:', error);
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
    });
}

// Wait a tiny bit for DOM to be ready
setTimeout(initSignup, 100);

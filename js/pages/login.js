// Login page logic

function initLogin() {
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

        try {
            console.log('Attempting login with:', email);
            errorDiv.style.display = 'none';
            
            await authManager.signIn(email, password);
            console.log('Login successful');
            
            // Redirect based on user type
            if (authManager.isStudent()) {
                console.log('Redirecting to student dashboard');
                window.location.hash = '/student/dashboard';
            } else if (authManager.isRecruiter()) {
                console.log('Redirecting to recruiter dashboard');
                window.location.hash = '/recruiter/dashboard';
            } else {
                console.log('Redirecting to onboarding');
                window.location.hash = '/onboarding';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
    });
}

// Wait a tiny bit for DOM to be ready
setTimeout(initLogin, 100);

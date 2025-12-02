// Login page logic

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('formError');

    try {
        errorDiv.style.display = 'none';
        
        await authManager.signIn(email, password);
        
        // Redirect based on user type
        if (authManager.isStudent()) {
            router.navigate('/student/dashboard');
        } else if (authManager.isRecruiter()) {
            router.navigate('/recruiter/dashboard');
        } else {
            router.navigate('/onboarding');
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
});

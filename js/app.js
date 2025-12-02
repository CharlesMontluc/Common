// Main Application

document.addEventListener('DOMContentLoaded', async () => {
    console.log('BAIT - Initializing Application');

    try {
        // Initialize auth
        await authManager.init();

        // Setup routes
        setupRoutes();

        // Navigate to initial page
        const path = window.location.pathname || '/';
        
        if (authManager.isAuthenticated()) {
            // Route authenticated users to their dashboard
            if (authManager.isStudent()) {
                router.navigate('/student/dashboard');
            } else if (authManager.isRecruiter()) {
                router.navigate('/recruiter/dashboard');
            } else {
                // Profile not complete, go to onboarding
                router.navigate('/onboarding');
            }
        } else {
            // Route unauthenticated users
            if (path === '/' || path === '/login' || path === '/signup' || path === '/onboarding') {
                router.navigate(path);
            } else {
                router.navigate('/login');
            }
        }
    } catch (error) {
        console.error('App initialization error:', error);
    }
});

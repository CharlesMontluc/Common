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
                await router.navigate('/student/dashboard');
            } else if (authManager.isRecruiter()) {
                await router.navigate('/recruiter/dashboard');
            } else {
                // Profile not complete, go to onboarding
                await router.navigate('/onboarding');
            }
        } else {
            // Route unauthenticated users
            if (path === '/' || path === '/login' || path === '/signup' || path === '/onboarding') {
                await router.navigate(path);
            } else {
                await router.navigate('/');
            }
        }
    } catch (error) {
        console.error('App initialization error:', error);
        // Fallback: show landing page on error
        await router.navigate('/');
    }
});

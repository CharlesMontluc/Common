// Main Application

document.addEventListener('DOMContentLoaded', async () => {
    console.log('BAIT - Initializing Application');

    try {
        // Setup routes first
        setupRoutes();
        
        // Initialize auth
        await authManager.init();

        // Get current path from hash
        const path = window.location.hash.slice(1) || '/';
        console.log('Initial path:', path);
        
        // Public routes that don't need auth check
        const publicRoutes = ['/', '/login', '/signup'];
        
        if (publicRoutes.includes(path)) {
            // Just navigate to the requested public page
            await router.navigate(path);
        } else if (authManager.isAuthenticated()) {
            // Authenticated user trying to access protected route
            if (path === '/onboarding' || !authManager.currentUserProfile?.profileComplete) {
                await router.navigate('/onboarding');
            } else if (authManager.isStudent()) {
                await router.navigate(path.startsWith('/student') ? path : '/student/dashboard');
            } else if (authManager.isRecruiter()) {
                await router.navigate(path.startsWith('/recruiter') ? path : '/recruiter/dashboard');
            } else {
                await router.navigate('/onboarding');
            }
        } else {
            // Not authenticated and trying to access protected route
            await router.navigate('/');
        }
    } catch (error) {
        console.error('App initialization error:', error);
        await router.navigate('/');
    }
});

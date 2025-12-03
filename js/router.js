// Router Module - Handles navigation between pages

class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
    }

    // Register a route
    register(path, htmlFile, scriptFile = null) {
        this.routes[path] = { htmlFile, scriptFile };
    }

    // Navigate to a page
    async navigate(path) {
        console.log('Router.navigate called with path:', path);
        
        // Allow public routes without authentication
        const publicRoutes = ['/', '/login', '/signup', '/onboarding'];
        
        // Check if user is authenticated for protected routes
        if (!publicRoutes.includes(path) && !authManager.isAuthenticated()) {
            console.log('Not authenticated, redirecting to login');
            window.location.hash = '/login';
            return;
        }

        if (!this.routes[path]) {
            console.warn(`Route not found: ${path}, redirecting to /`);
            window.location.hash = '/';
            return;
        }

        // Don't re-navigate to the same page
        if (this.currentPage === path) {
            console.log('Already on this page, skipping');
            return;
        }

        this.currentPage = path;
        const route = this.routes[path];

        try {
            // Load HTML - use absolute path from root
            const htmlPath = route.htmlFile.startsWith('/') ? route.htmlFile : '/' + route.htmlFile;
            console.log('Fetching:', htmlPath);
            const response = await fetch(htmlPath);
            if (!response.ok) throw new Error(`Failed to load ${htmlPath}: ${response.status}`);
            const html = await response.text();

            // Render to root
            document.getElementById('root').innerHTML = html;

            // Load and execute script if provided
            if (route.scriptFile) {
                const script = document.createElement('script');
                script.src = route.scriptFile + '?t=' + Date.now(); // Cache bust
                document.body.appendChild(script);
            }
        } catch (error) {
            console.error('Navigation error:', error);
            document.getElementById('root').innerHTML = '<h1>Error loading page: ' + error.message + '</h1>';
        }
    }
}

// Create global router instance
const router = new Router();

// Global navigation function for onclick handlers
window.navigateTo = function(path) {
    window.location.hash = path;
};

// Register all routes
function setupRoutes() {
    // Public routes
    router.register('/', 'html/landing.html', 'js/pages/landing.js');
    router.register('/login', 'html/login.html', 'js/pages/login.js');
    router.register('/signup', 'html/signup.html', 'js/pages/signup.js');
    router.register('/onboarding', 'html/onboarding.html', 'js/pages/onboarding.js');

    // Student routes
    router.register('/student/dashboard', 'html/student-dashboard.html', 'js/pages/student-dashboard.js');
    router.register('/student/profile', 'html/student-profile.html', 'js/pages/student-profile.js');
    router.register('/student/applications', 'html/student-applications.html', 'js/pages/student-applications.js');
    router.register('/student/offer/:id', 'html/student-offer-detail.html', 'js/pages/student-offer-detail.js');

    // Recruiter routes
    router.register('/recruiter/dashboard', 'html/recruiter-dashboard.html', 'js/pages/recruiter-dashboard.js');
    router.register('/recruiter/offers', 'html/recruiter-offers.html', 'js/pages/recruiter-offers.js');
    router.register('/recruiter/offer/new', 'html/recruiter-offer-new.html', 'js/pages/recruiter-offer-new.js');
    router.register('/recruiter/offer/edit/:id', 'html/recruiter-offer-edit.html', 'js/pages/recruiter-offer-edit.js');
    router.register('/recruiter/offer/:id/applicants', 'html/recruiter-applicants.html', 'js/pages/recruiter-applicants.js');
    router.register('/recruiter/student/:id', 'html/recruiter-student-profile.html', 'js/pages/recruiter-student-profile.js');
}

// Handle hash-based navigation
window.addEventListener('hashchange', (e) => {
    console.log('Hash changed:', window.location.hash);
    const path = window.location.hash.slice(1) || '/';
    router.navigate(path);
});

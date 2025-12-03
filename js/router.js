// Simple Router - No dependencies

const ROUTES = {
    '/': 'html/landing.html',
    '/login': 'html/login.html',
    '/signup': 'html/signup.html',
    '/onboarding': 'html/onboarding.html',
    '/student/dashboard': 'html/student-dashboard.html',
    '/student/profile': 'html/student-profile.html',
    '/student/applications': 'html/student-applications.html',
    '/student/results': 'html/student-results.html',
    '/recruiter/dashboard': 'html/recruiter-dashboard.html',
    '/recruiter/offers': 'html/recruiter-offers.html',
    '/recruiter/offer/new': 'html/recruiter-offer-new.html'
};

const SCRIPTS = {
    '/': 'js/pages/landing.js',
    '/login': 'js/pages/login.js',
    '/signup': 'js/pages/signup.js',
    '/onboarding': 'js/pages/onboarding.js',
    '/student/dashboard': 'js/pages/student-dashboard.js',
    '/student/profile': 'js/pages/student-profile.js',
    '/student/applications': 'js/pages/student-applications.js',
    '/student/results': 'js/pages/student-results.js',
    '/recruiter/dashboard': 'js/pages/recruiter-dashboard.js',
    '/recruiter/offers': 'js/pages/recruiter-offers.js',
    '/recruiter/offer/new': 'js/pages/recruiter-offer-new.js'
};

let _currentRoute = null;
let _loading = false;

async function navigate(path) {
    if (_loading || _currentRoute === path) return;
    _loading = true;
    
    console.log('[Router] Navigating to:', path);
    
    const htmlFile = ROUTES[path];
    if (!htmlFile) {
        console.warn('[Router] Unknown route:', path);
        _loading = false;
        return;
    }
    
    try {
        const res = await fetch('/' + htmlFile + '?_=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        
        const html = await res.text();
        document.getElementById('root').innerHTML = html;
        _currentRoute = path;
        
        // Load script
        const scriptFile = SCRIPTS[path];
        if (scriptFile) {
            const s = document.createElement('script');
            s.src = '/' + scriptFile + '?_=' + Date.now();
            document.body.appendChild(s);
        }
    } catch (err) {
        console.error('[Router] Error:', err);
    }
    
    _loading = false;
}

function onHashChange() {
    const path = window.location.hash.slice(1) || '/';
    navigate(path);
}

// Start
window.addEventListener('hashchange', onHashChange);
window.addEventListener('DOMContentLoaded', onHashChange);

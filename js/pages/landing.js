// Landing page
console.log('Landing page loaded');

// Check if user is already logged in
(function() {
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is logged in, redirect to appropriate dashboard
                try {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        const profile = userDoc.data();
                        if (profile.userType === 'student') {
                            window.location.hash = '/student/dashboard';
                        } else if (profile.userType === 'recruiter') {
                            window.location.hash = '/recruiter/dashboard';
                        }
                    }
                } catch (e) {
                    console.log('Error checking user:', e);
                }
            }
        });
    }
})();


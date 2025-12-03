// Recruiter Dashboard Logic

window.handleLogout = async function() {
    try {
        await auth.signOut();
        window.location.hash = '/login';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

window.createNewOffer = function() {
    window.location.hash = '/recruiter/offer/new';
};

window.viewOffers = function() {
    window.location.hash = '/recruiter/offers';
};

async function loadDashboard() {
    try {
        const user = auth.currentUser;
        console.log('Loading recruiter dashboard for user:', user?.uid);
        
        if (!user) {
            console.error('No user logged in');
            return;
        }
        
        // Get offers created by this recruiter
        console.log('Querying offers with recruiterId:', user.uid);
        const snapshot = await db.collection('offers')
            .where('recruiterId', '==', user.uid)
            .get();
        
        const offers = [];
        snapshot.forEach(doc => {
            console.log('Found offer:', doc.id, doc.data());
            offers.push({ id: doc.id, ...doc.data() });
        });

        console.log('Total offers found:', offers.length);

        const totalOffersEl = document.getElementById('totalOffers');
        if (totalOffersEl) totalOffersEl.textContent = offers.length;

        // Load applications count
        let totalApps = 0;
        let pendingApps = 0;

        for (const offer of offers) {
            const appsSnapshot = await db.collection('applications')
                .where('offerId', '==', offer.id)
                .get();
            totalApps += appsSnapshot.size;
            appsSnapshot.forEach(doc => {
                if (doc.data().status === 'pending') pendingApps++;
            });
        }

        const totalAppsEl = document.getElementById('totalApplications');
        const pendingAppsEl = document.getElementById('pendingApplications');
        if (totalAppsEl) totalAppsEl.textContent = totalApps;
        if (pendingAppsEl) pendingAppsEl.textContent = pendingApps;

        const container = document.getElementById('offersContainer');
        const noOffers = document.getElementById('noOffers');

        if (!container) return;

        if (offers.length === 0) {
            container.innerHTML = '';
            if (noOffers) noOffers.style.display = 'block';
            return;
        }

        container.innerHTML = '';
        if (noOffers) noOffers.style.display = 'none';

        for (const offer of offers) {
            const createdDate = offer.createdAt?.toDate ? offer.createdAt.toDate() : new Date(offer.createdAt);
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${offer.title || 'Untitled'}</h3>
                <p style="color: #6b7280;">${offer.location || 'N/A'} • ${offer.duration || 'N/A'}</p>
                
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <p style="color: #6b7280; margin: 0;">Applications</p>
                            <p style="font-weight: 600; font-size: 1.25rem; margin: 0.25rem 0 0 0;">${offer.applicantCount || 0}</p>
                        </div>
                        <div>
                            <p style="color: #6b7280; margin: 0;">Posted</p>
                            <p style="font-weight: 600; margin: 0.25rem 0 0 0;">${createdDate.toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <p>${(offer.description || 'No description').substring(0, 150)}...</p>

                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-primary btn-small" onclick="window.location.hash='/recruiter/offer/${offer.id}/applicants'">
                        View Applications
                    </button>
                    <button class="btn-secondary btn-small" onclick="window.location.hash='/recruiter/offer/edit/${offer.id}'">
                        Edit
                    </button>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Initialize
function initRecruiterDashboard() {
    console.log('Initializing recruiter dashboard');
    
    // Wait for Firebase auth to be ready
    auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log('Auth ready, user:', user.uid);
            
            const companyName = document.getElementById('companyName');
            if (companyName && authManager.currentUserProfile) {
                companyName.textContent = authManager.currentUserProfile.company || 'Recruiter';
            }
            
            loadDashboard();
        } else {
            console.log('No user, redirecting to login');
            window.location.hash = '/login';
        }
    });
}

setTimeout(initRecruiterDashboard, 100);

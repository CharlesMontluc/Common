// Student Dashboard Logic

window.handleLogout = async function() {
    try {
        await authManager.signOut();
        window.location.hash = '/login';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

async function loadOffers() {
    try {
        console.log('Loading offers...');
        const container = document.getElementById('offersContainer');
        const noOffers = document.getElementById('noOffers');

        if (!container) {
            console.error('Offers container not found');
            return;
        }

        // Get all offers from Firestore
        const snapshot = await db.collection('offers').get();
        const offers = [];
        snapshot.forEach(doc => {
            offers.push({ id: doc.id, ...doc.data() });
        });

        console.log('Loaded offers:', offers.length);

        if (offers.length === 0) {
            container.innerHTML = '';
            if (noOffers) noOffers.style.display = 'block';
            return;
        }

        container.innerHTML = '';
        if (noOffers) noOffers.style.display = 'none';

        for (const offer of offers) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3>${offer.title || 'Untitled Offer'}</h3>
                        <p style="color: #2563eb; font-weight: 500;">${offer.company || offer.recruiterCompany || 'Company'}</p>
                    </div>
                </div>

                <div style="margin-bottom: 1rem;">
                    <p><strong>Role:</strong> ${offer.role || 'N/A'}</p>
                    <p><strong>Location:</strong> ${offer.location || 'N/A'}</p>
                    <p><strong>Duration:</strong> ${offer.duration || 'N/A'}</p>
                </div>

                <p>${offer.description || 'No description available.'}</p>

                <div style="margin: 1rem 0;">
                    <p><strong>Required Skills:</strong> ${(offer.requiredSkills || []).join(', ') || 'N/A'}</p>
                </div>

                <button class="btn-primary" onclick="viewOffer('${offer.id}')" style="margin-right: 0.5rem;">
                    View Details
                </button>
                <button class="btn-success" onclick="applyForOffer('${offer.id}')">
                    Apply Now
                </button>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading offers:', error);
        const container = document.getElementById('offersContainer');
        if (container) {
            container.innerHTML = '<p>No offers available yet. Check back soon!</p>';
        }
    }
}

window.filterOffers = async function() {
    await loadOffers();
};

window.resetFilters = async function() {
    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    if (searchInput) searchInput.value = '';
    if (locationFilter) locationFilter.value = '';
    await loadOffers();
};

window.viewOffer = function(offerId) {
    window.location.hash = `/student/offer/${offerId}`;
};

window.applyForOffer = async function(offerId) {
    try {
        // Create application in Firestore
        await db.collection('applications').add({
            offerId: offerId,
            studentId: authManager.currentUser.uid,
            studentName: authManager.currentUserProfile?.name || 'Unknown',
            studentEmail: authManager.currentUser.email,
            status: 'pending',
            appliedAt: new Date()
        });

        alert('Application submitted successfully!');
        await loadOffers();
    } catch (error) {
        console.error('Error applying:', error);
        alert('Error submitting application: ' + error.message);
    }
};

// Initialize
function initStudentDashboard() {
    console.log('Initializing student dashboard');
    
    const userName = document.getElementById('userName');
    if (userName && authManager.currentUserProfile) {
        userName.textContent = authManager.currentUserProfile.name || 'User';
    }
    
    loadOffers();
}

setTimeout(initStudentDashboard, 100);

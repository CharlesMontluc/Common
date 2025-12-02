// Recruiter Offers Logic

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadOffers() {
    try {
        const offers = await OffersService.getRecruiterOffers(authManager.currentUser.uid);
        const container = document.getElementById('offersContainer');
        const noOffers = document.getElementById('noOffers');

        if (offers.length === 0) {
            container.innerHTML = '';
            noOffers.style.display = 'block';
            return;
        }

        container.innerHTML = '';
        noOffers.style.display = 'none';

        for (const offer of offers) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${offer.title}</h3>
                <p style="color: var(--gray-600);">${offer.location} • ${offer.duration}</p>
                
                <div style="background: var(--gray-100); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <p style="color: var(--gray-600); margin: 0;">Applications</p>
                            <p style="font-weight: 600; font-size: 1.25rem; margin: 0.25rem 0 0 0;">${offer.applicantCount || 0}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-600); margin: 0;">Posted</p>
                            <p style="font-weight: 600; margin: 0.25rem 0 0 0;">${new Date(offer.createdAt.toDate()).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <p>${offer.description.substring(0, 150)}...</p>

                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-primary btn-small" onclick="router.navigate('/recruiter/offer/${offer.id}/applicants')">
                        View Applications
                    </button>
                    <button class="btn-secondary btn-small" onclick="router.navigate('/recruiter/offer/edit/${offer.id}')">
                        Edit
                    </button>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading offers:', error);
        alert('Error loading offers: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadOffers();
});

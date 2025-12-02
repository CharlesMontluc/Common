// Student Dashboard Logic

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
        const offers = await OffersService.getAllOffers();
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
            const fitScore = FitScoreCalculator.calculateFitScore(authManager.currentUserProfile, offer);
            const fitColor = FitScoreCalculator.getFitScoreColor(fitScore);
            const fitLabel = FitScoreCalculator.getFitScoreLabel(fitScore);

            const hasApplied = await ApplicationsService.hasApplied(authManager.currentUser.uid, offer.id);

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3>${offer.title}</h3>
                        <p style="color: var(--primary); font-weight: 500;">${offer.recruiterCompany}</p>
                    </div>
                    <div style="background: ${fitColor}; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; text-align: center;">
                        <div style="font-weight: 700; font-size: 1.25rem;">${fitScore}%</div>
                        <div style="font-size: 0.75rem;">${fitLabel} Fit</div>
                    </div>
                </div>

                <div style="margin-bottom: 1rem;">
                    <p><strong>Role:</strong> ${offer.role}</p>
                    <p><strong>Location:</strong> ${offer.location}</p>
                    <p><strong>Duration:</strong> ${offer.duration}</p>
                </div>

                <p>${offer.description}</p>

                <div style="margin: 1rem 0;">
                    <p><strong>Required Skills:</strong> ${(offer.requiredSkills || []).join(', ')}</p>
                </div>

                <button class="btn-primary" onclick="viewOffer('${offer.id}')" style="margin-right: 0.5rem;">
                    View Details
                </button>
                ${hasApplied ? `
                    <button class="btn-secondary" disabled>
                        ✓ Applied
                    </button>
                ` : `
                    <button class="btn-success" onclick="applyForOffer('${offer.id}')">
                        Apply Now
                    </button>
                `}
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading offers:', error);
        alert('Error loading offers: ' + error.message);
    }
}

async function filterOffers() {
    // TODO: Implement filtering
    await loadOffers();
}

async function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('locationFilter').value = '';
    await loadOffers();
}

function viewOffer(offerId) {
    router.navigate(`/student/offer/${offerId}`);
}

async function applyForOffer(offerId) {
    try {
        const offer = await OffersService.getOffer(offerId);
        const fitScore = FitScoreCalculator.calculateFitScore(authManager.currentUserProfile, offer);

        await OffersService.addApplicant(offerId, authManager.currentUser.uid, fitScore);

        alert('Application submitted successfully!');
        await loadOffers();
    } catch (error) {
        console.error('Error applying:', error);
        alert('Error submitting application: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('userName').textContent = authManager.currentUserProfile?.name || 'User';
    await loadOffers();
});

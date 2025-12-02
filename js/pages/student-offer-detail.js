// Student Offer Detail Logic

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadOfferDetail() {
    try {
        const offerId = window.location.pathname.split('/').pop();
        const offer = await OffersService.getOffer(offerId);

        if (!offer) {
            document.getElementById('offerContainer').innerHTML = '<p>Offer not found</p>';
            return;
        }

        const fitScore = FitScoreCalculator.calculateFitScore(authManager.currentUserProfile, offer);
        const fitColor = FitScoreCalculator.getFitScoreColor(fitScore);
        const fitLabel = FitScoreCalculator.getFitScoreLabel(fitScore);
        const hasApplied = await ApplicationsService.hasApplied(authManager.currentUser.uid, offer.id);

        const container = document.getElementById('offerContainer');
        container.innerHTML = `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem;">
                    <div>
                        <h1>${offer.title}</h1>
                        <p style="color: var(--primary); font-size: 1.25rem; font-weight: 500; margin: 0.5rem 0;">
                            ${offer.recruiterCompany}
                        </p>
                        <p style="color: var(--gray-600);">${offer.location}</p>
                    </div>
                    <div style="background: ${fitColor}; color: white; padding: 1rem 1.5rem; border-radius: 0.75rem; text-align: center; white-space: nowrap;">
                        <div style="font-weight: 700; font-size: 2rem;">${fitScore}%</div>
                        <div>${fitLabel} Fit</div>
                    </div>
                </div>

                <div style="background: var(--gray-100); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
                        <div>
                            <p style="color: var(--gray-600); margin: 0;">Duration</p>
                            <p style="font-weight: 600; font-size: 1.1rem; margin: 0.5rem 0 0 0;">${offer.duration}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-600); margin: 0;">Location</p>
                            <p style="font-weight: 600; font-size: 1.1rem; margin: 0.5rem 0 0 0;">${offer.location}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-600); margin: 0;">Applicants</p>
                            <p style="font-weight: 600; font-size: 1.1rem; margin: 0.5rem 0 0 0;">${offer.applicantCount || 0}</p>
                        </div>
                    </div>
                </div>

                <h2>About This Role</h2>
                <p>${offer.description}</p>

                <h3>Required Skills</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                    ${offer.requiredSkills.map(skill => `
                        <span class="badge badge-primary">${skill}</span>
                    `).join('')}
                </div>

                <h3>Your Skills Match</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                    ${authManager.currentUserProfile.skills.map(skill => {
                        const isRequired = offer.requiredSkills.some(rs => 
                            rs.toLowerCase().includes(skill.toLowerCase()) || 
                            skill.toLowerCase().includes(rs.toLowerCase())
                        );
                        return `
                            <span class="badge ${isRequired ? 'badge-success' : 'badge-primary'}">${skill}</span>
                        `;
                    }).join('')}
                </div>

                <h3>Responsibilities</h3>
                <ul>
                    ${(offer.responsibilities || []).map(resp => `<li>${resp}</li>`).join('')}
                </ul>

                <h3>What We're Looking For</h3>
                <ul>
                    ${(offer.requirements || []).map(req => `<li>${req}</li>`).join('')}
                </ul>

                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    ${hasApplied ? `
                        <button class="btn-secondary" disabled style="flex: 1;">
                            ✓ You've Applied
                        </button>
                    ` : `
                        <button class="btn-success" onclick="applyForOffer('${offer.id}')" style="flex: 1;">
                            Apply Now
                        </button>
                    `}
                    <button class="btn-secondary" onclick="router.navigate('/student/dashboard')" style="flex: 1;">
                        Back to Offers
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading offer:', error);
        document.getElementById('offerContainer').innerHTML = '<p>Error loading offer</p>';
    }
}

async function applyForOffer(offerId) {
    try {
        const offer = await OffersService.getOffer(offerId);
        const fitScore = FitScoreCalculator.calculateFitScore(authManager.currentUserProfile, offer);

        await OffersService.addApplicant(offerId, authManager.currentUser.uid, fitScore);

        alert('Application submitted successfully!');
        await loadOfferDetail();
    } catch (error) {
        console.error('Error applying:', error);
        alert('Error submitting application: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadOfferDetail();
});

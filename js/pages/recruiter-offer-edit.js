// Recruiter Offer Edit Logic

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadOfferForm() {
    try {
        const offerId = window.location.pathname.split('/').pop();
        const offer = await OffersService.getOffer(offerId);

        if (!offer) {
            document.getElementById('offerContainer').innerHTML = '<p>Offer not found</p>';
            return;
        }

        const container = document.getElementById('offerContainer');
        container.innerHTML = `
            <h1>Edit Internship Offer</h1>

            <div class="card" style="margin-top: 2rem;">
                <form id="offerForm">
                    <div class="form-group">
                        <label for="title">Job Title *</label>
                        <input type="text" id="title" name="title" value="${offer.title}" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="role">Role/Department *</label>
                            <input type="text" id="role" name="role" value="${offer.role}" required>
                        </div>
                        <div class="form-group">
                            <label for="location">Location *</label>
                            <input type="text" id="location" name="location" value="${offer.location}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="duration">Duration *</label>
                            <input type="text" id="duration" name="duration" value="${offer.duration}" required>
                        </div>
                        <div class="form-group">
                            <label for="stipend">Stipend (Optional)</label>
                            <input type="text" id="stipend" name="stipend" value="${offer.stipend || ''}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="description">Job Description *</label>
                        <textarea id="description" name="description" required>${offer.description}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="requiredSkills">Required Skills (comma-separated) *</label>
                        <input type="text" id="requiredSkills" name="requiredSkills" value="${offer.requiredSkills.join(', ')}" required>
                    </div>

                    <div class="form-group">
                        <label for="responsibilities">Key Responsibilities (one per line)</label>
                        <textarea id="responsibilities" name="responsibilities">${offer.responsibilities.map(r => '• ' + r).join('\n')}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="requirements">What We're Looking For (one per line)</label>
                        <textarea id="requirements" name="requirements">${offer.requirements.map(r => '• ' + r).join('\n')}</textarea>
                    </div>

                    <div id="formError" class="alert alert-danger" style="display: none;"></div>

                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn-primary" style="flex: 1;">Save Changes</button>
                        <button type="button" class="btn-secondary" onclick="router.navigate('/recruiter/dashboard')" style="flex: 1;">Cancel</button>
                        <button type="button" class="btn-danger" onclick="deleteOffer('${offer.id}')" style="flex: 1;">Delete Offer</button>
                    </div>
                </form>
            </div>
        `;

        document.getElementById('offerForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value;
            const role = document.getElementById('role').value;
            const location = document.getElementById('location').value;
            const duration = document.getElementById('duration').value;
            const stipend = document.getElementById('stipend').value;
            const description = document.getElementById('description').value;
            const requiredSkills = document.getElementById('requiredSkills').value
                .split(',')
                .map(s => s.trim())
                .filter(s => s);
            const responsibilities = document.getElementById('responsibilities').value
                .split('\n')
                .map(r => r.trim())
                .filter(r => r && r.startsWith('•') ? r.substring(1).trim() : r);
            const requirements = document.getElementById('requirements').value
                .split('\n')
                .map(r => r.trim())
                .filter(r => r && r.startsWith('•') ? r.substring(1).trim() : r);

            const errorDiv = document.getElementById('formError');

            try {
                errorDiv.style.display = 'none';

                await OffersService.updateOffer(offerId, {
                    title,
                    role,
                    location,
                    duration,
                    stipend: stipend || null,
                    description,
                    requiredSkills,
                    responsibilities,
                    requirements
                });

                alert('Offer updated successfully!');
                router.navigate('/recruiter/dashboard');
            } catch (error) {
                console.error('Error updating offer:', error);
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
            }
        });
    } catch (error) {
        console.error('Error loading offer:', error);
        document.getElementById('offerContainer').innerHTML = '<p>Error loading offer</p>';
    }
}

async function deleteOffer(offerId) {
    if (confirm('Are you sure you want to delete this offer? This action cannot be undone.')) {
        try {
            await OffersService.deleteOffer(offerId);
            alert('Offer deleted successfully!');
            router.navigate('/recruiter/dashboard');
        } catch (error) {
            console.error('Error deleting offer:', error);
            alert('Error deleting offer: ' + error.message);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadOfferForm();
});

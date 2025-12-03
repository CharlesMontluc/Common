// Recruiter Offer New Logic

window.handleLogout = async function() {
    try {
        await authManager.signOut();
        window.location.hash = '/login';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

window.cancelCreate = function() {
    window.location.hash = '/recruiter/dashboard';
};

function initOfferForm() {
    const form = document.getElementById('offerForm');
    
    if (!form) {
        console.error('Offer form not found');
        return;
    }

    console.log('Offer form initialized');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Creating offer...');

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
        const responsibilitiesEl = document.getElementById('responsibilities');
        const requirementsEl = document.getElementById('requirements');
        
        const responsibilities = responsibilitiesEl ? responsibilitiesEl.value
            .split('\n')
            .map(r => r.trim())
            .filter(r => r) : [];
        const requirements = requirementsEl ? requirementsEl.value
            .split('\n')
            .map(r => r.trim())
            .filter(r => r) : [];

        const errorDiv = document.getElementById('formError');

        try {
            if (errorDiv) errorDiv.style.display = 'none';

            // Create offer directly in Firestore
            await db.collection('offers').add({
                title,
                role,
                location,
                duration,
                stipend: stipend || null,
                description,
                requiredSkills,
                responsibilities,
                requirements,
                recruiterId: authManager.currentUser.uid,
                recruiterName: authManager.currentUserProfile?.name || 'Unknown',
                recruiterCompany: authManager.currentUserProfile?.company || 'Unknown',
                company: authManager.currentUserProfile?.company || 'Unknown',
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'active',
                applicantCount: 0
            });

            console.log('Offer created successfully');
            alert('Offer created successfully!');
            window.location.hash = '/recruiter/dashboard';
        } catch (error) {
            console.error('Error creating offer:', error);
            if (errorDiv) {
                errorDiv.textContent = 'Error: ' + error.message;
                errorDiv.style.display = 'block';
            }
        }
    });
}

setTimeout(initOfferForm, 100);

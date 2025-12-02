// Recruiter Applicants Logic

let currentOffer = null;
let applicants = [];
let sortDescending = true;

const statusColors = {
    'pending': '#f59e0b',
    'interview': '#3b82f6',
    'offered': '#10b981',
    'rejected': '#ef4444'
};

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadApplicants() {
    try {
        const offerId = window.location.pathname.split('/')[4]; // Extract ID from /recruiter/offer/:id/applicants
        currentOffer = await OffersService.getOffer(offerId);

        if (!currentOffer) {
            document.getElementById('offerHeader').innerHTML = '<p>Offer not found</p>';
            return;
        }

        // Update header
        document.getElementById('offerHeader').innerHTML = `
            <h2 style="margin: 0 0 0.5rem 0;">${currentOffer.title}</h2>
            <p style="margin: 0 0 1rem 0; color: var(--gray-600);">${currentOffer.location} • ${currentOffer.duration}</p>
            <button class="btn-secondary btn-small" onclick="router.navigate('/recruiter/offer/edit/${offerId}')">Edit Offer</button>
        `;

        // Load applicants
        applicants = await ApplicationsService.getOfferApplications(offerId);
        
        if (applicants.length === 0) {
            document.getElementById('applicantsContainer').innerHTML = '';
            document.getElementById('noApplicants').style.display = 'block';
            document.getElementById('totalCount').textContent = '0';
            document.getElementById('pendingCount').textContent = '0';
            document.getElementById('avgFitScore').textContent = '0%';
            return;
        }

        // Update stats
        document.getElementById('totalCount').textContent = applicants.length;
        document.getElementById('pendingCount').textContent = applicants.filter(a => a.status === 'pending').length;
        
        const avgScore = Math.round(applicants.reduce((sum, a) => sum + a.fitScore, 0) / applicants.length);
        document.getElementById('avgFitScore').textContent = avgScore + '%';

        // Sort and render
        sortApplicants();
    } catch (error) {
        console.error('Error loading applicants:', error);
        alert('Error loading applicants: ' + error.message);
    }
}

function sortApplicants() {
    applicants.sort((a, b) => {
        if (sortDescending) {
            return b.fitScore - a.fitScore;
        } else {
            return a.fitScore - b.fitScore;
        }
    });
    renderApplicants();
}

function toggleSort() {
    sortDescending = !sortDescending;
    sortApplicants();
}

function renderApplicants() {
    const container = document.getElementById('applicantsContainer');
    container.innerHTML = '';

    for (const app of applicants) {
        const statusColor = statusColors[app.status];
        const student = app.student;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <h3 style="margin-bottom: 0.25rem;">${student.name}</h3>
                    <p style="margin: 0 0 0.5rem 0; color: var(--gray-600);">${student.role}</p>
                    <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">${student.location}</p>
                </div>
                <div style="background: ${statusColor}; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; min-width: 100px; text-align: center; white-space: nowrap;">
                    <div style="font-weight: 700;">${app.fitScore}%</div>
                </div>
            </div>

            <div style="margin: 1rem 0; padding: 1rem; background: var(--gray-100); border-radius: 0.5rem;">
                <p style="margin: 0; color: var(--gray-600); font-size: 0.875rem;">Current Status</p>
                <p style="margin: 0.5rem 0 0 0; font-weight: 600; text-transform: capitalize;">${app.status.replace('-', ' ')}</p>
            </div>

            <div style="margin-bottom: 1rem;">
                <p><strong>Skills:</strong> ${(student.skills || []).join(', ')}</p>
                <p><strong>Target Roles:</strong> ${(student.targetRoles || []).join(', ')}</p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn-primary btn-small" onclick="viewStudentProfile('${student.uid}')">
                    View Profile
                </button>
                <select class="btn-small" style="padding: 0.5rem; border: 1px solid var(--gray-300); border-radius: 0.5rem;" 
                        onchange="updateApplicationStatus('${app.id}', this.value)">
                    <option value="">Change Status...</option>
                    <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending Review</option>
                    <option value="interview" ${app.status === 'interview' ? 'selected' : ''}>Interview</option>
                    <option value="offered" ${app.status === 'offered' ? 'selected' : ''}>Offered</option>
                    <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </div>
        `;
        container.appendChild(card);
    }
}

async function updateApplicationStatus(applicationId, status) {
    if (!status) return;

    try {
        await ApplicationsService.updateApplicationStatus(applicationId, status);
        await loadApplicants();
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status: ' + error.message);
    }
}

function viewStudentProfile(studentId) {
    router.navigate(`/recruiter/student/${studentId}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadApplicants();
});

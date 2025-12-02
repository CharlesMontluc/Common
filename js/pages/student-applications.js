// Student Applications Logic

const statusColors = {
    'pending': '#f59e0b',
    'interview': '#3b82f6',
    'offered': '#10b981',
    'rejected': '#ef4444'
};

const statusLabels = {
    'pending': 'Pending Review',
    'interview': 'Interview Scheduled',
    'offered': 'Offer Received',
    'rejected': 'Not Selected'
};

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadApplications() {
    try {
        const applications = await ApplicationsService.getStudentApplications(authManager.currentUser.uid);
        const container = document.getElementById('applicationsContainer');
        const noApplications = document.getElementById('noApplications');

        if (applications.length === 0) {
            container.innerHTML = '';
            noApplications.style.display = 'block';
            return;
        }

        container.innerHTML = '';
        noApplications.style.display = 'none';

        for (const app of applications) {
            const statusColor = statusColors[app.status];
            const statusLabel = statusLabels[app.status];

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h3>${app.offer.title}</h3>
                        <p style="color: var(--primary); font-weight: 500;">${app.offer.recruiterCompany}</p>
                        <p>${app.offer.location} • ${app.offer.duration}</p>
                        <p style="color: var(--gray-600); margin-top: 1rem;">
                            Applied on ${new Date(app.appliedAt.toDate()).toLocaleDateString()}
                        </p>
                    </div>
                    <div style="background: ${statusColor}; color: white; padding: 1rem; border-radius: 0.5rem; text-align: center; min-width: 150px;">
                        <div style="font-weight: 700;">${statusLabel}</div>
                        <div style="font-size: 0.875rem; margin-top: 0.5rem;">
                            Fit Score: <strong>${app.fitScore}%</strong>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        alert('Error loading applications: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadApplications();
});

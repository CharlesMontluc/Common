// Student Profile Logic

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function loadProfile() {
    const profile = authManager.currentUserProfile;

    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileRole').textContent = profile.role;
    document.getElementById('profileLocation').textContent = profile.location;

    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = (profile.skills || []).map(skill => 
        `<span class="badge badge-primary">${skill}</span>`
    ).join('');

    const rolesList = document.getElementById('rolesList');
    rolesList.innerHTML = (profile.targetRoles || []).map(role => 
        `<span class="badge badge-primary">${role}</span>`
    ).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});

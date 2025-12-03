// Student Profile Logic

// Logout function
window.handleLogout = function() {
    console.log('Logout clicked');
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            console.log('Signed out successfully');
            localStorage.removeItem('bait_profile_mode');
            localStorage.removeItem('bait_custom_profile');
            window.location.hash = '#/login';
            window.location.reload();
        }).catch(error => {
            console.error('Logout error:', error);
            window.location.hash = '#/login';
            window.location.reload();
        });
    } else {
        window.location.hash = '#/login';
        window.location.reload();
    }
};

function loadProfile() {
    // Wait for DOM
    const profileName = document.getElementById('profileName');
    if (!profileName) {
        setTimeout(loadProfile, 100);
        return;
    }
    
    // Try to get profile from multiple sources
    let profile = null;
    
    // Check saved custom profile first
    const savedProfile = localStorage.getItem('bait_custom_profile');
    if (savedProfile) {
        profile = JSON.parse(savedProfile);
    }
    
    // Check demo mode
    const profileMode = localStorage.getItem('bait_profile_mode');
    if (profileMode === 'demo') {
        profile = {
            name: "Alex Johnson",
            email: "alex.johnson@student.edu",
            role: "Computer Science Student",
            location: "Paris, France",
            skills: ["JavaScript", "React", "Python", "SQL", "Git", "Node.js", "HTML", "CSS"],
            targetRoles: ["Frontend Developer", "Full Stack Developer", "Software Engineer"]
        };
    }
    
    // Try authManager if available
    if (!profile && typeof authManager !== 'undefined' && authManager.currentUserProfile) {
        profile = authManager.currentUserProfile;
    }
    
    if (!profile) {
        // No profile found, show message
        document.getElementById('profileName').textContent = 'Not logged in';
        document.getElementById('profileEmail').textContent = '-';
        document.getElementById('profileRole').textContent = '-';
        document.getElementById('profileLocation').textContent = '-';
        return;
    }

    document.getElementById('profileName').textContent = profile.name || 'Unknown';
    document.getElementById('profileEmail').textContent = profile.email || '-';
    document.getElementById('profileRole').textContent = profile.role || '-';
    document.getElementById('profileLocation').textContent = profile.location || '-';

    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = (profile.skills || []).map(skill => 
        `<span class="badge badge-primary">${skill}</span>`
    ).join('') || '<span style="color:#6b7280;">No skills added</span>';

    const rolesList = document.getElementById('rolesList');
    rolesList.innerHTML = (profile.targetRoles || []).map(role => 
        `<span class="badge badge-primary">${role}</span>`
    ).join('') || '<span style="color:#6b7280;">No target roles set</span>';
}

// Initialize
setTimeout(loadProfile, 100);

// Onboarding page logic

// Global variable for selected user type
window.selectedUserType = null;

// Make functions global so onclick handlers work
window.selectUserType = function(userType) {
    window.selectedUserType = userType;
    console.log('Selected user type:', userType);

    // Update UI
    const studentCard = document.getElementById('studentCard');
    const recruiterCard = document.getElementById('recruiterCard');

    if (userType === 'student') {
        studentCard.style.borderColor = '#2563eb';
        studentCard.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
        recruiterCard.style.borderColor = '#d1d5db';
        recruiterCard.style.backgroundColor = 'white';
        
        document.getElementById('studentFields').style.display = 'block';
        document.getElementById('recruiterFields').style.display = 'none';
    } else {
        recruiterCard.style.borderColor = '#2563eb';
        recruiterCard.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
        studentCard.style.borderColor = '#d1d5db';
        studentCard.style.backgroundColor = 'white';
        
        document.getElementById('recruiterFields').style.display = 'block';
        document.getElementById('studentFields').style.display = 'none';
    }

    document.getElementById('onboardingForm').style.display = 'block';
};

window.handleLogout = async function() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

window.submitProfile = async function(e) {
    if (e) e.preventDefault();
    
    console.log('Profile form submitted');
    console.log('Selected user type:', window.selectedUserType);

    if (!window.selectedUserType) {
        alert('Please select if you are a Student or Recruiter first');
        return;
    }

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const location = document.getElementById('location').value;
    const errorDiv = document.getElementById('formError');

    if (!name) {
        alert('Please enter your name');
        return;
    }

    try {
        console.log('Creating profile...');
        console.log('Current user:', authManager.currentUser);
        
        if (!authManager.currentUser) {
            throw new Error('You must be logged in to complete your profile');
        }
        
        errorDiv.style.display = 'none';

        const profileData = {
            userType: window.selectedUserType,
            name: name,
            role: role || '',
            location: location || '',
            createdAt: new Date().toISOString()
        };

        if (window.selectedUserType === 'student') {
            const skillsInput = document.getElementById('skills');
            const targetRolesInput = document.getElementById('targetRoles');
            
            profileData.skills = skillsInput ? skillsInput.value.split(',').map(s => s.trim()).filter(s => s) : [];
            profileData.targetRoles = targetRolesInput ? targetRolesInput.value.split(',').map(r => r.trim()).filter(r => r) : [];
        } else {
            const companyInput = document.getElementById('company');
            profileData.company = companyInput ? companyInput.value : '';
        }

        console.log('Profile data:', profileData);
        
        // Save to Firestore
        await db.collection('users').doc(authManager.currentUser.uid).set({
            email: authManager.currentUser.email,
            userType: profileData.userType,
            name: profileData.name,
            role: profileData.role,
            location: profileData.location,
            skills: profileData.skills || [],
            targetRoles: profileData.targetRoles || [],
            company: profileData.company || null,
            profileComplete: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log('Profile saved to Firestore');
        
        // Reload the user profile
        await authManager.loadUserProfile();
        console.log('User profile reloaded:', authManager.currentUserProfile);

        // Redirect to dashboard
        if (window.selectedUserType === 'student') {
            console.log('Navigating to student dashboard');
            window.location.hash = '/student/dashboard';
        } else {
            console.log('Navigating to recruiter dashboard');
            window.location.hash = '/recruiter/dashboard';
        }
    } catch (error) {
        console.error('Onboarding error:', error);
        errorDiv.textContent = 'Error: ' + (error.message || error);
        errorDiv.style.display = 'block';
    }
};

function initOnboarding() {
    const form = document.getElementById('profileForm');
    
    if (!form) {
        console.error('Profile form not found');
        return;
    }
    
    console.log('Onboarding form initialized');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        window.submitProfile(e);
    });
}

// Wait for DOM to be ready
setTimeout(initOnboarding, 100);

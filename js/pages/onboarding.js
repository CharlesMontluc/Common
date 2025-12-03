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
        await auth.signOut();
        window.location.hash = '/login';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

window.submitProfile = async function(e) {
    if (e) e.preventDefault();
    
    console.log('=== SUBMIT PROFILE CALLED ===');
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

    // Get the current user directly from Firebase auth
    const user = auth.currentUser;
    console.log('Current Firebase user:', user);
    
    if (!user) {
        alert('Error: You must be logged in. Please refresh and try again.');
        window.location.hash = '/login';
        return;
    }

    try {
        console.log('Creating profile for user:', user.uid);
        if (errorDiv) errorDiv.style.display = 'none';

        const profileData = {
            email: user.email,
            userType: window.selectedUserType,
            name: name,
            role: role || '',
            location: location || '',
            profileComplete: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (window.selectedUserType === 'student') {
            const skillsInput = document.getElementById('skills');
            const targetRolesInput = document.getElementById('targetRoles');
            
            profileData.skills = skillsInput && skillsInput.value ? skillsInput.value.split(',').map(s => s.trim()).filter(s => s) : [];
            profileData.targetRoles = targetRolesInput && targetRolesInput.value ? targetRolesInput.value.split(',').map(r => r.trim()).filter(r => r) : [];
            profileData.company = null;
        } else {
            const companyInput = document.getElementById('company');
            profileData.company = companyInput ? companyInput.value : '';
            profileData.skills = [];
            profileData.targetRoles = [];
        }

        console.log('Profile data to save:', profileData);
        
        // Save to Firestore using Firebase directly
        await db.collection('users').doc(user.uid).set(profileData);
        
        console.log('Profile saved successfully!');
        
        // Update authManager
        authManager.currentUser = user;
        authManager.currentUserProfile = profileData;

        // Show success and redirect
        alert('Profile created successfully!');
        
        if (window.selectedUserType === 'student') {
            console.log('Redirecting to student dashboard');
            window.location.hash = '/student/dashboard';
        } else {
            console.log('Redirecting to recruiter dashboard');
            window.location.hash = '/recruiter/dashboard';
        }
    } catch (error) {
        console.error('Onboarding error:', error);
        alert('Error creating profile: ' + error.message);
        if (errorDiv) {
            errorDiv.textContent = 'Error: ' + error.message;
            errorDiv.style.display = 'block';
        }
    }
};

console.log('Onboarding.js loaded - submitProfile is:', typeof window.submitProfile);

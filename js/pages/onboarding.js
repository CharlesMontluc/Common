// Onboarding page logic

let selectedUserType = null;

function selectUserType(userType) {
    selectedUserType = userType;

    // Update UI
    const studentCard = document.getElementById('studentCard');
    const recruiterCard = document.getElementById('recruiterCard');

    if (userType === 'student') {
        studentCard.style.borderColor = 'var(--primary)';
        studentCard.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
        recruiterCard.style.borderColor = 'var(--gray-300)';
        recruiterCard.style.backgroundColor = 'white';
        
        document.getElementById('studentFields').style.display = 'block';
        document.getElementById('recruiterFields').style.display = 'none';
    } else {
        recruiterCard.style.borderColor = 'var(--primary)';
        recruiterCard.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
        studentCard.style.borderColor = 'var(--gray-300)';
        studentCard.style.backgroundColor = 'white';
        
        document.getElementById('recruiterFields').style.display = 'block';
        document.getElementById('studentFields').style.display = 'none';
    }

    document.getElementById('onboardingForm').style.display = 'block';
}

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedUserType) {
        alert('Please select a user type');
        return;
    }

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const location = document.getElementById('location').value;
    const errorDiv = document.getElementById('formError');

    try {
        errorDiv.style.display = 'none';

        const profileData = {
            userType: selectedUserType,
            name,
            role,
            location
        };

        if (selectedUserType === 'student') {
            const skills = document.getElementById('skills').value
                .split(',')
                .map(s => s.trim())
                .filter(s => s);
            const targetRoles = document.getElementById('targetRoles').value
                .split(',')
                .map(r => r.trim())
                .filter(r => r);

            profileData.skills = skills;
            profileData.targetRoles = targetRoles;

            // Handle CV upload if provided
            const cvFile = document.getElementById('cv').files[0];
            if (cvFile) {
                const cvPath = `cvs/${authManager.currentUser.uid}/${cvFile.name}`;
                await storage.ref(cvPath).put(cvFile);
                profileData.cvPath = cvPath;
            }
        } else {
            const company = document.getElementById('company').value;
            profileData.company = company;
        }

        await authManager.createUserProfile(profileData);

        // Redirect to dashboard
        if (selectedUserType === 'student') {
            router.navigate('/student/dashboard');
        } else {
            router.navigate('/recruiter/dashboard');
        }
    } catch (error) {
        console.error('Onboarding error:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
});

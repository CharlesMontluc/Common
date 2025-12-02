// Recruiter Student Profile Logic

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadStudentProfile() {
    try {
        const studentId = window.location.pathname.split('/').pop();
        const studentDoc = await db.collection('users').doc(studentId).get();

        if (!studentDoc.exists) {
            document.getElementById('studentContainer').innerHTML = '<p>Student not found</p>';
            return;
        }

        const student = studentDoc.data();
        student.uid = studentDoc.id;

        // Get applications for this student
        const appsSnapshot = await db.collection('applications')
            .where('studentId', '==', studentId)
            .get();

        const applications = appsSnapshot.docs.map(doc => doc.data());

        const container = document.getElementById('studentContainer');
        container.innerHTML = `
            <div class="card">
                <div style="border-bottom: 1px solid var(--gray-200); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
                    <h1 style="margin-bottom: 0.5rem;">${student.name}</h1>
                    <p style="color: var(--gray-600); font-size: 1.1rem; margin: 0;">${student.role}</p>
                </div>

                <div style="background: var(--gray-100); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
                        <div>
                            <p style="color: var(--gray-600); margin: 0;">Email</p>
                            <p style="font-weight: 600; margin: 0.5rem 0 0 0;">${student.email}</p>
                        </div>
                        <div>
                            <p style="color: var(--gray-600); margin: 0;">Location</p>
                            <p style="font-weight: 600; margin: 0.5rem 0 0 0;">${student.location}</p>
                        </div>
                    </div>
                </div>

                <h2>Skills</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                    ${(student.skills || []).map(skill => `
                        <span class="badge badge-primary">${skill}</span>
                    `).join('')}
                </div>

                <h2>Target Internship Roles</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                    ${(student.targetRoles || []).map(role => `
                        <span class="badge badge-primary">${role}</span>
                    `).join('')}
                </div>

                <h2>Applications</h2>
                <div style="background: var(--gray-100); padding: 1rem; border-radius: 0.5rem;">
                    <p style="color: var(--gray-600); margin: 0;">Total Applications: <strong>${applications.length}</strong></p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading student profile:', error);
        document.getElementById('studentContainer').innerHTML = '<p>Error loading profile</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadStudentProfile();
});

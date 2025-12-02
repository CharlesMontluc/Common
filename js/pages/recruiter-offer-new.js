// Recruiter Offer New Logic

async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

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

        const offerId = await OffersService.createOffer({
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

        alert('Offer created successfully!');
        router.navigate('/recruiter/dashboard');
    } catch (error) {
        console.error('Error creating offer:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
});

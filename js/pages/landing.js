// Landing page logic

// Handle logout if called from other pages
async function handleLogout() {
    try {
        await authManager.signOut();
        router.navigate('/');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

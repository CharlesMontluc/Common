// Seed Data Loader - Run this once to populate demo data

async function loadSeedData() {
    console.log('Loading BAIT seed data...');

    try {
        // Load students
        for (const student of seedData.students) {
            const { uid, ...data } = student;
            await db.collection('users').doc(uid).set({
                ...data,
                email: data.email,
                updatedAt: new Date()
            });
            console.log(`Created student: ${data.name}`);
        }

        // Load recruiters
        for (const recruiter of seedData.recruiters) {
            const { uid, ...data } = recruiter;
            await db.collection('users').doc(uid).set({
                ...data,
                email: data.email,
                updatedAt: new Date()
            });
            console.log(`Created recruiter: ${data.name}`);
        }

        // Load offers
        for (const offer of seedData.offers) {
            await db.collection('offers').add({
                ...offer,
                createdAt: offer.createdAt,
                updatedAt: new Date()
            });
            console.log(`Created offer: ${offer.title}`);
        }

        console.log('✓ Seed data loaded successfully!');
        alert('Seed data loaded successfully! You can now explore BAIT with demo data.');
    } catch (error) {
        console.error('Error loading seed data:', error);
        alert('Error loading seed data: ' + error.message);
    }
}

// Call this function to load seed data
// loadSeedData();

// Note: To use the demo data, you have two options:
// 1. Paste the demo credentials below into login (they won't actually log in without auth setup)
// 2. Create your own accounts through normal signup and manually add offers

console.log('Available demo accounts (for reference):');
console.log('');
console.log('STUDENTS:');
seedData.students.forEach(s => {
    console.log(`  ${s.name}: ${s.email}`);
});
console.log('');
console.log('RECRUITERS:');
seedData.recruiters.forEach(r => {
    console.log(`  ${r.name}: ${r.email}`);
});

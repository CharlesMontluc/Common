// Recruiter Dashboard

const SAMPLE_RECRUITER_OFFERS = [
    {
        title: "Software Engineering Intern",
        role: "Full Stack Development",
        location: "Paris, France",
        duration: "6 months",
        stipend: "€1,300/month",
        description: "Join our engineering team to build scalable web applications.",
        requiredSkills: ["JavaScript", "React", "Node.js", "Git", "SQL"],
        status: "active"
    },
    {
        title: "Business Analyst Intern",
        role: "Business Analysis",
        location: "London, UK",
        duration: "4 months",
        stipend: "£1,200/month",
        description: "Help analyze business processes and work with stakeholders.",
        requiredSkills: ["Excel", "SQL", "Communication", "Problem Solving"],
        status: "active"
    }
];

// Generate sample offers for this recruiter
window.generateRecruiterOffers = async function() {
    const user = auth.currentUser;
    if (!user) {
        alert('Please log in first');
        return;
    }
    
    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const profile = userDoc.exists ? userDoc.data() : {};
        const company = profile.company || 'Your Company';
        
        for (const offer of SAMPLE_RECRUITER_OFFERS) {
            await db.collection('offers').add({
                ...offer,
                company: company,
                recruiterId: user.uid,
                recruiterName: profile.name || 'Recruiter',
                recruiterCompany: company,
                createdAt: new Date(),
                updatedAt: new Date(),
                applicantCount: 0
            });
        }
        
        alert('✅ Sample offers created!');
        loadDashboard();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
};

// Load dashboard data
async function loadDashboard() {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        // Get user profile
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const profile = userDoc.data();
            const companyName = document.getElementById('companyName');
            if (companyName) companyName.textContent = profile.company || 'Recruiter';
        }
        
        // Get offers
        const snapshot = await db.collection('offers')
            .where('recruiterId', '==', user.uid)
            .get();
        
        const offers = [];
        snapshot.forEach(doc => offers.push({ id: doc.id, ...doc.data() }));
        
        // Update stats
        document.getElementById('totalOffers').textContent = offers.length;
        
        // Count applications
        let totalApps = 0;
        let pending = 0;
        
        for (const offer of offers) {
            const apps = await db.collection('applications')
                .where('offerId', '==', offer.id)
                .get();
            totalApps += apps.size;
            apps.forEach(doc => {
                if (doc.data().status === 'pending') pending++;
            });
        }
        
        document.getElementById('totalApplications').textContent = totalApps;
        document.getElementById('pendingApplications').textContent = pending;
        
        // Render offers
        const container = document.getElementById('offersContainer');
        const noOffers = document.getElementById('noOffers');
        
        if (offers.length === 0) {
            container.innerHTML = '';
            noOffers.style.display = 'block';
            return;
        }
        
        noOffers.style.display = 'none';
        container.innerHTML = '';
        
        for (const offer of offers) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${offer.title}</h3>
                <p style="color:#6b7280;">${offer.location} • ${offer.duration}</p>
                <p style="margin:1rem 0;">${(offer.description || '').substring(0, 100)}...</p>
                <div style="display:flex;gap:0.5rem;">
                    <button class="btn-primary btn-small" onclick="alert('View applicants coming soon!')">
                        View Applicants
                    </button>
                    <button class="btn-secondary btn-small" onclick="alert('Edit coming soon!')">
                        Edit
                    </button>
                </div>
            `;
            container.appendChild(card);
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Logout
window.handleLogout = async function() {
    await auth.signOut();
    window.location.hash = '/login';
};

// Initialize
(function() {
    console.log('Recruiter dashboard loaded');
    
    const check = setInterval(() => {
        if (typeof auth !== 'undefined') {
            clearInterval(check);
            auth.onAuthStateChanged(user => {
                if (user) loadDashboard();
            });
        }
    }, 100);
})();

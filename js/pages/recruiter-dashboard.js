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

// Store applications data globally
let allApplications = [];
let allOffers = [];

// Tab switching
window.showRecruiterTab = function(tab) {
    // Hide all panels
    document.getElementById('panelOffers').style.display = 'none';
    document.getElementById('panelApplications').style.display = 'none';
    document.getElementById('panelOffered').style.display = 'none';
    
    // Reset all tab styles
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.style.color = '#6b7280';
        btn.style.fontWeight = '500';
        btn.style.borderBottom = 'none';
    });
    
    // Show selected panel and style tab
    const activeBtn = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (activeBtn) {
        activeBtn.style.color = '#2563eb';
        activeBtn.style.fontWeight = '600';
        activeBtn.style.borderBottom = '2px solid #2563eb';
    }
    
    if (tab === 'offers') {
        document.getElementById('panelOffers').style.display = 'block';
    } else if (tab === 'applications') {
        document.getElementById('panelApplications').style.display = 'block';
        renderApplications();
    } else if (tab === 'offered') {
        document.getElementById('panelOffered').style.display = 'block';
        renderOfferedCandidates();
    }
};

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

// Extend offer to a candidate
window.extendOffer = async function(applicationId) {
    try {
        await db.collection('applications').doc(applicationId).update({
            status: 'offered',
            offeredAt: new Date()
        });
        alert('✅ Offer extended to candidate!');
        loadDashboard();
    } catch (error) {
        console.error('Error extending offer:', error);
        alert('Error: ' + error.message);
    }
};

// Reject application
window.rejectApplication = async function(applicationId) {
    try {
        await db.collection('applications').doc(applicationId).update({
            status: 'rejected',
            rejectedAt: new Date()
        });
        alert('Application rejected');
        loadDashboard();
    } catch (error) {
        console.error('Error rejecting:', error);
        alert('Error: ' + error.message);
    }
};

// Request interview
window.requestInterview = async function(applicationId) {
    try {
        await db.collection('applications').doc(applicationId).update({
            status: 'interview',
            interviewRequestedAt: new Date()
        });
        alert('✅ Interview requested!');
        loadDashboard();
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
};

// Render applications panel
function renderApplications() {
    const container = document.getElementById('applicationsContainer');
    const noApps = document.getElementById('noApplications');
    
    // Filter pending and interview applications
    const activeApps = allApplications.filter(app => 
        app.status === 'pending' || app.status === 'applied' || app.status === 'interview'
    );
    
    if (activeApps.length === 0) {
        container.innerHTML = '';
        noApps.style.display = 'block';
        return;
    }
    
    noApps.style.display = 'none';
    container.innerHTML = '';
    
    for (const app of activeApps) {
        const statusColors = {
            'pending': '#f59e0b',
            'applied': '#f59e0b',
            'interview': '#2563eb'
        };
        const statusLabels = {
            'pending': 'Pending Review',
            'applied': 'Pending Review',
            'interview': 'Interview Scheduled'
        };
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">
                <h3 style="margin:0;">${app.studentName || 'Student'}</h3>
                <span style="background:${statusColors[app.status] || '#6b7280'};color:white;padding:0.2rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;">${statusLabels[app.status] || app.status}</span>
            </div>
            <p style="color:#2563eb;margin:0 0 0.5rem 0;font-weight:500;">${app.jobTitle || 'Position'}</p>
            <p style="color:#6b7280;font-size:0.9rem;margin:0 0 0.5rem 0;">📍 ${app.location || 'Not specified'}</p>
            <p style="color:#6b7280;font-size:0.9rem;margin:0 0 1rem 0;">Match: <strong style="color:#059669;">${app.fitScore || 0}%</strong></p>
            
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                ${app.status !== 'interview' ? `<button class="btn-secondary btn-small" onclick="requestInterview('${app.id}')">📅 Request Interview</button>` : ''}
                <button class="btn-primary btn-small" onclick="extendOffer('${app.id}')">✅ Extend Offer</button>
                <button class="btn-secondary btn-small" style="color:#ef4444;" onclick="rejectApplication('${app.id}')">❌ Reject</button>
            </div>
        `;
        container.appendChild(card);
    }
}

// Render offered candidates panel
function renderOfferedCandidates() {
    const container = document.getElementById('offeredContainer');
    const noOffered = document.getElementById('noOffered');
    
    const offeredApps = allApplications.filter(app => app.status === 'offered');
    
    if (offeredApps.length === 0) {
        container.innerHTML = '';
        noOffered.style.display = 'block';
        return;
    }
    
    noOffered.style.display = 'none';
    container.innerHTML = '';
    
    for (const app of offeredApps) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderLeft = '4px solid #059669';
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">
                <h3 style="margin:0;">${app.studentName || 'Student'}</h3>
                <span style="background:#059669;color:white;padding:0.2rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;">✅ OFFER EXTENDED</span>
            </div>
            <p style="color:#2563eb;margin:0 0 0.5rem 0;font-weight:500;">${app.jobTitle || 'Position'}</p>
            <p style="color:#6b7280;font-size:0.9rem;margin:0 0 0.5rem 0;">📍 ${app.location || 'Not specified'}</p>
            <p style="color:#6b7280;font-size:0.9rem;margin:0 0 0.5rem 0;">Match Score: <strong style="color:#059669;">${app.fitScore || 0}%</strong></p>
            <p style="color:#059669;font-size:0.85rem;margin:0;">Offer extended on ${app.offeredAt ? new Date(app.offeredAt.toDate ? app.offeredAt.toDate() : app.offeredAt).toLocaleDateString() : 'recently'}</p>
        `;
        container.appendChild(card);
    }
}

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
        
        allOffers = [];
        snapshot.forEach(doc => allOffers.push({ id: doc.id, ...doc.data() }));
        
        // Update total offers stat
        document.getElementById('totalOffers').textContent = allOffers.length;
        
        // Count applications
        allApplications = [];
        let totalApps = 0;
        let pending = 0;
        let offered = 0;
        
        for (const offer of allOffers) {
            const apps = await db.collection('applications')
                .where('offerId', '==', offer.id)
                .get();
            apps.forEach(doc => {
                const appData = { id: doc.id, ...doc.data() };
                allApplications.push(appData);
                totalApps++;
                if (appData.status === 'pending' || appData.status === 'applied') pending++;
                if (appData.status === 'offered') offered++;
            });
        }
        
        document.getElementById('totalApplications').textContent = totalApps;
        document.getElementById('pendingApplications').textContent = pending;
        document.getElementById('offersExtended').textContent = offered;
        
        // Render offers
        const container = document.getElementById('offersContainer');
        const noOffers = document.getElementById('noOffers');
        
        if (allOffers.length === 0) {
            container.innerHTML = '';
            noOffers.style.display = 'block';
            return;
        }
        
        noOffers.style.display = 'none';
        container.innerHTML = '';
        
        for (const offer of allOffers) {
            // Count apps for this offer
            const offerApps = allApplications.filter(app => app.offerId === offer.id);
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${offer.title}</h3>
                <p style="color:#6b7280;">${offer.location} • ${offer.duration}</p>
                <p style="margin:1rem 0;">${(offer.description || '').substring(0, 100)}...</p>
                <p style="font-size:0.9rem;color:#2563eb;margin-bottom:1rem;">📥 ${offerApps.length} application${offerApps.length !== 1 ? 's' : ''}</p>
                <div style="display:flex;gap:0.5rem;">
                    <button class="btn-primary btn-small" onclick="showRecruiterTab('applications')">
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

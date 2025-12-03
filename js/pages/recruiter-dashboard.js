// Recruiter Dashboard

// Sample offers - multiple positions per recruiter
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
    },
    {
        title: "Data Science Intern",
        role: "Data Analysis",
        location: "Berlin, Germany",
        duration: "6 months",
        stipend: "€1,500/month",
        description: "Work on machine learning models and data pipelines.",
        requiredSkills: ["Python", "Machine Learning", "SQL", "Statistics"],
        status: "active"
    },
    {
        title: "Product Design Intern",
        role: "UX/UI Design",
        location: "Amsterdam, Netherlands",
        duration: "5 months",
        stipend: "€1,100/month",
        description: "Design user experiences for our mobile and web apps.",
        requiredSkills: ["Figma", "UI Design", "User Research", "Prototyping"],
        status: "active"
    }
];

// Fake student applicants with detailed info
const FAKE_APPLICANTS = [
    {
        name: "Emma Martinez",
        university: "MIT",
        major: "Computer Science",
        gpa: "3.9/4.0",
        year: "Junior",
        skills: ["JavaScript", "React", "Node.js", "Python", "Git"],
        fitScore: 92,
        grade: "A",
        ranking: 1,
        pros: ["Top-tier university with strong CS program", "Extensive React experience from 2 internships", "Published research in web optimization", "Perfect communication skills"],
        cons: ["Limited backend experience"],
        status: "pending"
    },
    {
        name: "James Chen",
        university: "Stanford University",
        major: "Software Engineering",
        gpa: "3.8/4.0",
        year: "Senior",
        skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "AWS"],
        fitScore: 88,
        grade: "A-",
        ranking: 2,
        pros: ["Strong ML background with published papers", "Previous internship at Google", "Excellent problem-solving demonstrated in hackathons"],
        cons: ["Less experience with frontend technologies", "May prefer research roles"],
        status: "pending"
    },
    {
        name: "Sophie Dubois",
        university: "École Polytechnique",
        major: "Data Science",
        gpa: "16/20",
        year: "Master's 1",
        skills: ["Python", "SQL", "Machine Learning", "Statistics", "R"],
        fitScore: 85,
        grade: "B+",
        ranking: 3,
        pros: ["Strong statistical foundation", "Fluent in French and English", "Previous analytics internship at L'Oréal"],
        cons: ["Limited experience with modern ML frameworks", "No web development background"],
        status: "interview"
    },
    {
        name: "Marcus Johnson",
        university: "Georgia Tech",
        major: "Computer Science",
        gpa: "3.7/4.0",
        year: "Junior",
        skills: ["JavaScript", "React", "TypeScript", "CSS", "Git"],
        fitScore: 82,
        grade: "B+",
        ranking: 4,
        pros: ["Strong frontend portfolio with 5+ projects", "Active open source contributor", "Good team player based on references"],
        cons: ["No professional internship experience yet", "Weaker backend skills"],
        status: "pending"
    },
    {
        name: "Aisha Patel",
        university: "Imperial College London",
        major: "Computing",
        gpa: "First Class Honours",
        year: "Final Year",
        skills: ["Python", "Java", "SQL", "Docker", "Kubernetes"],
        fitScore: 79,
        grade: "B",
        ranking: 5,
        pros: ["Strong DevOps knowledge", "Internship at Bloomberg", "Excellent coding test scores"],
        cons: ["Less experience with JavaScript ecosystem", "Graduating soon - short availability"],
        status: "pending"
    },
    {
        name: "Lucas Weber",
        university: "TU Munich",
        major: "Informatics",
        gpa: "1.3 (German scale)",
        year: "Bachelor 3",
        skills: ["Java", "Spring Boot", "SQL", "Docker", "Linux"],
        fitScore: 75,
        grade: "B",
        ranking: 6,
        pros: ["Strong backend foundation", "German speaker for local clients", "Good academic performance"],
        cons: ["No React/frontend experience", "Limited English communication"],
        status: "pending"
    },
    {
        name: "Olivia Smith",
        university: "University of Toronto",
        major: "UX Design",
        gpa: "3.8/4.0",
        year: "Senior",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "HTML/CSS"],
        fitScore: 90,
        grade: "A",
        ranking: 1,
        pros: ["Award-winning design portfolio", "Previous internship at Shopify", "Strong user research methodology"],
        cons: ["Limited coding ability"],
        status: "offered"
    },
    {
        name: "Daniel Kim",
        university: "Seoul National University",
        major: "Business Analytics",
        gpa: "4.2/4.5",
        year: "Master's",
        skills: ["Excel", "SQL", "Tableau", "Python", "Communication"],
        fitScore: 87,
        grade: "A-",
        ranking: 2,
        pros: ["Strong business acumen", "Bilingual Korean/English", "Consulting experience at McKinsey"],
        cons: ["Technical skills more analytics-focused", "May require visa sponsorship"],
        status: "interview"
    },
    {
        name: "Isabella Rossi",
        university: "Bocconi University",
        major: "Economics & Computer Science",
        gpa: "110/110 cum laude",
        year: "Final Year",
        skills: ["Excel", "SQL", "Python", "Statistics", "Communication"],
        fitScore: 83,
        grade: "B+",
        ranking: 3,
        pros: ["Unique mix of business and tech skills", "Fluent in Italian, English, French", "Internship at Goldman Sachs"],
        cons: ["Less technical depth", "More finance-oriented background"],
        status: "pending"
    },
    {
        name: "Noah Williams",
        university: "UC Berkeley",
        major: "EECS",
        gpa: "3.6/4.0",
        year: "Sophomore",
        skills: ["Python", "C++", "Machine Learning", "Git", "Linux"],
        fitScore: 71,
        grade: "B-",
        ranking: 7,
        pros: ["Strong theoretical CS foundation", "Quick learner based on references", "Very motivated"],
        cons: ["Only sophomore - less experience", "No industry internship yet", "Missing key required skills"],
        status: "pending"
    },
    {
        name: "Mia Anderson",
        university: "University of Amsterdam",
        major: "Artificial Intelligence",
        gpa: "8.5/10",
        year: "Master's 2",
        skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
        fitScore: 91,
        grade: "A",
        ranking: 1,
        pros: ["Specialized AI Master's program", "Research assistant experience", "Published at NeurIPS workshop"],
        cons: ["Very specialized - may be overqualified", "Research focus over engineering"],
        status: "offered"
    },
    {
        name: "Ethan Brown",
        university: "Carnegie Mellon",
        major: "Human-Computer Interaction",
        gpa: "3.85/4.0",
        year: "Senior",
        skills: ["Figma", "User Research", "Prototyping", "JavaScript", "React"],
        fitScore: 86,
        grade: "A-",
        ranking: 2,
        pros: ["Top HCI program in the world", "Can code and design", "Previous internship at Apple"],
        cons: ["Expensive relocation if needed"],
        status: "pending"
    }
];

// Store applications data globally
let allApplications = [];
let allOffers = [];
let fakeApplicationsGenerated = false;

// Generate fake applications for demo
function generateFakeApplications(offers) {
    if (fakeApplicationsGenerated) return;
    
    const apps = [];
    let appId = 1;
    
    // Distribute applicants across offers
    const offerApplicantMap = {
        "Software Engineering Intern": [0, 1, 3, 4, 5, 9], // Emma, James, Marcus, Aisha, Lucas, Noah
        "Business Analyst Intern": [7, 8], // Daniel, Isabella
        "Data Science Intern": [1, 2, 10], // James, Sophie, Mia
        "Product Design Intern": [6, 11] // Olivia, Ethan
    };
    
    for (const offer of offers) {
        const applicantIndices = offerApplicantMap[offer.title] || [0, 1, 2];
        
        for (const idx of applicantIndices) {
            const applicant = FAKE_APPLICANTS[idx];
            if (!applicant) continue;
            
            apps.push({
                id: 'fake-app-' + appId++,
                offerId: offer.id,
                jobTitle: offer.title,
                location: offer.location,
                studentName: applicant.name,
                studentEmail: applicant.name.toLowerCase().replace(' ', '.') + '@university.edu',
                university: applicant.university,
                major: applicant.major,
                gpa: applicant.gpa,
                year: applicant.year,
                skills: applicant.skills,
                fitScore: applicant.fitScore,
                grade: applicant.grade,
                ranking: applicant.ranking,
                pros: applicant.pros,
                cons: applicant.cons,
                status: applicant.status,
                appliedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
                isFake: true
            });
        }
    }
    
    fakeApplicationsGenerated = true;
    return apps;
}

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
        // Check if fake application
        const app = allApplications.find(a => a.id === applicationId);
        if (app && app.isFake) {
            app.status = 'offered';
            app.offeredAt = new Date();
            // Update stats
            document.getElementById('offersExtended').textContent = 
                allApplications.filter(a => a.status === 'offered').length;
            document.getElementById('pendingApplications').textContent = 
                allApplications.filter(a => a.status === 'pending' || a.status === 'applied' || a.status === 'interview').length;
            alert('✅ Offer extended to ' + (app.studentName || 'candidate') + '!');
            renderApplications();
            renderOfferedCandidates();
            // Re-render offers to update counts
            loadDashboard();
            return;
        }
        
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
        // Check if fake application
        const app = allApplications.find(a => a.id === applicationId);
        if (app && app.isFake) {
            app.status = 'rejected';
            // Update stats
            document.getElementById('pendingApplications').textContent = 
                allApplications.filter(a => a.status === 'pending' || a.status === 'applied' || a.status === 'interview').length;
            alert('Application from ' + (app.studentName || 'candidate') + ' rejected');
            renderApplications();
            loadDashboard();
            return;
        }
        
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
        // Check if fake application
        const app = allApplications.find(a => a.id === applicationId);
        if (app && app.isFake) {
            app.status = 'interview';
            app.interviewRequestedAt = new Date();
            alert('✅ Interview requested with ' + (app.studentName || 'candidate') + '!');
            renderApplications();
            loadDashboard();
            return;
        }
        
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
    
    // Sort by ranking/fit score
    activeApps.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
    
    if (activeApps.length === 0) {
        container.innerHTML = '';
        noApps.style.display = 'block';
        return;
    }
    
    noApps.style.display = 'none';
    container.innerHTML = '';
    
    for (let i = 0; i < activeApps.length; i++) {
        const app = activeApps[i];
        const rank = i + 1;
        
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
        
        // Grade colors
        const gradeColors = {
            'A+': '#059669', 'A': '#059669', 'A-': '#10b981',
            'B+': '#2563eb', 'B': '#3b82f6', 'B-': '#60a5fa',
            'C+': '#f59e0b', 'C': '#fbbf24', 'C-': '#fcd34d',
            'D': '#ef4444', 'F': '#7f1d1d'
        };
        
        const gradeColor = gradeColors[app.grade] || '#6b7280';
        
        const card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative';
        card.innerHTML = `
            <!-- Ranking Badge -->
            <div style="position:absolute;top:-10px;left:-10px;background:${rank <= 3 ? '#059669' : '#6b7280'};color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;box-shadow:0 2px 4px rgba(0,0,0,0.2);">
                #${rank}
            </div>
            
            <!-- Header with status -->
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.25rem;padding-left:1.5rem;">
                <div>
                    <p style="font-size:0.75rem;color:#6b7280;margin:0;">Applying for</p>
                    <p style="color:#2563eb;margin:0;font-weight:600;font-size:0.9rem;">${app.jobTitle || 'Position'}</p>
                </div>
                <span style="background:${statusColors[app.status] || '#6b7280'};color:white;padding:0.2rem 0.5rem;border-radius:0.25rem;font-size:0.7rem;">${statusLabels[app.status] || app.status}</span>
            </div>
            
            <!-- Student Info -->
            <div style="background:#f9fafb;padding:1rem;border-radius:0.5rem;margin:1rem 0;">
                <div style="display:flex;justify-content:space-between;align-items:start;">
                    <div>
                        <h3 style="margin:0 0 0.25rem 0;font-size:1.1rem;">${app.studentName || 'Student'}</h3>
                        <p style="margin:0;color:#6b7280;font-size:0.85rem;">📚 ${app.university || 'University'}</p>
                        <p style="margin:0.25rem 0 0 0;color:#6b7280;font-size:0.85rem;">🎓 ${app.major || 'Major'} • ${app.year || 'Student'}</p>
                        <p style="margin:0.25rem 0 0 0;color:#6b7280;font-size:0.85rem;">📊 GPA: ${app.gpa || 'N/A'}</p>
                    </div>
                    <div style="text-align:right;">
                        <div style="background:${gradeColor};color:white;padding:0.4rem 0.8rem;border-radius:0.5rem;font-weight:bold;font-size:1.1rem;margin-bottom:0.5rem;">
                            ${app.grade || 'B'}
                        </div>
                        <p style="margin:0;font-size:0.8rem;color:#059669;font-weight:600;">${app.fitScore || 0}% Match</p>
                    </div>
                </div>
                
                <!-- Skills -->
                <div style="margin-top:0.75rem;">
                    <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
                        ${(app.skills || []).slice(0, 5).map(skill => 
                            `<span style="background:#e0e7ff;color:#3730a3;padding:0.15rem 0.5rem;border-radius:1rem;font-size:0.7rem;">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Pros & Cons -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
                <div>
                    <p style="font-size:0.75rem;font-weight:600;color:#059669;margin:0 0 0.3rem 0;">✅ Strengths</p>
                    <ul style="margin:0;padding-left:1rem;font-size:0.75rem;color:#374151;">
                        ${(app.pros || ['Good candidate']).slice(0, 2).map(pro => `<li style="margin-bottom:0.2rem;">${pro}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <p style="font-size:0.75rem;font-weight:600;color:#ef4444;margin:0 0 0.3rem 0;">⚠️ Considerations</p>
                    <ul style="margin:0;padding-left:1rem;font-size:0.75rem;color:#374151;">
                        ${(app.cons || ['None noted']).slice(0, 2).map(con => `<li style="margin-bottom:0.2rem;">${con}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                ${app.status !== 'interview' ? `<button class="btn-secondary btn-small" onclick="requestInterview('${app.id}')">📅 Interview</button>` : ''}
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
        // Grade colors
        const gradeColors = {
            'A+': '#059669', 'A': '#059669', 'A-': '#10b981',
            'B+': '#2563eb', 'B': '#3b82f6', 'B-': '#60a5fa',
            'C+': '#f59e0b', 'C': '#fbbf24'
        };
        const gradeColor = gradeColors[app.grade] || '#059669';
        
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderLeft = '4px solid #059669';
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">
                <div>
                    <p style="font-size:0.75rem;color:#6b7280;margin:0;">Offered position</p>
                    <p style="color:#2563eb;margin:0;font-weight:600;">${app.jobTitle || 'Position'}</p>
                </div>
                <span style="background:#059669;color:white;padding:0.2rem 0.5rem;border-radius:0.25rem;font-size:0.7rem;">✅ OFFER EXTENDED</span>
            </div>
            
            <!-- Student Info -->
            <div style="background:#ecfdf5;padding:1rem;border-radius:0.5rem;margin:0.75rem 0;">
                <div style="display:flex;justify-content:space-between;align-items:start;">
                    <div>
                        <h3 style="margin:0 0 0.25rem 0;">${app.studentName || 'Student'}</h3>
                        <p style="margin:0;color:#6b7280;font-size:0.85rem;">📚 ${app.university || 'University'}</p>
                        <p style="margin:0.25rem 0 0 0;color:#6b7280;font-size:0.85rem;">🎓 ${app.major || 'Major'} • ${app.year || 'Student'}</p>
                    </div>
                    <div style="text-align:right;">
                        <div style="background:${gradeColor};color:white;padding:0.3rem 0.6rem;border-radius:0.5rem;font-weight:bold;">
                            ${app.grade || 'A'}
                        </div>
                        <p style="margin:0.25rem 0 0 0;font-size:0.8rem;color:#059669;font-weight:600;">${app.fitScore || 0}% Match</p>
                    </div>
                </div>
            </div>
            
            <p style="color:#059669;font-size:0.85rem;margin:0;">📅 Offer extended on ${app.offeredAt ? new Date(app.offeredAt.toDate ? app.offeredAt.toDate() : app.offeredAt).toLocaleDateString() : 'recently'}</p>
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
        let companyName = 'Your Company';
        if (userDoc.exists) {
            const profile = userDoc.data();
            companyName = profile.company || 'Recruiter';
            const companyEl = document.getElementById('companyName');
            if (companyEl) companyEl.textContent = companyName;
        }
        
        // Get offers
        const snapshot = await db.collection('offers')
            .where('recruiterId', '==', user.uid)
            .get();
        
        allOffers = [];
        snapshot.forEach(doc => allOffers.push({ id: doc.id, ...doc.data() }));
        
        // Update total offers stat
        document.getElementById('totalOffers').textContent = allOffers.length;
        
        // Get real applications from Firestore
        allApplications = [];
        
        for (const offer of allOffers) {
            const apps = await db.collection('applications')
                .where('offerId', '==', offer.id)
                .get();
            apps.forEach(doc => {
                const appData = { id: doc.id, ...doc.data() };
                allApplications.push(appData);
            });
        }
        
        // Add fake applications for demo if there are offers
        if (allOffers.length > 0) {
            const fakeApps = generateFakeApplications(allOffers);
            if (fakeApps) {
                allApplications = [...allApplications, ...fakeApps];
            }
        }
        
        // Calculate stats
        let totalApps = allApplications.length;
        let pending = allApplications.filter(app => app.status === 'pending' || app.status === 'applied').length;
        let interview = allApplications.filter(app => app.status === 'interview').length;
        let offered = allApplications.filter(app => app.status === 'offered').length;
        
        document.getElementById('totalApplications').textContent = totalApps;
        document.getElementById('pendingApplications').textContent = pending + interview;
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
            const offerPending = offerApps.filter(app => app.status === 'pending' || app.status === 'applied').length;
            const offerInterview = offerApps.filter(app => app.status === 'interview').length;
            const offerOffered = offerApps.filter(app => app.status === 'offered').length;
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${offer.title}</h3>
                <p style="color:#6b7280;margin-bottom:0.5rem;">${offer.location} • ${offer.duration}</p>
                <p style="margin:0.75rem 0;font-size:0.9rem;">${(offer.description || '').substring(0, 80)}...</p>
                
                <div style="display:flex;gap:1rem;margin:1rem 0;font-size:0.85rem;">
                    <span style="color:#f59e0b;">⏳ ${offerPending} pending</span>
                    <span style="color:#2563eb;">📅 ${offerInterview} interviews</span>
                    <span style="color:#059669;">✅ ${offerOffered} offered</span>
                </div>
                
                <p style="font-size:0.9rem;color:#374151;margin-bottom:1rem;font-weight:500;">📥 ${offerApps.length} total application${offerApps.length !== 1 ? 's' : ''}</p>
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

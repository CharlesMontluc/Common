// Student Dashboard Logic

// Sample internship data for demo
const sampleOffers = [
    {
        title: "Frontend Developer Intern",
        company: "TechCorp",
        role: "Frontend Development",
        location: "Paris, France",
        duration: "6 months",
        stipend: "€1,200/month",
        description: "Join our dynamic team to build modern web applications using React and TypeScript. You'll work on real projects that impact millions of users.",
        requiredSkills: ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
        responsibilities: ["Develop UI components", "Write unit tests", "Collaborate with designers"],
        requirements: ["Currently enrolled in CS program", "Basic React knowledge"]
    },
    {
        title: "Data Science Intern",
        company: "DataViz Inc",
        role: "Data Analysis",
        location: "London, UK",
        duration: "4 months",
        stipend: "£1,500/month",
        description: "Work with our data science team to analyze large datasets and build predictive models using Python and machine learning.",
        requiredSkills: ["Python", "Pandas", "Machine Learning", "SQL", "Statistics"],
        responsibilities: ["Analyze datasets", "Build ML models", "Create visualizations"],
        requirements: ["Statistics background", "Python proficiency"]
    },
    {
        title: "Product Management Intern",
        company: "StartupXYZ",
        role: "Product",
        location: "Berlin, Germany",
        duration: "3 months",
        stipend: "€1,000/month",
        description: "Help shape the future of our product by conducting user research, defining requirements, and working closely with engineering teams.",
        requiredSkills: ["Product Strategy", "User Research", "Agile", "Communication", "Analytics"],
        responsibilities: ["Conduct user interviews", "Write PRDs", "Prioritize features"],
        requirements: ["Strong communication skills", "Interest in tech products"]
    },
    {
        title: "Backend Engineer Intern",
        company: "CloudScale",
        role: "Backend Development",
        location: "Amsterdam, Netherlands",
        duration: "6 months",
        stipend: "€1,400/month",
        description: "Build scalable backend services using Node.js and cloud technologies. Work on microservices architecture and API development.",
        requiredSkills: ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
        responsibilities: ["Design APIs", "Write backend services", "Optimize performance"],
        requirements: ["Programming experience", "Database knowledge"]
    },
    {
        title: "UX/UI Design Intern",
        company: "DesignHub",
        role: "Design",
        location: "Barcelona, Spain",
        duration: "5 months",
        stipend: "€900/month",
        description: "Create beautiful and intuitive user interfaces for web and mobile applications. Work with Figma and collaborate with developers.",
        requiredSkills: ["Figma", "UI Design", "User Research", "Prototyping", "Adobe XD"],
        responsibilities: ["Design mockups", "Create prototypes", "Conduct usability tests"],
        requirements: ["Design portfolio", "Figma experience"]
    },
    {
        title: "Marketing Intern",
        company: "GrowthLab",
        role: "Digital Marketing",
        location: "Dublin, Ireland",
        duration: "4 months",
        stipend: "€1,100/month",
        description: "Drive growth through digital marketing campaigns, social media management, and content creation for a fast-growing startup.",
        requiredSkills: ["Social Media", "Content Marketing", "SEO", "Google Analytics", "Copywriting"],
        responsibilities: ["Manage social accounts", "Create content", "Analyze metrics"],
        requirements: ["Marketing interest", "Creative mindset"]
    }
];

// Calculate fit score based on student skills and offer requirements
function calculateFitScore(studentProfile, offer) {
    if (!studentProfile || !studentProfile.skills || studentProfile.skills.length === 0) {
        // Return random score between 40-75 if no profile
        return Math.floor(Math.random() * 35) + 40;
    }
    
    const studentSkills = studentProfile.skills.map(s => s.toLowerCase().trim());
    const requiredSkills = (offer.requiredSkills || []).map(s => s.toLowerCase().trim());
    
    if (requiredSkills.length === 0) {
        return Math.floor(Math.random() * 20) + 60;
    }
    
    let matchCount = 0;
    for (const reqSkill of requiredSkills) {
        for (const studentSkill of studentSkills) {
            if (studentSkill.includes(reqSkill) || reqSkill.includes(studentSkill)) {
                matchCount++;
                break;
            }
        }
    }
    
    // Base score from skill match (0-70%)
    const skillScore = (matchCount / requiredSkills.length) * 70;
    
    // Add some randomness for other factors (experience, location preference, etc.)
    const randomBonus = Math.floor(Math.random() * 30);
    
    return Math.min(99, Math.floor(skillScore + randomBonus));
}

// Get color based on fit score
function getFitScoreColor(score) {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red
}

window.handleLogout = async function() {
    try {
        await auth.signOut();
        window.location.hash = '/login';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// Generate sample offers
window.generateSampleData = async function() {
    try {
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in');
            return;
        }
        
        const btn = document.getElementById('generateDataBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Generating...';
        }
        
        // Add sample offers to Firestore
        for (const offer of sampleOffers) {
            await db.collection('offers').add({
                ...offer,
                recruiterId: 'demo-recruiter',
                recruiterName: 'Demo Recruiter',
                recruiterCompany: offer.company,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'active',
                applicantCount: Math.floor(Math.random() * 20)
            });
        }
        
        alert('Sample internship offers generated!');
        await loadOffers();
        
        if (btn) {
            btn.disabled = false;
            btn.textContent = '🎲 Generate Sample Data';
        }
    } catch (error) {
        console.error('Error generating sample data:', error);
        alert('Error: ' + error.message);
    }
};

async function loadOffers() {
    try {
        console.log('Loading offers...');
        const container = document.getElementById('offersContainer');
        const noOffers = document.getElementById('noOffers');

        if (!container) {
            console.error('Offers container not found');
            return;
        }

        // Get student profile for fit score calculation
        const studentProfile = authManager.currentUserProfile;

        // Get all offers from Firestore
        const snapshot = await db.collection('offers').where('status', '==', 'active').get();
        const offers = [];
        snapshot.forEach(doc => {
            offers.push({ id: doc.id, ...doc.data() });
        });

        console.log('Loaded offers:', offers.length);

        if (offers.length === 0) {
            container.innerHTML = '';
            if (noOffers) noOffers.style.display = 'block';
            return;
        }

        container.innerHTML = '';
        if (noOffers) noOffers.style.display = 'none';

        // Sort by fit score (highest first)
        const offersWithScores = offers.map(offer => ({
            ...offer,
            fitScore: calculateFitScore(studentProfile, offer)
        })).sort((a, b) => b.fitScore - a.fitScore);

        for (const offer of offersWithScores) {
            const fitColor = getFitScoreColor(offer.fitScore);
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin-bottom: 0.25rem;">${offer.title || 'Untitled Offer'}</h3>
                        <p style="color: #2563eb; font-weight: 500; margin: 0;">${offer.company || offer.recruiterCompany || 'Company'}</p>
                    </div>
                    <div style="background: ${fitColor}; color: white; padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 600; font-size: 0.9rem; white-space: nowrap;">
                        ${offer.fitScore}% Match
                    </div>
                </div>

                <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #6b7280;">
                    <p style="margin: 0.25rem 0;"><strong>Role:</strong> ${offer.role || 'N/A'}</p>
                    <p style="margin: 0.25rem 0;"><strong>Location:</strong> ${offer.location || 'N/A'}</p>
                    <p style="margin: 0.25rem 0;"><strong>Duration:</strong> ${offer.duration || 'N/A'}</p>
                    ${offer.stipend ? `<p style="margin: 0.25rem 0;"><strong>Stipend:</strong> ${offer.stipend}</p>` : ''}
                </div>

                <p style="color: #374151; margin-bottom: 1rem;">${(offer.description || 'No description available.').substring(0, 150)}${offer.description?.length > 150 ? '...' : ''}</p>

                <div style="margin-bottom: 1rem;">
                    <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.5rem;"><strong>Required Skills:</strong></p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${(offer.requiredSkills || []).slice(0, 5).map(skill => 
                            `<span style="background: #e5e7eb; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem;">${skill}</span>`
                        ).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-primary" onclick="viewOffer('${offer.id}')">
                        View Details
                    </button>
                    <button class="btn-success" onclick="applyForOffer('${offer.id}')">
                        Apply Now
                    </button>
                </div>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading offers:', error);
        const container = document.getElementById('offersContainer');
        if (container) {
            container.innerHTML = '<p>Error loading offers. Please try again.</p>';
        }
    }
}

window.filterOffers = async function() {
    await loadOffers();
};

window.resetFilters = async function() {
    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    if (searchInput) searchInput.value = '';
    if (locationFilter) locationFilter.value = '';
    await loadOffers();
};

window.viewOffer = function(offerId) {
    window.location.hash = `/student/offer/${offerId}`;
};

window.applyForOffer = async function(offerId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in to apply');
            return;
        }
        
        // Check if already applied
        const existing = await db.collection('applications')
            .where('offerId', '==', offerId)
            .where('studentId', '==', user.uid)
            .get();
            
        if (!existing.empty) {
            alert('You have already applied to this offer!');
            return;
        }
        
        // Create application in Firestore
        await db.collection('applications').add({
            offerId: offerId,
            studentId: user.uid,
            studentName: authManager.currentUserProfile?.name || 'Unknown',
            studentEmail: user.email,
            studentSkills: authManager.currentUserProfile?.skills || [],
            status: 'pending',
            appliedAt: new Date()
        });

        alert('Application submitted successfully! 🎉');
    } catch (error) {
        console.error('Error applying:', error);
        alert('Error submitting application: ' + error.message);
    }
};

// Initialize
function initStudentDashboard() {
    console.log('Initializing student dashboard');
    
    auth.onAuthStateChanged(user => {
        if (user) {
            const userName = document.getElementById('userName');
            if (userName && authManager.currentUserProfile) {
                userName.textContent = authManager.currentUserProfile.name || 'Student';
            }
            loadOffers();
        }
    });
}

setTimeout(initStudentDashboard, 100);

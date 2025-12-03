// Student Dashboard - Internship Browser with AI Fit Scores

// ============================================
// SAMPLE INTERNSHIP DATA (for demo purposes)
// ============================================
const SAMPLE_INTERNSHIPS = [
    {
        title: "Frontend Developer Intern",
        company: "TechCorp Paris",
        role: "Frontend Development",
        location: "Paris, France",
        duration: "6 months",
        stipend: "€1,200/month",
        description: "Join our dynamic team to build modern web applications using React and TypeScript. You'll work on real projects that impact millions of users worldwide.",
        requiredSkills: ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
        status: "active"
    },
    {
        title: "Data Science Intern",
        company: "DataViz Analytics",
        role: "Data Analysis",
        location: "London, UK",
        duration: "4 months",
        stipend: "£1,500/month",
        description: "Work with our data science team to analyze large datasets, build predictive models, and create visualizations using Python and machine learning.",
        requiredSkills: ["Python", "Pandas", "Machine Learning", "SQL", "Statistics"],
        status: "active"
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
        status: "active"
    },
    {
        title: "Backend Engineer Intern",
        company: "CloudScale Systems",
        role: "Backend Development",
        location: "Amsterdam, Netherlands",
        duration: "6 months",
        stipend: "€1,400/month",
        description: "Build scalable backend services using Node.js and cloud technologies. Work on microservices architecture and API development.",
        requiredSkills: ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
        status: "active"
    },
    {
        title: "UX/UI Design Intern",
        company: "DesignHub Creative",
        role: "Design",
        location: "Barcelona, Spain",
        duration: "5 months",
        stipend: "€900/month",
        description: "Create beautiful and intuitive user interfaces for web and mobile apps. Work with Figma and collaborate with developers.",
        requiredSkills: ["Figma", "UI Design", "User Research", "Prototyping", "Adobe XD"],
        status: "active"
    },
    {
        title: "Marketing Analytics Intern",
        company: "GrowthLab Digital",
        role: "Digital Marketing",
        location: "Dublin, Ireland",
        duration: "4 months",
        stipend: "€1,100/month",
        description: "Drive growth through digital marketing campaigns, social media management, and data-driven content creation.",
        requiredSkills: ["Social Media", "Content Marketing", "SEO", "Google Analytics", "Copywriting"],
        status: "active"
    },
    {
        title: "Mobile Developer Intern",
        company: "AppWorks Studio",
        role: "Mobile Development",
        location: "Milan, Italy",
        duration: "6 months",
        stipend: "€1,150/month",
        description: "Develop cross-platform mobile applications using React Native. Ship features used by thousands of users.",
        requiredSkills: ["React Native", "JavaScript", "iOS", "Android", "Mobile UI"],
        status: "active"
    },
    {
        title: "DevOps Intern",
        company: "InfraCloud Tech",
        role: "DevOps Engineering",
        location: "Stockholm, Sweden",
        duration: "5 months",
        stipend: "€1,300/month",
        description: "Learn and implement CI/CD pipelines, container orchestration, and cloud infrastructure management.",
        requiredSkills: ["Docker", "Kubernetes", "CI/CD", "Linux", "Terraform"],
        status: "active"
    }
];

// ============================================
// AI FIT SCORE CALCULATOR
// ============================================
function calculateFitScore(studentSkills, internship) {
    if (!studentSkills || studentSkills.length === 0) {
        // Random score for demo if no skills
        return Math.floor(Math.random() * 40) + 35; // 35-75%
    }
    
    const studentSkillsLower = studentSkills.map(s => s.toLowerCase().trim());
    const requiredSkills = internship.requiredSkills.map(s => s.toLowerCase().trim());
    
    let matchScore = 0;
    let partialMatches = 0;
    
    for (const required of requiredSkills) {
        for (const skill of studentSkillsLower) {
            if (skill === required) {
                matchScore += 2; // Exact match
                break;
            } else if (skill.includes(required) || required.includes(skill)) {
                partialMatches += 1; // Partial match
                break;
            }
        }
    }
    
    // Calculate percentage (max 100)
    const maxScore = requiredSkills.length * 2;
    const rawScore = ((matchScore + partialMatches * 0.5) / maxScore) * 80;
    
    // Add some randomness for other factors (experience, location, etc.)
    const bonus = Math.floor(Math.random() * 20);
    
    return Math.min(99, Math.max(25, Math.floor(rawScore + bonus)));
}

function getFitColor(score) {
    if (score >= 75) return '#10b981'; // Green - Great match
    if (score >= 50) return '#f59e0b'; // Orange - Good match
    return '#ef4444'; // Red - Low match
}

function getFitLabel(score) {
    if (score >= 75) return 'Great Match!';
    if (score >= 50) return 'Good Match';
    return 'Explore';
}

// ============================================
// PAGE FUNCTIONS
// ============================================

// Generate sample internships in Firestore
window.generateSampleData = async function() {
    const btn = document.getElementById('generateBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Generating...';
    }
    
    try {
        console.log('Generating sample internships...');
        
        for (const internship of SAMPLE_INTERNSHIPS) {
            await db.collection('offers').add({
                ...internship,
                recruiterId: 'demo-recruiter-' + Math.random().toString(36).substr(2, 9),
                recruiterName: 'Demo Recruiter',
                recruiterCompany: internship.company,
                createdAt: new Date(),
                updatedAt: new Date(),
                applicantCount: Math.floor(Math.random() * 50)
            });
        }
        
        alert('✅ Generated ' + SAMPLE_INTERNSHIPS.length + ' sample internships!');
        loadInternships();
        
    } catch (error) {
        console.error('Error generating data:', error);
        alert('Error: ' + error.message);
    }
    
    if (btn) {
        btn.disabled = false;
        btn.textContent = '🎲 Generate Sample Internships';
    }
};

// Load and display internships
async function loadInternships() {
    const container = document.getElementById('offersContainer');
    const noOffers = document.getElementById('noOffers');
    
    if (!container) return;
    
    container.innerHTML = '<p style="text-align:center;padding:2rem;">Loading internships...</p>';
    
    try {
        // Get student profile for fit calculation
        let studentSkills = [];
        const user = auth.currentUser;
        
        if (user) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                studentSkills = userDoc.data().skills || [];
                
                // Update user name display
                const userName = document.getElementById('userName');
                if (userName) {
                    userName.textContent = userDoc.data().name || 'Student';
                }
            }
        }
        
        // Get all active internships
        const snapshot = await db.collection('offers').where('status', '==', 'active').get();
        
        const internships = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const fitScore = calculateFitScore(studentSkills, data);
            internships.push({
                id: doc.id,
                ...data,
                fitScore: fitScore
            });
        });
        
        // Sort by fit score (highest first) - AI RANKING
        internships.sort((a, b) => b.fitScore - a.fitScore);
        
        console.log('Loaded', internships.length, 'internships');
        
        if (internships.length === 0) {
            container.innerHTML = '';
            if (noOffers) noOffers.style.display = 'block';
            return;
        }
        
        if (noOffers) noOffers.style.display = 'none';
        container.innerHTML = '';
        
        // Render internship cards
        for (const job of internships) {
            const fitColor = getFitColor(job.fitScore);
            const fitLabel = getFitLabel(job.fitScore);
            
            const card = document.createElement('div');
            card.className = 'card';
            card.style.position = 'relative';
            card.innerHTML = `
                <div style="position:absolute;top:1rem;right:1rem;background:${fitColor};color:white;padding:0.5rem 1rem;border-radius:2rem;font-weight:bold;font-size:0.9rem;">
                    ${job.fitScore}% ${fitLabel}
                </div>
                
                <h3 style="margin-bottom:0.25rem;padding-right:120px;">${job.title}</h3>
                <p style="color:#2563eb;font-weight:600;margin:0 0 1rem 0;">${job.company}</p>
                
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1rem;font-size:0.9rem;color:#6b7280;">
                    <p style="margin:0;">📍 ${job.location}</p>
                    <p style="margin:0;">⏱️ ${job.duration}</p>
                    <p style="margin:0;">💼 ${job.role}</p>
                    <p style="margin:0;">💰 ${job.stipend || 'Competitive'}</p>
                </div>
                
                <p style="color:#374151;margin-bottom:1rem;">${(job.description || '').substring(0, 120)}...</p>
                
                <div style="margin-bottom:1rem;">
                    <p style="font-size:0.85rem;color:#6b7280;margin-bottom:0.5rem;"><strong>Skills:</strong></p>
                    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
                        ${(job.requiredSkills || []).map(skill => 
                            `<span style="background:#e5e7eb;padding:0.2rem 0.6rem;border-radius:1rem;font-size:0.75rem;">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div style="display:flex;gap:0.5rem;margin-top:1rem;">
                    <button class="btn-primary" onclick="applyToJob('${job.id}', '${job.title.replace(/'/g, "\\'")}')">
                        Apply Now
                    </button>
                    <button class="btn-secondary" onclick="viewDetails('${job.id}')">
                        View Details
                    </button>
                </div>
            `;
            container.appendChild(card);
        }
        
    } catch (error) {
        console.error('Error loading internships:', error);
        container.innerHTML = '<p style="color:red;text-align:center;padding:2rem;">Error loading internships. Please refresh.</p>';
    }
}

// Apply to a job
window.applyToJob = async function(jobId, jobTitle) {
    const user = auth.currentUser;
    
    if (!user) {
        alert('Please log in to apply');
        window.location.hash = '/login';
        return;
    }
    
    try {
        // Check if already applied
        const existing = await db.collection('applications')
            .where('offerId', '==', jobId)
            .where('studentId', '==', user.uid)
            .get();
        
        if (!existing.empty) {
            alert('You have already applied to this internship!');
            return;
        }
        
        // Get user profile
        const userDoc = await db.collection('users').doc(user.uid).get();
        const profile = userDoc.exists ? userDoc.data() : {};
        
        // Create application
        await db.collection('applications').add({
            offerId: jobId,
            studentId: user.uid,
            studentName: profile.name || 'Unknown',
            studentEmail: user.email,
            studentSkills: profile.skills || [],
            status: 'pending',
            appliedAt: new Date()
        });
        
        alert('🎉 Application submitted for: ' + jobTitle);
        
    } catch (error) {
        console.error('Error applying:', error);
        alert('Error: ' + error.message);
    }
};

// View job details
window.viewDetails = function(jobId) {
    alert('Job details page coming soon!\nJob ID: ' + jobId);
};

// Logout
window.handleLogout = async function() {
    try {
        await auth.signOut();
        window.location.hash = '/login';
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// ============================================
// INITIALIZE PAGE
// ============================================
(function init() {
    console.log('Student Dashboard initializing...');
    
    // Wait for auth to be ready
    const checkAuth = setInterval(() => {
        if (typeof auth !== 'undefined') {
            clearInterval(checkAuth);
            
            auth.onAuthStateChanged(user => {
                if (user) {
                    console.log('User logged in:', user.email);
                    loadInternships();
                } else {
                    console.log('No user, showing demo data');
                    loadInternships();
                }
            });
        }
    }, 100);
})();

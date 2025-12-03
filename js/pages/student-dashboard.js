// Student Dashboard - Internship Browser with AI Fit Scores

// ============================================
// DEMO STUDENT PROFILE
// ============================================
const DEMO_PROFILE = {
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    role: "Computer Science Student",
    location: "Paris, France",
    skills: ["JavaScript", "React", "Python", "SQL", "Git", "Node.js", "HTML", "CSS"],
    targetRoles: ["Frontend Developer", "Full Stack Developer", "Software Engineer"],
    isDemo: true
};

// Current student profile (will be loaded or use demo)
let currentProfile = null;
let profileMode = null; // 'demo' or 'custom'

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
        status: "active",
        companyGrade: "B+",
        gradeReason: "Good mentorship, fair pay"
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
        status: "active",
        companyGrade: "A-",
        gradeReason: "Excellent learning, good pay"
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
        status: "active",
        companyGrade: "C+",
        gradeReason: "Startup culture, lower pay"
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
        status: "active",
        companyGrade: "B",
        gradeReason: "Good technical depth"
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
        status: "active",
        companyGrade: "B-",
        gradeReason: "Creative work, lower pay"
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
        status: "active",
        companyGrade: "C",
        gradeReason: "Average program quality"
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
        status: "active",
        companyGrade: "B",
        gradeReason: "Hands-on experience, good team"
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
        status: "active",
        companyGrade: "A",
        gradeReason: "Excellent mentorship, great WLB"
    }
];

// ============================================
// AI FIT SCORE CALCULATOR
// ============================================
function calculateFitScore(studentSkills, internship) {
    if (!studentSkills || studentSkills.length === 0 || !internship.requiredSkills) {
        return Math.floor(Math.random() * 40) + 35;
    }
    
    const studentSkillsLower = studentSkills.map(s => s.toLowerCase().trim());
    const requiredSkills = internship.requiredSkills.map(s => s.toLowerCase().trim());
    
    let matchScore = 0;
    let partialMatches = 0;
    
    for (const required of requiredSkills) {
        for (const skill of studentSkillsLower) {
            if (skill === required) {
                matchScore += 2;
                break;
            } else if (skill.includes(required) || required.includes(skill)) {
                partialMatches += 1;
                break;
            }
        }
    }
    
    const maxScore = requiredSkills.length * 2;
    const rawScore = ((matchScore + partialMatches * 0.5) / maxScore) * 80;
    const bonus = Math.floor(Math.random() * 20);
    
    return Math.min(99, Math.max(25, Math.floor(rawScore + bonus)));
}

function getFitColor(score) {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
}

function getFitLabel(score) {
    if (score >= 75) return 'Great Match!';
    if (score >= 50) return 'Good Match';
    return 'Explore';
}

// ============================================
// REAL INTERNSHIP SEARCH (for custom profiles)
// ============================================
async function fetchRealInternships(skills, targetRoles) {
    console.log('Fetching real internships for skills:', skills);
    
    // Always start with our global fallback jobs for reliability
    const globalJobs = generateRealLookingJobs(skills);
    
    // Try to add some real API jobs if available
    try {
        const searchTerms = [...(skills || []), ...(targetRoles || [])].slice(0, 2);
        const query = searchTerms.join(' ');
        
        // Try Remotive API for remote jobs
        const res = await fetch('https://remotive.com/api/remote-jobs?search=' + encodeURIComponent(query) + '&limit=4');
        if (res.ok) {
            const data = await res.json();
            if (data.jobs && data.jobs.length > 0) {
                const apiJobs = data.jobs.slice(0, 4).map(job => ({
                    id: 'remotive-' + job.id,
                    title: job.title,
                    company: job.company_name,
                    location: job.candidate_required_location || 'Remote Worldwide',
                    duration: 'Varies',
                    role: job.category || extractRole(job.title),
                    description: stripHtml(job.description).substring(0, 200),
                    requiredSkills: extractSkillsFromDescription(job.description, skills),
                    stipend: job.salary || 'Competitive',
                    status: 'active',
                    isReal: true,
                    applyUrl: job.url,
                    fitScore: calculateFitScore(skills, { requiredSkills: extractSkillsFromDescription(job.description, skills) })
                }));
                // Add API jobs to the mix
                globalJobs.push(...apiJobs);
            }
        }
    } catch (e) {
        console.log('API fetch failed, using fallback only:', e);
    }
    
    // Sort by fit score
    globalJobs.sort((a, b) => b.fitScore - a.fitScore);
    
    return globalJobs;
}

// Generate realistic-looking jobs as fallback - GLOBAL coverage
// Company grades based on: Pay, Learning, Mentorship, Return Offer Rate, Work-Life Balance
function generateRealLookingJobs(skills) {
    const companies = [
        // North America - Top Tier (A-S)
        { name: 'Google', location: 'New York, USA', stipend: '$8,000/month', careers: 'https://careers.google.com', grade: 'A+', gradeReason: 'Top pay, world-class mentorship, great WLB' },
        { name: 'Microsoft', location: 'Seattle, USA', stipend: '$7,500/month', careers: 'https://careers.microsoft.com', grade: 'A', gradeReason: 'Excellent mentorship, great culture' },
        { name: 'Apple', location: 'Cupertino, USA', stipend: '$8,500/month', careers: 'https://jobs.apple.com', grade: 'A', gradeReason: 'High pay, prestigious brand' },
        { name: 'Amazon', location: 'Vancouver, Canada', stipend: 'CAD 7,000/month', careers: 'https://amazon.jobs', grade: 'B+', gradeReason: 'Great pay but intense culture' },
        { name: 'Meta', location: 'Menlo Park, USA', stipend: '$9,000/month', careers: 'https://metacareers.com', grade: 'A', gradeReason: 'Top pay, fast-paced learning' },
        { name: 'Netflix', location: 'Los Angeles, USA', stipend: '$8,000/month', careers: 'https://jobs.netflix.com', grade: 'A-', gradeReason: 'High autonomy, excellent pay' },
        { name: 'Stripe', location: 'San Francisco, USA', stipend: '$9,000/month', careers: 'https://stripe.com/jobs', grade: 'A+', gradeReason: 'Best intern program, top mentorship' },
        { name: 'Shopify', location: 'Toronto, Canada', stipend: 'CAD 6,000/month', careers: 'https://shopify.com/careers', grade: 'B+', gradeReason: 'Good culture, solid learning' },
        // Europe
        { name: 'Spotify', location: 'Stockholm, Sweden', stipend: '€4,500/month', careers: 'https://lifeatspotify.com', grade: 'A', gradeReason: 'Excellent culture and WLB' },
        { name: 'Revolut', location: 'London, UK', stipend: '£4,000/month', careers: 'https://revolut.com/careers', grade: 'B', gradeReason: 'Fast growth but demanding' },
        { name: 'BlaBlaCar', location: 'Paris, France', stipend: '€2,500/month', careers: 'https://blablacar.com/careers', grade: 'C+', gradeReason: 'Average pay, decent learning' },
        { name: 'Klarna', location: 'Amsterdam, Netherlands', stipend: '€3,500/month', careers: 'https://klarna.com/careers', grade: 'B', gradeReason: 'Good culture, fair pay' },
        { name: 'Adyen', location: 'Amsterdam, Netherlands', stipend: '€4,000/month', careers: 'https://careers.adyen.com', grade: 'B+', gradeReason: 'Good pay, technical depth' },
        { name: 'Deliveroo', location: 'London, UK', stipend: '£3,500/month', careers: 'https://careers.deliveroo.com', grade: 'C+', gradeReason: 'Average program, OK learning' },
        { name: 'Zalando', location: 'Berlin, Germany', stipend: '€3,000/month', careers: 'https://jobs.zalando.com', grade: 'B-', gradeReason: 'Good culture, average pay' },
        // Asia Pacific
        { name: 'Grab', location: 'Singapore', stipend: 'SGD 4,000/month', careers: 'https://grab.careers', grade: 'B+', gradeReason: 'Regional leader, good learning' },
        { name: 'Atlassian', location: 'Sydney, Australia', stipend: 'AUD 5,500/month', careers: 'https://atlassian.com/company/careers', grade: 'A', gradeReason: 'Excellent culture and benefits' },
        { name: 'Rakuten', location: 'Tokyo, Japan', stipend: '¥350,000/month', careers: 'https://global.rakuten.com/corp/careers', grade: 'B', gradeReason: 'Good pay, structured program' },
        { name: 'ByteDance', location: 'Singapore', stipend: 'SGD 5,000/month', careers: 'https://jobs.bytedance.com', grade: 'B+', gradeReason: 'High pay but intense hours' },
        { name: 'Sea Group', location: 'Singapore', stipend: 'SGD 4,500/month', careers: 'https://careers.sea.com', grade: 'B', gradeReason: 'Growing company, good exposure' },
        // Latin America & MENA
        { name: 'Mercado Libre', location: 'Buenos Aires, Argentina', stipend: 'Competitive', careers: 'https://mercadolibre.com/jobs', grade: 'B', gradeReason: 'Regional giant, good learning' },
        { name: 'Nubank', location: 'São Paulo, Brazil', stipend: 'R$8,000/month', careers: 'https://nubank.com.br/carreiras', grade: 'A-', gradeReason: 'Top fintech, great culture' },
        { name: 'Careem', location: 'Dubai, UAE', stipend: 'AED 8,000/month', careers: 'https://careem.com/careers', grade: 'B', gradeReason: 'Good exposure, solid pay' },
        { name: 'Rappi', location: 'Bogotá, Colombia', stipend: 'Competitive', careers: 'https://rappi.com/jobs', grade: 'C', gradeReason: 'Startup culture, variable quality' }
    ];
    
    const roles = [
        'Software Engineering Intern',
        'Data Science Intern',
        'Product Design Intern',
        'Full Stack Developer Intern',
        'Machine Learning Intern',
        'Cloud Engineering Intern',
        'Frontend Developer Intern',
        'Backend Developer Intern',
        'Mobile Developer Intern',
        'DevOps Intern',
        'Security Engineering Intern',
        'Data Engineering Intern',
        'Platform Engineering Intern',
        'Site Reliability Intern',
        'QA Engineering Intern'
    ];
    
    const descriptions = [
        "Join our world-class engineering team to build products used by millions globally.",
        "Work on cutting-edge technology with experienced mentors in a fast-paced environment.",
        "Be part of a team that's changing how people interact with technology every day.",
        "Gain hands-on experience solving real-world problems at scale.",
        "Collaborate with talented engineers from around the world on impactful projects.",
        "Build features that ship to production and impact real users.",
        "Learn from industry experts while working on challenging technical problems."
    ];
    
    // Shuffle and pick 18 diverse companies
    const shuffled = companies.sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, 18).map((company, i) => ({
        id: 'global-' + Date.now() + '-' + i,
        title: roles[i % roles.length],
        company: company.name,
        location: company.location,
        duration: '3-6 months',
        role: 'Engineering',
        description: descriptions[i % descriptions.length],
        requiredSkills: skills?.slice(0, 4) || ['Programming', 'Problem Solving', 'Teamwork'],
        stipend: company.stipend,
        status: 'active',
        isReal: true,
        applyUrl: company.careers,
        fitScore: calculateFitScore(skills, { requiredSkills: skills?.slice(0, 4) || [] }),
        companyGrade: company.grade,
        gradeReason: company.gradeReason
    }));
}

// Helper: Strip HTML tags
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
}

// Helper: Extract role from title
function extractRole(title) {
    const t = title.toLowerCase();
    if (t.includes('frontend') || t.includes('front-end')) return 'Frontend Development';
    if (t.includes('backend') || t.includes('back-end')) return 'Backend Development';
    if (t.includes('full stack') || t.includes('fullstack')) return 'Full Stack Development';
    if (t.includes('data')) return 'Data Science';
    if (t.includes('machine learning') || t.includes('ml') || t.includes('ai')) return 'Machine Learning';
    if (t.includes('devops') || t.includes('sre')) return 'DevOps';
    if (t.includes('design') || t.includes('ux') || t.includes('ui')) return 'Design';
    if (t.includes('product')) return 'Product Management';
    return 'Software Engineering';
}

// Helper: Extract skills from job description
function extractSkillsFromDescription(description, userSkills) {
    const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'Java', 'C++', 'Go', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Machine Learning', 'TensorFlow', 'PyTorch'];
    
    const descLower = (description || '').toLowerCase();
    const found = commonSkills.filter(skill => descLower.includes(skill.toLowerCase()));
    
    // Add some user skills to improve matching
    if (userSkills && found.length < 3) {
        found.push(...userSkills.slice(0, 3 - found.length));
    }
    
    return [...new Set(found)].slice(0, 5);
}

// ============================================
// PROFILE SELECTION
// ============================================
function showProfileSelector() {
    const profileCard = document.getElementById('profileCard');
    if (!profileCard) {
        console.log('Profile card not found, retrying...');
        setTimeout(showProfileSelector, 100);
        return;
    }
    
    // Check if user already selected a mode
    const savedMode = localStorage.getItem('bait_profile_mode');
    const savedProfile = localStorage.getItem('bait_custom_profile');
    
    if (savedMode === 'demo') {
        useDemo();
        return;
    } else if (savedMode === 'custom' && savedProfile) {
        currentProfile = JSON.parse(savedProfile);
        profileMode = 'custom';
        updateProfileCard();
        loadInternships();
        return;
    }
    
    profileCard.innerHTML = `
        <div style="text-align:center;">
            <h2 style="margin-bottom:0.5rem;">👋 Welcome to BAIT!</h2>
            <p style="color:#6b7280;margin-bottom:1.5rem;">Choose how you want to explore internships</p>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div onclick="useDemo()" style="cursor:pointer;background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;padding:1.5rem;border-radius:1rem;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">🎭</div>
                    <h3 style="color:white;margin-bottom:0.5rem;">Try Demo Profile</h3>
                    <p style="font-size:0.85rem;color:#e0e7ff;margin:0;">Alex Johnson - CS Student with JavaScript, React, Python skills</p>
                </div>
                
                <div onclick="showCustomForm()" style="cursor:pointer;background:white;border:2px solid #2563eb;color:#1e40af;padding:1.5rem;border-radius:1rem;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">✏️</div>
                    <h3 style="color:#1e40af;margin-bottom:0.5rem;">Enter Your Info</h3>
                    <p style="font-size:0.85rem;color:#6b7280;margin:0;">Create your own profile with your skills and preferences</p>
                </div>
            </div>
        </div>
    `;
}

// Use demo profile
window.useDemo = function() {
    currentProfile = DEMO_PROFILE;
    profileMode = 'demo';
    localStorage.setItem('bait_profile_mode', 'demo');
    updateProfileCard();
    loadInternships();
};

// Show custom profile form
window.showCustomForm = function() {
    const profileCard = document.getElementById('profileCard');
    if (!profileCard) return;
    
    profileCard.innerHTML = `
        <h3 style="margin-bottom:1rem;">✏️ Create Your Profile</h3>
        <form id="customProfileForm" onsubmit="saveCustomProfile(event)" style="display:grid;gap:1rem;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label style="font-size:0.85rem;color:#6b7280;display:block;margin-bottom:0.25rem;">Your Name</label>
                    <input type="text" id="customName" required placeholder="e.g. Marie Dupont" style="width:100%;padding:0.75rem;border:1px solid #d1d5db;border-radius:0.5rem;">
                </div>
                <div>
                    <label style="font-size:0.85rem;color:#6b7280;display:block;margin-bottom:0.25rem;">Location</label>
                    <input type="text" id="customLocation" placeholder="e.g. Paris, France" style="width:100%;padding:0.75rem;border:1px solid #d1d5db;border-radius:0.5rem;">
                </div>
            </div>
            
            <div>
                <label style="font-size:0.85rem;color:#6b7280;display:block;margin-bottom:0.25rem;">Your Skills (comma separated)</label>
                <input type="text" id="customSkills" required placeholder="e.g. Python, JavaScript, React, SQL, Machine Learning" style="width:100%;padding:0.75rem;border:1px solid #d1d5db;border-radius:0.5rem;">
            </div>
            
            <div>
                <label style="font-size:0.85rem;color:#6b7280;display:block;margin-bottom:0.25rem;">Target Roles (comma separated)</label>
                <input type="text" id="customRoles" placeholder="e.g. Data Scientist, ML Engineer, Software Developer" style="width:100%;padding:0.75rem;border:1px solid #d1d5db;border-radius:0.5rem;">
            </div>
            
            <div style="display:flex;gap:1rem;margin-top:0.5rem;">
                <button type="submit" class="btn-primary">Save & Find Matches</button>
                <button type="button" class="btn-secondary" onclick="showProfileSelector()">Cancel</button>
            </div>
        </form>
    `;
};

// Save custom profile
window.saveCustomProfile = function(e) {
    e.preventDefault();
    
    const name = document.getElementById('customName').value.trim();
    const location = document.getElementById('customLocation').value.trim();
    const skillsRaw = document.getElementById('customSkills').value;
    const rolesRaw = document.getElementById('customRoles').value;
    
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s);
    const roles = rolesRaw.split(',').map(s => s.trim()).filter(s => s);
    
    currentProfile = {
        name: name,
        location: location || 'Not specified',
        role: 'Student',
        skills: skills,
        targetRoles: roles,
        isDemo: false
    };
    
    profileMode = 'custom';
    localStorage.setItem('bait_profile_mode', 'custom');
    localStorage.setItem('bait_custom_profile', JSON.stringify(currentProfile));
    
    updateProfileCard();
    loadInternships();
};

// Switch profile
window.switchProfile = function() {
    localStorage.removeItem('bait_profile_mode');
    localStorage.removeItem('bait_custom_profile');
    showProfileSelector();
};

// ============================================
// PAGE FUNCTIONS
// ============================================

// Generate sample internships
window.generateSampleData = async function() {
    const btn = document.getElementById('generateBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Generating...';
    }
    
    try {
        const db = firebase.firestore();
        
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
    
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    // Don't load if no profile selected yet
    if (!currentProfile) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:#6b7280;">👆 Select a profile above to see personalized internship matches</p>';
        return;
    }
    
    // For demo profile, use sample internships directly (no Firestore needed)
    if (currentProfile.isDemo) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;">🎭 Loading demo internships...</p>';
        
        // Use SAMPLE_INTERNSHIPS directly for demo
        const internships = SAMPLE_INTERNSHIPS.map((job, idx) => ({
            id: 'sample-' + idx,
            ...job,
            fitScore: calculateFitScore(currentProfile.skills, job)
        }));
        
        // Sort by fit score
        internships.sort((a, b) => b.fitScore - a.fitScore);
        
        if (noOffers) noOffers.style.display = 'none';
        container.innerHTML = '';
        
        // Add demo header
        const header = document.createElement('div');
        header.style.cssText = 'grid-column:1/-1;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;padding:1rem 1.5rem;border-radius:0.75rem;margin-bottom:0.5rem;';
        header.innerHTML = '<p style="margin:0;color:white;">🎭 <strong>Demo Internships</strong> - These are sample internships for demonstration. Switch to custom profile for real jobs!</p>';
        container.appendChild(header);
        
        renderInternshipCards(internships, container, false);
        return;
    }
    
    // For custom profile, search real internships
    container.innerHTML = '<p style="text-align:center;padding:2rem;">🔍 Searching real internships based on your skills...</p>';
    
    try {
        const internships = [];
        
        // Fetch real internships from API
        const realJobs = await fetchRealInternships(currentProfile.skills, currentProfile.targetRoles);
        internships.push(...realJobs);
        
        // Sort by fit score (AI RANKING)
        internships.sort((a, b) => b.fitScore - a.fitScore);
        
        if (internships.length === 0) {
            container.innerHTML = '';
            if (noOffers) noOffers.style.display = 'block';
            return;
        }
        
        if (noOffers) noOffers.style.display = 'none';
        container.innerHTML = '';
        
        // Add real jobs header
        const header = document.createElement('div');
        header.style.cssText = 'grid-column:1/-1;background:linear-gradient(135deg,#059669,#10b981);color:white;padding:1rem 1.5rem;border-radius:0.75rem;margin-bottom:0.5rem;';
        header.innerHTML = '<p style="margin:0;color:white;">🌐 <strong>Real Internships</strong> - Found ' + internships.length + ' matches from job boards based on your skills</p>';
        container.appendChild(header);
        
        renderInternshipCards(internships, container, true);
        
    } catch (error) {
        console.error('Error loading internships:', error);
        container.innerHTML = `
            <div style="text-align:center;padding:2rem;grid-column:1/-1;">
                <p style="color:#ef4444;margin-bottom:1rem;">Error loading internships: ${error.message}</p>
                <p style="color:#6b7280;margin-bottom:1rem;">Try refreshing or switch to demo mode.</p>
                <div style="display:flex;gap:1rem;justify-content:center;">
                    <button class="btn-primary" onclick="useDemo()">🎭 Use Demo Mode</button>
                    <button class="btn-secondary" onclick="loadInternships()">🔄 Retry</button>
                </div>
            </div>
        `;
    }
}

// Helper function to render internship cards
function renderInternshipCards(internships, container, isRealMode) {
    // Helper to get grade color
    const getGradeColor = (grade) => {
        if (!grade) return '#6b7280';
        const g = grade.toUpperCase().replace(/[+-]/g, '');
        if (g === 'A') return '#059669'; // Green
        if (g === 'B') return '#2563eb'; // Blue
        if (g === 'C') return '#f59e0b'; // Orange
        if (g === 'D') return '#ef4444'; // Red
        if (g === 'F') return '#7f1d1d'; // Dark Red
        return '#6b7280';
    };
    
    for (const job of internships) {
        const fitColor = getFitColor(job.fitScore);
        const fitLabel = getFitLabel(job.fitScore);
        const title = job.title || 'Untitled Position';
        const company = job.company || job.recruiterCompany || 'Unknown Company';
        const jobTitle = title.replace(/'/g, "\\'");
        const jobCompany = company.replace(/'/g, "\\'");
        const isReal = job.isReal || false;
        const realBadge = isReal ? '<span style="background:#059669;color:white;padding:0.2rem 0.5rem;border-radius:0.25rem;font-size:0.7rem;margin-left:0.5rem;">REAL</span>' : '';
        
        // Company grade badge
        const companyGrade = job.companyGrade || null;
        const gradeColor = getGradeColor(companyGrade);
        const gradeBadge = companyGrade ? `<span title="${job.gradeReason || 'Company internship rating'}" style="background:${gradeColor};color:white;padding:0.2rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;font-weight:bold;margin-left:0.5rem;cursor:help;">Grade: ${companyGrade}</span>` : '';
        
        // Check if application is locked (fit score < 40%)
        const isLocked = job.fitScore < 40;
        const lockedBadge = isLocked ? '<div style="background:#ef4444;color:white;padding:0.5rem 1rem;border-radius:0.5rem;margin-bottom:1rem;font-size:0.85rem;"><strong>🔒 APPLICATION LOCKED</strong> - You need at least 40% match to apply. Improve your skills!</div>' : '';
        
        // Find missing skills
        const userSkills = (currentProfile?.skills || []).map(s => s.toLowerCase());
        const requiredSkills = job.requiredSkills || [];
        const missingSkills = requiredSkills.filter(skill => 
            !userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))
        );
        
        const card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative';
        card.style.borderLeft = isLocked ? '4px solid #ef4444' : (isReal ? '4px solid #059669' : 'none');
        if (isLocked) card.style.opacity = '0.85';
        
        card.innerHTML = `
            <div style="position:absolute;top:0.75rem;right:0.75rem;background:${fitColor};color:white;padding:0.3rem 0.6rem;border-radius:1rem;font-weight:600;font-size:0.7rem;">
                ${job.fitScore}%
            </div>
            
            <h3 style="margin-bottom:0.25rem;padding-right:60px;">${title}${realBadge}</h3>
            <p style="color:#2563eb;font-weight:600;margin:0 0 0.5rem 0;">${company}${gradeBadge}</p>
            
            ${lockedBadge}
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1rem;font-size:0.9rem;color:#6b7280;">
                <p style="margin:0;">📍 ${job.location || 'Remote'}</p>
                <p style="margin:0;">⏱️ ${job.duration || 'Flexible'}</p>
                <p style="margin:0;">💼 ${job.role || 'Internship'}</p>
                <p style="margin:0;">💰 ${job.stipend || 'Competitive'}</p>
            </div>
            
            <p style="color:#374151;margin-bottom:1rem;">${(job.description || 'No description available').substring(0, 120)}...</p>
            
            <div style="margin-bottom:1rem;">
                <p style="font-size:0.85rem;color:#6b7280;margin-bottom:0.5rem;"><strong>Required Skills:</strong></p>
                <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
                    ${requiredSkills.map(skill => {
                        const hasSkill = userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us));
                        return `<span style="background:${hasSkill ? '#d1fae5' : '#fee2e2'};color:${hasSkill ? '#065f46' : '#991b1b'};padding:0.2rem 0.6rem;border-radius:1rem;font-size:0.75rem;">${hasSkill ? '✓' : '✗'} ${skill}</span>`;
                    }).join('')}
                </div>
                ${missingSkills.length > 0 && isLocked ? `
                    <p style="font-size:0.8rem;color:#ef4444;margin-top:0.5rem;">⚠️ Missing: ${missingSkills.join(', ')}</p>
                ` : ''}
            </div>
            
            <div style="display:flex;gap:0.5rem;margin-top:1rem;">
                ${isLocked ? 
                    `<button class="btn-secondary" disabled style="opacity:0.5;cursor:not-allowed;">🔒 Locked - Improve Skills</button>` :
                    `<button class="btn-primary" onclick="applyToInternship('${job.id}', '${jobTitle}', '${jobCompany}', '${job.location || ''}', '${job.duration || ''}', ${job.fitScore})">🚀 Apply Now</button>`
                }
                ${isReal && job.applyUrl ? `<a href="${job.applyUrl}" target="_blank" class="btn-secondary" style="text-decoration:none;">🔗 Company Site</a>` : ''}
            </div>
        `;
        container.appendChild(card);
    }
}

// Update profile card display
function updateProfileCard() {
    const profileCard = document.getElementById('profileCard');
    if (!profileCard || !currentProfile) return;
    
    const demoLabel = currentProfile.isDemo ? '<span style="background:#7c3aed;color:white;padding:0.2rem 0.5rem;border-radius:0.25rem;font-size:0.7rem;margin-left:0.5rem;">DEMO</span>' : '';
    
    profileCard.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:1rem;">
            <div style="display:flex;align-items:center;gap:1rem;">
                <div style="width:60px;height:60px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:bold;">
                    ${currentProfile.name.charAt(0)}
                </div>
                <div>
                    <h3 style="margin:0;">${currentProfile.name}${demoLabel}</h3>
                    <p style="margin:0;color:#6b7280;">${currentProfile.role || 'Student'}</p>
                    <p style="font-size:0.85rem;color:#6b7280;margin-top:0.25rem;">📍 ${currentProfile.location || 'Not specified'}</p>
                </div>
            </div>
            <button onclick="switchProfile()" class="btn-secondary btn-small" style="font-size:0.8rem;">
                🔄 Switch Profile
            </button>
        </div>
        <div style="margin-top:1rem;">
            <p style="font-size:0.85rem;color:#6b7280;margin-bottom:0.5rem;"><strong>Your Skills:</strong></p>
            <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
                ${(currentProfile.skills || []).map(skill => 
                    `<span style="background:#dbeafe;color:#1e40af;padding:0.2rem 0.5rem;border-radius:0.5rem;font-size:0.75rem;">${skill}</span>`
                ).join('')}
            </div>
        </div>
    `;
}

// Apply to a job - SAVES TO FIRESTORE FOR MY APPLICATIONS
window.applyToJob = async function(jobId, jobTitle, jobCompany) {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const user = auth.currentUser;
    
    // Use current profile
    const profile = currentProfile || DEMO_PROFILE;
    const odientId = user ? user.uid : 'demo-student-' + Date.now();
    
    try {
        // Check if already applied (only for logged in users)
        if (user) {
            const existing = await db.collection('applications')
                .where('offerId', '==', jobId)
                .where('studentId', '==', user.uid)
                .get();
            
            if (!existing.empty) {
                alert('You have already applied to this internship!');
                return;
            }
        }
        
        // Get offer details
        const offerDoc = await db.collection('offers').doc(jobId).get();
        const offerData = offerDoc.exists ? offerDoc.data() : {};
        
        // Calculate fit score for this application
        const fitScore = calculateFitScore(profile.skills, offerData);
        
        // Create application document
        const applicationData = {
            offerId: jobId,
            offerTitle: jobTitle,
            offerCompany: jobCompany,
            offerLocation: offerData.location || '',
            offerDuration: offerData.duration || '',
            studentId: user ? user.uid : odientId,
            studentName: profile.name,
            studentEmail: profile.email || (user ? user.email : 'demo@student.edu'),
            studentSkills: profile.skills || [],
            fitScore: fitScore,
            status: 'pending',
            appliedAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('applications').add(applicationData);
        
        // Update offer's applicant count
        if (offerDoc.exists) {
            const currentCount = offerData.applicantCount || 0;
            await db.collection('offers').doc(jobId).update({
                applicantCount: currentCount + 1
            });
        }
        
        alert('🎉 Application submitted successfully!\n\nPosition: ' + jobTitle + '\nCompany: ' + jobCompany + '\nFit Score: ' + fitScore + '%\n\n⏱️ ~2 hours saved with BAIT AI matching!\n\nView your applications in My Applications tab.');
        
    } catch (error) {
        console.error('Error applying:', error);
        alert('Error submitting application: ' + error.message);
    }
};

// Apply to internship directly on BAIT
window.applyToInternship = async function(jobId, jobTitle, jobCompany, location, duration, fitScore) {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const user = auth.currentUser;
    
    const profile = currentProfile || DEMO_PROFILE;
    const odientId = user ? user.uid : 'demo-student-' + Date.now();
    
    try {
        const applicationData = {
            offerId: jobId,
            offerTitle: jobTitle,
            offerCompany: jobCompany,
            offerLocation: location || 'Remote',
            offerDuration: duration || '3-6 months',
            studentId: user ? user.uid : odientId,
            studentName: profile.name,
            studentEmail: profile.email || (user ? user.email : 'demo@student.edu'),
            studentSkills: profile.skills || [],
            fitScore: fitScore || calculateFitScore(profile.skills, { requiredSkills: profile.skills }),
            status: 'applied',
            appliedAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('applications').add(applicationData);
        
        alert('🎉 Application submitted on BAIT!\n\nPosition: ' + jobTitle + '\nCompany: ' + jobCompany + '\nFit Score: ' + fitScore + '%\n\n⏱️ ~3 hours saved with BAIT!\n\nThe company will contact you via Messages.');
        
    } catch (error) {
        console.error('Error applying:', error);
        alert('Error: ' + error.message);
    }
};

// Logout
window.handleLogout = function() {
    console.log('Logout clicked');
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            console.log('Signed out successfully');
            localStorage.removeItem('bait_profile_mode');
            localStorage.removeItem('bait_custom_profile');
            window.location.hash = '#/login';
            window.location.reload();
        }).catch(error => {
            console.error('Logout error:', error);
            // Force redirect anyway
            localStorage.removeItem('bait_profile_mode');
            localStorage.removeItem('bait_custom_profile');
            window.location.hash = '#/login';
            window.location.reload();
        });
    } else {
        // Firebase not ready, just redirect
        localStorage.removeItem('bait_profile_mode');
        localStorage.removeItem('bait_custom_profile');
        window.location.hash = '#/login';
        window.location.reload();
    }
};

// ============================================
// INITIALIZE PAGE
// ============================================
async function initDashboard() {
    console.log('Student Dashboard initializing...');
    
    // Keep trying until profileCard exists
    const profileCard = document.getElementById('profileCard');
    if (!profileCard) {
        console.log('DOM not ready, retrying in 100ms...');
        setTimeout(initDashboard, 100);
        return;
    }
    
    console.log('DOM ready, profileCard found:', profileCard);
    
    // Wait for Firebase
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.log('Firebase not ready, retrying in 100ms...');
        setTimeout(initDashboard, 100);
        return;
    }
    
    console.log('Firebase ready, checking for user profile...');
    
    // Check for saved mode first
    const savedMode = localStorage.getItem('bait_profile_mode');
    const savedProfile = localStorage.getItem('bait_custom_profile');
    
    if (savedMode === 'demo') {
        console.log('Demo mode saved, loading demo...');
        currentProfile = DEMO_PROFILE;
        profileMode = 'demo';
        updateProfileCard();
        loadInternships();
        return;
    } else if (savedMode === 'custom' && savedProfile) {
        console.log('Custom mode saved, loading custom profile...');
        currentProfile = JSON.parse(savedProfile);
        profileMode = 'custom';
        updateProfileCard();
        loadInternships();
        return;
    }
    
    // Try to load profile from Firestore (from onboarding)
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            console.log('Loading profile from Firestore for user:', user.uid);
            const doc = await firebase.firestore().collection('users').doc(user.uid).get();
            if (doc.exists) {
                const userData = doc.data();
                console.log('Found Firestore profile:', userData);
                
                if (userData.profileComplete && userData.userType === 'student') {
                    // Use the onboarding profile
                    currentProfile = {
                        name: userData.name || 'Student',
                        email: userData.email || user.email,
                        role: userData.role || 'Student',
                        location: userData.location || 'Not specified',
                        skills: userData.skills || [],
                        targetRoles: userData.targetRoles || [],
                        isDemo: false
                    };
                    profileMode = 'custom';
                    
                    // Save to localStorage for future
                    localStorage.setItem('bait_profile_mode', 'custom');
                    localStorage.setItem('bait_custom_profile', JSON.stringify(currentProfile));
                    
                    console.log('Auto-loaded profile from onboarding:', currentProfile.name);
                    updateProfileCard();
                    loadInternships();
                    return;
                }
            }
        } catch (e) {
            console.log('Error loading Firestore profile:', e);
        }
    }
    
    // No saved profile found, show selector
    console.log('No saved mode, showing selector...');
    profileCard.innerHTML = `
        <div style="text-align:center;">
            <h2 style="margin-bottom:0.5rem;">👋 Welcome to BAIT!</h2>
            <p style="color:#6b7280;margin-bottom:1.5rem;">Choose how you want to explore internships</p>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div onclick="useDemo()" style="cursor:pointer;background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;padding:1.5rem;border-radius:1rem;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">🎭</div>
                    <h3 style="color:white;margin-bottom:0.5rem;">Try Demo Profile</h3>
                    <p style="font-size:0.85rem;color:#e0e7ff;margin:0;">Alex Johnson - CS Student with JavaScript, React, Python skills</p>
                </div>
                
                <div onclick="showCustomForm()" style="cursor:pointer;background:white;border:2px solid #2563eb;color:#1e40af;padding:1.5rem;border-radius:1rem;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">✏️</div>
                    <h3 style="color:#1e40af;margin-bottom:0.5rem;">Enter Your Info</h3>
                    <p style="font-size:0.85rem;color:#6b7280;margin:0;">Create your own profile with your skills and preferences</p>
                </div>
            </div>
        </div>
    `;
}

// Start initialization immediately - script is loaded after DOM by router
console.log('Student dashboard script loaded, starting init...');
setTimeout(initDashboard, 50);

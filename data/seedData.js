// BAIT Seed Data - Demo users, companies, and offers

const seedData = {
    // Demo Students
    students: [
        {
            uid: 'student_001',
            email: 'alice@college.edu',
            name: 'Alice Chen',
            userType: 'student',
            role: 'Computer Science Student',
            location: 'San Francisco, CA',
            skills: ['Python', 'JavaScript', 'React', 'Machine Learning', 'SQL'],
            targetRoles: ['Frontend Engineer', 'Full Stack Engineer', 'Machine Learning Engineer'],
            profileComplete: true,
            createdAt: new Date('2024-11-01')
        },
        {
            uid: 'student_002',
            email: 'bob@college.edu',
            name: 'Bob Kumar',
            userType: 'student',
            role: 'Computer Science & Business Student',
            location: 'New York, NY',
            skills: ['Java', 'Python', 'Data Analysis', 'Excel', 'Business Development'],
            targetRoles: ['Product Manager', 'Business Analyst', 'Data Analyst'],
            profileComplete: true,
            createdAt: new Date('2024-11-02')
        },
        {
            uid: 'student_003',
            email: 'carol@college.edu',
            name: 'Carol Johnson',
            userType: 'student',
            role: 'Software Engineering Student',
            location: 'Seattle, WA',
            skills: ['C++', 'Python', 'Systems Design', 'Cloud Architecture', 'DevOps'],
            targetRoles: ['Backend Engineer', 'DevOps Engineer', 'Site Reliability Engineer'],
            profileComplete: true,
            createdAt: new Date('2024-11-03')
        },
        {
            uid: 'student_004',
            email: 'diana@college.edu',
            name: 'Diana Martinez',
            userType: 'student',
            role: 'UX/UI Design Student',
            location: 'Los Angeles, CA',
            skills: ['Figma', 'User Research', 'Prototyping', 'CSS', 'JavaScript'],
            targetRoles: ['Product Designer', 'UX Designer', 'UI Engineer'],
            profileComplete: true,
            createdAt: new Date('2024-11-04')
        },
        {
            uid: 'student_005',
            email: 'evan@college.edu',
            name: 'Evan Park',
            userType: 'student',
            role: 'Data Science Student',
            location: 'Boston, MA',
            skills: ['Python', 'R', 'SQL', 'TensorFlow', 'Statistical Analysis'],
            targetRoles: ['Data Scientist', 'Analytics Engineer', 'Machine Learning Engineer'],
            profileComplete: true,
            createdAt: new Date('2024-11-05')
        }
    ],

    // Demo Recruiters (Companies)
    recruiters: [
        {
            uid: 'recruiter_001',
            email: 'careers@techcorp.com',
            name: 'Sarah Lee',
            userType: 'recruiter',
            role: 'Hiring Manager',
            location: 'San Francisco, CA',
            company: 'TechCorp',
            profileComplete: true,
            createdAt: new Date('2024-10-01')
        },
        {
            uid: 'recruiter_002',
            email: 'hr@startup.io',
            name: 'Marcus Williams',
            userType: 'recruiter',
            role: 'Talent Acquisition',
            location: 'New York, NY',
            company: 'StartupIO',
            profileComplete: true,
            createdAt: new Date('2024-10-02')
        },
        {
            uid: 'recruiter_003',
            email: 'recruiting@cloudtech.com',
            name: 'Jennifer Zhang',
            userType: 'recruiter',
            role: 'Engineering Manager',
            location: 'Seattle, WA',
            company: 'CloudTech',
            profileComplete: true,
            createdAt: new Date('2024-10-03')
        }
    ],

    // Demo Internship Offers
    offers: [
        {
            title: 'Frontend Engineer Intern',
            recruiterId: 'recruiter_001',
            recruiterName: 'Sarah Lee',
            recruiterCompany: 'TechCorp',
            role: 'Frontend Engineer',
            location: 'San Francisco, CA',
            duration: 'Summer 2025 (12 weeks)',
            stipend: '$22/hour',
            description: 'Join our Frontend team to build beautiful, responsive web applications. You\'ll work on React components, learn modern web development practices, and contribute to products used by millions. Great opportunity to learn from experienced engineers and grow your technical skills.',
            requiredSkills: ['JavaScript', 'React', 'CSS', 'HTML'],
            responsibilities: [
                'Develop new features for our web platform using React',
                'Write clean, maintainable code with tests',
                'Collaborate with designers and product managers',
                'Participate in code reviews and learn best practices',
                'Debug and optimize performance issues'
            ],
            requirements: [
                'Comfortable with JavaScript fundamentals',
                'Experience with React or similar frameworks',
                'Strong problem-solving skills',
                'Good communication and team collaboration',
                'Passion for building great user experiences'
            ],
            applicantCount: 0,
            status: 'active',
            createdAt: new Date('2024-11-10')
        },
        {
            title: 'Backend Engineer Intern',
            recruiterId: 'recruiter_001',
            recruiterName: 'Sarah Lee',
            recruiterCompany: 'TechCorp',
            role: 'Backend Engineer',
            location: 'San Francisco, CA',
            duration: 'Summer 2025 (12 weeks)',
            stipend: '$22/hour',
            description: 'Build scalable backend systems and APIs. You\'ll work with Python, databases, and cloud infrastructure. This is a great opportunity to understand how large-scale systems work and contribute to mission-critical services.',
            requiredSkills: ['Python', 'SQL', 'APIs', 'Databases'],
            responsibilities: [
                'Design and implement new APIs',
                'Optimize database queries and performance',
                'Write unit and integration tests',
                'Learn about cloud deployment and DevOps',
                'Work on fixing bugs and improving code quality'
            ],
            requirements: [
                'Strong knowledge of Python or similar language',
                'Understanding of databases and SQL',
                'Problem-solving and debugging skills',
                'Ability to write clean, documented code',
                'Interest in learning DevOps and cloud technologies'
            ],
            applicantCount: 0,
            status: 'active',
            createdAt: new Date('2024-11-10')
        },
        {
            title: 'Product Manager Intern',
            recruiterId: 'recruiter_002',
            recruiterName: 'Marcus Williams',
            recruiterCompany: 'StartupIO',
            role: 'Product Manager',
            location: 'New York, NY',
            duration: 'Spring 2025 (10 weeks)',
            stipend: '$20/hour',
            description: 'Work directly with our founding team to shape the future of our product. You\'ll conduct user research, analyze data, and help prioritize features. Perfect for those interested in product strategy and business.',
            requiredSkills: ['Data Analysis', 'User Research', 'Communication'],
            responsibilities: [
                'Conduct user interviews and gather feedback',
                'Analyze product metrics and user behavior',
                'Help prioritize features based on impact',
                'Create product requirements documents',
                'Collaborate with engineering and design teams'
            ],
            requirements: [
                'Strong analytical and critical thinking skills',
                'Excellent communication abilities',
                'Interest in understanding user needs',
                'Comfort with data and metrics',
                'Entrepreneurial mindset'
            ],
            applicantCount: 0,
            status: 'active',
            createdAt: new Date('2024-11-11')
        },
        {
            title: 'DevOps Engineer Intern',
            recruiterId: 'recruiter_003',
            recruiterName: 'Jennifer Zhang',
            recruiterCompany: 'CloudTech',
            role: 'DevOps Engineer',
            location: 'Seattle, WA',
            duration: 'Summer 2025 (12 weeks)',
            stipend: '$24/hour',
            description: 'Help us build and maintain our cloud infrastructure. You\'ll learn about Kubernetes, CI/CD pipelines, and infrastructure as code. Great for those interested in the intersection of development and operations.',
            requiredSkills: ['Linux', 'Docker', 'Cloud Platforms', 'Python'],
            responsibilities: [
                'Help deploy and manage applications',
                'Improve CI/CD pipelines',
                'Monitor and optimize system performance',
                'Write infrastructure as code',
                'Document deployment processes'
            ],
            requirements: [
                'Linux command line proficiency',
                'Understanding of containerization (Docker)',
                'Experience with at least one cloud platform (AWS, GCP, Azure)',
                'Scripting skills in Python or Bash',
                'Passion for automation and efficiency'
            ],
            applicantCount: 0,
            status: 'active',
            createdAt: new Date('2024-11-11')
        },
        {
            title: 'Data Scientist Intern',
            recruiterId: 'recruiter_002',
            recruiterName: 'Marcus Williams',
            recruiterCompany: 'StartupIO',
            role: 'Data Science',
            location: 'New York, NY',
            duration: 'Spring 2025 (10 weeks)',
            stipend: '$23/hour',
            description: 'Join our data team to build machine learning models and analyze user behavior. You\'ll work with real data, learn about ML pipelines, and see your models impact real users.',
            requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
            responsibilities: [
                'Build and train machine learning models',
                'Analyze user behavior and trends',
                'Create data visualizations',
                'Write production-ready code',
                'Document findings and present insights'
            ],
            requirements: [
                'Strong Python programming skills',
                'Knowledge of machine learning algorithms',
                'SQL proficiency',
                'Statistical thinking',
                'Experience with ML libraries (scikit-learn, TensorFlow)'
            ],
            applicantCount: 0,
            status: 'active',
            createdAt: new Date('2024-11-12')
        },
        {
            title: 'UX Designer Intern',
            recruiterId: 'recruiter_001',
            recruiterName: 'Sarah Lee',
            recruiterCompany: 'TechCorp',
            role: 'Product Design',
            location: 'San Francisco, CA',
            duration: 'Summer 2025 (12 weeks)',
            stipend: '$20/hour',
            description: 'Design user interfaces and experiences for our products. You\'ll conduct user research, create wireframes and prototypes, and learn modern design practices. Work with talented engineers and product managers.',
            requiredSkills: ['Figma', 'User Research', 'Prototyping'],
            responsibilities: [
                'Conduct user research and interviews',
                'Create wireframes and prototypes',
                'Design user interfaces in Figma',
                'Iterate based on user feedback',
                'Collaborate with engineers on implementation'
            ],
            requirements: [
                'Proficiency in design tools like Figma',
                'Understanding of UX principles',
                'Strong visual communication skills',
                'Empathy for users and their needs',
                'Portfolio showcasing design work'
            ],
            applicantCount: 0,
            status: 'active',
            createdAt: new Date('2024-11-12')
        }
    ]
};

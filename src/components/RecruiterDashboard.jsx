import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  Users, 
  Star, 
  TrendingUp, 
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye
} from 'lucide-react';

// ============================================
// AI MATCHING LOGIC
// ============================================

/**
 * Analyzes the fit between a job's requirements and a student's profile
 * @param {Object} job - Job object with requirements string
 * @param {Object} student - Student object with learnGoals and cvSummary
 * @returns {Object} { score: number, analysis: string, matchedSkills: string[], missingSkills: string[] }
 */
const analyzeFit = (job, student) => {
  // Extract keywords from job requirements
  const requirementKeywords = extractKeywords(job.requirements || '');
  
  // Combine student's learn goals and CV summary for analysis
  const studentProfile = `${student.learnGoals || ''} ${student.cvSummary || ''}`.toLowerCase();
  
  // Find matched and missing skills
  const matchedSkills = [];
  const missingSkills = [];
  
  requirementKeywords.forEach(keyword => {
    if (studentProfile.includes(keyword.toLowerCase())) {
      matchedSkills.push(keyword);
    } else {
      missingSkills.push(keyword);
    }
  });
  
  // Calculate base score (0-10)
  const matchRatio = requirementKeywords.length > 0 
    ? matchedSkills.length / requirementKeywords.length 
    : 0;
  
  // Score calculation with bonuses
  let score = Math.round(matchRatio * 8); // Base score up to 8
  
  // Bonus for experience keywords
  const experienceBonus = checkExperienceBonus(studentProfile);
  score += experienceBonus;
  
  // Bonus for education keywords
  const educationBonus = checkEducationBonus(studentProfile, job.requirements);
  score += educationBonus;
  
  // Cap at 10
  score = Math.min(10, Math.max(0, score));
  
  // Generate AI analysis text
  const analysis = generateAnalysis(score, matchedSkills, missingSkills, student);
  
  return {
    score,
    analysis,
    matchedSkills,
    missingSkills,
    matchRatio: Math.round(matchRatio * 100)
  };
};

/**
 * Extract meaningful keywords from requirements text
 */
const extractKeywords = (text) => {
  const skillKeywords = [
    'react', 'javascript', 'typescript', 'python', 'java', 'node.js', 'nodejs',
    'sql', 'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes', 'git',
    'html', 'css', 'tailwind', 'vue', 'angular', 'express', 'django', 'flask',
    'machine learning', 'ml', 'ai', 'data science', 'analytics', 'tableau',
    'figma', 'ui/ux', 'design', 'photoshop', 'illustrator',
    'agile', 'scrum', 'jira', 'communication', 'teamwork', 'leadership',
    'excel', 'powerpoint', 'salesforce', 'marketing', 'seo',
    'tensorflow', 'pytorch', 'pandas', 'numpy', 'r', 'statistics',
    'rest api', 'graphql', 'microservices', 'ci/cd', 'devops',
    'swift', 'kotlin', 'flutter', 'react native', 'mobile'
  ];
  
  const textLower = text.toLowerCase();
  return skillKeywords.filter(skill => textLower.includes(skill));
};

/**
 * Check for experience-related bonuses
 */
const checkExperienceBonus = (profile) => {
  const experienceKeywords = ['internship', 'experience', 'worked at', 'project', 'built', 'developed', 'created'];
  const hasExperience = experienceKeywords.some(kw => profile.includes(kw));
  return hasExperience ? 1 : 0;
};

/**
 * Check for education-related bonuses
 */
const checkEducationBonus = (profile, requirements) => {
  const topSchools = ['mit', 'stanford', 'harvard', 'berkeley', 'carnegie mellon', 'oxford', 'cambridge'];
  const hasTopSchool = topSchools.some(school => profile.includes(school));
  return hasTopSchool ? 1 : 0;
};

/**
 * Generate human-readable AI analysis
 */
const generateAnalysis = (score, matchedSkills, missingSkills, student) => {
  if (score >= 9) {
    return `🚀 Perfect Match: ${student.name} demonstrates mastery in ${matchedSkills.slice(0, 3).join(', ')}. Exceptional candidate with comprehensive skill alignment.`;
  } else if (score >= 7) {
    return `⭐ Strong Candidate: Solid foundation in ${matchedSkills.slice(0, 2).join(' and ')}. ${missingSkills.length > 0 ? `Could develop ${missingSkills[0]}.` : 'Well-rounded profile.'}`;
  } else if (score >= 5) {
    return `💡 Potential Match: Shows promise with ${matchedSkills[0] || 'relevant background'}. May need mentoring in ${missingSkills.slice(0, 2).join(', ') || 'some areas'}.`;
  } else if (score >= 3) {
    return `📚 Growth Candidate: Foundational skills present. Significant training needed in ${missingSkills.slice(0, 2).join(', ')}.`;
  } else {
    return `⚠️ Limited Match: Profile doesn't align well with requirements. Consider for different role.`;
  }
};

// ============================================
// SAMPLE DATA
// ============================================

const SAMPLE_JOB = {
  id: 'job-1',
  title: 'Software Engineering Intern',
  company: 'TechCorp',
  requirements: 'Looking for candidates with React, JavaScript, TypeScript experience. Knowledge of Node.js and REST APIs preferred. Familiarity with Git and Agile methodologies. Strong communication and teamwork skills required.'
};

const SAMPLE_APPLICANTS = [
  {
    id: 'app-1',
    name: 'Emma Martinez',
    email: 'emma.martinez@mit.edu',
    university: 'MIT',
    major: 'Computer Science',
    gpa: '3.9/4.0',
    year: 'Junior',
    location: 'Boston, MA',
    appliedDate: '2025-12-01',
    learnGoals: 'I want to master React and TypeScript for building scalable web applications. Interested in learning Node.js backend development and microservices architecture.',
    cvSummary: 'Built 3 full-stack projects using React and JavaScript. Internship at Google working on frontend development. Led team project using Agile methodology. Proficient in Git, HTML, CSS, and REST APIs. Strong communication skills demonstrated through hackathon presentations.',
    strengths: ['React', 'JavaScript', 'Team Leadership', 'Communication']
  },
  {
    id: 'app-2',
    name: 'James Chen',
    email: 'james.chen@stanford.edu',
    university: 'Stanford University',
    major: 'Software Engineering',
    gpa: '3.8/4.0',
    year: 'Senior',
    location: 'Palo Alto, CA',
    appliedDate: '2025-11-30',
    learnGoals: 'Focused on machine learning and AI applications. Want to combine my Python expertise with web development using React.',
    cvSummary: 'Extensive Python and TensorFlow experience. Published research in ML. Previous internship at Google on AI team. Learning React and TypeScript. Good with Git and agile development.',
    strengths: ['Python', 'Machine Learning', 'Research', 'Problem Solving']
  },
  {
    id: 'app-3',
    name: 'Sophie Dubois',
    email: 'sophie.dubois@polytechnique.edu',
    university: 'École Polytechnique',
    major: 'Data Science',
    gpa: '16/20',
    year: "Master's 1",
    location: 'Paris, France',
    appliedDate: '2025-11-29',
    learnGoals: 'Want to transition from data science to full-stack development. Learning React and Node.js.',
    cvSummary: 'Strong Python and SQL background. Analytics internship at L\'Oréal. Basic JavaScript knowledge. Learning React. Excellent teamwork and communication in English and French.',
    strengths: ['Python', 'SQL', 'Analytics', 'Bilingual']
  },
  {
    id: 'app-4',
    name: 'Marcus Johnson',
    email: 'marcus.j@gatech.edu',
    university: 'Georgia Tech',
    major: 'Computer Science',
    gpa: '3.7/4.0',
    year: 'Junior',
    location: 'Atlanta, GA',
    appliedDate: '2025-11-28',
    learnGoals: 'Master modern frontend frameworks, especially React and Vue. Want to contribute to open source projects.',
    cvSummary: 'React developer with 5 personal projects on GitHub. TypeScript enthusiast. Built REST APIs with Node.js and Express. Active open source contributor. Excellent Git workflow. Experience with Agile in club projects.',
    strengths: ['React', 'TypeScript', 'Open Source', 'Node.js']
  },
  {
    id: 'app-5',
    name: 'Aisha Patel',
    email: 'a.patel@imperial.ac.uk',
    university: 'Imperial College London',
    major: 'Computing',
    gpa: 'First Class Honours',
    year: 'Final Year',
    location: 'London, UK',
    appliedDate: '2025-11-27',
    learnGoals: 'Interested in DevOps and cloud infrastructure. Also learning React for frontend development.',
    cvSummary: 'Bloomberg internship in infrastructure team. Strong Python and Java skills. Docker and Kubernetes experience. Learning JavaScript and React. Good communication skills.',
    strengths: ['DevOps', 'Python', 'Docker', 'Cloud']
  },
  {
    id: 'app-6',
    name: 'Lucas Weber',
    email: 'lucas.weber@tum.de',
    university: 'TU Munich',
    major: 'Informatics',
    gpa: '1.3 (German scale)',
    year: 'Bachelor 3',
    location: 'Munich, Germany',
    appliedDate: '2025-11-26',
    learnGoals: 'Want to improve frontend skills. Currently focused on Java backend development.',
    cvSummary: 'Java and Spring Boot expertise. PostgreSQL database experience. Basic HTML and CSS. No React experience yet. Good at algorithms. German and English speaker.',
    strengths: ['Java', 'Backend', 'Databases', 'Algorithms']
  },
  {
    id: 'app-7',
    name: 'Olivia Smith',
    email: 'olivia.smith@uoft.ca',
    university: 'University of Toronto',
    major: 'UX Design',
    gpa: '3.8/4.0',
    year: 'Senior',
    location: 'Toronto, Canada',
    appliedDate: '2025-11-25',
    learnGoals: 'Bridge the gap between design and development. Learning React to prototype my designs.',
    cvSummary: 'Shopify internship in UX team. Expert in Figma and design systems. Learning React and JavaScript. Good at user research and communication. Basic HTML/CSS knowledge.',
    strengths: ['UX Design', 'Figma', 'User Research', 'Prototyping']
  },
  {
    id: 'app-8',
    name: 'Daniel Kim',
    email: 'daniel.kim@snu.ac.kr',
    university: 'Seoul National University',
    major: 'Business Analytics',
    gpa: '4.2/4.5',
    year: "Master's",
    location: 'Seoul, Korea',
    appliedDate: '2025-11-24',
    learnGoals: 'Combine business analytics with product development. Learning web technologies.',
    cvSummary: 'McKinsey consulting internship. Expert in Excel and Tableau. SQL and Python for analytics. Basic understanding of web development. Excellent communication and presentation skills.',
    strengths: ['Analytics', 'Consulting', 'Excel', 'Communication']
  }
];

// ============================================
// COMPONENTS
// ============================================

const RecruiterDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(SAMPLE_JOB);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopPicks, setFilterTopPicks] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Process applicants with AI analysis
  useEffect(() => {
    const processedApplicants = SAMPLE_APPLICANTS.map(applicant => {
      const fitAnalysis = analyzeFit(job, applicant);
      return {
        ...applicant,
        fitScore: fitAnalysis.score,
        aiAnalysis: fitAnalysis.analysis,
        matchedSkills: fitAnalysis.matchedSkills,
        missingSkills: fitAnalysis.missingSkills,
        matchRatio: fitAnalysis.matchRatio,
        isTopPick: fitAnalysis.score >= 7
      };
    });
    
    // Sort by fit score descending
    processedApplicants.sort((a, b) => b.fitScore - a.fitScore);
    setApplicants(processedApplicants);
  }, [job]);

  // Filtered applicants based on search and filters
  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const matchesSearch = !searchQuery || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.major.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = !filterTopPicks || app.isTopPick;
      
      return matchesSearch && matchesFilter;
    });
  }, [applicants, searchQuery, filterTopPicks]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const processed = applicants.length;
    const topPicks = applicants.filter(a => a.isTopPick).length;
    const minutesSaved = processed * 5; // 5 min per CV
    const timeSaved = minutesSaved >= 60 
      ? `${(minutesSaved / 60).toFixed(1)} hrs`
      : `${minutesSaved} min`;
    
    return { processed, topPicks, timeSaved, minutesSaved };
  }, [applicants]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InternMatch</h1>
                <p className="text-xs text-gray-500">AI-Powered Recruiting</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900">
                <MessageSquare className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                RC
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Synthesis Summary Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-lg font-semibold">AI Candidate Synthesis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Processed */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Processed</p>
                    <p className="text-3xl font-bold">{metrics.processed}</p>
                    <p className="text-white/60 text-xs">applicants analyzed</p>
                  </div>
                </div>
              </div>
              
              {/* Top Picks */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400/30 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Top Picks</p>
                    <p className="text-3xl font-bold">{metrics.topPicks}</p>
                    <p className="text-white/60 text-xs">score ≥ 7/10</p>
                  </div>
                </div>
              </div>
              
              {/* Time Saved */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-400/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Time Saved</p>
                    <p className="text-3xl font-bold">{metrics.timeSaved}</p>
                    <p className="text-white/60 text-xs">vs manual review</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job Context */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Analyzing for: <strong className="text-white">{job.title}</strong> at {job.company}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates by name, university, or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setFilterTopPicks(!filterTopPicks)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
              filterTopPicks 
                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-400'
            }`}
          >
            <Star className={`w-5 h-5 ${filterTopPicks ? 'text-yellow-500 fill-yellow-500' : ''}`} />
            Top Picks Only
          </button>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApplicants.map((applicant, index) => (
            <CandidateCard 
              key={applicant.id} 
              applicant={applicant} 
              rank={index + 1}
              onView={() => setSelectedApplicant(applicant)}
            />
          ))}
        </div>

        {filteredApplicants.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No candidates match your search criteria</p>
          </div>
        )}
      </main>

      {/* Candidate Detail Modal */}
      {selectedApplicant && (
        <CandidateModal 
          applicant={selectedApplicant} 
          onClose={() => setSelectedApplicant(null)} 
        />
      )}
    </div>
  );
};

// Candidate Card Component
const CandidateCard = ({ applicant, rank, onView }) => {
  const isTopPick = applicant.isTopPick;
  const scoreColor = applicant.fitScore >= 8 ? 'text-green-600' : 
                     applicant.fitScore >= 6 ? 'text-blue-600' : 
                     applicant.fitScore >= 4 ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-lg ${
        isTopPick 
          ? 'border-yellow-400 shadow-yellow-100' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
      style={isTopPick ? { boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' } : {}}
    >
      {/* Top Pick Badge */}
      {isTopPick && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          AI TOP PICK
        </div>
      )}

      {/* Rank Badge */}
      <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
        rank <= 3 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gray-400'
      }`}>
        #{rank}
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {applicant.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {applicant.university}
              </p>
            </div>
          </div>
          
          {/* Score Badge */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${scoreColor}`}>
              {applicant.fitScore}/10
            </div>
            <p className="text-xs text-gray-500">Match Score</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {applicant.major}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {applicant.location}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            GPA: {applicant.gpa}
          </span>
        </div>

        {/* AI Insight Box */}
        <div className={`rounded-xl p-4 mb-4 ${
          isTopPick ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className={`w-4 h-4 ${isTopPick ? 'text-yellow-600' : 'text-blue-600'}`} />
            <span className={`text-xs font-semibold ${isTopPick ? 'text-yellow-700' : 'text-blue-700'}`}>
              AI Insight
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {applicant.aiAnalysis}
          </p>
        </div>

        {/* Key Strengths */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">Key Strengths</p>
          <div className="flex flex-wrap gap-2">
            {applicant.strengths.map((strength, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        {/* Matched Skills */}
        {applicant.matchedSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">Matched Requirements</p>
            <div className="flex flex-wrap gap-2">
              {applicant.matchedSkills.slice(0, 5).map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CV Snippet */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1 font-medium">CV Summary</p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {applicant.cvSummary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View Profile
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Shortlist
          </button>
          <button className="flex items-center justify-center px-3 py-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Candidate Detail Modal
const CandidateModal = ({ applicant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {applicant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{applicant.name}</h2>
                <p className="text-gray-500">{applicant.major} at {applicant.university}</p>
                <p className="text-sm text-gray-400">{applicant.email}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Section */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                applicant.fitScore >= 7 ? 'text-green-600' : 'text-blue-600'
              }`}>
                {applicant.fitScore}/10
              </div>
              <p className="text-sm text-gray-500">AI Match Score</p>
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  applicant.fitScore >= 7 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${applicant.fitScore * 10}%` }}
              />
            </div>
          </div>

          {/* AI Analysis */}
          <div className={`rounded-xl p-4 ${
            applicant.isTopPick ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">AI Analysis</span>
            </div>
            <p className="text-gray-700">{applicant.aiAnalysis}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Year</p>
              <p className="font-medium">{applicant.year}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">GPA</p>
              <p className="font-medium">{applicant.gpa}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Location</p>
              <p className="font-medium">{applicant.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Applied</p>
              <p className="font-medium">{applicant.appliedDate}</p>
            </div>
          </div>

          {/* Learning Goals */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Learning Goals</h3>
            <p className="text-gray-600">{applicant.learnGoals}</p>
          </div>

          {/* CV Summary */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">CV Summary</h3>
            <p className="text-gray-600">{applicant.cvSummary}</p>
          </div>

          {/* Skills Match */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant.matchedSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant.missingSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
              <CheckCircle className="w-5 h-5" />
              Extend Offer
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              <Calendar className="w-5 h-5" />
              Schedule Interview
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              <MessageSquare className="w-5 h-5" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

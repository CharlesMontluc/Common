// Fit Score Utility - Simple AI-style matching

class FitScoreCalculator {
    // Calculate fit score between student and job
    static calculateFitScore(student, offer) {
        let score = 50; // Base score

        // Skill match (40 points)
        const studentSkills = (student.skills || []).map(s => s.toLowerCase());
        const requiredSkills = (offer.requiredSkills || []).map(s => s.toLowerCase());
        
        if (requiredSkills.length > 0) {
            const matchedSkills = requiredSkills.filter(skill => 
                studentSkills.some(s => s.includes(skill) || skill.includes(s))
            );
            const skillScore = (matchedSkills.length / requiredSkills.length) * 40;
            score += skillScore;
        }

        // Role match (40 points)
        const studentRoles = (student.targetRoles || []).map(r => r.toLowerCase());
        const jobRole = (offer.role || '').toLowerCase();
        
        const roleMatch = studentRoles.some(role => 
            role.includes(jobRole) || jobRole.includes(role)
        );
        
        if (roleMatch) {
            score += 40;
        }

        // Location match (20 points)
        const studentLocation = (student.location || '').toLowerCase();
        const jobLocation = (offer.location || '').toLowerCase();
        
        if (studentLocation === jobLocation) {
            score += 20;
        } else if (jobLocation.includes('remote')) {
            score += 10; // Partial credit for remote
        }

        return Math.round(Math.min(100, score));
    }

    // Get fit score description
    static getFitScoreLabel(score) {
        if (score >= 85) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Fair';
        return 'Poor';
    }

    // Get fit score color
    static getFitScoreColor(score) {
        if (score >= 85) return 'var(--secondary)'; // Green
        if (score >= 70) return 'var(--primary)'; // Blue
        if (score >= 50) return 'var(--warning)'; // Orange
        return 'var(--danger)'; // Red
    }
}

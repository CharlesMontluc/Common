// Student Results Page - Application Responses
(function() {
    console.log('Student Results page loaded');

    const resultTypes = {
        'offered': {
            icon: '🎉',
            label: 'Offer Received!',
            color: '#10b981',
            bgColor: '#ecfdf5',
            message: 'Congratulations! The company wants to hire you.'
        },
        'rejected': {
            icon: '😔',
            label: 'Not Selected',
            color: '#ef4444',
            bgColor: '#fef2f2',
            message: 'Unfortunately, the company decided to move forward with other candidates.'
        },
        'messaged': {
            icon: '💬',
            label: 'Company Messaged',
            color: '#3b82f6',
            bgColor: '#eff6ff',
            message: 'The company has sent you a message!'
        },
        'interview': {
            icon: '📅',
            label: 'Interview Scheduled',
            color: '#8b5cf6',
            bgColor: '#f5f3ff',
            message: 'Great news! The company wants to interview you.'
        }
    };

    // Logout function
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
                window.location.hash = '#/login';
                window.location.reload();
            });
        } else {
            window.location.hash = '#/login';
            window.location.reload();
        }
    };

    // Load results
    async function loadResults() {
        const container = document.getElementById('resultsContainer');
        const noResults = document.getElementById('noResults');
        
        if (!container) {
            console.log('Results container not found, retrying...');
            setTimeout(loadResults, 100);
            return;
        }
        
        // Wait for Firebase
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            console.log('Waiting for Firebase...');
            setTimeout(loadResults, 100);
            return;
        }

        try {
            const db = firebase.firestore();
            const auth = firebase.auth();
            
            // Show demo results immediately (don't require login for demo)
            showDemoResults(container);
            
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = `<p style="color:#ef4444;text-align:center;padding:2rem;">Error: ${error.message}</p>`;
        }
    }

    async function fetchResults(userId) {
        const db = firebase.firestore();
        const container = document.getElementById('resultsContainer');
        const noResults = document.getElementById('noResults');
        
        // Get applications with responses (not pending)
        const snapshot = await db.collection('applications')
            .where('studentId', '==', userId)
            .get();
        
        // Filter to only show those with responses
        const results = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.status && data.status !== 'pending' && data.status !== 'applied_external') {
                results.push({ id: doc.id, ...data });
            }
        });
        
        // Sort by most recent
        results.sort((a, b) => {
            const dateA = a.updatedAt?.toDate?.() || a.appliedAt?.toDate?.() || new Date(0);
            const dateB = b.updatedAt?.toDate?.() || b.appliedAt?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        
        if (results.length === 0) {
            container.innerHTML = '';
            
            // Show demo results for demonstration
            showDemoResults(container);
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        container.innerHTML = '';
        
        renderResults(results, container);
    }

    function showDemoResults(container) {
        // Show demo results to demonstrate the feature
        const demoResults = [
            {
                offerTitle: 'Frontend Developer Intern',
                offerCompany: 'TechCorp Paris',
                status: 'offered',
                fitScore: 92,
                message: 'We loved your portfolio! We would like to offer you the internship position starting January 2026. Please reply to confirm.',
                updatedAt: new Date()
            },
            {
                offerTitle: 'Data Science Intern',
                offerCompany: 'DataViz Analytics',
                status: 'interview',
                fitScore: 78,
                message: 'We would like to schedule a technical interview. Please select a time slot from our calendar link.',
                interviewDate: '2025-12-10',
                updatedAt: new Date(Date.now() - 86400000)
            },
            {
                offerTitle: 'Backend Engineer Intern',
                offerCompany: 'CloudScale Systems',
                status: 'messaged',
                fitScore: 85,
                message: 'Thank you for applying! We are reviewing your application and will get back to you within a week.',
                updatedAt: new Date(Date.now() - 172800000)
            },
            {
                offerTitle: 'UX/UI Design Intern',
                offerCompany: 'DesignHub Creative',
                status: 'rejected',
                fitScore: 45,
                message: 'Thank you for your interest. After careful consideration, we have decided to move forward with other candidates.',
                rejectionReasons: [
                    'Missing required skill: Figma (consider taking a Figma course)',
                    'Limited experience with user research methodologies',
                    'Portfolio could include more case studies with process documentation',
                    'Consider adding prototyping experience with tools like Principle or Framer'
                ],
                updatedAt: new Date(Date.now() - 259200000)
            },
            {
                offerTitle: 'Machine Learning Intern',
                offerCompany: 'AI Solutions Inc',
                status: 'rejected',
                fitScore: 38,
                message: 'We appreciate your application but have decided to proceed with candidates whose qualifications more closely match our requirements.',
                rejectionReasons: [
                    'Missing required skill: TensorFlow or PyTorch (complete a deep learning course)',
                    'Need more experience with Python data science libraries (NumPy, Pandas)',
                    'Consider contributing to ML open-source projects to build portfolio',
                    'Statistics and probability foundations could be strengthened'
                ],
                updatedAt: new Date(Date.now() - 345600000)
            }
        ];
        
        // Add demo banner
        const banner = document.createElement('div');
        banner.style.cssText = 'background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;padding:1rem 1.5rem;border-radius:0.75rem;margin-bottom:1rem;';
        banner.innerHTML = '<p style="margin:0;color:white;">🎭 <strong>Demo Results</strong> - These are sample responses to show how the feature works. Apply to internships to receive real responses!</p>';
        container.appendChild(banner);
        
        renderResults(demoResults, container);
    }

    function renderResults(results, container) {
        for (const result of results) {
            const type = resultTypes[result.status] || resultTypes.messaged;
            
            // Format date
            let dateStr = 'Recently';
            if (result.updatedAt) {
                const date = result.updatedAt.toDate ? result.updatedAt.toDate() : result.updatedAt;
                dateStr = date.toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                });
            }
            
            // Build rejection feedback HTML
            let feedbackHtml = '';
            if (result.status === 'rejected' && result.rejectionReasons && result.rejectionReasons.length > 0) {
                feedbackHtml = `
                    <div style="background:#fef2f2;border:1px solid #fecaca;padding:1rem;border-radius:0.5rem;margin-top:1rem;">
                        <p style="margin:0 0 0.5rem 0;font-weight:600;color:#991b1b;">📋 Areas for Improvement:</p>
                        <ul style="margin:0;padding-left:1.25rem;color:#7f1d1d;">
                            ${result.rejectionReasons.map(r => `<li style="margin-bottom:0.25rem;font-size:0.9rem;">${r}</li>`).join('')}
                        </ul>
                        <p style="margin:0.75rem 0 0 0;font-size:0.85rem;color:#059669;">💡 <strong>Tip:</strong> Use these insights to strengthen your profile for future applications!</p>
                    </div>
                `;
            }
            
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cssText = `border-left: 4px solid ${type.color}; background: ${type.bgColor};`;
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:1rem;">
                    <div style="flex:1;min-width:250px;">
                        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
                            <span style="font-size:2rem;">${type.icon}</span>
                            <div>
                                <span style="background:${type.color};color:white;padding:0.3rem 0.75rem;border-radius:2rem;font-size:0.85rem;font-weight:600;">${type.label}</span>
                            </div>
                        </div>
                        
                        <h3 style="margin:0 0 0.25rem 0;">${result.offerTitle || 'Position'}</h3>
                        <p style="color:#2563eb;font-weight:600;margin:0 0 1rem 0;">🏢 ${result.offerCompany || 'Company'}</p>
                        
                        <div style="background:white;padding:1rem;border-radius:0.5rem;margin-bottom:1rem;border:1px solid ${type.color}40;">
                            <p style="margin:0;color:#374151;">${result.message || type.message}</p>
                        </div>
                        
                        ${feedbackHtml}
                        
                        ${result.status === 'interview' && result.interviewDate ? `
                            <div style="background:#f5f3ff;padding:0.75rem;border-radius:0.5rem;display:inline-flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
                                <span>📅</span>
                                <strong>Interview Date:</strong> ${result.interviewDate}
                            </div>
                        ` : ''}
                        
                        <p style="color:#9ca3af;font-size:0.85rem;margin:${feedbackHtml ? '1rem' : '0'} 0 0 0;">Received on ${dateStr}</p>
                    </div>
                    
                    <div style="text-align:center;">
                        <div style="background:white;border:2px solid ${type.color};padding:1rem 1.5rem;border-radius:0.75rem;">
                            <div style="font-size:0.85rem;color:#6b7280;">Fit Score</div>
                            <div style="font-size:1.75rem;font-weight:bold;color:${type.color};">${result.fitScore || 0}%</div>
                        </div>
                        
                        ${result.status === 'offered' ? `
                            <div style="margin-top:1rem;">
                                <button class="btn-primary" onclick="respondToOffer('${result.id}', 'accept')">✅ Accept</button>
                                <button class="btn-secondary" onclick="respondToOffer('${result.id}', 'decline')" style="margin-left:0.5rem;">❌ Decline</button>
                            </div>
                        ` : ''}
                        
                        ${result.status === 'interview' ? `
                            <div style="margin-top:1rem;">
                                <button class="btn-primary" onclick="confirmInterview('${result.id}')">✅ Confirm Interview</button>
                            </div>
                        ` : ''}
                        
                        ${result.status === 'messaged' ? `
                            <div style="margin-top:1rem;">
                                <button class="btn-primary" onclick="replyToMessage('${result.id}')">💬 Reply</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        }
    }

    // Response actions
    window.respondToOffer = async function(applicationId, response) {
        const action = response === 'accept' ? 'accepted' : 'declined';
        
        try {
            await firebase.firestore().collection('applications').doc(applicationId).update({
                status: action,
                respondedAt: new Date()
            });
            
            alert(response === 'accept' ? 
                '🎉 Congratulations! You have accepted the offer!' : 
                '✅ Offer declined. Good luck with your search!');
            
            loadResults();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    window.confirmInterview = async function(applicationId) {
        try {
            await firebase.firestore().collection('applications').doc(applicationId).update({
                interviewConfirmed: true,
                confirmedAt: new Date()
            });
            
            alert('✅ Interview confirmed! Good luck!');
            loadResults();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    window.replyToMessage = function(applicationId) {
        const reply = prompt('Enter your reply to the company:');
        if (reply) {
            alert('💬 Reply sent! (Demo - in production this would send to the company)');
        }
    };

    // Initialize
    setTimeout(loadResults, 100);
})();

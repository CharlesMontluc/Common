// Student Applications Logic
(function() {
    console.log('Student Applications page loaded');
    
    const db = firebase.firestore();
    const auth = firebase.auth();

    const statusColors = {
        'pending': '#f59e0b',
        'applied_external': '#6366f1',
        'interview': '#3b82f6',
        'offered': '#10b981',
        'accepted': '#059669',
        'rejected': '#ef4444',
        'declined': '#9ca3af',
        'messaged': '#3b82f6'
    };

    const statusLabels = {
        'pending': '⏳ Pending Review',
        'applied_external': '🔗 Applied Externally',
        'interview': '📅 Interview Scheduled',
        'offered': '🎉 Offer Received',
        'accepted': '✅ Offer Accepted',
        'rejected': '❌ Not Selected',
        'declined': '🚫 Declined',
        'messaged': '💬 Company Messaged'
    };

    const statusEmoji = {
        'pending': '⏳',
        'interview': '📅',
        'offered': '🎉',
        'rejected': '❌'
    };

    // Logout function
    window.handleLogout = function() {
        console.log('Logout clicked');
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().signOut().then(() => {
                console.log('Signed out successfully');
                localStorage.removeItem('bait_profile_mode');
                localStorage.removeItem('bait_custom_profile');
                localStorage.removeItem('demoProfile');
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

    // Load applications from Firestore
    async function loadApplications() {
        const container = document.getElementById('applicationsContainer');
        const noApplications = document.getElementById('noApplications');
        
        if (!container) {
            console.log('Container not found, retrying...');
            setTimeout(loadApplications, 100);
            return;
        }

        container.innerHTML = '<p style="text-align:center;padding:2rem;grid-column:1/-1;">Loading your applications...</p>';

        // Wait for auth
        const user = auth.currentUser;
        if (!user) {
            console.log('Waiting for auth...');
            auth.onAuthStateChanged(async (u) => {
                if (u) {
                    await fetchApplications(u.uid);
                } else {
                    container.innerHTML = '<p style="text-align:center;padding:2rem;grid-column:1/-1;">Please log in to view applications</p>';
                }
            });
            return;
        }

        await fetchApplications(user.uid);
    }

    async function fetchApplications(userId) {
        const container = document.getElementById('applicationsContainer');
        const noApplications = document.getElementById('noApplications');

        try {
            console.log('Fetching applications for user:', userId);
            
            // Simple query without orderBy to avoid index requirement
            const snapshot = await db.collection('applications')
                .where('studentId', '==', userId)
                .get();

            console.log('Found applications:', snapshot.size);

            if (snapshot.empty) {
                container.innerHTML = '';
                if (noApplications) noApplications.style.display = 'block';
                return;
            }

            // Convert to array and sort in JavaScript
            const applications = [];
            snapshot.forEach(doc => {
                applications.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort by appliedAt descending
            applications.sort((a, b) => {
                const dateA = a.appliedAt?.toDate?.() || a.appliedAt || new Date(0);
                const dateB = b.appliedAt?.toDate?.() || b.appliedAt || new Date(0);
                return dateB - dateA;
            });

            container.innerHTML = '';
            if (noApplications) noApplications.style.display = 'none';

            applications.forEach(app => {
                console.log('Application data:', app);
                
                const statusColor = statusColors[app.status] || '#6b7280';
                const statusLabel = statusLabels[app.status] || 'Unknown';
                const fitScore = app.fitScore || 0;
                
                // Format date
                let dateStr = 'Unknown date';
                if (app.appliedAt) {
                    if (app.appliedAt.toDate) {
                        dateStr = app.appliedAt.toDate().toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                        });
                    } else if (app.appliedAt instanceof Date) {
                        dateStr = app.appliedAt.toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                        });
                    }
                }

                // Get fit score color
                let fitColor = '#ef4444'; // Red
                if (fitScore >= 75) fitColor = '#10b981'; // Green
                else if (fitScore >= 50) fitColor = '#f59e0b'; // Orange

                // Handle both field name patterns
                const title = app.offerTitle || app.title || 'Internship Position';
                const company = app.offerCompany || app.company || 'Company';
                const location = app.offerLocation || app.location || 'Location not specified';
                const duration = app.offerDuration || app.duration || 'Duration not specified';

                const card = document.createElement('div');
                card.className = 'card';
                card.style.cssText = 'border-left: 4px solid ' + statusColor + ';';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
                        <div style="flex: 1; min-width: 200px;">
                            <h3 style="margin-bottom: 0.5rem;">${title}</h3>
                            <p style="color: #2563eb; font-weight: 600; margin-bottom: 0.5rem;">
                                🏢 ${company}
                            </p>
                            <p style="color: #6b7280; margin-bottom: 0.25rem;">
                                📍 ${location}
                            </p>
                            <p style="color: #6b7280; margin-bottom: 0.5rem;">
                                ⏱️ ${duration}
                            </p>
                            <p style="color: #9ca3af; font-size: 0.875rem; margin-top: 0.5rem;">
                                Applied on ${dateStr}
                            </p>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <div style="background: ${statusColor}; color: white; padding: 0.75rem 1.25rem; border-radius: 0.5rem; text-align: center; min-width: 160px;">
                                <div style="font-weight: 600; font-size: 0.9rem;">${statusLabel}</div>
                            </div>
                            <div style="background: ${fitColor}20; border: 2px solid ${fitColor}; color: ${fitColor}; padding: 0.5rem 1rem; border-radius: 0.5rem; text-align: center; font-weight: 700;">
                                Match: ${fitScore}%
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

            // Add summary at top
            const totalApps = applications.length;
            const pending = applications.filter(a => a.status === 'pending' || a.status === 'applied_external').length;
            const interview = applications.filter(a => a.status === 'interview').length;
            const offered = applications.filter(a => a.status === 'offered').length;
            const withResponses = applications.filter(a => a.status !== 'pending' && a.status !== 'applied_external').length;

            const summary = document.createElement('div');
            summary.style.cssText = 'grid-column: 1 / -1; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;';
            summary.innerHTML = `
                <h3 style="margin-bottom: 1rem; color: #0369a1;">📊 Your Application Summary</h3>
                <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                    <div><strong style="font-size: 1.5rem; color: #2563eb;">${totalApps}</strong> Total Applications</div>
                    <div><strong style="font-size: 1.5rem; color: ${statusColors.pending};">${pending}</strong> Pending</div>
                    <div><strong style="font-size: 1.5rem; color: ${statusColors.interview};">${interview}</strong> Interviews</div>
                    <div><strong style="font-size: 1.5rem; color: ${statusColors.offered};">${offered}</strong> Offers</div>
                </div>
                ${withResponses > 0 ? `
                    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #0ea5e9;">
                        <a href="#/student/results" style="display:inline-flex;align-items:center;gap:0.5rem;color:#059669;font-weight:600;text-decoration:none;">
                            📬 You have ${withResponses} response${withResponses > 1 ? 's' : ''} from companies → View Results
                        </a>
                    </div>
                ` : ''}
            `;
            container.insertBefore(summary, container.firstChild);

        } catch (error) {
            console.error('Error loading applications:', error);
            container.innerHTML = `
                <div style="text-align:center;padding:2rem;grid-column:1/-1;">
                    <p style="color: #ef4444;">Error loading applications: ${error.message}</p>
                    <button class="btn-primary" onclick="location.reload()" style="margin-top: 1rem;">Retry</button>
                </div>
            `;
        }
    }

    // Initialize
    setTimeout(loadApplications, 100);
})();

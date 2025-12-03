// Student Messages Page
(function() {
    console.log('Student Messages page loaded');
    
    let currentConversation = null;
    
    // Logout function
    window.handleLogout = function() {
        console.log('Logout clicked');
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().signOut().then(() => {
                localStorage.removeItem('bait_profile_mode');
                localStorage.removeItem('bait_custom_profile');
                window.location.hash = '#/login';
                window.location.reload();
            }).catch(error => {
                window.location.hash = '#/login';
                window.location.reload();
            });
        } else {
            window.location.hash = '#/login';
            window.location.reload();
        }
    };
    
    // Demo conversations
    const demoConversations = [
        {
            id: 'conv-1',
            company: 'Google',
            position: 'Software Engineering Intern',
            lastMessage: 'We would love to schedule an interview!',
            unread: true,
            timestamp: new Date(Date.now() - 3600000),
            messages: [
                { from: 'company', text: 'Hi! Thank you for applying to the Software Engineering Intern position at Google.', time: new Date(Date.now() - 86400000) },
                { from: 'company', text: 'We reviewed your profile and were impressed by your skills in JavaScript and React.', time: new Date(Date.now() - 82800000) },
                { from: 'student', text: 'Thank you so much! I am very excited about this opportunity.', time: new Date(Date.now() - 79200000) },
                { from: 'company', text: 'We would love to schedule an interview!', time: new Date(Date.now() - 3600000) }
            ]
        },
        {
            id: 'conv-2',
            company: 'Spotify',
            position: 'Frontend Developer Intern',
            lastMessage: 'Thanks for your interest in Spotify!',
            unread: false,
            timestamp: new Date(Date.now() - 172800000),
            messages: [
                { from: 'company', text: 'Thanks for your interest in Spotify!', time: new Date(Date.now() - 172800000) },
                { from: 'company', text: 'We are currently reviewing applications and will get back to you soon.', time: new Date(Date.now() - 172700000) }
            ]
        },
        {
            id: 'conv-3',
            company: 'Stripe',
            position: 'Full Stack Developer Intern',
            lastMessage: 'When would you be available for a call?',
            unread: true,
            timestamp: new Date(Date.now() - 7200000),
            messages: [
                { from: 'company', text: 'Hello! Your application caught our attention.', time: new Date(Date.now() - 259200000) },
                { from: 'student', text: 'Hi! Thank you for reaching out. I am very interested in this role.', time: new Date(Date.now() - 255600000) },
                { from: 'company', text: 'Great! We think you would be a good fit for our team.', time: new Date(Date.now() - 86400000) },
                { from: 'company', text: 'When would you be available for a call?', time: new Date(Date.now() - 7200000) }
            ]
        }
    ];
    
    // Load conversations
    function loadConversations() {
        const container = document.getElementById('conversationsContainer');
        if (!container) {
            setTimeout(loadConversations, 100);
            return;
        }
        
        // Show demo banner
        container.innerHTML = '';
        
        const demoBanner = document.createElement('div');
        demoBanner.style.cssText = 'padding: 0.75rem; background: #f5f3ff; border-bottom: 1px solid #e5e7eb; font-size: 0.8rem; color: #7c3aed;';
        demoBanner.innerHTML = '🎭 Demo conversations';
        container.appendChild(demoBanner);
        
        // Render conversations
        demoConversations.forEach(conv => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 1rem; border-bottom: 1px solid #e5e7eb; cursor: pointer; transition: background 0.2s;';
            item.onmouseover = () => item.style.background = '#f9fafb';
            item.onmouseout = () => item.style.background = currentConversation === conv.id ? '#eff6ff' : 'white';
            if (currentConversation === conv.id) item.style.background = '#eff6ff';
            
            const timeStr = formatTime(conv.timestamp);
            
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.25rem;">
                    <strong style="color: #1e40af;">${conv.company}</strong>
                    ${conv.unread ? '<span style="background: #ef4444; color: white; font-size: 0.65rem; padding: 0.15rem 0.4rem; border-radius: 1rem;">NEW</span>' : ''}
                </div>
                <p style="margin: 0 0 0.25rem 0; font-size: 0.85rem; color: #374151;">${conv.position}</p>
                <p style="margin: 0; font-size: 0.8rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${conv.lastMessage}</p>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.7rem; color: #9ca3af;">${timeStr}</p>
            `;
            
            item.onclick = () => openConversation(conv);
            container.appendChild(item);
        });
    }
    
    // Open a conversation
    function openConversation(conv) {
        currentConversation = conv.id;
        conv.unread = false;
        
        // Update header
        const header = document.getElementById('chatHeader');
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #2563eb, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                    ${conv.company.charAt(0)}
                </div>
                <div>
                    <h3 style="margin: 0;">${conv.company}</h3>
                    <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">${conv.position}</p>
                </div>
            </div>
        `;
        
        // Show messages
        const container = document.getElementById('messagesContainer');
        container.innerHTML = '';
        
        conv.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            const isStudent = msg.from === 'student';
            msgDiv.style.cssText = `
                display: flex;
                justify-content: ${isStudent ? 'flex-end' : 'flex-start'};
                margin-bottom: 1rem;
            `;
            
            msgDiv.innerHTML = `
                <div style="max-width: 70%; padding: 0.75rem 1rem; border-radius: 1rem; background: ${isStudent ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'white'}; color: ${isStudent ? 'white' : '#374151'}; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                    <p style="margin: 0; color: ${isStudent ? 'white' : '#374151'};">${msg.text}</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.7rem; color: ${isStudent ? 'rgba(255,255,255,0.7)' : '#9ca3af'}; text-align: right;">${formatTime(msg.time)}</p>
                </div>
            `;
            
            container.appendChild(msgDiv);
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
        
        // Show input
        document.getElementById('messageInput').style.display = 'block';
        
        // Refresh list to update selection
        loadConversations();
    }
    
    // Send message
    window.sendMessage = function(e) {
        e.preventDefault();
        const input = document.getElementById('messageText');
        const text = input.value.trim();
        
        if (!text || !currentConversation) return;
        
        // Find conversation
        const conv = demoConversations.find(c => c.id === currentConversation);
        if (!conv) return;
        
        // Add message
        conv.messages.push({
            from: 'student',
            text: text,
            time: new Date()
        });
        conv.lastMessage = text;
        conv.timestamp = new Date();
        
        // Clear input
        input.value = '';
        
        // Refresh chat
        openConversation(conv);
        
        // Simulate company reply after 2 seconds
        setTimeout(() => {
            const replies = [
                "Thank you for your message! We'll get back to you soon.",
                "Great to hear from you! Let me check with my team.",
                "Thanks! I'll review this and respond shortly.",
                "Perfect! We're excited to move forward."
            ];
            conv.messages.push({
                from: 'company',
                text: replies[Math.floor(Math.random() * replies.length)],
                time: new Date()
            });
            conv.lastMessage = conv.messages[conv.messages.length - 1].text;
            conv.timestamp = new Date();
            
            if (currentConversation === conv.id) {
                openConversation(conv);
            }
            loadConversations();
        }, 2000);
    };
    
    // Format time
    function formatTime(date) {
        if (!date) return '';
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Initialize
    setTimeout(loadConversations, 100);
})();

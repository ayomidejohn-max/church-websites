// ==================== AUTHENTICATION ====================

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Valid credentials
    const validUsers = [
        { username: 'Ayomide', password: 'ayojesu123' },
        { username: 'Ayojesu', password: 'ayojesu001' }
    ];

    const user = validUsers.find(u => u.username === username && u.password === password);

    if (user) {
        // Set session
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentAdmin', username);
        
        // Initialize data if first time
        initializeData();

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = '❌ Invalid username or password. Please try again.';
        errorDiv.classList.add('show');
        
        // Clear error after 3 seconds
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
    }
});

// Logout functionality
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentAdmin');
    window.location.href = 'index.html';
}

// ==================== DATA INITIALIZATION ====================

function initializeData() {
    // Initialize ministry requests if not exists
    if (!localStorage.getItem('ministryRequests')) {
        const sampleRequests = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@gmail.com',
                phone: '08012345678',
                ministry: 'Youth Ministry',
                experience: 'I play keyboard and help with worship',
                dateSubmitted: '12 Feb 2026',
                status: 'Pending'
            },
            {
                id: '2',
                name: 'Mary James',
                email: 'mary@gmail.com',
                phone: '07087654321',
                ministry: 'Children Ministry',
                experience: 'Teaching experience with kids',
                dateSubmitted: '11 Feb 2026',
                status: 'Contacted'
            },
            {
                id: '3',
                name: 'David Paul',
                email: 'david@gmail.com',
                phone: '08134567890',
                ministry: 'Outreach Ministry',
                experience: 'Community service volunteer',
                dateSubmitted: '10 Feb 2026',
                status: 'Pending'
            }
        ];
        localStorage.setItem('ministryRequests', JSON.stringify(sampleRequests));
    }

    // Initialize contact messages if not exists
    if (!localStorage.getItem('contactMessages')) {
        const sampleMessages = [
            {
                id: '1',
                name: 'Samuel Okonkwo',
                email: 'samuel@gmail.com',
                phone: '08098765432',
                subject: 'Prayer Request',
                message: 'Please pray for my family. We are facing financial difficulties and need God\'s guidance.',
                dateSent: '15 Feb 2026',
                status: 'Unread'
            },
            {
                id: '2',
                name: 'Bola Adeyemi',
                email: 'bola@gmail.com',
                phone: '07012345678',
                subject: 'Want to Join Church',
                message: 'Hello, I would like to join your church community. I am new to the area and looking for a good church home.',
                dateSent: '14 Feb 2026',
                status: 'Read'
            },
            {
                id: '3',
                name: 'Grace Eze',
                email: 'grace@gmail.com',
                phone: '09087654321',
                subject: 'Event Participation',
                message: 'I am interested in participating in the upcoming community outreach program. How can I register?',
                dateSent: '13 Feb 2026',
                status: 'Unread'
            }
        ];
        localStorage.setItem('contactMessages', JSON.stringify(sampleMessages));
    }

    // Initialize ministries if not exists
    if (!localStorage.getItem('ministries')) {
        const defaultMinistries = [
            {
                id: '1',
                name: 'Children Ministry',
                leader: 'Sister Grace',
                day: 'Sunday 10:00 AM',
                description: 'Ministry for children aged 4-12'
            },
            {
                id: '2',
                name: 'Youth Ministry',
                leader: 'Pastor Ben',
                day: 'Friday 5:30 PM',
                description: 'Ministry for teenagers and young adults'
            },
            {
                id: '3',
                name: 'Outreach Ministry',
                leader: 'Pastor John',
                day: 'Saturday 2:00 PM',
                description: 'Community outreach and evangelism'
            }
        ];
        localStorage.setItem('ministries', JSON.stringify(defaultMinistries));
    }
}


// ==================== DASHBOARD FUNCTIONS ====================

function loadDashboard() {
    const requests = JSON.parse(localStorage.getItem('ministryRequests')) || [];
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const currentUser = localStorage.getItem('currentAdmin');

    document.getElementById('currentUser').textContent = `Welcome, ${currentUser}`;

    // Calculate statistics
    const totalRequests = requests.length;
    const childrenCount = requests.filter(r => r.ministry === 'Children Ministry').length;
    const youthCount = requests.filter(r => r.ministry === 'Youth Ministry').length;
    const outreachCount = requests.filter(r => r.ministry === 'Outreach Ministry').length;

    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('childrenCount').textContent = childrenCount;
    document.getElementById('youthCount').textContent = youthCount;
    document.getElementById('outreachCount').textContent = outreachCount;

    // Display recent requests
    const recentRequestsDiv = document.getElementById('recentRequests');
    if (requests.length > 0) {
        const recent = requests.slice(-5).reverse();
        recentRequestsDiv.innerHTML = recent.map(req => 
            `<div class="recent-item">
                <strong>${req.name}</strong> – ${req.ministry}
            </div>`
        ).join('');
    } else {
        recentRequestsDiv.innerHTML = '<p class="no-data">No recent requests</p>';
    }

    // Display recent messages
    const recentMessagesDiv = document.getElementById('recentMessages');
    if (messages.length > 0) {
        const recentMsgs = messages.slice(-5).reverse();
        recentMessagesDiv.innerHTML = recentMsgs.map(msg => 
            `<div class="recent-item">
                <strong>${msg.name}</strong> – ${msg.message.substring(0, 50)}...
            </div>`
        ).join('');
    } else {
        recentMessagesDiv.innerHTML = '<p class="no-data">No recent messages</p>';
    }
}

// ==================== MINISTRY REQUESTS FUNCTIONS ====================

function loadRequests() {
    const requests = JSON.parse(localStorage.getItem('ministryRequests')) || [];
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const ministryFilter = document.getElementById('ministryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    let filtered = requests.filter(req => {
        const matchSearch = req.name.toLowerCase().includes(searchTerm) || 
                           req.email.toLowerCase().includes(searchTerm);
        const matchMinistry = !ministryFilter || req.ministry === ministryFilter;
        const matchStatus = !statusFilter || req.status === statusFilter;
        return matchSearch && matchMinistry && matchStatus;
    });

    const tbody = document.getElementById('requestsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No requests found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(req => `
        <tr>
            <td>${req.name}</td>
            <td>${req.email}</td>
            <td>${req.phone}</td>
            <td>${req.ministry}</td>
            <td>${req.experience.substring(0, 30)}...</td>
            <td><span class="status-badge status-${(req.status || 'Pending').toLowerCase().replace(' ', '-')}">${req.status || 'Pending'}</span></td>
            <td>
                <button class="btn-small" onclick="viewRequest('${req.id}')">View</button>
                <button class="btn-small" onclick="updateStatus('${req.id}')">Status</button>
                <button class="btn-small btn-danger" onclick="deleteRequest('${req.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function viewRequest(id) {
    localStorage.setItem('viewRequestId', id);
    window.location.href = 'view-request.html';
}

function updateStatus(id) {
    currentEditId = id;
    const requests = JSON.parse(localStorage.getItem('ministryRequests')) || [];
    const request = requests.find(r => r.id === id);
    document.getElementById('statusSelect').value = request.status || 'Pending';
    document.getElementById('statusModal').style.display = 'block';
}

function saveStatus() {
    const status = document.getElementById('statusSelect').value;
    const requests = JSON.parse(localStorage.getItem('ministryRequests')) || [];
    const index = requests.findIndex(r => r.id === currentEditId);
    if (index !== -1) {
        requests[index].status = status;
        localStorage.setItem('ministryRequests', JSON.stringify(requests));
        document.getElementById('statusModal').style.display = 'none';
        loadRequests();
    }
}

function deleteRequest(id) {
    if (confirm('Are you sure you want to delete this request?')) {
        let requests = JSON.parse(localStorage.getItem('ministryRequests')) || [];
        requests = requests.filter(r => r.id !== id);
        localStorage.setItem('ministryRequests', JSON.stringify(requests));
        loadRequests();
    }
}

// ==================== MODAL CONTROLS ====================

function setupModalControls() {
    // Close modal when X is clicked
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Initialize modal controls
setupModalControls();

// ==================== CONTACT MESSAGES FUNCTIONS ====================

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const searchTerm = document.getElementById('messageSearch')?.value.toLowerCase() || '';
    const filterStatus = document.getElementById('messageFilter')?.value || '';

    let filtered = messages.filter(msg => {
        const matchSearch = msg.name.toLowerCase().includes(searchTerm) || 
                           msg.email.toLowerCase().includes(searchTerm);
        const matchFilter = !filterStatus || msg.status === filterStatus;
        return matchSearch && matchFilter;
    });

    const container = document.getElementById('messagesContainer');

    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-data">No messages found</p>';
        return;
    }

    container.innerHTML = filtered.map(msg => `
        <div class="message-card">
            <div class="message-header">
                <h3>${msg.name}</h3>
                <span class="status-badge status-${(msg.status || 'Unread').toLowerCase()}">${msg.status || 'Unread'}</span>
            </div>
            <p><strong>Email:</strong> ${msg.email}</p>
            <p><strong>Subject:</strong> ${msg.subject || 'No Subject'}</p>
            <p class="message-preview"><strong>Message:</strong> ${msg.message.substring(0, 100)}...</p>
            <p class="message-date"><small>${msg.dateSent || 'N/A'}</small></p>
            <div class="action-buttons">
                <button class="btn-small" onclick="viewMessage('${msg.id}')">View Full</button>
                <button class="btn-small" onclick="markAsRead('${msg.id}')">Mark as Read</button>
                <button class="btn-small btn-danger" onclick="deleteMessageDirect('${msg.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewMessage(id) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const message = messages.find(m => m.id === id);

    if (message) {
        currentMessageId = id;
        document.getElementById('messageDetail').innerHTML = `
            <div class="detail-card">
                <div class="detail-row">
                    <label>Name:</label>
                    <span>${message.name}</span>
                </div>
                <div class="detail-row">
                    <label>Email:</label>
                    <span>${message.email}</span>
                </div>
                <div class="detail-row">
                    <label>Phone:</label>
                    <span>${message.phone || 'Not provided'}</span>
                </div>
                <div class="detail-row">
                    <label>Subject:</label>
                    <span>${message.subject || 'No Subject'}</span>
                </div>
                <div class="detail-row">
                    <label>Message:</label>
                    <span class="message-text">${message.message}</span>
                </div>
                <div class="detail-row">
                    <label>Sent on:</label>
                    <span>${message.dateSent || 'N/A'}</span>
                </div>
            </div>
        `;
        document.getElementById('messageModal').style.display = 'block';
        markAsRead(id);
    }
}

function markAsRead(id) {
    let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
        messages[index].status = 'Read';
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        loadMessages();
    }
}

function replyToMessage() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const message = messages.find(m => m.id === currentMessageId);
    if (message) {
        window.location.href = `mailto:${message.email}?subject=RE: ${message.subject || 'Your Message'}`;
    }
}

function deleteMessage() {
    if (confirm('Are you sure you want to delete this message?')) {
        deleteMessageDirect(currentMessageId);
        document.getElementById('messageModal').style.display = 'none';
    }
}

function deleteMessageDirect(id) {
    let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    loadMessages();
}

// ==================== MINISTRIES FUNCTIONS ====================

function initializeMinistries() {
    if (!localStorage.getItem('ministries')) {
        const defaultMinistries = [
            {
                id: '1',
                name: 'Children Ministry',
                leader: 'Sister Grace',
                day: 'Sunday 10:00 AM',
                description: 'Ministry for children aged 4-12'
            },
            {
                id: '2',
                name: 'Youth Ministry',
                leader: 'Pastor Ben',
                day: 'Friday 5:30 PM',
                description: 'Ministry for teenagers and young adults'
            },
            {
                id: '3',
                name: 'Outreach Ministry',
                leader: 'Pastor John',
                day: 'Saturday 2:00 PM',
                description: 'Community outreach and evangelism'
            }
        ];
        localStorage.setItem('ministries', JSON.stringify(defaultMinistries));
    }
}

function loadMinistries() {
    initializeMinistries();
    const ministries = JSON.parse(localStorage.getItem('ministries')) || [];
    const container = document.getElementById('ministriesContainer');

    if (ministries.length === 0) {
        container.innerHTML = '<p class="no-data">No ministries added yet</p>';
        return;
    }

    container.innerHTML = ministries.map(ministry => `
        <div class="ministry-card">
            <h3>${ministry.name}</h3>
            <p><strong>Leader:</strong> ${ministry.leader}</p>
            <p><strong>Meeting:</strong> ${ministry.day}</p>
            <p><strong>Description:</strong> ${ministry.description || 'N/A'}</p>
            <div class="action-buttons">
                <button class="btn-small" onclick="editMinistry('${ministry.id}')">Edit</button>
                <button class="btn-small btn-danger" onclick="deleteMinistry('${ministry.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function editMinistry(id) {
    const ministries = JSON.parse(localStorage.getItem('ministries')) || [];
    const ministry = ministries.find(m => m.id === id);

    if (ministry) {
        editingId = id;
        document.getElementById('editMinistryName').value = ministry.name;
        document.getElementById('editMinistryLeader').value = ministry.leader;
        document.getElementById('editMinistryDay').value = ministry.day;
        document.getElementById('editMinistryDescription').value = ministry.description || '';
        document.getElementById('editModal').style.display = 'block';
    }
}

function deleteMinistry(id) {
    if (confirm('Are you sure you want to delete this ministry?')) {
        let ministries = JSON.parse(localStorage.getItem('ministries')) || [];
        ministries = ministries.filter(m => m.id !== id);
        localStorage.setItem('ministries', JSON.stringify(ministries));
        loadMinistries();
    }
}

// ==================== EVENT LISTENERS ====================

// Search and filter listeners for ministry requests
document.getElementById('searchInput')?.addEventListener('keyup', loadRequests);
document.getElementById('ministryFilter')?.addEventListener('change', loadRequests);
document.getElementById('statusFilter')?.addEventListener('change', loadRequests);

// Search and filter listeners for messages
document.getElementById('messageSearch')?.addEventListener('keyup', loadMessages);
document.getElementById('messageFilter')?.addEventListener('change', loadMessages);

// Form submissions for adding ministry
document.getElementById('addMinistryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const ministries = JSON.parse(localStorage.getItem('ministries')) || [];
    const newMinistry = {
        id: Date.now().toString(),
        name: document.getElementById('ministryName').value,
        leader: document.getElementById('ministryLeader').value,
        day: document.getElementById('ministryDay').value,
        description: document.getElementById('ministryDescription').value
    };

    ministries.push(newMinistry);
    localStorage.setItem('ministries', JSON.stringify(ministries));
    this.reset();
    loadMinistries();
    alert('Ministry added successfully!');
});

// Form submissions for editing ministry
document.getElementById('editMinistryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const ministries = JSON.parse(localStorage.getItem('ministries')) || [];
    const index = ministries.findIndex(m => m.id === editingId);

    if (index !== -1) {
        ministries[index] = {
            ...ministries[index],
            name: document.getElementById('editMinistryName').value,
            leader: document.getElementById('editMinistryLeader').value,
            day: document.getElementById('editMinistryDay').value,
            description: document.getElementById('editMinistryDescription').value
        };

        localStorage.setItem('ministries', JSON.stringify(ministries));
        document.getElementById('editModal').style.display = 'none';
        loadMinistries();
        alert('Ministry updated successfully!');
    }
});

// ==================== GLOBAL VARIABLES ====================

let currentEditId = null;
let editingId = null;
let currentMessageId = null;
// public/assets/JS/common.js

function showToast(title, msg, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-accent"></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${msg}</div>
        </div>
        <button class="toast-dismiss">&times;</button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-dismiss').onclick = () => toast.remove();

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
// Mock logged-in session for local testing
window.userSession = {
    id: 1,
    username: "johndoe",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    rating: 4.8,
    verified: true,
    phone: "0771234567",
    location: "Colombo",
    address: "123 Galle Road, Colombo 03"
};

// Mock sessionPromise so page scripts (like donation.js) work immediately
window.sessionPromise = Promise.resolve(window.userSession);

updateNavbar(window.userSession);


function updateNavbar(user) {
    const loggedOutEl = document.getElementById('navLoggedOut');
    const loggedInEl = document.getElementById('navLoggedIn');
    const dashboardLi = document.getElementById('nav-dashboard-li');

    if (user) {
        loggedOutEl?.classList.add('hidden');
        loggedInEl?.classList.remove('hidden');
        dashboardLi?.classList.remove('hidden');

        // Dynamically add Admin Panel link if role === 'admin'
        if (user.role === 'admin' && !document.getElementById('nav-admin-li')) {
            const li = document.createElement('li');
            li.id = 'nav-admin-li';
            li.innerHTML = `<a href="admin.html" id="nav-admin">Admin Panel</a>`;
            document.getElementById('navLinks')?.appendChild(li);
        }
    } else {
        loggedOutEl?.classList.remove('hidden');
        loggedInEl?.classList.add('hidden');
        dashboardLi?.classList.add('hidden');
        document.getElementById('nav-admin-li')?.remove();
    }

    // Active link highlighting based on current URL path
    const linkMap = {
        'index.html': 'nav-home',
        'marketplace.html': 'nav-marketplace',
        'donation.html': 'nav-donation-requests',
        'dashboard.html': 'nav-dashboard',
        'admin.html': 'nav-admin'
    };
    // Adds '.active' class to matching link
}

const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.onclick = () => {
        // Clear mock user session
        window.userSession = null;
        updateNavbar(null);

        // Show toast notification
        showToast("Success", "Logged out successfully.", "success");

        // Redirect to home page after brief delay
        setTimeout(() => window.location.href = 'index.html', 800);
    };
}

function initNotifications() {
    const bell = document.getElementById('notifBellBtn');
    const dropdown = document.getElementById('notifDropdown');
    const badge = document.getElementById('notifCountBadge');
    const listEl = document.getElementById('notifList');
    const markAllRead = document.getElementById('markAllReadBtn');

    if (!bell) return;

    const fetchNotifications = () => {
        fetch('api/notifications/index.php')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.notifications) {
                    const unread = data.notifications.filter(n => !n.is_read);
                    if (unread.length > 0) {
                        badge.textContent = unread.length;
                        badge.classList.remove('hidden');
                    } else {
                        badge.classList.add('hidden');
                    }

                    if (data.notifications.length === 0) {
                        listEl.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.8rem;">No notifications.</div>`;
                    } else {
                        listEl.innerHTML = data.notifications.map(n => `
                            <div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="readNotification(${n.id}, this)">
                                <div class="notif-item-title">${escapeHTML(n.title)}</div>
                                <div class="notif-item-msg">${escapeHTML(n.message)}</div>
                                <div class="notif-item-time">${formatDate(n.created_at)}</div>
                            </div>
                        `).join('');
                    }
                }
            })
            .catch(err => console.error("Error fetching notifications:", err));
    };

    bell.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            fetchNotifications();
        }
    };

    document.addEventListener('click', () => {
        if (dropdown) dropdown.classList.remove('open');
    });
    if (dropdown) dropdown.onclick = (e) => e.stopPropagation();

    if (markAllRead) {
        markAllRead.onclick = (e) => {
            e.preventDefault();
            fetch('api/notifications/read.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: 0 })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchNotifications();
                }
            });
        };
    }

    setInterval(fetchNotifications, 30000);
    fetchNotifications();
}

function readNotification(id, el) {
    fetch('api/notifications/read.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            el.classList.remove('unread');
            const badge = document.getElementById('notifCountBadge');
            let count = parseInt(badge.textContent || '0');
            if (count > 1) {
                badge.textContent = count - 1;
            } else {
                badge.classList.add('hidden');
            }
        }
    });
}


function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(' ', 'T'));
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        if (!document.getElementById('mobileMenuToggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'mobileMenuToggle';
            toggleBtn.className = 'mobile-menu-toggle';
            toggleBtn.innerHTML = '☰';
            navbar.insertBefore(toggleBtn, navbar.children[1]);

            const links = document.getElementById('navLinks');
            toggleBtn.onclick = () => {
                links.classList.toggle('mobile-open');
                toggleBtn.innerHTML = links.classList.contains('mobile-open') ? '✕' : '☰';
            };
        }
    }
});

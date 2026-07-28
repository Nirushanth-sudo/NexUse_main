// public/assets/JS/donation.js

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
    window.sessionPromise.then(user => {
        initDonations();
    });
});

function initDonations() {
    const catCheckboxes = document.querySelectorAll('#donFilterCategory input');
    const locSelect = document.getElementById('donFilterLocation');
    const resetFiltersBtn = document.getElementById('donResetFiltersBtn');
    const donationForm = document.getElementById('donationReqForm');

    // Attach filters
    catCheckboxes.forEach(c => c.onchange = () => renderDonationRequests());
    if (locSelect) locSelect.onchange = () => renderDonationRequests();

    if (resetFiltersBtn) {
        resetFiltersBtn.onclick = () => {
            catCheckboxes.forEach(c => c.checked = false);
            if (locSelect) locSelect.value = '';
            renderDonationRequests();
        };
    }

    if (donationForm) {
        donationForm.onsubmit = (e) => {
            e.preventDefault();
            if (currentEditingId !== null) {
                submitEditDonationRequest(currentEditingId);
            } else {
                submitDonationRequest();
            }
        };
    }

    // Mobile Filter Drawer Toggle
    const mobileFilterBtn = document.getElementById('donMobileFilterBtn');
    const closeSidebarBtn = document.getElementById('donSidebarCloseBtn');
    const sidebarOverlay = document.getElementById('donSidebarOverlay');
    const marketplaceSidebar = document.getElementById('donMarketplaceSidebar');

    const closeDrawer = () => {
        if (marketplaceSidebar) marketplaceSidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    };

    if (mobileFilterBtn && marketplaceSidebar && sidebarOverlay) {
        mobileFilterBtn.onclick = () => {
            marketplaceSidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
        };
    }

    if (closeSidebarBtn) closeSidebarBtn.onclick = closeDrawer;
    if (sidebarOverlay) sidebarOverlay.onclick = closeDrawer;

    // Toggle & Bind Donation Post Button based on auth
    const loginToReqBtn = document.getElementById('donPageSignInBtn');
    const createReqBtn = document.getElementById('donPageCreateBtn');

    if (createReqBtn) {
        createReqBtn.onclick = () => openDonationRequestModal();
    }

    if (window.userSession) {
        if (loginToReqBtn) loginToReqBtn.classList.add('hidden');
        if (createReqBtn) createReqBtn.classList.remove('hidden');
    } else {
        if (loginToReqBtn) loginToReqBtn.classList.remove('hidden');
        if (createReqBtn) createReqBtn.classList.add('hidden');
    }

    // Initial Render
    renderDonationRequests(true);
}

// Sample dummy data to simulate your backend database
const MOCK_DONATION_REQUESTS = [
    {
        id: 1,
        category: 'Electronics',
        location: 'Gampaha',
        title: 'Laptops for School',
        item_type: 'LAPTOPS',
        description: 'I want 10 Laptops for my school.',
        proof_file: '#',
        requester_name: 'Nished Ruveesha',
        rating: 5.00,
        requester_id: 1
    },
    {
        id: 2,
        category: 'Books',
        location: 'Colombo',
        title: 'Textbooks for Grade 10',
        item_type: 'BOOKS',
        description: 'Need mathematics and science textbooks for 15 students.',
        proof_file: null, // Example without proof attachment
        requester_name: 'Amara Perera',
        rating: 4.85,
        requester_id: 102
    },
    {
        id: 3,
        category: 'Furniture',
        location: 'Kandy',
        title: 'Study Desks for Community Center',
        item_type: 'DESKS',
        description: 'Looking for 5 wooden study desks in good condition.',
        proof_file: '#',
        requester_name: 'Saman Kumara',
        rating: 4.50,
        requester_id: 103
    }
];

function getDonationFilters() {
    const location = document.getElementById('donFilterLocation')?.value || '';
    const checkedCats = [...document.querySelectorAll('#donFilterCategory input:checked')].map(i => i.value);
    const category = checkedCats.join(',');

    return { location, category };
}

function renderDonationRequests(initLocations = false) {
    const filters = getDonationFilters();
    const grid = document.getElementById('donCardsGrid');

    if (!grid) return;

    // Get selected categories as an array
    const selectedCategories = filters.category
        ? filters.category.split(',').filter(Boolean)
        : [];

    // Filter local mock data
    let filteredRequests = MOCK_DONATION_REQUESTS.filter(item => {
        // 1. Filter by location (show all if location is "" or null)
        const matchLocation = !filters.location || item.location === filters.location;

        // 2. Filter by category: 
        // IF no checkboxes are selected (selectedCategories.length === 0), SHOW ALL!
        // OTHERWISE, show only if item.category matches one of the checked boxes.
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);

        return matchLocation && matchCategory;
    });

    window.loadedDonationRequests = filteredRequests;

    // Populate location dropdown dynamically on initial load
    if (initLocations) {
        populateDonationLocations(MOCK_DONATION_REQUESTS);
    }

    // Render empty state if no matches found
    if (filteredRequests.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <div class="empty-state-icon">💝</div>
                <div class="empty-state-text">No donation requests match your filters.</div>
            </div>
        `;
        return;
    }

    const CATEGORY_IMAGES = {
        'Electronics': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
        'Books': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60',
        'Furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60',
        'Clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60',
        'Tools': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60',
        'Other': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60'
    };

    // Render cards template
    grid.innerHTML = filteredRequests.map(d => `
        <div class="donation-card" onclick="openDonationDetail(${d.id}, event)" style="cursor: pointer;">
            <div class="donation-card-image">
                <img src="${CATEGORY_IMAGES[d.category] || CATEGORY_IMAGES['Other']}" alt="${escapeHTML(d.category)}">
                <span class="badge-category-pill">${escapeHTML(d.category)}</span>
            </div>
            <div class="donation-card-body">
                <div class="donation-card-header-row">
                    <span class="donation-card-location">📍 ${escapeHTML(d.location)}</span>
                    ${d.rating >= 4.7 ? `<span class="verified-badge-pill" title="Top Rated Member">★ Top Rated</span>` : ''}
                </div>
                <div class="donation-card-title">${escapeHTML(d.title)}</div>
                <div class="donation-card-tag">NEEDED: ${escapeHTML(d.item_type)}</div>
                <div class="donation-card-desc">${escapeHTML(d.description)}</div>
                ${d.proof_file && d.proof_file !== '#' ? `
                <div class="donation-proof-wrapper">
                    <a href="${escapeHTML(d.proof_file)}" target="_blank" class="proof-link" onclick="event.stopPropagation()">
                        📎 View Verified Proof
                    </a>
                </div>
                ` : ''}
            </div>
            <div class="donation-card-footer">
                <a href="profile.html?id=${d.requester_id}" class="donor-info-link" title="Click to view trust profile" onclick="event.stopPropagation()">
                    <div class="donor-info-avatar">${escapeHTML(d.requester_name.charAt(0))}</div>
                    <div class="donor-info">
                        <span class="donor-name">${escapeHTML(d.requester_name)}</span>
                        <span class="donor-rating">⭐ ${d.rating.toFixed(2)} <span class="rating-label">Rating</span></span>
                    </div>
                </a>
                ${(window.userSession && (window.userSession.id === d.requester_id || window.userSession.role === 'admin')) ? `
                <div class="donation-card-actions" onclick="event.stopPropagation()">
                    <button class="btn btn-outline btn-sm" onclick="openEditDonationModal(${d.id})">Edit</button>
                    <button class="btn btn-outline btn-sm btn-delete" onclick="deleteDonationRequest(${d.id})">Delete</button>
                </div>
                ` : `
                <button class="btn btn-green btn-sm" onclick="event.stopPropagation(); pledgeDonation(${d.id})">Pledge Item</button>
                `}
            </div>
        </div>
    `).join('');
}

function populateDonationLocations(requests) {
    const locSelect = document.getElementById('donFilterLocation');
    if (!locSelect) return;

    // Extract unique locations from data
    const locations = [...new Set(requests.map(req => req.location))];

    // Build options list starting with "All Locations" (value="")
    locSelect.innerHTML = `<option value="">All Locations</option>` +
        locations.map(loc => `<option value="${escapeHTML(loc)}">${escapeHTML(loc)}</option>`).join('');

    // 🔴 FORCE SELECT "ALL LOCATIONS" ON INIT
    locSelect.value = "";
}

function openDonationRequestModal() {
    if (!window.userSession) {
        showToast("Access Denied", "Please sign in to request donations.", "warning");
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    const modal = document.getElementById('donationReqModal');
    if (modal) modal.showModal();
}

function openDonationDetail(id, event) {
    // If the click was directly on an interactive element inside the card, stop
    if (event && (event.target.tagName === 'A' || event.target.tagName === 'BUTTON' || event.target.closest('a') || event.target.closest('button'))) {
        return;
    }

    const d = MOCK_DONATION_REQUESTS.find(x => x.id === id);
    if (!d) return;

    // Populate modal fields
    document.getElementById('dLocation').textContent = d.location;
    document.getElementById('dItemType').textContent = d.item_type;
    document.getElementById('dDescription').textContent = d.description;

    const CATEGORY_IMAGES = {
        'Electronics': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
        'Books': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60',
        'Furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60',
        'Clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60',
        'Tools': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60',
        'Other': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60'
    };
    
    document.getElementById('dCoverImage').src = CATEGORY_IMAGES[d.category] || CATEGORY_IMAGES['Other'];
    document.getElementById('dCoverImage').alt = d.category;
    document.getElementById('dBadge').innerHTML = `<span class="badge-category-pill">${escapeHTML(d.category)}</span>`;

    // Verified status
    document.getElementById('dVerifiedStatus').innerHTML = d.proof_file && d.proof_file !== '#' 
        ? `<span style="color:var(--green); font-weight:700;">✓ Verified</span>` 
        : `<span style="color:var(--text-secondary);">Self-reported</span>`;

    // Proof link
    const proofArea = document.getElementById('dProofArea');
    const proofContainer = document.getElementById('dProofLinkContainer');
    if (d.proof_file && d.proof_file !== '#') {
        proofArea.classList.remove('hidden');
        proofContainer.innerHTML = `
            <a href="${escapeHTML(d.proof_file)}" target="_blank" class="proof-link" style="display:inline-flex; align-items:center; gap:6px;">
                📎 Open Official Verification Document (PDF/Image)
            </a>
        `;
    } else {
        proofArea.classList.add('hidden');
        proofContainer.innerHTML = '';
    }

    // Requester profile link details
    document.getElementById('dRequesterAvatar').textContent = d.requester_name.charAt(0);
    document.getElementById('dRequesterName').textContent = d.requester_name;
    document.getElementById('dRequesterStars').innerHTML = `⭐ ${d.rating.toFixed(2)} <span style="font-weight:500; font-size:0.75rem; color:var(--text-secondary);">(Rating)</span>`;

    const profileUrl = `profile.html?id=${d.requester_id}`;
    document.getElementById('dRequesterLink').href = profileUrl;
    document.getElementById('dRequesterProfileBtn').href = profileUrl;

    // Action button setup
    const actionBtn = document.getElementById('dActionBtn');
    const chatBtn = document.getElementById('dChatBtn');

    if (window.userSession && d.requester_id === window.userSession.id) {
        actionBtn.textContent = "Your Request (Edit)";
        actionBtn.className = "btn btn-outline btn-sm";
        actionBtn.onclick = () => {
            document.getElementById('donationDetailModal').close();
            openEditDonationModal(d.id);
        };
        chatBtn.classList.add('hidden');
    } else {
        actionBtn.textContent = "💝 Pledge Item";
        actionBtn.className = "btn btn-green btn-sm";
        actionBtn.onclick = () => {
            document.getElementById('donationDetailModal').close();
            pledgeDonation(d.id);
        };
        chatBtn.classList.remove('hidden');
        chatBtn.onclick = () => {
            document.getElementById('donationDetailModal').close();
            window.location.href = `dashboard.html?tab=chat&request=${d.id}`;
        };
    }

    // Close button
    document.getElementById('dCloseBtn').onclick = () => {
        document.getElementById('donationDetailModal').close();
    };

    document.getElementById('donationDetailModal').showModal();
}
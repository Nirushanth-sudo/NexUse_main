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
        requester_id: 101
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

    // Render cards template
    grid.innerHTML = filteredRequests.map(d => `
        <div class="donation-card">
            <div class="donation-card-header">
                <span class="badge-category-pill">${escapeHTML(d.category)}</span>
                <span style="font-size:0.78rem;color:var(--text-secondary);">📍 ${escapeHTML(d.location)}</span>
            </div>
            <div class="donation-card-title">${escapeHTML(d.title)}</div>
            <div class="donation-card-tag">ITEM NEEDED: ${escapeHTML(d.item_type)}</div>
            <div class="donation-card-desc">${escapeHTML(d.description)}</div>
            ${d.proof_file ? `
            <div class="donation-proof-wrapper" style="margin-top: 10px; margin-bottom: 5px;">
                <a href="${escapeHTML(d.proof_file)}" target="_blank" class="proof-link" style="font-size: 0.78rem; color: #1a5cff; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; font-weight: 500; border: 1px dashed #e2e8f0; padding: 4px 8px; border-radius: 6px; background: #f8fafc;">
                    📎 View Attached Proof
                </a>
            </div>
            ` : ''}
            <div class="donation-card-footer">
                <div class="donor-info">
                    <span class="donor-name">${escapeHTML(d.requester_name)}</span>
                    <span class="donor-rating">⭐ ${d.rating.toFixed(2)} <span>Rating</span></span>
                </div>
                ${(window.userSession && (window.userSession.id === d.requester_id || window.userSession.role === 'admin')) ? `
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" onclick="openEditDonationModal(${d.id})">Edit</button>
                    <button class="btn btn-outline btn-sm" style="color:#ef4444; border-color:#fca5a5;" onclick="deleteDonationRequest(${d.id})">Delete</button>
                </div>
                ` : `
                <button class="btn btn-green btn-sm" onclick="pledgeDonation(${d.id})">Pledge Item</button>
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
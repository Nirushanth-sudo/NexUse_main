// public/assets/JS/donation.js

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
    window.sessionPromise.then(user => {
        initDonations();
    });

    // File upload change listener for pledge form
    const plProofInput = document.getElementById('plProof');
    if (plProofInput) {
        plProofInput.onchange = (e) => {
            const file = e.target.files[0];
            const textEl = e.target.parentElement.querySelector('.upload-text');
            const iconEl = e.target.parentElement.querySelector('.upload-icon');
            if (file) {
                textEl.innerHTML = `Selected: <strong style="color:var(--green); font-size:0.8rem;">${escapeHTML(file.name)}</strong>`;
                iconEl.textContent = '📄';
            } else {
                textEl.innerHTML = `Drag & drop files or <span class="upload-link">browse</span>`;
                iconEl.textContent = '📤';
            }
        };
    }
    // File upload change listener for request form
    const drProofInput = document.getElementById('drProof');
    if (drProofInput) {
        drProofInput.onchange = (e) => {
            const file = e.target.files[0];
            const textEl = e.target.parentElement.querySelector('.upload-text');
            const iconEl = e.target.parentElement.querySelector('.upload-icon');
            if (file) {
                textEl.innerHTML = `Selected: <strong style="color:var(--green); font-size:0.8rem;">${escapeHTML(file.name)}</strong>`;
                iconEl.textContent = '📄';
            } else {
                textEl.innerHTML = `Drag & drop files or <span class="upload-link">browse</span>`;
                iconEl.textContent = '📤';
            }
        };
    }
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

    const pledgeForm = document.getElementById('pledgeForm');
    if (pledgeForm) {
        pledgeForm.onsubmit = (e) => {
            e.preventDefault();
            submitPledgeForm();
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
    animateStats();
}

function animateStats() {
    const stats = [
        { id: 'statActiveRequests', target: MOCK_DONATION_REQUESTS.length },
        { id: 'statTotalPledges', target: 142 },
        { id: 'statNeighborsHelped', target: 94 }
    ];

    stats.forEach(s => {
        const el = document.getElementById(s.id);
        if (!el) return;
        let count = 0;
        const duration = 1200; // ms
        const stepTime = Math.max(Math.floor(duration / s.target), 15);
        const timer = setInterval(() => {
            count += Math.ceil(s.target / (duration / stepTime));
            if (count >= s.target) {
                el.textContent = s.target;
                clearInterval(timer);
            } else {
                el.textContent = count;
            }
        }, stepTime);
    });
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
        requester_id: 1,
        urgent: true,
        target_qty: 10,
        pledged_qty: 6
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
        requester_id: 102,
        urgent: false,
        target_qty: 15,
        pledged_qty: 4
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
        requester_id: 103,
        urgent: true,
        target_qty: 5,
        pledged_qty: 5
    },
    {
        id: 4,
        category: 'Clothing',
        location: 'Galle',
        title: 'Warm Clothes for Elders',
        item_type: 'CLOTHING',
        description: 'Collecting sweaters and warm blankets for a local elder care facility.',
        proof_file: '#',
        requester_name: 'Dinesh Silva',
        rating: 4.90,
        requester_id: 104,
        urgent: false,
        target_qty: 30,
        pledged_qty: 12
    },
    {
        id: 5,
        category: 'Tools',
        location: 'Jaffna',
        title: 'Gardening Equipment',
        item_type: 'TOOLS',
        description: 'Need basic garden tools like spades, hoes, and watering cans for our community farm.',
        proof_file: null,
        requester_name: 'Sanjeevan K.',
        rating: 4.60,
        requester_id: 105,
        urgent: false,
        target_qty: 8,
        pledged_qty: 2
    },
    {
        id: 6,
        category: 'Other',
        location: 'Colombo Suburb',
        title: 'Dry Rations and Grocery Packs',
        item_type: 'GROCERIES',
        description: 'Seeking non-perishable food items for 20 low-income families in the area.',
        proof_file: '#',
        requester_name: 'Fathima R.',
        rating: 4.95,
        requester_id: 106,
        urgent: true,
        target_qty: 20,
        pledged_qty: 18
    },
    {
        id: 7,
        category: 'Electronics',
        location: 'Colombo',
        title: 'Projector for Community Class',
        item_type: 'PROJECTOR',
        description: 'Need a working multimedia projector to conduct free educational evening seminars.',
        proof_file: '#',
        requester_name: 'John Doe',
        rating: 4.80,
        requester_id: 1, // Logged-in user self post
        urgent: false,
        target_qty: 1,
        pledged_qty: 0
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

    // Sort to prioritize logged-in user's requests first
    if (window.userSession) {
        filteredRequests.sort((a, b) => {
            const aIsOwn = a.requester_id === window.userSession.id ? 1 : 0;
            const bIsOwn = b.requester_id === window.userSession.id ? 1 : 0;
            return bIsOwn - aIsOwn;
        });
    }

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
        'Electronics': 'assets/images/electronics.jpg',
        'Books': 'assets/images/books.jpg',
        'Furniture': 'assets/images/furniture.jpg',
        'Clothing': 'assets/images/clothing.jpg',
        'Tools': 'assets/images/tools.jpg',
        'Other': 'assets/images/other.jpg'
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

                <!-- Card Progress Bar -->
                <div class="donation-progress-container">
                    <div class="donation-progress-labels">
                        <span>Pledge Progress</span>
                        <span>${d.pledged_qty || 0} / ${d.target_qty || 1} items</span>
                    </div>
                    <div class="donation-progress-bar">
                        <div class="donation-progress-fill" style="width: ${Math.min(100, Math.round(((d.pledged_qty || 0) / (d.target_qty || 1)) * 100))}%;"></div>
                    </div>
                </div>

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
                <div class="donation-card-actions" onclick="event.stopPropagation()">
                    <button class="btn btn-outline btn-sm" onclick="window.location.href = 'dashboard.html?tab=chat&request=${d.id}'">💬 Message</button>
                    <button class="btn btn-green btn-sm" onclick="pledgeDonation(${d.id})">Pledge Item</button>
                </div>
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

    currentEditingId = null;
    const form = document.getElementById('donationReqForm');
    if (form) form.reset();

    // Reset titles/buttons
    const modalTitle = document.getElementById('drModalTitle');
    if (modalTitle) modalTitle.textContent = "Create Donation Request";
    const submitBtn = document.getElementById('drSubmitBtn');
    if (submitBtn) {
        submitBtn.textContent = "Post Request";
        submitBtn.className = "btn btn-primary btn-md";
    }
    // Reset file upload box UI text
    const drProofInput = document.getElementById('drProof');
    if (drProofInput) {
        const textEl = drProofInput.parentElement.querySelector('.upload-text');
        const iconEl = drProofInput.parentElement.querySelector('.upload-icon');
        if (textEl && iconEl) {
            textEl.innerHTML = `Drag & drop files or <span class="upload-link">browse</span>`;
            iconEl.textContent = '📤';
        }
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

    // Quantity Progress Display
    const pledged = d.pledged_qty || 0;
    const target = d.target_qty || 1;
    const pct = Math.min(100, Math.round((pledged / target) * 100));
    document.getElementById('dQuantityProgress').textContent = `${pledged} / ${target}`;
    document.getElementById('dProgressText').textContent = `${pledged} / ${target} pledged (${pct}%)`;
    document.getElementById('dProgressFill').style.width = `${pct}%`;

    const CATEGORY_IMAGES = {
        'Electronics': 'assets/images/electronics.jpg',
        'Books': 'assets/images/books.jpg',
        'Furniture': 'assets/images/furniture.jpg',
        'Clothing': 'assets/images/clothing.jpg',
        'Tools': 'assets/images/tools.jpg',
        'Other': 'assets/images/other.jpg'
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

let activePledgeRequestId = null;

function pledgeDonation(id) {
    if (!window.userSession) {
        showToast("Access Denied", "Please sign in to pledge items.", "warning");
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    const d = MOCK_DONATION_REQUESTS.find(x => x.id === id);
    if (!d) return;

    activePledgeRequestId = id;

    // Reset pledge form
    const form = document.getElementById('pledgeForm');
    if (form) form.reset();

    const modal = document.getElementById('pledgeModal');
    if (modal) modal.showModal();
}

function submitPledgeForm() {
    if (!activePledgeRequestId) return;

    const d = MOCK_DONATION_REQUESTS.find(x => x.id === activePledgeRequestId);
    if (!d) return;

    const note = document.getElementById('plNote').value;
    const proofFile = document.getElementById('plProof').files[0];

    // Note validation
    if (!note.trim() || note.trim().length < 10) {
        showToast("Validation Error", "Pledge note must be at least 10 characters.", "error");
        return;
    }

    // Proof file validation
    if (proofFile) {
        const fileCheck = validateFile(proofFile);
        if (!fileCheck.valid) {
            showToast("Validation Error", fileCheck.message, "error");
            return;
        }
    }

    // Increment pledged quantity (max out at target)
    if (d.pledged_qty < d.target_qty) {
        d.pledged_qty = (d.pledged_qty || 0) + 1;
    }

    // Close pledge modal and open success modal
    const pledgeModal = document.getElementById('pledgeModal');
    if (pledgeModal) pledgeModal.close();

    const successModal = document.getElementById('pledgeSuccessModal');
    if (successModal) successModal.showModal();

    activePledgeRequestId = null;

    renderDonationRequests();
}

function deleteDonationRequest(id) {
    const index = MOCK_DONATION_REQUESTS.findIndex(x => x.id === id);
    if (index === -1) return;

    const d = MOCK_DONATION_REQUESTS[index];
    if (confirm(`Are you sure you want to delete the donation request for "${d.title}"?`)) {
        MOCK_DONATION_REQUESTS.splice(index, 1);
        showToast("Deleted", "Donation request deleted successfully.", "success");
        renderDonationRequests();
        animateStats();
    }
}

function openEditDonationModal(id) {
    const d = MOCK_DONATION_REQUESTS.find(x => x.id === id);
    if (!d) return;

    currentEditingId = id;

    // Populate inputs
    document.getElementById('drTitle').value = d.title;
    document.getElementById('drCategory').value = d.category;
    document.getElementById('drLocation').value = d.location;
    document.getElementById('drItemType').value = d.item_type;
    document.getElementById('drQuantity').value = d.target_qty || 1;
    document.getElementById('drDescription').value = d.description;

    // Change titles
    const modalTitle = document.getElementById('drModalTitle');
    if (modalTitle) modalTitle.textContent = "Edit Donation Request";

    const submitBtn = document.getElementById('drSubmitBtn');
    if (submitBtn) {
        submitBtn.textContent = "Update Request";
        submitBtn.className = "btn btn-primary btn-md";
    }

    // Reset or populate upload box state
    const drProofInput = document.getElementById('drProof');
    if (drProofInput) {
        const textEl = drProofInput.parentElement.querySelector('.upload-text');
        const iconEl = drProofInput.parentElement.querySelector('.upload-icon');
        if (d.proof_file && d.proof_file !== '#') {
            textEl.innerHTML = `Current: <strong style="color:var(--primary); font-size:0.8rem;">Proof Document Uploaded</strong>`;
            iconEl.textContent = '📄';
        } else {
            textEl.innerHTML = `Drag & drop files or <span class="upload-link">browse</span>`;
            iconEl.textContent = '📤';
        }
    }

    // Modal
    const modal = document.getElementById('donationReqModal');
    if (modal) modal.showModal();
}

function validateFile(file) {
    if (!file) return { valid: true };

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return { valid: false, message: "File is too large! Maximum size allowed is 5MB." };
    }

    // Check file type
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!hasAllowedExtension) {
        return { valid: false, message: "Invalid file type! Allowed extensions are: JPG, PNG, GIF, PDF, Word, Text." };
    }

    return { valid: true };
}

function validateDonationFormFields(title, category, location, itemType, qty, description, proofFile) {
    if (!title.trim() || title.trim().length < 5) {
        showToast("Validation Error", "Title must be at least 5 characters long.", "error");
        return false;
    }
    if (!category) {
        showToast("Validation Error", "Please select a Category.", "error");
        return false;
    }
    if (!location) {
        showToast("Validation Error", "Please select your Location.", "error");
        return false;
    }
    if (!itemType.trim() || itemType.trim().length < 2) {
        showToast("Validation Error", "Item type must be at least 2 characters.", "error");
        return false;
    }
    if (isNaN(qty) || qty < 1) {
        showToast("Validation Error", "Quantity must be at least 1.", "error");
        return false;
    }
    if (!description.trim() || description.trim().length < 15) {
        showToast("Validation Error", "Explanation must be at least 15 characters long.", "error");
        return false;
    }

    if (proofFile) {
        const fileCheck = validateFile(proofFile);
        if (!fileCheck.valid) {
            showToast("Validation Error", fileCheck.message, "error");
            return false;
        }
    }

    return true;
}

function submitEditDonationRequest(id) {
    const d = MOCK_DONATION_REQUESTS.find(x => x.id === id);
    if (!d) return;

    const title = document.getElementById('drTitle').value;
    const category = document.getElementById('drCategory').value;
    const location = document.getElementById('drLocation').value;
    const itemType = document.getElementById('drItemType').value;
    const qty = parseInt(document.getElementById('drQuantity').value, 10) || 1;
    const description = document.getElementById('drDescription').value;
    const proofFile = document.getElementById('drProof').files[0];

    if (!validateDonationFormFields(title, category, location, itemType, qty, description, proofFile)) {
        return;
    }

    d.title = title;
    d.category = category;
    d.location = location;
    d.item_type = itemType;
    d.target_qty = qty;
    d.description = description;

    // If new proof file is uploaded, simulate saving
    if (proofFile) {
        d.proof_file = URL.createObjectURL(proofFile);
    }

    // Reset state
    currentEditingId = null;

    document.getElementById('donationReqModal').close();
    document.getElementById('donationReqForm').reset();
    showToast("Updated", "Donation request updated successfully.", "success");
    renderDonationRequests();
}

function submitDonationRequest() {
    const title = document.getElementById('drTitle').value;
    const category = document.getElementById('drCategory').value;
    const location = document.getElementById('drLocation').value;
    const itemType = document.getElementById('drItemType').value;
    const qty = parseInt(document.getElementById('drQuantity').value, 10) || 1;
    const description = document.getElementById('drDescription').value;
    const proofFile = document.getElementById('drProof').files[0];

    if (!validateDonationFormFields(title, category, location, itemType, qty, description, proofFile)) {
        return;
    }

    const newReq = {
        id: Date.now(),
        category,
        location,
        title,
        item_type: itemType,
        description,
        proof_file: proofFile ? URL.createObjectURL(proofFile) : '#', // mock proof
        requester_name: window.userSession ? window.userSession.name : 'Guest User',
        rating: window.userSession ? window.userSession.rating : 5.0,
        requester_id: window.userSession ? window.userSession.id : 999,
        urgent: false,
        target_qty: qty,
        pledged_qty: 0
    };

    MOCK_DONATION_REQUESTS.unshift(newReq);

    document.getElementById('donationReqModal').close();
    document.getElementById('donationReqForm').reset();
    showToast("Created Request", "Donation request created successfully.", "success");
    renderDonationRequests();
    animateStats();
}

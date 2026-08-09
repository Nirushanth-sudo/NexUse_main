// public/js/marketplace.js

const MOCK_MARKETPLACE_LISTINGS = [
    {
        id: 1,
        title: "Canon EOS Rebel T7 DSLR",
        category: "Electronics",
        condition: "Like New",
        type: "buy",
        price: 300,
        location: "Colombo",
        description: "Great camera for beginners. Barely used.",
        image: "cam.png",
        owner_id: 101,
        owner_name: "John Doe",
        owner_rating: 4.8,
        in_wishlist: false,
        in_cart: false
    },
    {
        id: 2,
        title: "Pressure Washer 2000 PSI",
        category: "Tools",
        condition: "Good",
        type: "rent",
        price: 25,
        location: "Gampaha",
        description: "Powerful pressure washer. Available for daily rent.",
        image: "washgun.png",
        owner_id: 102,
        owner_name: "Jane Smith",
        owner_rating: 4.5,
        in_wishlist: false,
        in_cart: false
    },
    {
        id: 3,
        title: "MacBook Pro 15-inch (2018)",
        category: "Electronics",
        condition: "Good",
        type: "buy",
        price: 750,
        location: "Colombo",
        description: "15-inch MacBook Pro, 16GB RAM, 512GB SSD.",
        image: "AppleMac.jpg",
        owner_id: 103,
        owner_name: "Mike Johnson",
        owner_rating: 4.9,
        in_wishlist: false,
        in_cart: false
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Check session first
    window.sessionPromise.then(user => {
        // Init UI listeners
        initMarketplace();
    });

    const lImageInput = document.getElementById('lImage');
    if (lImageInput) {
        lImageInput.onchange = (e) => {
            const file = e.target.files[0];
            const textEl = e.target.parentElement.querySelector('.upload-text');
            const iconEl = e.target.parentElement.querySelector('.upload-icon');
            if (file) {
                textEl.innerHTML = `Selected: <strong style="color:var(--green); font-size:0.8rem;">${escapeHTML(file.name)}</strong>`;
                iconEl.textContent = '🖼️';
            } else {
                textEl.innerHTML = `Drag & drop image or <span class="upload-link" style="color: var(--primary); font-weight: 600;">browse</span>`;
                iconEl.textContent = '📤';
            }
        };
    }
});

function initMarketplace() {
    const searchBtn = document.getElementById('mktSearchBtn');
    const searchInput = document.getElementById('mktSearchInput');
    const typeRadios = document.querySelectorAll('input[name="mktType"]');
    const condRadios = document.querySelectorAll('input[name="mktCond"]');
    const catCheckboxes = document.querySelectorAll('#mktFilterCategory input');
    const locSelect = document.getElementById('mktFilterLocation');
    const listingForm = document.getElementById('listingForm');
    const lTypeSelect = document.getElementById('lType');

    // Attach listeners
    if (searchBtn) searchBtn.onclick = () => renderMarketplace();
    if (searchInput) {
        searchInput.onkeypress = (e) => {
            if (e.key === 'Enter') renderMarketplace();
        };
    }
    typeRadios.forEach(r => r.onchange = () => renderMarketplace());
    condRadios.forEach(r => r.onchange = () => renderMarketplace());
    catCheckboxes.forEach(c => c.onchange = () => renderMarketplace());
    if (locSelect) locSelect.onchange = () => renderMarketplace();

    if (lTypeSelect) {
        lTypeSelect.onchange = () => syncListingPriceField();
    }

    if (listingForm) {
        listingForm.onsubmit = (e) => {
            e.preventDefault();
            submitListing();
        };
    }

    // Run first render
    renderMarketplace(true); // true means populate location list on first run
}

function getFilters() {
    const search = document.getElementById('mktSearchInput')?.value || '';
    const type = document.querySelector('input[name="mktType"]:checked')?.value || '';
    const condition = document.querySelector('input[name="mktCond"]:checked')?.value || '';
    const location = document.getElementById('mktFilterLocation')?.value || '';
    
    const checkedCats = [...document.querySelectorAll('#mktFilterCategory input:checked')].map(i => i.value);
    const category = checkedCats.join(',');

    return { search, type, condition, location, category };
}

function renderMarketplace(initLocations = false) {
    const filters = getFilters();
    const query = new URLSearchParams(filters).toString();
    const grid = document.getElementById('mktProductsGrid');

    if (!grid) return;

    // Filter local mock data
    const searchLower = filters.search.toLowerCase();
    const selectedCategories = filters.category ? filters.category.split(',').filter(Boolean) : [];

    let listings = MOCK_MARKETPLACE_LISTINGS.filter(l => {
        const matchSearch = !searchLower || l.title.toLowerCase().includes(searchLower) || l.description.toLowerCase().includes(searchLower);
        const matchType = !filters.type || l.type === filters.type;
        const matchCond = !filters.condition || l.condition === filters.condition;
        const matchLoc = !filters.location || l.location === filters.location;
        const matchCat = selectedCategories.length === 0 || selectedCategories.includes(l.category);

        return matchSearch && matchType && matchCond && matchLoc && matchCat;
    });

    if (initLocations) {
        populateLocations(MOCK_MARKETPLACE_LISTINGS);
    }

    if (listings.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-text">No items match your search.</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = listings.map(l => {
        const badgeClass = l.type === 'buy' ? 'badge-sell' : l.type === 'rent' ? 'badge-rent' : 'badge-donate';
        const badgeText = l.type === 'buy' ? 'SELL' : l.type === 'rent' ? 'RENT' : 'DONATE';
        const priceHtml = l.type === 'buy' ? `<div class="product-card-price">$${l.price.toFixed(2)}</div>` :
                          l.type === 'rent' ? `<div class="product-card-price">$${l.price.toFixed(2)}/day</div>` :
                          `<div class="product-card-price free">FREE</div>`;
        
        return `
            <div class="product-card">
                <div class="product-card-image">
                    ${l.image || l.imageUrl ? `<img src="${l.imageUrl ? l.imageUrl : `assets/images/${l.image}`}" alt="${escapeHTML(l.title)}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:0;">` : `<span class="emoji-icon">${escapeHTML(l.emoji || '📦')}</span>`}
                    <span class="product-card-badge badge ${badgeClass}" style="z-index:1;">${badgeText}</span>
                    <button class="product-card-wish ${l.in_wishlist ? 'active' : ''}" onclick="toggleWishlist(${l.id}, event)" title="Wishlist" style="z-index:1;">❤️</button>
                </div>
                <div class="product-card-body">
                    <div class="product-card-category">${escapeHTML(l.category)}</div>
                    <div class="product-card-title">${escapeHTML(l.title)}</div>
                    <div class="product-card-desc">${escapeHTML(l.description)}</div>
                    ${priceHtml}
                    <div class="product-card-location">📍 ${escapeHTML(l.location)}</div>
                    <div class="product-card-footer">
                        <button class="btn-view-details" onclick="openProductDetail(${l.id})">View Details</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateLocations(listings) {
    const locSel = document.getElementById('mktFilterLocation');
    if (!locSel) return;

    // Get unique locations
    const locations = [...new Set(listings.map(l => l.location).filter(Boolean))];
    const current = locSel.value;

    locSel.innerHTML = `<option value="">All Locations</option>` + 
        locations.map(loc => `<option value="${escapeHTML(loc)}" ${loc === current ? 'selected' : ''}>${escapeHTML(loc)}</option>`).join('');
}

function toggleWishlist(id, event) {
    if (event) event.stopPropagation();

    if (!window.userSession) {
        showToast("Access Denied", "Please sign in to add items to your wishlist.", "warning");
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    const cardWishBtn = event ? event.currentTarget : null;
    const isAdding = cardWishBtn ? !cardWishBtn.classList.contains('active') : true;

    fetch('api/user/wishlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: id, action: isAdding ? 'add' : 'remove' })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast(isAdding ? "Added to Wishlist ❤️" : "Removed from Wishlist", "", isAdding ? "success" : "warning");
            if (cardWishBtn) {
                cardWishBtn.classList.toggle('active');
            } else {
                renderMarketplace();
            }
        } else {
            showToast("Error", data.message, "error");
        }
    });
}

function openProductDetail(id) {
    const l = MOCK_MARKETPLACE_LISTINGS.find(x => x.id === id);
    if (!l) return;

    document.getElementById('pdTitle').textContent = l.title;
    
    const imageArea = document.getElementById('pdImageArea');
    if (l.image || l.imageUrl) {
        imageArea.innerHTML = `<img src="${l.imageUrl ? l.imageUrl : `assets/images/${l.image}`}" alt="${escapeHTML(l.title)}" style="width:100%; height:100%; object-fit:cover;">
        <span style="position:absolute;top:12px;left:12px;" id="pdBadge"></span>`;
    } else {
        imageArea.innerHTML = `<span id="pdEmoji" style="font-size:4rem;">${escapeHTML(l.emoji || '📦')}</span>
        <span style="position:absolute;top:12px;left:12px;" id="pdBadge"></span>`;
    }
    
    document.getElementById('pdCategory').textContent = l.category;
    document.getElementById('pdCondition').textContent = l.condition;
    document.getElementById('pdLocation').textContent = l.location;
    document.getElementById('pdOwner').innerHTML = `<a href="profile.html?id=${l.owner_id}" style="color:var(--primary); font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="View trust profile">👤 ${escapeHTML(l.owner_name)} <span style="color:var(--text-secondary); font-weight:500; font-size:0.8rem;">(★ ${l.owner_rating.toFixed(1)})</span></a>`;
    document.getElementById('pdDescription').textContent = l.description;

    const badgeMap = { buy: "badge-sell SELL", rent: "badge-rent RENT", donate: "badge-donate DONATE", share: "badge-donate FREE SHARE", disposal: "badge-disposal DISPOSAL" };
    const [cls, txt] = (badgeMap[l.type] || "badge-disposal ITEM").split(" ");
    document.getElementById('pdBadge').innerHTML = `<span class="badge ${cls}">${txt}</span>`;

    const priceEl = document.getElementById('pdPrice');
    priceEl.textContent = l.type === 'buy' ? `$${l.price.toFixed(2)}` :
                          l.type === 'rent' ? `$${l.price.toFixed(2)} / day` : "FREE";
    priceEl.style.color = l.type === 'donate' || l.type === 'share' ? "var(--green)" : "var(--text)";

    // Hide show dates/notes
    const rdates = document.getElementById('pdRentalDates');
    const pledgeNote = document.getElementById('pdPledgeNote');
    rdates.classList.toggle('hidden', l.type !== 'rent' && l.type !== 'share');
    pledgeNote.classList.toggle('hidden', l.type !== 'donate');

    if (l.type === 'rent' || l.type === 'share') {
        const today = new Date();
        const returnDate = new Date();
        returnDate.setDate(today.getDate() + 5);
        document.getElementById('pdStartDate').value = today.toISOString().split('T')[0];
        document.getElementById('pdReturnDate').value = returnDate.toISOString().split('T')[0];
    }

    // Setup action button
    const actionBtn = document.getElementById('pdActionBtn');
    const wishlistBtn = document.getElementById('pdWishBtn');

    if (window.userSession && l.owner_id === window.userSession.id) {
        actionBtn.textContent = "Your Listing (Edit)";
        actionBtn.onclick = () => {
            document.getElementById('productDetailModal').close();
            openListingModal(l.id);
        };
    } else {
        if (l.type === 'buy') {
            actionBtn.textContent = l.in_cart ? "In Cart 🛒" : "Add to Cart";
            actionBtn.onclick = () => {
                if (l.in_cart) {
                    window.location.href = 'dashboard.html';
                } else {
                    addToCart(l.id);
                }
            };
        } else if (l.type === 'rent' || l.type === 'share') {
            actionBtn.textContent = "Send Rental Request";
            actionBtn.onclick = () => sendRentalRequest(l.id);
        } else if (l.type === 'donate') {
            actionBtn.textContent = "💝 Pledge Item";
            actionBtn.onclick = () => pledgeDonation(l.id);
        }
    }

    wishlistBtn.onclick = () => {
        toggleWishlist(l.id, null);
        document.getElementById('productDetailModal').close();
    };

    document.getElementById('pdChatBtn').onclick = () => {
        document.getElementById('productDetailModal').close();
        window.location.href = 'dashboard.html?tab=chat&listing=' + l.id;
    };

    document.getElementById('pdClose').onclick = () => {
        document.getElementById('productDetailModal').close();
    };

    document.getElementById('productDetailModal').showModal();
}

function addToCart(listingId) {
    if (!window.userSession) {
        showToast("Access Denied", "Please sign in to buy items.", "warning");
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    fetch('api/user/cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, action: 'add' })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast("Added to Cart 🛒", "", "success");
            document.getElementById('productDetailModal').close();
            renderMarketplace();
        } else {
            showToast("Error", data.message, "error");
        }
    });
}

function sendRentalRequest(listingId) {
    if (!window.userSession) {
        showToast("Access Denied", "Please sign in to borrow items.", "warning");
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    const startDate = document.getElementById('pdStartDate').value;
    const returnDate = document.getElementById('pdReturnDate').value;

    fetch('api/requests/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, start_date: startDate, return_date: returnDate })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast("Success", data.message, "success");
            document.getElementById('productDetailModal').close();
            renderMarketplace();
        } else {
            showToast("Error", data.message, "error");
        }
    });
}

function pledgeDonation(listingId) {
    if (!window.userSession) {
        showToast("Access Denied", "Please sign in to pledge items.", "warning");
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    const note = document.getElementById('pdPledgeNoteInput').value;

    fetch('api/requests/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, start_date: null, return_date: null })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast("Success", data.message, "success");
            document.getElementById('productDetailModal').close();
            renderMarketplace();
        } else {
            showToast("Error", data.message, "error");
        }
    });
}

function openListingModal(listingId = null) {
    if (!window.userSession) {
        showToast("Access Denied", "Please sign in to list items.", "warning");
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    const modal = document.getElementById('listingModal');
    document.getElementById('listingForm').reset();
    document.getElementById('listingEditId').value = listingId || '';
    document.getElementById('listingModalTitle').textContent = listingId ? "Edit Listing" : "List an Item";

    const lImageInput = document.getElementById('lImage');
    if (lImageInput) {
        const textEl = lImageInput.parentElement.querySelector('.upload-text');
        const iconEl = lImageInput.parentElement.querySelector('.upload-icon');
        textEl.innerHTML = `Drag & drop image or <span class="upload-link" style="color: var(--primary); font-weight: 600;">browse</span>`;
        iconEl.textContent = '📤';
    }

    if (listingId) {
        const l = MOCK_MARKETPLACE_LISTINGS.find(x => x.id === listingId);
        if (l) {
            document.getElementById('lTitle').value = l.title;
            document.getElementById('lCategory').value = l.category;
            document.getElementById('lCondition').value = l.condition;
            document.getElementById('lType').value = l.type;
            document.getElementById('lPrice').value = l.price;
            document.getElementById('lLocation').value = l.location;
            document.getElementById('lDescription').value = l.description;
            syncListingPriceField();
        }
    } else {
        document.getElementById('lLocation').value = window.userSession.location;
        syncListingPriceField();
    }

    modal.showModal();
}

function syncListingPriceField() {
    const type = document.getElementById('lType')?.value;
    const wrap = document.getElementById('lPriceWrap');
    if (wrap) wrap.style.display = (type === 'buy' || type === 'rent') ? 'block' : 'none';
}

function submitListing() {
    const editId = document.getElementById('listingEditId').value;
    const isEdit = !!editId;

    const title = document.getElementById('lTitle').value;
    const category = document.getElementById('lCategory').value;
    const condition = document.getElementById('lCondition').value;
    const type = document.getElementById('lType').value;
    const price = parseFloat(document.getElementById('lPrice').value || 0);
    const location = document.getElementById('lLocation').value;
    const description = document.getElementById('lDescription').value;
    
    const imageInput = document.getElementById('lImage');
    let imageObj = null;
    if (imageInput && imageInput.files[0]) {
        imageObj = URL.createObjectURL(imageInput.files[0]);
    }

    if (isEdit) {
        const l = MOCK_MARKETPLACE_LISTINGS.find(x => x.id === parseInt(editId));
        if (l) {
            l.title = title;
            l.category = category;
            l.condition = condition;
            l.type = type;
            l.price = price;
            l.location = location;
            l.description = description;
            if (imageObj) {
                l.image = null; 
                l.imageUrl = imageObj;
            }
        }
        showToast("Success", "Listing updated successfully.", "success");
    } else {
        const newListing = {
            id: Date.now(),
            title: title,
            category: category,
            condition: condition,
            type: type,
            price: price,
            location: location,
            description: description,
            image: null,
            imageUrl: imageObj,
            owner_id: window.userSession ? window.userSession.id : 999,
            owner_name: window.userSession ? window.userSession.name : 'Guest User',
            owner_rating: window.userSession ? window.userSession.rating : 5.0,
            in_wishlist: false,
            in_cart: false
        };
        MOCK_MARKETPLACE_LISTINGS.unshift(newListing);
        showToast("Success", "Listing created successfully.", "success");
    }

    document.getElementById('listingModal').close();
    document.getElementById('listingForm').reset();
    renderMarketplace(true);
}

// public/assets/JS/profile.js

// Mock Users Database with detailed ratings, stats, contact details, listings, and reviews
const MOCK_USERS_DB = {
    "1": {
        id: 1,
        username: "johndoe",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Community Contributor",
        rating: 4.80,
        reviewsCount: 14,
        verified: true,
        phone: "0771234567",
        location: "Colombo",
        address: "123 Galle Road, Colombo 03",
        joinedDate: "October 2024",
        stats: {
            donations: 8,
            pledges: 5,
            listings: 4,
            disputes: 0
        },
        listings: [
            { id: 201, type: "buy", title: "Scientific Calculator", category: "Electronics", price: 15.00, emoji: "🧮", condition: "Like New", location: "Colombo" },
            { id: 202, type: "rent", title: "Professional Tripod", category: "Other", price: 3.50, emoji: "📷", condition: "Good", location: "Colombo" }
        ],
        donations: [
            { id: 203, category: "Books", title: "A/L Chemistry Past Papers", item_type: "BOOKS", description: "Chemistry past papers from 2018-2023 for student in need.", location: "Colombo" }
        ],
        reviews: [
            { reviewer: "Amara Perera", rating: 5, date: "2026-06-15", text: "Very prompt response. The calculator works perfectly and was clean. Thank you John!" },
            { reviewer: "Saman Kumara", rating: 4.5, date: "2026-05-20", text: "Rented the tripod, it was in perfect condition and handover was seamless." }
        ]
    },
    "101": {
        id: 101,
        username: "nishedr",
        name: "Nished Ruveesha",
        email: "nished.r@example.com",
        role: "School Organizer",
        rating: 5.00,
        reviewsCount: 28,
        verified: true,
        phone: "0772223334",
        location: "Gampaha",
        address: "45 Kandy Road, Gampaha",
        joinedDate: "January 2025",
        stats: {
            donations: 12,
            pledges: 15,
            listings: 2,
            disputes: 0
        },
        listings: [
            { id: 301, type: "buy", title: "Children Storybooks", category: "Books", price: 4.00, emoji: "📚", condition: "Good", location: "Gampaha" }
        ],
        donations: [
            { id: 1, category: "Electronics", title: "Laptops for School", item_type: "LAPTOPS", description: "I want 10 Laptops for my school. Students from remote villages attend this center.", location: "Gampaha", proof_file: "#" }
        ],
        reviews: [
            { reviewer: "John Doe", rating: 5, date: "2026-07-10", text: "Fabulous community leader. Pledged 2 laptops and she sent me pictures of the students using them. Highly trustworthy!" },
            { reviewer: "Amara Perera", rating: 5, date: "2026-04-18", text: "Excellent and smooth coordinator. Visited the school to donate books. Extremely grateful." }
        ]
    },
    "102": {
        id: 102,
        username: "amarap",
        name: "Amara Perera",
        email: "amara.p@example.com",
        role: "Community Member",
        rating: 4.85,
        reviewsCount: 19,
        verified: true,
        phone: "0773334445",
        location: "Colombo",
        address: "88 Duplication Road, Colombo 04",
        joinedDate: "March 2025",
        stats: {
            donations: 9,
            pledges: 6,
            listings: 5,
            disputes: 0
        },
        listings: [
            { id: 401, type: "rent", title: "Sewing Machine", category: "Tools", price: 5.00, emoji: "🧵", condition: "Good", location: "Colombo" },
            { id: 402, type: "buy", title: "Fiction Novels Pack", category: "Books", price: 10.00, emoji: "📖", condition: "Like New", location: "Colombo" }
        ],
        donations: [
            { id: 2, category: "Books", title: "Textbooks for Grade 10", item_type: "BOOKS", description: "Need mathematics and science textbooks for 15 students preparing for exams.", location: "Colombo", proof_file: null }
        ],
        reviews: [
            { reviewer: "Nished Ruveesha", rating: 5, date: "2026-06-01", text: "Donated grade 10 textbooks to Amara. Communication was fast and polite. Absolute pleasure!" },
            { reviewer: "John Doe", rating: 4.5, date: "2026-03-24", text: "Rented the sewing machine. Had a tiny issue with tension but Amara immediately helped me resolve it." }
        ]
    },
    "103": {
        id: 103,
        username: "samank",
        name: "Saman Kumara",
        email: "saman.k@example.com",
        role: "Eco Enthusiast",
        rating: 4.50,
        reviewsCount: 9,
        verified: false,
        phone: "0774445556",
        location: "Kandy",
        address: "10 Peradeniya Road, Kandy",
        joinedDate: "December 2024",
        stats: {
            donations: 4,
            pledges: 11,
            listings: 3,
            disputes: 0
        },
        listings: [
            { id: 501, type: "share", title: "Electric Lawn Mower", category: "Tools", price: 0.00, emoji: "⚙️", condition: "Fair", location: "Kandy" }
        ],
        donations: [
            { id: 3, category: "Furniture", title: "Study Desks for Community Center", item_type: "DESKS", description: "Looking for 5 wooden study desks in good condition to rebuild the village center.", location: "Kandy", proof_file: "#" }
        ],
        reviews: [
            { reviewer: "John Doe", rating: 5, date: "2026-05-12", text: "Borrowed the lawn mower. Cleaned it, returned it, Saman was incredibly friendly. Great sharing advocate!" },
            { reviewer: "Nished Ruveesha", rating: 4, date: "2026-02-15", text: "Helped deliver study desks. Handover was smooth, though directions to center were slightly confusing." }
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Parse user id from URL
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id") || "1"; // Default to John Doe (ID 1) if no ID is provided

    // 2. Fetch User Profile Data
    const user = MOCK_USERS_DB[userId];
    if (!user) {
        showErrorState();
        return;
    }

    // 3. Render Profile UI details
    renderUserProfile(user);

    // 4. Render Active Listings, Donations, and Reviews
    renderUserListings(user.listings);
    renderUserDonations(user.donations);
    renderUserReviews(user.reviews);

    // 5. Update Rating Statistics in head
    document.getElementById("avgRatingText").textContent = user.rating.toFixed(2);
    document.getElementById("reviewCountText").textContent = `(${user.reviewsCount} reviews)`;

    // 6. Hook tab clicks
    setupTabs();
});

function renderUserProfile(user) {
    // Basic Details
    document.getElementById("userAvatar").textContent = user.name.charAt(0);
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userRole").textContent = user.role;
    
    // Stars rendering
    const starContainer = document.getElementById("userStars");
    const fullStars = Math.floor(user.rating);
    const hasHalf = user.rating % 1 >= 0.5;
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHtml += "★";
        } else if (i === fullStars && hasHalf) {
            starsHtml += "⯪";
        } else {
            starsHtml += "☆";
        }
    }
    starContainer.innerHTML = `${starsHtml} <span class="profile-rating-count">${user.rating.toFixed(2)} (${user.reviewsCount} Reviews)</span>`;

    // Badges details
    const badgesList = document.getElementById("trustBadgesList");
    badgesList.innerHTML = `
        <div class="trust-badge-item ${user.verified ? 'verified' : ''}">
            <span class="trust-badge-icon">${user.verified ? '✓' : '⚠️'}</span>
            <span>${user.verified ? 'Identity Verified' : 'Identity Unverified'}</span>
        </div>
        <div class="trust-badge-item verified">
            <span class="trust-badge-icon">✓</span>
            <span>Email Verified</span>
        </div>
        <div class="trust-badge-item verified">
            <span class="trust-badge-icon">✓</span>
            <span>Phone Verified</span>
        </div>
        ${user.rating >= 4.7 ? `
        <div class="trust-badge-item verified" style="background:#fffbeb; color:#b45309; border-color:#fef3c7;">
            <span class="trust-badge-icon">⭐</span>
            <span>Top Rated Member</span>
        </div>
        ` : ''}
    `;

    // Contact Grid Details
    document.getElementById("infoEmail").textContent = user.email;
    document.getElementById("infoPhone").textContent = user.phone;
    document.getElementById("infoLocation").textContent = user.location;
    document.getElementById("infoAddress").textContent = user.address;

    // Numerical stats
    document.getElementById("statDonatedCount").textContent = user.stats.donations;
    document.getElementById("statPledgedCount").textContent = user.stats.pledges;
    document.getElementById("statListingsCount").textContent = user.stats.listings;
    document.getElementById("statMemberSince").textContent = user.joinedDate;
}

function renderUserListings(listings) {
    const container = document.getElementById("profileListingsContainer");
    if (!listings || listings.length === 0) {
        container.innerHTML = `
            <div class="profile-empty-state" style="grid-column: 1 / -1;">
                <div class="profile-empty-icon">🏪</div>
                <div>No active listings at the moment.</div>
            </div>
        `;
        return;
    }

    container.innerHTML = listings.map(l => {
        const badgeClass = l.type === 'buy' ? 'badge-sell' : l.type === 'rent' ? 'badge-rent' : 'badge-donate';
        const badgeText = l.type === 'buy' ? 'SELL' : l.type === 'rent' ? 'RENT' : 'FREE';
        const priceHtml = l.type === 'buy' ? `<div class="product-card-price" style="font-weight:700; color:var(--primary); font-size:1.1rem;">$${l.price.toFixed(2)}</div>` :
                          l.type === 'rent' ? `<div class="product-card-price" style="font-weight:700; color:var(--primary); font-size:1.1rem;">$${l.price.toFixed(2)}/day</div>` :
                          `<div class="product-card-price free" style="font-weight:700; color:var(--green); font-size:1.1rem;">FREE</div>`;

        return `
            <div class="product-card" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; display:flex; flex-direction:column; box-shadow:var(--shadow-xs);">
                <div class="product-card-image" style="height:120px; display:flex; align-items:center; justify-content:center; background:var(--bg); position:relative; font-size:2.8rem;">
                    <span>${l.emoji || '📦'}</span>
                    <span class="product-card-badge badge ${badgeClass}" style="position:absolute; top:12px; left:12px; font-size:0.65rem; font-weight:700; padding:3px 8px; border-radius:var(--radius-pill); color:#fff; background:${l.type==='buy'?'var(--primary)':l.type==='rent'?'var(--amber)':'var(--green)'};">${badgeText}</span>
                </div>
                <div class="product-card-body" style="padding:16px; display:flex; flex-direction:column; gap:6px; flex:1;">
                    <div class="product-card-category" style="font-size:0.75rem; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">${l.category}</div>
                    <div class="product-card-title" style="font-size:0.95rem; font-weight:700; color:var(--text);">${l.title}</div>
                    ${priceHtml}
                    <div class="product-card-location" style="font-size:0.78rem; color:var(--text-secondary); margin-top:auto; display:flex; align-items:center; gap:4px;">📍 ${l.location}</div>
                </div>
            </div>
        `;
    }).join("");
}

function renderUserDonations(donations) {
    const container = document.getElementById("profileDonationsContainer");
    if (!donations || donations.length === 0) {
        container.innerHTML = `
            <div class="profile-empty-state" style="grid-column: 1 / -1;">
                <div class="profile-empty-icon">💝</div>
                <div>No donation requests posted yet.</div>
            </div>
        `;
        return;
    }

    container.innerHTML = donations.map(d => {
        // High quality illustration mapping
        const categoryImages = {
            'Electronics': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
            'Books': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60',
            'Furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60',
            'Clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60',
            'Tools': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60',
            'Other': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60'
        };
        const imageUrl = categoryImages[d.category] || categoryImages['Other'];

        return `
            <div class="donation-card" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); overflow:hidden; display:flex; flex-direction:column; box-shadow:var(--shadow-xs);">
                <div style="height:120px; width:100%; overflow:hidden; position:relative;">
                    <img src="${imageUrl}" alt="${d.category}" style="width:100%; height:100%; object-fit:cover;">
                    <span style="position:absolute; top:12px; left:12px; font-size:0.65rem; font-weight:700; padding:4px 8px; border-radius:var(--radius-pill); background:var(--green); color:#fff; text-transform:uppercase;">${d.category}</span>
                </div>
                <div style="padding:16px; display:flex; flex-direction:column; gap:6px; flex:1;">
                    <div style="font-size:0.95rem; font-weight:700; color:var(--text);">${d.title}</div>
                    <div style="font-size:0.7rem; font-weight:700; color:var(--green); letter-spacing:0.05em; text-transform:uppercase;">Needed: ${d.item_type}</div>
                    <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.5; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${d.description}</div>
                    <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:auto; display:flex; align-items:center; gap:4px;">📍 ${d.location}</div>
                </div>
            </div>
        `;
    }).join("");
}

function renderUserReviews(reviews) {
    const container = document.getElementById("profileReviewsContainer");
    if (!reviews || reviews.length === 0) {
        container.innerHTML = `
            <div class="profile-empty-state">
                <div class="profile-empty-icon">✍️</div>
                <div>No reviews or feedback received yet.</div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="reviews-list">
            ${reviews.map(r => {
                let stars = "";
                for (let i = 1; i <= 5; i++) {
                    stars += i <= Math.floor(r.rating) ? "★" : "☆";
                }
                return `
                    <div class="review-card">
                        <div class="review-header">
                            <div>
                                <span class="reviewer-name">${escapeHTML(r.reviewer)}</span>
                                <div class="review-rating-stars">${stars} <span style="color:var(--text-secondary); font-size:0.78rem; font-weight:500; margin-left:4px;">${r.rating}</span></div>
                            </div>
                            <span class="review-date">${formatReviewDate(r.date)}</span>
                        </div>
                        <p class="review-text">"${escapeHTML(r.text)}"</p>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function setupTabs() {
    const tabs = document.querySelectorAll(".profile-tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const targetTab = tab.getAttribute("data-tab");
            const panes = document.querySelectorAll(".profile-tab-pane");
            panes.forEach(pane => {
                if (pane.id === `tabView-${targetTab}`) {
                    pane.classList.remove("hidden");
                } else {
                    pane.classList.add("hidden");
                }
            });
        });
    });
}

function showErrorState() {
    const container = document.getElementById("profilePageWrapper");
    if (container) {
        container.innerHTML = `
            <div style="max-width:500px; margin: 80px auto; padding: 40px; background:#fff; border:1px solid var(--border); border-radius:var(--radius-lg); text-align:center; box-shadow:var(--shadow-md);">
                <div style="font-size:3.5rem; margin-bottom:16px;">🔍</div>
                <h2 style="font-weight:800; margin-bottom:8px;">User Profile Not Found</h2>
                <p style="color:var(--text-secondary); margin-bottom:24px; font-size:0.9rem;">The user you are trying to view does not exist or has been disabled.</p>
                <a href="donation.html" class="btn btn-primary btn-md">Back to Donations</a>
            </div>
        `;
    }
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function formatReviewDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

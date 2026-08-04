document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE NAVIGATION TOGGLE ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // --- LOCAL STORAGE DATA ENGINE ---
  const defaultUsers = [
    { id: 1, name: 'System Administrator', email: 'admin@nexuse.lk', username: 'admin', role: 'ADMIN', city: 'Colombo', status: 'ACTIVE' },
    { id: 2, name: 'Kamal Perera', email: 'seller@nexuse.lk', username: 'seller1', role: 'SELLER', city: 'Dehiwala', status: 'ACTIVE' },
    { id: 3, name: 'Nimali Silva', email: 'buyer@nexuse.lk', username: 'buyer1', role: 'BUYER', city: 'Colombo', status: 'ACTIVE' },
    { id: 4, name: 'Sunil Jayasinghe', email: 'donor@nexuse.lk', username: 'donor1', role: 'DONOR', city: 'Kandy', status: 'ACTIVE' },
    { id: 5, name: 'Dilshan Fernando', email: 'renter@nexuse.lk', username: 'renter1', role: 'RENTER', city: 'Galle', status: 'ACTIVE' },
    { id: 6, name: 'Kasun Kalhara', email: 'kasun@nexuse.lk', username: 'seller2', role: 'SELLER', city: 'Negombo', status: 'ACTIVE' }
  ];

  const defaultCategories = [
    { id: 1, name: 'Electronics & Appliances', slug: 'electronics', desc: 'Laptops, cameras, & appliances' },
    { id: 2, name: 'Books & Educational Tools', slug: 'books', desc: 'Textbooks & stationeries' },
    { id: 3, name: 'Furniture & Home Decor', slug: 'furniture', desc: 'Chairs, tables, & home decor' },
    { id: 4, name: 'Camping & Outdoor Gear', slug: 'outdoor', desc: 'Tents & outdoor gear' },
    { id: 5, name: 'Musical Instruments', slug: 'music', desc: 'Guitars, keyboards & audio gear' },
    { id: 6, name: 'Sports & Fitness', slug: 'sports', desc: 'Bicycles, gym items & sports kits' }
  ];

  const defaultListings = [
    { id: 1, title: 'Dell Latitude 7490 Laptop', owner: 'Kamal Perera', category: 'Electronics & Appliances', price: 'LKR 85,000', status: 'APPROVED' },
    { id: 2, title: 'A-Level Physics Textbooks Pack', owner: 'Sunil Jayasinghe', category: 'Books & Educational Tools', price: 'FREE (Donation)', status: 'APPROVED' },
    { id: 3, title: 'Ergonomic Office Chair', owner: 'Kasun Kalhara', category: 'Furniture & Home Decor', price: 'LKR 1,500 / day', status: 'APPROVED' },
    { id: 4, title: '4-Person Camping Tent', owner: 'Dilshan Fernando', category: 'Camping & Outdoor Gear', price: 'LKR 2,500 / day', status: 'APPROVED' },
    { id: 5, title: 'Yamaha Acoustic Guitar F310', owner: 'Kamal Perera', category: 'Musical Instruments', price: 'LKR 35,000', status: 'APPROVED' },
    { id: 6, title: 'Mountain Bike 26-inch', owner: 'Kasun Kalhara', category: 'Sports & Fitness', price: 'LKR 45,000', status: 'PENDING' }
  ];

  const defaultDisputes = [
    { id: 1, subject: 'Inquiry on delivery delay', reporter: 'User #3', details: 'Seller postponed meetup date by 2 days.', status: 'RESOLVED' }
  ];

  const defaultNotifications = [
    { id: 1, target: 'User #3', title: 'Order Accepted', message: 'Your request for Dell Latitude 7490 was accepted.', type: 'SUCCESS' },
    { id: 2, target: 'User #5', title: 'New Donation Pledge Received!', message: 'Sunil Jayasinghe pledged 10 School Bags.', type: 'INFO' }
  ];

  // Helper getters & setters
  function loadData(key, fallback) {
    const raw = localStorage.getItem('nexuse_admin_' + key);
    return raw ? JSON.parse(raw) : fallback;
  }
  function saveData(key, val) {
    localStorage.setItem('nexuse_admin_' + key, JSON.stringify(val));
  }

  let users = loadData('users', defaultUsers);
  let categories = loadData('categories', defaultCategories);
  let listings = loadData('listings', defaultListings);
  let disputes = loadData('disputes', defaultDisputes);
  let notifications = loadData('notifications', defaultNotifications);

  // --- STATE REFRESH & COUNTS ---
  function updateSidebarCounts() {
    document.getElementById('badge-users-count').textContent = users.length;
    document.getElementById('badge-categories-count').textContent = categories.length;
    document.getElementById('badge-listings-count').textContent = listings.length;
    document.getElementById('badge-disputes-count').textContent = disputes.filter(d => d.status !== 'RESOLVED' && d.status !== 'DISMISSED').length || disputes.length;
    document.getElementById('badge-notifs-count').textContent = notifications.length;

    // Stat Cards
    document.getElementById('stat-total-users').textContent = users.length;
    document.getElementById('stat-total-listings').textContent = listings.length;
    document.getElementById('stat-open-complaints').textContent = disputes.filter(d => d.status === 'OPEN').length || disputes.length;
  }

  // --- TAB NAVIGATION LOGIC ---
  const navBtns = document.querySelectorAll('.dash-nav-btn');
  const crudViews = document.querySelectorAll('.crud-view-section');

  function switchTab(targetId) {
    navBtns.forEach(btn => {
      if (btn.dataset.target === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    crudViews.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.target);
    });
  });

  // --- RENDER 1: USERS CRUD ---
  function renderUsersTable(filter = '') {
    const tbody = document.getElementById('tbody-users');
    tbody.innerHTML = '';
    const q = filter.toLowerCase().trim();

    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.username.toLowerCase().includes(q) || 
      u.role.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:24px;">No users found matching your search.</td></tr>`;
      return;
    }

    filtered.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${u.id}</strong></td>
        <td><strong>${escapeHtml(u.name)}</strong></td>
        <td><div>${escapeHtml(u.username)}</div><div class="text-xs text-muted">${escapeHtml(u.email)}</div></td>
        <td><span class="badge badge-${u.role.toLowerCase()}">${u.role}</span></td>
        <td>${escapeHtml(u.city)}</td>
        <td><span class="badge badge-${u.status.toLowerCase()}">${u.status}</span></td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl-edit" onclick="editUser(${u.id})">Edit</button>
            <button class="btn-tbl-dark" onclick="toggleUserStatus(${u.id})">${u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</button>
            <button class="btn-tbl-delete" onclick="deleteUser(${u.id})">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // User Actions (EMAIL READONLY FOR ADMIN)
  window.editUser = function(id) {
    const u = users.find(x => x.id === id);
    if (!u) return;
    document.getElementById('modalUserTitle').textContent = 'Edit User Account';
    document.getElementById('userId').value = u.id;
    document.getElementById('userName').value = u.name;
    document.getElementById('userEmail').value = u.email;
    document.getElementById('userEmail').readOnly = true; // Email cannot be edited by admin
    document.getElementById('userUsername').value = u.username;
    document.getElementById('userRole').value = u.role;
    document.getElementById('userCity').value = u.city;
    openModal('modalUser');
  };

  window.toggleUserStatus = function(id) {
    const u = users.find(x => x.id === id);
    if (!u) return;
    u.status = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    saveData('users', users);
    renderUsersTable(document.getElementById('search-users').value);
    showToast(`User ${u.name} status updated to ${u.status}`);
  };

  window.deleteUser = function(id) {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    users = users.filter(x => x.id !== id);
    saveData('users', users);
    renderUsersTable(document.getElementById('search-users').value);
    updateSidebarCounts();
    showToast('User account deleted successfully');
  };

  document.getElementById('btn-add-user').addEventListener('click', () => {
    document.getElementById('modalUserTitle').textContent = 'Add New User Account';
    document.getElementById('formUser').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userEmail').readOnly = false; // Allow typing email for NEW user creation
    openModal('modalUser');
  });

  document.getElementById('formUser').addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const username = document.getElementById('userUsername').value;
    const role = document.getElementById('userRole').value;
    const city = document.getElementById('userCity').value;

    if (idVal) {
      const u = users.find(x => x.id == idVal);
      if (u) {
        u.name = name;
        u.username = username;
        u.role = role;
        u.city = city;
        showToast('User updated successfully');
      }
    } else {
      const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      users.push({ id: newId, name, email, username, role, city, status: 'ACTIVE' });
      showToast('New user created successfully');
    }

    saveData('users', users);
    renderUsersTable();
    updateSidebarCounts();
    closeModal('modalUser');
  });

  document.getElementById('search-users').addEventListener('input', (e) => {
    renderUsersTable(e.target.value);
  });

  // --- RENDER 2: CATEGORIES CRUD ---
  function renderCategoriesTable(filter = '') {
    const tbody = document.getElementById('tbody-categories');
    tbody.innerHTML = '';
    const q = filter.toLowerCase().trim();

    const filtered = categories.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q) || 
      c.desc.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding:24px;">No categories found matching your search.</td></tr>`;
      return;
    }

    filtered.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${c.id}</strong></td>
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">${escapeHtml(c.slug)}</code></td>
        <td>${escapeHtml(c.desc)}</td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl-edit" onclick="editCategory(${c.id})">Edit</button>
            <button class="btn-tbl-delete" onclick="deleteCategory(${c.id})">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.editCategory = function(id) {
    const c = categories.find(x => x.id === id);
    if (!c) return;
    document.getElementById('modalCategoryTitle').textContent = 'Edit Category';
    document.getElementById('catId').value = c.id;
    document.getElementById('catName').value = c.name;
    document.getElementById('catSlug').value = c.slug;
    document.getElementById('catDesc').value = c.desc;
    openModal('modalCategory');
  };

  window.deleteCategory = function(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    categories = categories.filter(x => x.id !== id);
    saveData('categories', categories);
    renderCategoriesTable(document.getElementById('search-categories').value);
    updateSidebarCounts();
    showToast('Category deleted successfully');
  };

  document.getElementById('btn-add-category').addEventListener('click', () => {
    document.getElementById('modalCategoryTitle').textContent = 'Add New Category';
    document.getElementById('formCategory').reset();
    document.getElementById('catId').value = '';
    openModal('modalCategory');
  });

  document.getElementById('formCategory').addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('catId').value;
    const name = document.getElementById('catName').value;
    const slug = document.getElementById('catSlug').value;
    const desc = document.getElementById('catDesc').value;

    if (idVal) {
      const c = categories.find(x => x.id == idVal);
      if (c) { c.name = name; c.slug = slug; c.desc = desc; showToast('Category updated successfully'); }
    } else {
      const newId = categories.length ? Math.max(...categories.map(x => x.id)) + 1 : 1;
      categories.push({ id: newId, name, slug, desc });
      showToast('New category added successfully');
    }

    saveData('categories', categories);
    renderCategoriesTable();
    updateSidebarCounts();
    closeModal('modalCategory');
  });

  document.getElementById('search-categories').addEventListener('input', (e) => {
    renderCategoriesTable(e.target.value);
  });

  // --- RENDER 3: LISTINGS MODERATION CRUD (WITH AVAILABLE CATEGORY SELECT DROPDOWN) ---
  function populateCategoryDropdown(selectedCategoryName = '') {
    const select = document.getElementById('listingCategory');
    select.innerHTML = '';
    
    if (categories.length === 0) {
      select.innerHTML = '<option value="">No Categories Available</option>';
      return;
    }

    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name;
      if (c.name === selectedCategoryName) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function renderListingsTable(filter = '') {
    const tbody = document.getElementById('tbody-listings');
    tbody.innerHTML = '';
    const q = filter.toLowerCase().trim();

    const filtered = listings.filter(l => 
      l.title.toLowerCase().includes(q) || 
      l.owner.toLowerCase().includes(q) || 
      l.category.toLowerCase().includes(q) ||
      l.price.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:24px;">No listings found matching your search.</td></tr>`;
      return;
    }

    filtered.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${l.id}</strong></td>
        <td><strong>${escapeHtml(l.title)}</strong></td>
        <td>${escapeHtml(l.owner)}</td>
        <td><span class="text-muted">${escapeHtml(l.category)}</span></td>
        <td><strong>${escapeHtml(l.price)}</strong></td>
        <td><span class="badge badge-${l.status.toLowerCase()}">${l.status}</span></td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl-teal" onclick="toggleListingStatus(${l.id})">${l.status === 'APPROVED' ? 'Flag' : 'Approve'}</button>
            <button class="btn-tbl-edit" onclick="editListing(${l.id})">Edit</button>
            <button class="btn-tbl-delete" onclick="deleteListing(${l.id})">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.toggleListingStatus = function(id) {
    const l = listings.find(x => x.id === id);
    if (!l) return;
    l.status = l.status === 'APPROVED' ? 'FLAGGED' : 'APPROVED';
    saveData('listings', listings);
    renderListingsTable(document.getElementById('search-listings').value);
    showToast(`Listing #${id} marked as ${l.status}`);
  };

  window.editListing = function(id) {
    const l = listings.find(x => x.id === id);
    if (!l) return;
    document.getElementById('modalListingTitle').textContent = 'Edit Listing Details';
    document.getElementById('listingId').value = l.id;
    document.getElementById('listingItemTitle').value = l.title;
    document.getElementById('listingOwner').value = l.owner;
    populateCategoryDropdown(l.category);
    document.getElementById('listingPrice').value = l.price;
    document.getElementById('listingStatus').value = l.status;
    openModal('modalListing');
  };

  window.deleteListing = function(id) {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    listings = listings.filter(x => x.id !== id);
    saveData('listings', listings);
    renderListingsTable(document.getElementById('search-listings').value);
    updateSidebarCounts();
    showToast('Listing deleted successfully');
  };

  document.getElementById('btn-add-listing').addEventListener('click', () => {
    document.getElementById('modalListingTitle').textContent = 'Create Marketplace Listing';
    document.getElementById('formListing').reset();
    document.getElementById('listingId').value = '';
    populateCategoryDropdown();
    openModal('modalListing');
  });

  document.getElementById('formListing').addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('listingId').value;
    const title = document.getElementById('listingItemTitle').value;
    const owner = document.getElementById('listingOwner').value;
    const category = document.getElementById('listingCategory').value;
    const price = document.getElementById('listingPrice').value;
    const status = document.getElementById('listingStatus').value;

    if (idVal) {
      const l = listings.find(x => x.id == idVal);
      if (l) { l.title = title; l.owner = owner; l.category = category; l.price = price; l.status = status; showToast('Listing updated successfully'); }
    } else {
      const newId = listings.length ? Math.max(...listings.map(x => x.id)) + 1 : 1;
      listings.push({ id: newId, title, owner, category, price, status });
      showToast('New listing added successfully');
    }

    saveData('listings', listings);
    renderListingsTable();
    updateSidebarCounts();
    closeModal('modalListing');
  });

  document.getElementById('search-listings').addEventListener('input', (e) => {
    renderListingsTable(e.target.value);
  });

  // --- RENDER 4: DISPUTES & COMPLAINTS CRUD ---
  function renderDisputesTable() {
    const tbody = document.getElementById('tbody-disputes');
    tbody.innerHTML = '';

    if (disputes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No active complaints or disputes logged.</td></tr>`;
      return;
    }

    disputes.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${d.id}</strong></td>
        <td><strong>${escapeHtml(d.subject)}</strong></td>
        <td>${escapeHtml(d.reporter)}</td>
        <td>${escapeHtml(d.details)}</td>
        <td><span class="badge badge-${d.status.toLowerCase()}">${d.status}</span></td>
        <td>
          <div class="tbl-actions">
            ${d.status !== 'RESOLVED' ? `<button class="btn-tbl-teal" onclick="resolveDispute(${d.id})">Resolve</button>` : ''}
            ${d.status !== 'DISMISSED' ? `<button class="btn-tbl-dark" onclick="dismissDispute(${d.id})">Dismiss</button>` : ''}
            <button class="btn-tbl-delete" onclick="deleteDispute(${d.id})">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.resolveDispute = function(id) {
    const d = disputes.find(x => x.id === id);
    if (!d) return;
    d.status = 'RESOLVED';
    saveData('disputes', disputes);
    renderDisputesTable();
    updateSidebarCounts();
    showToast(`Dispute #${id} resolved successfully`);
  };

  window.dismissDispute = function(id) {
    const d = disputes.find(x => x.id === id);
    if (!d) return;
    d.status = 'DISMISSED';
    saveData('disputes', disputes);
    renderDisputesTable();
    updateSidebarCounts();
    showToast(`Dispute #${id} dismissed`);
  };

  window.deleteDispute = function(id) {
    if (!confirm('Are you sure you want to remove this dispute log?')) return;
    disputes = disputes.filter(x => x.id !== id);
    saveData('disputes', disputes);
    renderDisputesTable();
    updateSidebarCounts();
    showToast('Dispute record deleted');
  };

  // LOG NEW DISPUTE MODAL HANDLER
  document.getElementById('btn-add-dispute').addEventListener('click', () => {
    document.getElementById('formDispute').reset();
    openModal('modalDispute');
  });

  document.getElementById('formDispute').addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('dspSubject').value;
    const reporter = document.getElementById('dspReporter').value;
    const details = document.getElementById('dspDetails').value;
    const status = document.getElementById('dspStatus').value;

    const newId = disputes.length ? Math.max(...disputes.map(x => x.id)) + 1 : 1;
    disputes.push({ id: newId, subject, reporter, details, status });

    saveData('disputes', disputes);
    renderDisputesTable();
    updateSidebarCounts();
    closeModal('modalDispute');
    showToast('New dispute logged successfully');
  });

  // --- RENDER 5: SYSTEM NOTIFICATIONS LOG CRUD ---
  function renderNotificationsTable() {
    const tbody = document.getElementById('tbody-notifications');
    tbody.innerHTML = '';

    if (notifications.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:24px;">No system notifications logged.</td></tr>`;
      return;
    }

    notifications.forEach(n => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${n.id}</strong></td>
        <td>${escapeHtml(n.target)}</td>
        <td><strong>${escapeHtml(n.title)}</strong></td>
        <td>${escapeHtml(n.message)}</td>
        <td><span class="badge badge-${n.type.toLowerCase()}">${n.type}</span></td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl-delete" onclick="deleteNotification(${n.id})">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.deleteNotification = function(id) {
    notifications = notifications.filter(x => x.id !== id);
    saveData('notifications', notifications);
    renderNotificationsTable();
    updateSidebarCounts();
    showToast('Notification record deleted');
  };

  // BROADCAST NOTIFICATION MODAL & ACTIONS
  const btnBroadcastTop = document.getElementById('btn-broadcast-top');
  if (btnBroadcastTop) {
    btnBroadcastTop.addEventListener('click', () => {
      document.getElementById('formBroadcast').reset();
      openModal('modalBroadcast');
    });
  }

  document.getElementById('formBroadcast').addEventListener('submit', (e) => {
    e.preventDefault();
    const target = document.getElementById('bcTarget').value;
    const title = document.getElementById('bcTitle').value;
    const message = document.getElementById('bcMessage').value;
    const type = document.getElementById('bcType').value;

    const newId = notifications.length ? Math.max(...notifications.map(x => x.id)) + 1 : 1;
    notifications.unshift({ id: newId, target: target === 'ALL' ? 'All Users' : target, title, message, type });

    saveData('notifications', notifications);
    renderNotificationsTable();
    updateSidebarCounts();
    closeModal('modalBroadcast');
    showToast('Broadcast notification dispatched to ' + target);
  });

  // --- MODAL UTILITIES ---
  window.openModal = function(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('open');
  };

  window.closeModal = function(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('open');
  };

  document.querySelectorAll('.modal-close-btn, .btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      const backdrop = btn.closest('.modal-backdrop');
      if (backdrop) backdrop.classList.remove('open');
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  });

  // --- TOAST UTILITIES ---
  function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="font-size:1.1rem;">${type === 'error' ? '⚠️' : '✅'}</div>
      <div style="flex:1;">
        <div style="font-size:0.84rem;font-weight:700;">${type === 'error' ? 'Notice' : 'Success'}</div>
        <div style="font-size:0.78rem;color:#64748b;">${escapeHtml(msg)}</div>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // INITIALIZE TABLES & SIDEBAR
  renderUsersTable();
  renderCategoriesTable();
  renderListingsTable();
  renderDisputesTable();
  renderNotificationsTable();
  updateSidebarCounts();

});

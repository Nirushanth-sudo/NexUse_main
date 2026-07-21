// public/assets/JS/donation.js

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
    window.sessionPromise.then(user => {
        initDonations();
    });
});

function initDonations() {
    /*const catCheckboxes = document.querySelectorAll('#donFilterCategory input');
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
    */
    // Toggle Donation Post Button based on auth
    const loginToReqBtn = document.getElementById('donPageSignInBtn');
    const createReqBtn = document.getElementById('donPageCreateBtn');

    if (window.userSession) {
        if (loginToReqBtn) loginToReqBtn.classList.add('hidden');
        if (createReqBtn) createReqBtn.classList.remove('hidden');
    } else {
        if (loginToReqBtn) loginToReqBtn.classList.remove('hidden');
        if (createReqBtn) createReqBtn.classList.add('hidden');
    }
}

function openDonationRequestModal() {
        if (!window.userSession) {
            showToast("Access Denied", "Please sign in to request donations.", "warning");
            setTimeout(() => window.location.href = 'login.html', 1200);
            return;
        }

        const modal = document.getElementById('donationReqModal');
        modal.showModal();
}
const products = [
  {
    id: "garden-tools",
    title: "Community Garden Tool Set",
    condition: "Gently Used",
    location: "Colombo 03",
    type: "donate",
    label: "Donate",
    icon: "volunteer_activism",
    price: "Free",
    priceValue: 0,
    priceClass: "is-free",
    dateRank: 4,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YwVOoCLUGA0i8quKXZQOmzovmogNTqfqNiMmwu56DlZ5RpSylV2biuq0Hcllz6_CLaa-dST4FM8-jKigSfQYDfUot_T9Yb4WIt-5A6-qAMSrP_W7Q6wwOxgrFlQpt6XT6Qvonnt933BoBouyFQaHEOMbOp8i12U3Z1fQyeJZ5fDggARnWCSQULbilr7tX9cgIxVVnxIf8nwqB1Kq3v6HxEBnxHTVju-yCrlRxEgP2pSqHXQPB_h5",
    alt: "Community gardening tools on a wooden table outdoors"
  },
  {
    id: "solar-generator",
    title: "Eco-friendly Portable Solar Generator 500W",
    condition: "Like New",
    location: "Kandy",
    type: "resell",
    label: "Resell",
    icon: "sell",
    price: "Rs. 45,000",
    priceValue: 45000,
    priceClass: "",
    dateRank: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZQwDzOLV2Hi4jS-XXFp1vvlM38G6q-unaagjRAWOmGLI0xDLXma5pk0zCOMqByQb6dhspn8ya_DyxQ7n8PE95f1c21LHhsRzTGDstkEzLAeTGIg7907ZWiXRODBHPtGohn8ZBfaDrloyEaSAEqTgHRLidqWZz3TDpjyfgdIIH2LFA_vABERIyIS7plv7q6yGmuMeqj2WrQYEbrECE21Cvp5Js7Kqzlz6mA-5_YhrtpMckLdLHRw6E",
    alt: "Portable solar generator on a bright studio surface"
  },
  {
    id: "power-tools",
    title: "Professional Power Tool Kit",
    condition: "Good Condition",
    location: "Galle",
    type: "rent",
    label: "Rent",
    icon: "handshake",
    price: "Rs. 1,500 / day",
    priceValue: 1500,
    priceClass: "",
    dateRank: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyNh9BTPmnM5kms0VjuJPmelB1v3MyKq08g5q3dB42Vx2wBm4MxSsDcv9AZHgbgjIGvvTuTAihCO_ANjxymhps9ZgBXmATYj68EL_zXwLFEYP5xVXQBUCXa1FJG5-dLIYhHH6oBmcWrMCGnTNBRoqFnFCAdWNgzCXJLvQB1PABMtDRNVlFSzZ6apJcFR7lcQ6IfdOk9DzNOzvG2qEC57xe6iBFbBrjEunLTEo-E6FWixcorVyGz6Pz",
    alt: "Power tools arranged on a workshop bench"
  },
  {
    id: "cargo-bike",
    title: "Electric Cargo Bike",
    condition: "Excellent",
    location: "Mount Lavinia",
    type: "share",
    label: "Share",
    icon: "group",
    price: "Co-op Share",
    priceValue: 0,
    priceClass: "is-share",
    dateRank: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCovWdM8jNUPJg56WjoFDUll0T5E-evFrNxLfGCch6vmuyTWnPsxGdlMkSLRHANxFumxwes2ZtXg2Fhf9DFEJWv_uvrWemFAYmc2q3B_MwizGq-F5vx3ZP36N6uIovqBm-T-oVSDIa_kgXedW-qxF0vICivNLwa_T6N3tnbHS1GbqLA-s0CUV6gn2AAj7zvByVEd1XYtd_AWyVMu8qli7KZVwvP7EuF1HqVj96VfFP9yn8f_uYvGgC7",
    alt: "Electric cargo bike parked near a clean concrete wall"
  }
];

const fallbackImage =
  "https://lh3.googleusercontent.com/aida/AP1WRLurtcd6yRUe4y4q384YAKfuL0HZUBVQYgtq39MlYQiqlfFHQxSCM0l9TUjyBNvReEPukZPDM9qeAJBuNnUX13uVPQjps_SGZ6I_LObnMNwZz1vdPXpOZrz8hWRS0oEUxPLxvEF8tnr5JGXmJ5QhbbTLJtrVxxf1166aysrSqvn37AXZYDTtkEEBP6DYP_AEbc-T4Ti6weVWEtg4VHtfAfWGFThXuh8yieIFIDs4Yg7PSVtz6cipFudFC-o";

const productGrid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const filterButtons = document.querySelectorAll("[data-filter]");
const viewButtons = document.querySelectorAll("[data-view]");
const clearFiltersButton = document.querySelector("#clearFiltersButton");
const listItemButton = document.querySelector("#listItemButton");
const listModal = document.querySelector("#listModal");
const closeModalButton = document.querySelector("#closeModalButton");
const listingForm = document.querySelector("#listingForm");
const menuButton = document.querySelector("#menuButton");
const mobileNav = document.querySelector("#mobileNav");
const toast = document.querySelector("#toast");

const state = {
  activeFilter: "all",
  query: "",
  sort: "featured",
  view: "grid",
  saved: new Set()
};

function getVisibleProducts() {
  const query = state.query.trim().toLowerCase();

  const visible = products.filter((product) => {
    const matchesFilter = state.activeFilter === "all" || product.type === state.activeFilter;
    const searchable = `${product.title} ${product.condition} ${product.location} ${product.label}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });

  return visible.sort((a, b) => {
    if (state.sort === "price-low") return a.priceValue - b.priceValue;
    if (state.sort === "price-high") return b.priceValue - a.priceValue;
    if (state.sort === "newest") return b.dateRank - a.dateRank;
    return b.dateRank - a.dateRank;
  });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.classList.toggle("is-list", state.view === "list");

  resultCount.textContent = `${visibleProducts.length} resource${visibleProducts.length === 1 ? "" : "s"} available`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>No resources found</h3>
        <p>Try a different search or choose another exchange type.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product) => {
    const isSaved = state.saved.has(product.id);

    return `
      <article class="product-card">
        <span class="badge badge--${product.type}">
          <span class="material-symbols-outlined" aria-hidden="true">${product.icon}</span>
          ${product.label}
        </span>
        <div class="product-card__image">
          <img src="${product.image}" alt="${product.alt}" loading="lazy">
        </div>
        <div class="product-card__body">
          <h3>${product.title}</h3>
          <p class="product-card__meta">${product.condition} &bull; ${product.location}</p>
          <div class="product-card__footer">
            <span class="product-card__price ${product.priceClass}">${product.price}</span>
            <button class="icon-button bookmark" type="button" data-bookmark="${product.id}" aria-label="${isSaved ? "Remove bookmark" : "Save listing"}" aria-pressed="${isSaved}">
              <span class="material-symbols-outlined" aria-hidden="true">${isSaved ? "bookmark" : "bookmark_border"}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setActiveFilter(nextFilter) {
  state.activeFilter = nextFilter;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === nextFilter;
    button.classList.toggle("is-active", isActive);

    if (isActive && !button.querySelector(".material-symbols-outlined")) {
      button.insertAdjacentHTML("afterbegin", '<span class="material-symbols-outlined" aria-hidden="true">check</span>');
    }
  });

  renderProducts();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function openListingModal() {
  if (typeof listModal.showModal === "function") {
    listModal.showModal();
    document.body.classList.add("modal-open");
  } else {
    showToast("Your browser does not support this dialog.");
  }
}

function closeListingModal() {
  listModal.close();
  document.body.classList.remove("modal-open");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
  });
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    viewButtons.forEach((viewButton) => viewButton.classList.toggle("is-active", viewButton === button));
    renderProducts();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  sortSelect.value = "featured";
  state.query = "";
  state.sort = "featured";
  setActiveFilter("all");
});

productGrid.addEventListener("click", (event) => {
  const bookmarkButton = event.target.closest("[data-bookmark]");
  if (!bookmarkButton) return;

  const productId = bookmarkButton.dataset.bookmark;
  if (state.saved.has(productId)) {
    state.saved.delete(productId);
    showToast("Removed from saved listings");
  } else {
    state.saved.add(productId);
    showToast("Saved listing");
  }

  renderProducts();
});

document.querySelectorAll("[data-scroll-to-filters]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#filters").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

document.querySelectorAll("[data-nav-link]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll("[data-nav-link]").forEach((navLink) => navLink.classList.remove("is-active"));
    document.querySelectorAll(`[href="${link.getAttribute("href")}"]`).forEach((matchingLink) => matchingLink.classList.add("is-active"));
    mobileNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

listItemButton.addEventListener("click", openListingModal);
closeModalButton.addEventListener("click", closeListingModal);

listModal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
});

listingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(listingForm);
  const type = formData.get("type");

  products.unshift({
    id: `custom-${Date.now()}`,
    title: formData.get("title"),
    condition: "New Listing",
    location: formData.get("location"),
    type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    icon: type === "donate" ? "volunteer_activism" : type === "resell" ? "sell" : type === "rent" ? "handshake" : "group",
    price: formData.get("price"),
    priceValue: Number(String(formData.get("price")).replace(/[^0-9]/g, "")) || 0,
    priceClass: /free/i.test(formData.get("price")) ? "is-free" : type === "share" ? "is-share" : "",
    dateRank: Date.now(),
    image: fallbackImage,
    alt: "Newly listed circular marketplace resource"
  });

  listingForm.reset();
  closeListingModal();
  setActiveFilter("all");
  showToast("Listing added to the marketplace");
});

document.querySelector("#howItWorksButton").addEventListener("click", () => {
  showToast("Search, choose an exchange type, then save or list resources.");
});

renderProducts();

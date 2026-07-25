// ==========================================
// 1. PRODUCT DATA
// ==========================================
const products = [
    { id: 1, category: "Sun Screen", title: "Hyalu-Cica", subtitle: "Water-Fit Sun Serum SPF50+ PA++++", price: "$22.00", rating: 4, image: "product1.jpg" },
    { id: 2, category: "Sun Screen", title: "Madagascar", subtitle: "Centella Air-Fit Suncream Light SPF 30 PA++++", price: "$18.00", rating: 4, image: "product2.jpg" },
    { id: 3, category: "Sun Screen", title: "Madagascar", subtitle: "Centella Tone Brightening Tone-Up Sunscreen SPF50+ PA++++", price: "$22.00", rating: 0, image: "product3.jpg" },
    { id: 4, category: "Cleanser", title: "Madagascar", subtitle: "Centella Tea-Trica Foam Cleanser", price: "$16.00", rating: 0, image: "product4.jpg" },
    { id: 5, category: "Cleanser", title: "Madagascar", subtitle: "Centella Poremizing Deep Cleansing Foam", price: "$17.00", rating: 4, image: "product5.jpg" },
    { id: 6, category: "Cleanser", title: "Madagascar", subtitle: "Centella Ampoule Foam", price: "$15.00", rating: 0, image: "product6.jpg" },
    { id: 7, category: "Toner", title: "Madagascar", subtitle: "Centella Toning Toner", price: "$21.00", rating: 4, image: "product7.jpg" },
    { id: 8, category: "Toner", title: "Madagascar", subtitle: "Centella Tone Brightening Boosting Toner", price: "$19.00", rating: 0, image: "product8.jpg" },
    { id: 9, category: "Toner", title: "Madagascar", subtitle: "Centella Probio-Cica Essence Toner", price: "$20.00", rating: 0, image: "product9.jpg" },
    { id: 10, category: "Cream", title: "Madagascar", subtitle: "Centella Tone Brightening Capsule Cream", price: "$24.00", rating: 0, image: "product10.jpg" },
    { id: 11, category: "Cream", title: "Madagascar", subtitle: "Centella Probio-Cica Enrich Cream", price: "$25.00", rating: 4, image: "product11.jpg" },
    { id: 12, category: "Cream", title: "Madagascar", subtitle: "Centella Soothing Cream", price: "$24.00", rating: 0, image: "product12.jpg" },
    { id: 13, category: "Ampoule", title: "Madagascar", subtitle: "Centella Tone Brightening Capsule Ampoule", price: "$25.00", rating: 4, image: "product13.jpg" },
    { id: 14, category: "Ampoule", title: "Madagascar", subtitle: "Centella Ampoule", price: "$22.00", rating: 0, image: "product14.jpg" },
    { id: 15, category: "Ampoule", title: "Madagascar", subtitle: "Tea-Trica Relief Ampoule", price: "$20.00", rating: 0, image: "product15.jpg" }
];

let currentCategory = 'All';

// ==========================================
// 2. AUTHENTICATION LOGIC (WITH PASSWORD & REMEMBER ME)
// ==========================================
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser"));
}

function checkAuthRequirement() {
    const user = getCurrentUser();
    if (!user) {
        const authModalEl = document.getElementById('authModal');
        if (authModalEl) {
            alert('Please Log In or Sign Up first to continue shopping!');
            const modal = bootstrap.Modal.getOrCreateInstance(authModalEl);
            modal.show();
        }
        return false;
    }
    return true;
}

function handleSignUp(e) {
    e.preventDefault();
    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    
    const name = nameInput ? nameInput.value.trim() : 'User';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    const userData = { name: name, email: email, password: password };

    localStorage.setItem("registeredUser", JSON.stringify(userData));
    localStorage.setItem("currentUser", JSON.stringify(userData));

    alert(`Signed up successfully! Welcome, ${name}`);
    closeAuthModal();
    updateUserUI();
}

function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginAlert = document.getElementById('loginAlert');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!registeredUser || registeredUser.email !== email || registeredUser.password !== password) {
        if (loginAlert) {
            loginAlert.classList.remove('d-none');
            loginAlert.innerText = "Invalid email or password! Please check again.";
        }
        return;
    }

    if (loginAlert) loginAlert.classList.add('d-none');

    const user = { name: registeredUser.name, email: email };

    if (rememberMe) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        sessionStorage.removeItem("currentUser");
    } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.removeItem("currentUser");
    }

    alert(`Logged in successfully! Welcome back, ${user.name}`);
    closeAuthModal();
    updateUserUI();
}

function handleForgot(e) {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!email || !registeredUser || registeredUser.email !== email) {
        alert("Please enter your registered Email address in the email field first, then click 'Forgot password?'.");
        return;
    }

    alert(`Password recovery instructions have been sent to: ${email}\nYour current password is: ${registeredUser.password}`);
}

function handleLogout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        alert("Logged out successfully!");
        location.reload();
    }
}

function closeAuthModal() {
    const authModalEl = document.getElementById('authModal');
    if (authModalEl) {
        const modal = bootstrap.Modal.getInstance(authModalEl);
        if (modal) modal.hide();
    }
}

function updateUserUI() {
    const user = getCurrentUser();
    const userIcons = document.querySelectorAll('#userAccountBtn, [data-bs-target="#authModal"]');
    
    userIcons.forEach(icon => {
        if (user) {
            icon.removeAttribute('data-bs-target');
            icon.setAttribute('title', `Logged in as ${user.name} (Click to Logout)`);
            icon.onclick = handleLogout;
            icon.innerHTML = `<i class="bi bi-person-check-fill fs-5 text-success"></i>`;
        } else {
            icon.setAttribute('data-bs-target', '#authModal');
            icon.onclick = null;
            icon.innerHTML = `<i class="bi bi-person fs-5"></i>`;
        }
    });
}

function initAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleSignUp);

    const forgotBtn = document.getElementById('forgotPasswordLink');
    if (forgotBtn) forgotBtn.addEventListener('click', handleForgot);

    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
    const loginEmailInput = document.getElementById('loginEmail');
    const rememberMeBox = document.getElementById('rememberMe');
    if (savedUser && loginEmailInput && localStorage.getItem("currentUser")) {
        loginEmailInput.value = savedUser.email;
        if (rememberMeBox) rememberMeBox.checked = true;
    }
}

// ==========================================
// 3. FILTER & SEARCH LOGIC
// ==========================================
function filterCategory(category) {
    currentCategory = category;
    
    const buttons = document.querySelectorAll('#filterPills .filter-btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === category.toLowerCase()) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    applyFilters();
}

function handleSearch() {
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filtered = products.filter(product => {
        const matchesCategory = (currentCategory === 'All') || (product.category.toLowerCase() === currentCategory.toLowerCase());
        const matchesSearch = product.title.toLowerCase().includes(query) || product.subtitle.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    renderProductsGrid(filtered);
}

// ==========================================
// 4. HELPER FUNCTIONS
// ==========================================
function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(String(priceStr).replace(/[^0-9.-]+/g, "")) || 0;
}

function getCart() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cartItems", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach(badge => badge.textContent = totalItems);
}

// ==========================================
// 5. CART OPERATIONS
// ==========================================
function addToCart(productId, qty = 1) {
    if (!checkAuthRequirement()) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }

    saveCart(cart);
    alert(`Added "${product.title} - ${product.subtitle}" to cart!`);
}

// កែសម្រួលឱ្យមុខងារ Add to Cart នៅលើទំព័រ Detail ដំណើរការយកចំនួន Qty ពី Input មកគណនានាបញ្ចូលគ្នា
function handleAddToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const qtyInput = document.getElementById('detailQty');
    const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

    if (!productId) {
        alert("Product not found!");
        return;
    }

    addToCart(productId, qty);
}

function updateQuantity(index, change) {
    let cart = getCart();
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart(cart);
    renderCartPage();
}

function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartPage();
}

// ==========================================
// 6. RENDER FUNCTIONS
// ==========================================
function renderProductsGrid(items) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">No products found!</p></div>`;
        return;
    }

    grid.innerHTML = items.map(product => `
        <div class="col-12 col-md-4">
            <div class="product-card">
                <div>
                    <div class="product-img-box">
                        <img src="${product.image}" alt="${product.subtitle}">
                    </div>
                    <h5 class="product-title">${product.title}</h5>
                    <p class="product-subtitle">${product.subtitle}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="product-price">${product.price}</span>
                        <div class="star-rating">
                            ${product.rating > 0 ? '★'.repeat(product.rating) : ''}
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <a href="pro-detail.html?id=${product.id}" class="btn btn-sage-sm flex-fill text-center text-decoration-none">Detail</a>
                    <button type="button" class="btn btn-outline-custom flex-fill" onclick="addToCart(${product.id})">Add to cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCartPage() {
    const cartTableBody = document.getElementById("cartTableBody");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartTableBody) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-5">
                    <p class="text-muted fs-5 mb-3">Your shopping cart is empty</p>
                    <a href="products.html" class="btn btn-sm btn-outline-dark">Explore Products</a>
                </td>
            </tr>
        `;
        if (cartSubtotal) cartSubtotal.innerText = "$0.00";
        if (cartTotal) cartTotal.innerText = "$0.00";
        return;
    }

    let html = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        const priceNum = parsePrice(item.price);
        const itemTotal = priceNum * item.quantity;
        subtotal += itemTotal;

        html += `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <div class="product-img-box" style="width: 60px;">
                            <img src="${item.image}" alt="${item.title}" class="img-fluid rounded">
                        </div>
                        <div>
                            <span class="product-name d-block fw-medium">${item.title}</span>
                            <small class="text-muted d-block">${item.subtitle}</small>
                            <button onclick="removeItem(${index})" class="btn btn-link text-danger p-0 border-0 mt-1 small" style="font-size: 0.8rem; text-decoration: none;">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </td>
                <td class="text-center price-text fw-bold">$${priceNum.toFixed(2)}</td>
                <td class="text-center">
                    <div class="qty-btn-group d-inline-flex align-items-center border px-2 py-1 rounded">
                        <button onclick="updateQuantity(${index}, -1)" class="btn btn-sm p-0 me-2 border-0 fw-bold">-</button>
                        <span class="px-2">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="btn btn-sm p-0 ms-2 border-0 fw-bold">+</button>
                    </div>
                </td>
                <td class="text-end fw-bold fs-5">$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    cartTableBody.innerHTML = html;
    if (cartSubtotal) cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
    if (cartTotal) cartTotal.innerText = `$${subtotal.toFixed(2)}`;
}

// ==========================================
// 7. PRODUCT DETAIL PAGE LOGIC
// ==========================================
function changeQty(amount) {
    const qtyInput = document.getElementById('detailQty');
    if (!qtyInput) return;
    
    let currentQty = parseInt(qtyInput.value) || 1;
    currentQty += amount;
    
    if (currentQty < 1) currentQty = 1;
    qtyInput.value = currentQty;
}

function updatePageSEO(product) {
    document.title = `${product.title} - ${product.subtitle} | ML SKIN 1004`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = `Buy ${product.title} ${product.subtitle} for ${product.price}. High-quality skincare products from ML SKIN 1004.`;
}

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    if (!productId) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const imgEl = document.getElementById('detailImg');
    const titleEl = document.getElementById('detailTitle');
    const subEl = document.getElementById('detailSub');
    const priceEl = document.getElementById('detailPrice');

    if (imgEl) imgEl.src = product.image;
    if (titleEl) titleEl.innerText = product.title;
    if (subEl) subEl.innerText = product.subtitle;
    if (priceEl) priceEl.innerText = product.price;

    updatePageSEO(product);
}

// ==========================================
// 8. KHQR PAYMENT & CHECKOUT LOGIC
// ==========================================
function loadKHQRAmount() {
    const qrTotalAmountEl = document.getElementById("qrTotalAmount");
    const khqrImageEl = document.getElementById("khqrImage");
    
    if (!qrTotalAmountEl) return;

    const cart = getCart();
    let subtotal = 0;

    cart.forEach(item => {
        const priceNum = parsePrice(item.price);
        subtotal += priceNum * (item.quantity || 1);
    });

    qrTotalAmountEl.innerText = `$${subtotal.toFixed(2)}`;

    if (khqrImageEl) {
        const qrData = `MLSKIN1004_PAYMENT_TOTAL_$${subtotal.toFixed(2)}`;
        khqrImageEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;
    }
}

function confirmPayment() {
    const cart = getCart();
    
    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        window.location.href = "products.html";
        return;
    }

    alert("Payment confirmed successfully! Thank you for shopping with ML SKIN 1004.");
    window.location.href = "invoice.html";
}

// ==========================================
// 9. INVOICE PAGE RENDER LOGIC
// ==========================================
function renderInvoicePage() {
    const invoiceTableBody = document.getElementById("invoiceTableBody");
    const invoiceTotalEl = document.getElementById("invoiceTotal");
    const invoiceNumberEl = document.getElementById("invoiceNumber");
    const invoiceDateEl = document.getElementById("invoiceDate");

    if (!invoiceTableBody) return;

    const cart = getCart();

    if (invoiceNumberEl) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        invoiceNumberEl.innerText = `#INV-2026-${randomNum}`;
    }

    if (invoiceDateEl) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        invoiceDateEl.innerText = new Date().toLocaleDateString('en-US', options);
    }

    if (cart.length === 0) {
        invoiceTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4 text-muted">
                    No recent order details found.
                </td>
            </tr>
        `;
        if (invoiceTotalEl) invoiceTotalEl.innerText = "$0.00";
        return;
    }

    let html = "";
    let grandTotal = 0;

    cart.forEach(item => {
        const priceNum = parsePrice(item.price);
        const itemTotal = priceNum * (item.quantity || 1);
        grandTotal += itemTotal;

        html += `
            <tr>
                <td>
                    <span class="fw-medium text-dark d-block">${item.title}</span>
                    <small class="text-muted">${item.subtitle || ''}</small>
                </td>
                <td class="text-center fw-medium">${item.quantity || 1}</td>
                <td class="text-end fw-bold">$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    invoiceTableBody.innerHTML = html;
    if (invoiceTotalEl) invoiceTotalEl.innerText = `$${grandTotal.toFixed(2)}`;

    clearCartAfterOrder();
}

function clearCartAfterOrder() {
    localStorage.removeItem("cartItems");
    updateCartCount();
}

// ==========================================
// 10. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initAuthListeners();
    renderProductsGrid(products);
    renderCartPage();
    loadProductDetail();
    loadKHQRAmount();
    renderInvoicePage();
    updateCartCount();
    updateUserUI();
});
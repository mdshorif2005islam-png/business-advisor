// ===== STATE =====
let currentProperties = [];
let currentPage = 1;
const perPage = 6;
let wishlist = [];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadProperties();
    await checkAuth();
    loadAgents();
});

// ===== LOAD PROPERTIES =====
async function loadProperties(filters = {}) {
    try {
        const result = await api.getProperties(filters);
        if (result.success) {
            currentProperties = result.data;
            render(currentProperties);
            document.getElementById('totalListings').textContent = result.count || 0;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// ===== CHECK AUTH =====
async function checkAuth() {
    const token = storage.getToken();
    if (token) {
        try {
            const result = await api.getMe(token);
            if (result.success) {
                storage.setUser(result.user);
                showUserProfile(result.user);
            }
        } catch (e) {
            storage.removeToken();
            storage.removeUser();
        }
    }
}

// ===== RENDER =====
function render(list = currentProperties, page = currentPage) {
    const grid = document.getElementById('listingGrid');
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageItems = list.slice(start, end);

    if (pageItems.length === 0 && page > 1) {
        currentPage = page - 1;
        return render(list, currentPage);
    }

    grid.innerHTML = pageItems.map(p => `
        <article class="card" onclick="showPropertyDetail('${p._id}')">
            <div class="photo" style="background-image:url('${p.images?.[0] || 'https://via.placeholder.com/400x200'}')">
                <span class="badge">${p.status === 'rent' ? 'FOR RENT' : 'FOR SALE'}</span>
                <button class="heart" onclick="event.stopPropagation();toggleWishlist('${p._id}')">
                    ${wishlist.includes(p._id) ? '♥' : '♡'}
                </button>
            </div>
            <div class="card-body">
                <div class="price">${money(p.price)}${p.status === 'rent' ? ' <small>/ month</small>' : ''}</div>
                <div class="title">${p.title}</div>
                <div class="meta">${p.meta || `${p.bedrooms || 0} Beds`}</div>
                <div class="location-text"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>
                <div class="seller">${p.verified ? '<span class="verified"><i class="fas fa-check-circle"></i> Verified</span>' : 'Owner / Agent'}</div>
            </div>
        </article>
    `).join('');

    renderPagination(list.length);
    document.getElementById('resultCount').textContent = `${list.length} results`;
}

// ===== PAGINATION =====
function renderPagination(total) {
    const totalPages = Math.ceil(total / perPage);
    const container = document.getElementById('pagination');
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    let html = `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span>…</span>`;
        }
    }
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
    container.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(currentProperties.length / perPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    render(currentProperties, currentPage);
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
}

// ===== HELPERS =====
function money(n) { return '৳ ' + n.toLocaleString('en-BD'); }

// ===== FILTERS =====
async function filterProperties() {
    const city = document.getElementById('location').value;
    const type = document.getElementById('type').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const status = document.querySelector('.tab.active')?.dataset.mode || 'buy';

    const filters = {};
    if (city) filters.city = city;
    if (type) filters.type = type;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (status !== 'buy') filters.status = status === 'rent' ? 'rent' : undefined;

    await loadProperties(filters);
}

function resetFilters() {
    document.getElementById('location').value = '';
    document.getElementById('type').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    loadProperties();
}

function sortProperties() {
    const s = document.getElementById('sort').value;
    currentProperties.sort((a, b) => s === 'low' ? a.price - b.price : s === 'high' ? b.price - a.price : b.id - a.id);
    render(currentProperties, currentPage);
}

// ===== AUTH =====
function openAuthModal(mode) {
    document.getElementById('authModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('open');
    document.body.style.overflow = '';
}

async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
        const result = await api.login({ email, password });
        if (result.success) {
            storage.setToken(result.token);
            storage.setUser(result.user);
            showUserProfile(result.user);
            closeAuthModal();
            alert('✅ Login successful!');
        } else {
            alert('❌ ' + result.message);
        }
    } catch (error) {
        alert('❌ Something went wrong!');
    }
}

function showUserProfile(user) {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('userName').textContent = user.fullName || user.email.split('@')[0];
}

function logoutUser() {
    storage.removeToken();
    storage.removeUser();
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userProfile').style.display = 'none';
    document.getElementById('profileDropdown').classList.remove('open');
    alert('Logged out!');
}

function toggleProfileMenu() {
    document.getElementById('profileDropdown').classList.toggle('open');
}

function toggleAuthMode() {
    const title = document.getElementById('authTitle');
    const btn = document.getElementById('authSubmitBtn');
    const toggle = document.getElementById('authToggle');
    const fields = document.getElementById('signupFields');

    if (title.textContent.includes('Login')) {
        title.innerHTML = '<i class="fas fa-user-plus" style="color:#ff5a1f;"></i> Sign Up';
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        toggle.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>';
        fields.style.display = 'block';
    } else {
        title.innerHTML = '<i class="fas fa-user-circle" style="color:#ff5a1f;"></i> Login';
        btn.innerHTML = '<i class="fas fa-arrow-right"></i> Login';
        toggle.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign Up</a>';
        fields.style.display = 'none';
    }
}

// ===== POST PROPERTY =====
function openPostModal() {
    const token = storage.getToken();
    if (!token) { alert('Please login first!'); return; }
    document.getElementById('postModal').classList.add('open');
}

function closePostModal() {
    document.getElementById('postModal').classList.remove('open');
}

async function postProperty(e) {
    e.preventDefault();
    const token = storage.getToken();
    if (!token) { alert('Please login first!'); return; }

    const data = {
        title: document.getElementById('propertyTitle').value,
        type: document.getElementById('propertyType').value,
        location: document.getElementById('propertyLocation').value,
        price: Number(document.getElementById('propertyPrice').value),
        meta: document.getElementById('propertyMeta').value,
        status: document.getElementById('propertyStatus').value,
        city: document.getElementById('propertyLocation').value.split(',')[0] || 'Dhaka'
    };

    try {
        const result = await api.createProperty(data, token);
        if (result.success) {
            alert('✅ Property posted successfully!');
            closePostModal();
            document.getElementById('postPropertyForm').reset();
            await loadProperties();
        } else {
            alert('❌ ' + result.message);
        }
    } catch (error) {
        alert('❌ Something went wrong!');
    }
}

// ===== DETAIL =====
async function showPropertyDetail(id) {
    try {
        const result = await api.getProperty(id);
        if (result.success) {
            const p = result.data;
            document.getElementById('detailImage').style.backgroundImage = `url(${p.images?.[0] || 'https://via.placeholder.com/600x300'})`;
            document.getElementById('detailTitle').textContent = p.title;
            document.getElementById('detailPrice').textContent = `${money(p.price)}${p.status === 'rent' ? ' / month' : ''}`;
            document.getElementById('detailMeta').textContent = p.meta || `${p.bedrooms || 0} Beds • ${p.bathrooms || 0} Baths`;
            document.getElementById('detailLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${p.location}`;
            document.getElementById('detailModal').classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        alert('Error loading property details');
    }
}

function closeDetail() {
    document.getElementById('detailModal').classList.remove('open');
    document.body.style.overflow = '';
}

function shareProperty() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Property', url });
    } else {
        navigator.clipboard?.writeText(url).then(() => alert('📋 Copied!'));
    }
}

function contactAgent() {
    window.open('https://wa.me/88017XXXXXXXX', '_blank');
}

// ===== FAVORITE =====
async function toggleWishlist(id) {
    const token = storage.getToken();
    if (!token) { alert('Please login first!'); return; }
    try {
        const result = await api.toggleFavorite(id, token);
        if (result.success) {
            wishlist.includes(id) ? wishlist = wishlist.filter(i => i !== id) : wishlist.push(id);
            render(currentProperties, currentPage);
        }
    } catch (error) {
        alert('❌ Something went wrong!');
    }
}

// ===== DARK MODE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    const icon = document.querySelector('.theme-toggle-btn i');
    icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelector('.theme-toggle-btn i').className = 'fas fa-sun';
}

// ===== AGENTS =====
function loadAgents() {
    const agents = [
        { name: 'Md. Rahman', rating: '4.9', reviews: '128' },
        { name: 'Mrs. Akhter', rating: '4.8', reviews: '96' },
        { name: 'Mr. Islam', rating: '4.7', reviews: '84' }
    ];
    document.getElementById('agentsGrid').innerHTML = agents.map(a => `
        <div class="agent-card">
            <div class="agent-avatar"><i class="fas fa-user-circle"></i></div>
            <div>
                <b>${a.name}</b>
                <small><i class="fas fa-star" style="color:#f59e0b;"></i> ${a.rating} (${a.reviews} reviews)</small>
                <span><i class="fas fa-check-circle" style="color:#1d9b67;"></i> Verified</span>
            </div>
        </div>
    `).join('');
}

// ===== TABS =====
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterProperties();
    });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
    }
});

// ===== CLICK OUTSIDE =====
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
});
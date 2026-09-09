// ==========================================
// BANCO DE DADOS SIMULADO DE PRODUTOS
// ==========================================
const products = [
    {
        id: 1,
        title: "Camiseta Oversized Nego Trap 'Purple Haze'",
        brand: "NEGO TRAP",
        category: "camisetas",
        price: 189.90,
        badge: "NOVO DROP",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Moletom Hoodie Trapstar Irongate Black",
        brand: "TRAPSTAR",
        category: "hoodies",
        price: 549.90,
        badge: "RARE",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Calça Cargo Tactical Cyberpunk Black",
        brand: "NEGO TRAP",
        category: "calcas",
        price: 299.90,
        badge: "BEST SELLER",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Corrente Cubana Iced Out 15mm Silver",
        brand: "NEGO TRAP",
        category: "acessorios",
        price: 159.90,
        badge: "ICED OUT",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Camiseta Off-White Industrial Arrow",
        brand: "OFF-WHITE",
        category: "camisetas",
        price: 420.00,
        badge: "HYPEX",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Jaqueta Windbreaker Bape Shark Head",
        brand: "BAPE",
        category: "hoodies",
        price: 890.00,
        badge: "EXCLUSIVO",
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 7,
        title: "Touca Balaclava Tactical Streetwear",
        brand: "CORTEIZ",
        category: "acessorios",
        price: 119.90,
        badge: "HOT",
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 8,
        title: "Camiseta Boxy Fit Heavyweight Graphic",
        brand: "NEGO TRAP",
        category: "camisetas",
        price: 179.90,
        badge: "DROP LIMITADO",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop"
    }
];

// Estado do Carrinho
let cart = [];
let activeCategory = 'all';
let activeBrand = 'all';

// ==========================================
// RENDERIZAÇÃO DE PRODUTOS
// ==========================================
function renderProducts() {
    const grid = document.getElementById('productGrid');
    
    // Filtragem por Categoria e Marca simultaneamente
    const filtered = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesBrand = activeBrand === 'all' || product.brand.toUpperCase() === activeBrand.toUpperCase();
        return matchesCategory && matchesBrand;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">Nenhum produto encontrado para este filtro.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <span class="product-badge">${p.badge}</span>
            <img src="${p.image}" alt="${p.title}" class="product-img">
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <h3 class="product-title">${p.title}</h3>
                <div class="product-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
                <button class="btn-add-cart" onclick="addToCart(${p.id})">Adicionar ao Drop</button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// GERENCIAMENTO DO CARRINHO
// ==========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    toggleCart(true); // Abre o carrinho automaticamente
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const cartCountHeader = document.getElementById('cartCountHeader');
    const cartTotalValue = document.getElementById('cartTotalValue');

    // Atualiza contadores
    const totalItems = cart.reduce((sum, item) => sum += item.quantity, 0);
    cartBadge.innerText = totalItems;
    cartCountHeader.innerText = totalItems;

    // Renderiza itens no carrinho
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; color: var(--text-gray); margin-top:20px;">Seu carrinho está vazio.</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remover</button>
                </div>
            </div>
        `).join('');
    }

    // Calcula Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalValue.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Controle de Abertura/Fechamento da Sidebar do Carrinho
function toggleCart(open = null) {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    if (open === true) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    } else if (open === false) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// ==========================================
// EVENTOS E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza inicial
    renderProducts();

    // Eventos do Carrinho
    document.getElementById('cartBtn').addEventListener('click', () => toggleCart(true));
    document.getElementById('closeCartBtn').addEventListener('click', () => toggleCart(false));
    document.getElementById('cartOverlay').addEventListener('click', () => toggleCart(false));

    // Filtro de Categorias
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.getAttribute('data-category');
            renderProducts();
        });
    });

    // Filtro de Marcas
    document.querySelectorAll('.brand-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.brand-item').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeBrand = e.target.getAttribute('data-brand');
            renderProducts();
        });
    });
});

function scrollToProducts() {
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}

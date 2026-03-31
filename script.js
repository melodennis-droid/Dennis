// Tema
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
    document.body.classList.toggle('light-mode');
    themeToggle.innerText = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
};

// --- LÓGICA DO MODAL DE CADASTRO ---
const userToggle = document.getElementById('userToggle');
const registerModal = document.getElementById('registerModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const registerForm = document.getElementById('registerForm');

userToggle.onclick = () => {
    registerModal.classList.add('open');
};

closeRegisterModal.onclick = () => {
    registerModal.classList.remove('open');
};

window.onclick = (event) => {
    if (event.target === registerModal) {
        registerModal.classList.remove('open');
    }
};

registerForm.onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('regName').value;
    alert(`Conta criada com sucesso!\nBem-vindo(a), ${nome}!`);
    registerModal.classList.remove('open');
    registerForm.reset(); 
};

// Abas
const tabs = document.querySelectorAll('.tab-btn');
const searchContainer = document.getElementById('searchContainer');
const productGrid = document.getElementById('productGrid');

tabs.forEach(tab => {
    tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if(tab.dataset.category === 'montar-look') {
            searchContainer.style.display = 'none';
            productGrid.style.display = 'none';
            document.querySelector('.montar-look-container').classList.add('active');
        } else {
            searchContainer.style.display = 'block';
            productGrid.style.display = 'grid';
            document.querySelector('.montar-look-container').classList.remove('active');
            
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            document.querySelectorAll(`.category.${tab.dataset.category}`).forEach(c => c.classList.add('active'));
        }
    };
});

// Carrinho
let cart = [];
const sidebar = document.getElementById('cartSidebar');
const itemsContainer = document.getElementById('cartItems');

document.getElementById('cartToggle').onclick = () => sidebar.classList.add('open');

function addToCart(name, price, url) {
    cart.push({ name, price, url });
    updateCart();
    sidebar.classList.add('open');
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.onclick = (e) => {
        const card = e.target.closest('.product-card');
        addToCart(card.dataset.name, parseFloat(card.dataset.price), card.dataset.url);
    };
});

function updateCart() {
    itemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, i) => {
        total += item.price;
        itemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="cart-item-actions">
                    <a href="${item.url}" target="_blank" class="cart-buy-link">Comprar Item</a>
                    <button onclick="removeFromCart(${i})" style="color:red; background:none; border:none; cursor:pointer; font-size:13px; font-weight: bold;">Remover</button>
                </div>
            </div>`;
    });
    document.getElementById('cartCount').innerText = cart.length;
    document.getElementById('cartTotal').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

window.removeFromCart = (i) => {
    cart.splice(i, 1);
    updateCart();
};

// --- LÓGICA DO MONTADOR DE LOOKS ---
let lookItems = [];
const lookCanvas = document.getElementById('lookCanvas');
const emptyLookMsg = document.getElementById('emptyLookMsg');
const lookTotalText = document.getElementById('lookTotal');
const buyLookBtn = document.getElementById('buyLookBtn');

document.querySelectorAll('.add-to-look').forEach(btn => {
    btn.onclick = (e) => {
        const card = e.target.closest('.product-card');
        const itemInfo = {
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            url: card.dataset.url,
            img: card.querySelector('img').src
        };
        
        const alreadyInLook = lookItems.some(item => item.name === itemInfo.name);
        if(!alreadyInLook) {
            lookItems.push(itemInfo);
            updateLook();
            
            const originalText = btn.innerText;
            btn.innerText = "✅ Adicionado";
            btn.style.backgroundColor = "var(--accent-color)";
            btn.style.color = "white";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "transparent";
                btn.style.color = "var(--text-color)";
            }, 1500);
        } else {
            alert("Esta peça já está no seu look!");
        }
    };
});

function updateLook() {
    lookCanvas.innerHTML = '';
    let total = 0;

    if (lookItems.length === 0) {
        lookCanvas.appendChild(emptyLookMsg);
        emptyLookMsg.style.display = 'block';
        buyLookBtn.style.display = 'none';
    } else {
        emptyLookMsg.style.display = 'none';
        buyLookBtn.style.display = 'block';

        lookItems.forEach((item, i) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'look-item';
            div.innerHTML = `
                <button class="remove-look-btn" onclick="removeFromLook(${i})">&times;</button>
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name}</span>
            `;
            lookCanvas.appendChild(div);
        });
    }
    lookTotalText.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

window.removeFromLook = (i) => {
    lookItems.splice(i, 1);
    updateLook();
};

buyLookBtn.onclick = () => {
    lookItems.forEach(item => {
        cart.push({ name: item.name, price: item.price, url: item.url });
    });
    updateCart();
    sidebar.classList.add('open');
    alert("Look completo adicionado ao carrinho!");
};

// Busca
document.getElementById('searchInput').oninput = (e) => {
    const val = e.target.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(val) ? "flex" : "none";
    });
};
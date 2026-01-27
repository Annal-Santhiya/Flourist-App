// =================== PRODUCTS DATA ===================
const products = [
    {
        id: 1,
        name: "Dazzling Bouquet",
        price: 79.99,
        category: "romantic",
        image: "Img1.jpg",
        description: "A timeless arrangement of red roses and white lilies",
        popular: true
    },
    {
        id: 2,
        name: "Joyful Birthday Blooms",
        price: 65.50,
        category: "birthday",
        image: "Img7.jpg",
        description: "Bright and cheerful mix of seasonal flowers",
        popular: true
    },
    {
        id: 3,
        name: "Bridal Bliss Bouquet",
        price: 125.00,
        category: "wedding",
        image: "Img8.jpg",
        description: "Elegant white roses and peonies for the special day",
        popular: false
    },
    {
        id: 4,
        name: "Serenity Sympathy Arrangement",
        price: 89.99,
        category: "sympathy",
        image: "Img9.jpg",
        description: "Peaceful white lilies and greenery to express condolences",
        popular: false
    },
    {
        id: 5,
        name: "Sunshine Daydream Bouquet",
        price: 55.00,
        category: "birthday",
        image: "Img10.jpg",
        description: "Vibrant yellow sunflowers and daisies",
        popular: true
    },
    {
        id: 6,
        name: "Classic Rose Bundle",
        price: 72.50,
        category: "romantic",
        image: "Img11.jpg",
        description: "Two dozen premium long-stemmed red roses",
        popular: true
    },
    {
        id: 7,
        name: "Orchid Elegance",
        price: 95.00,
        category: "wedding",
        image: "Img12.jpg",
        description: "Exquisite purple orchids in a ceramic vase",
        popular: false
    },
    {
        id: 8,
        name: "Peaceful Memories Basket",
        price: 68.75,
        category: "sympathy",
        image: "Img13.jpg",
        description: "Soft pastel flowers arranged in a wicker basket",
        popular: false
    }
];

let cart = [];
let cartCount = 0;
let cartTotal = 0;
let deferredPrompt = null;
let isOnline = navigator.onLine;
let isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                   window.navigator.standalone ||
                   document.referrer.includes('android-app://');

const productsGrid = document.getElementById('productsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCountElement = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const continueShoppingBtn = document.getElementById('continueShopping');
const checkoutBtn = document.getElementById('checkoutBtn');
const newsletterForm = document.getElementById('newsletterForm');
const navLinks = document.querySelectorAll('.nav-link');
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
const closeInstall = document.getElementById('closeInstall');
const installHeaderBtn = document.getElementById('installHeaderBtn');
const offlineIndicator = document.getElementById('offlineIndicator');
const offlineContent = document.getElementById('offlineContent');
const retryConnection = document.getElementById('retryConnection');
const pwaStatus = document.getElementById('pwaStatus');
const clearCache = document.getElementById('clearCache');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Bloom & Petal PWA Initializing...');
    const savedCart = localStorage.getItem('floristCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            console.log(`Loaded ${cart.length} items from cart`);
        } catch (e) {
            console.error('Error parsing cart data:', e);
            cart = [];
        }
    }
    
    renderProducts('all');
    setupEventListeners();
    updateCartUI();
    setupSmoothScrolling();
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
  
    if (isStandalone) {
        console.log('App is running in standalone mode');
        hideInstallPromotion();
    }

    setTimeout(() => {
        showInstallBanner();
    }, 3000);
    console.log('App initialized successfully');
    console.log('Online:', isOnline);
    console.log('Standalone:', isStandalone);
    console.log('Cart items:', cart.length);
});
function handleBeforeInstallPrompt(e) {
    console.log('Before install prompt triggered');
    e.preventDefault();
    deferredPrompt = e;
    if (installHeaderBtn && !isStandalone) {
        installHeaderBtn.style.display = 'flex';
        installHeaderBtn.classList.add('show');
    }
}

function showInstallBanner() {
    const hasSeenBanner = localStorage.getItem('hasSeenInstallBanner');
    if (!hasSeenBanner && installBanner && !isStandalone) {
        console.log('Showing install banner');
        setTimeout(() => {
            installBanner.classList.add('active');
        }, 3000);
    }
}

function hideInstallBanner() {
    if (installBanner) {
        installBanner.classList.remove('active');
        localStorage.setItem('hasSeenInstallBanner', 'true');
        console.log('Install banner hidden');
    }
}

function hideInstallPromotion() {
    hideInstallBanner();
    if (installHeaderBtn) {
        installHeaderBtn.style.display = 'none';
        installHeaderBtn.classList.remove('show');
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        showNotification('This app is already installed or cannot be installed.', 'info');
        return;
    }
    
    console.log('Installing PWA...');
    
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        showNotification('App installed successfully!', 'success');
        hideInstallPromotion();
    } else {
        console.log('User dismissed the install prompt');
        showNotification('Installation cancelled. You can install later from the menu.', 'info');
    }
    
    deferredPrompt = null;
}

function updateOnlineStatus() {
    isOnline = navigator.onLine;
    console.log('Online status changed:', isOnline);
    
    if (offlineIndicator) {
        if (isOnline) {
            offlineIndicator.classList.remove('active');
            offlineContent.classList.remove('active');
        } else {
            offlineIndicator.classList.add('active');
            offlineContent.classList.add('active');
            showNotification('You are now offline. Some features may be limited.', 'info');
        }
    }
}

function renderProducts(category) {
    console.log(`Rendering products for category: ${category}`);
    productsGrid.innerHTML = '';
  
    productsGrid.innerHTML = '<div class="loading" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--primary)">Loading flowers...</div>';
    
    setTimeout(() => {
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        
        productsGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">No flowers found in this category. Please try another filter.</div>';
            return;
        }
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                    ${product.popular ? '<div class="popular-badge">Popular</div>' : ''}
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
                this.classList.add('added-to-cart');
                setTimeout(() => {
                    this.classList.remove('added-to-cart');
                }, 300);
            });
        });
        
        console.log(`Rendered ${filteredProducts.length} products`);
    }, 300);
}
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            renderProducts(filter);
            
            if (window.innerWidth < 768) {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    continueShoppingBtn.addEventListener('click', closeCartModal);
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty! Add some flowers first.', 'error');
            return;
        }
        
        if (!isOnline) {
            showNotification('You are offline. Cannot proceed to checkout.', 'error');
            return;
        }
        
        showNotification(`Proceeding to checkout with ${cartCount} items. Total: $${cartTotal.toFixed(2)}`, 'success');
        simulateCheckout();
    });
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                if (!isOnline) {
                    const pendingSubscriptions = JSON.parse(localStorage.getItem('pendingSubscriptions') || '[]');
                    pendingSubscriptions.push({ email, date: new Date().toISOString() });
                    localStorage.setItem('pendingSubscriptions', JSON.stringify(pendingSubscriptions));
                    
                    showNotification(`Subscription saved offline. Will sync when online.`, 'info');
                } else {
                    showNotification(`Thank you for subscribing with ${email}!`, 'success');
                }
                
                emailInput.value = '';
                console.log(`Subscribed email: ${email}`);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    if (installBtn) {
        installBtn.addEventListener('click', installPWA);
    }
    
    if (closeInstall) {
        closeInstall.addEventListener('click', hideInstallBanner);
    }
    
    if (installHeaderBtn) {
        installHeaderBtn.addEventListener('click', installPWA);
    }

    if (retryConnection) {
        retryConnection.addEventListener('click', function() {
            if (navigator.onLine) {
                location.reload();
            } else {
                showNotification('Still offline. Please check your connection.', 'error');
            }
        });
    }
    if (clearCache) {
        clearCache.addEventListener('click', function() {
            if (confirm('Clear all cached data? This will reset the app and remove offline content.')) {
                clearAppCache();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartModal.classList.contains('active')) {
            closeCartModal();
        }
        

        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            if (deferredPrompt) {
                installPWA();
            }
        }
    });
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = 'var(--shadow)';
            header.style.backgroundColor = 'var(--white)';
        }
    });
    
    console.log('Event listeners setup complete');
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToLocalStorage();
    showNotification(`${product.name} added to cart!`, 'success');
    if (isOnline) {
        syncCartToServer();
    }
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        updateCartUI();
        saveCartToLocalStorage();
        showNotification(`${itemName} removed from cart.`, 'info');
        
        if (isOnline) {
            syncCartToServer();
        }
    }
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
        saveCartToLocalStorage();
        if (isOnline) {
            syncCartToServer();
        }
    }
}

function updateCartUI() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    
    renderCartItems();
    console.log(`Cart updated: ${cartCount} items, $${cartTotal.toFixed(2)} total`);
}

function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p>Add some beautiful flowers to brighten your day!</p>
            </div>`;
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn decrease" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

function openCart() {
    console.log('Opening cart');
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        cartModal.classList.add('active');
    }, 10);
}

function closeCartModal() {
    console.log('Closing cart');
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        cartModal.style.display = 'none';
    }, 300);
}

function saveCartToLocalStorage() {
    try {
        localStorage.setItem('floristCart', JSON.stringify(cart));
        console.log('Cart saved to localStorage');
    } catch (e) {
        console.error('Error saving cart to localStorage:', e);
        showNotification('Error saving cart. Storage might be full.', 'error');
    }
}

function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (mainNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
        console.log('Mobile menu opened');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = 'auto';
        console.log('Mobile menu closed');
    }
}

function closeMobileMenu() {
    mainNav.classList.remove('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    document.body.style.overflow = 'auto';
    console.log('Mobile menu closed');
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#!')) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                console.log(`Smooth scrolling to ${targetId}`);
            }
        });
    });
}

function showNotification(message, type = 'info') {
    console.log(`Notification (${type}): ${message}`);
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
    notification.addEventListener('click', function() {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

function simulateCheckout() {
    console.log('Simulating checkout...');
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<span class="loading"></span> Processing...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        const order = {
            id: Date.now(),
            items: cart,
            total: cartTotal,
            date: new Date().toISOString()
        };
        
        const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
        pendingOrders.push(order);
        localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
        
        cart = [];
        updateCartUI();
        saveCartToLocalStorage();
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;

        closeCartModal();
        showNotification('Order placed successfully! Thank you for your purchase.', 'success');

        if (isOnline) {
            syncOrderToServer(order);
        }
        
        console.log('Checkout completed, order saved');
    }, 2000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function clearAppCache() {
    console.log('Clearing app cache...');
    localStorage.clear();
    cart = [];
    updateCartUI();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
                registration.unregister();
                console.log('Service worker unregistered');
            }
        });
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                cacheNames.forEach(function(cacheName) {
                    caches.delete(cacheName);
                    console.log('Cache deleted:', cacheName);
                });
            });
        }
    }
    
    showNotification('Cache cleared successfully. App will reload.', 'success');
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function syncCartToServer() {
    console.log('Syncing cart to server...', cart);
    setTimeout(() => {
        console.log('Cart synced successfully');
    }, 500);
}

function syncOrderToServer(order) {
   
    console.log('Syncing order to server:', order);
    
    setTimeout(() => {
        console.log('Order synced successfully');
        
        const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
        const updatedOrders = pendingOrders.filter(o => o.id !== order.id);
        localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
        console.log('Pending orders updated');
    }, 1000);
}

function syncPendingData() {
    
    const pendingSubscriptions = JSON.parse(localStorage.getItem('pendingSubscriptions') || '[]');
    if (pendingSubscriptions.length > 0) {
        console.log('Syncing pending subscriptions:', pendingSubscriptions);
      
        localStorage.removeItem('pendingSubscriptions');
    }
    
 
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    if (pendingOrders.length > 0) {
        console.log('Syncing pending orders:', pendingOrders);
        pendingOrders.forEach(order => {
            syncOrderToServer(order);
        });
    }
}

window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('=== Bloom & Petal PWA Loaded Successfully ===');
        console.log('Standalone mode:', isStandalone);
        console.log('Online:', isOnline);
        console.log('Cart items:', cart.length);
        console.log('Service Worker:', 'serviceWorker' in navigator);
        console.log('=============================================');
 
        if (isOnline) {
            syncPendingData();
        }
    }, 1000);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        cart,
        isOnline,
        isStandalone,
        showNotification,
        validateEmail
    };
}
console.log('=== PWA DEBUG INFO ===');
console.log('User Agent:', navigator.userAgent);
console.log('Platform:', navigator.platform);
console.log('Is Chrome?', /chrome/i.test(navigator.userAgent));
console.log('Is Mobile?', /mobile/i.test(navigator.userAgent));
console.log('Service Worker Support:', 'serviceWorker' in navigator);
console.log('BeforeInstallPrompt Support:', 'onbeforeinstallprompt' in window);
console.log('========================');
document.addEventListener('DOMContentLoaded', () => {
    const shopNameDisplay = document.getElementById('shop-name-display');
    const publicCatalogTitle = document.getElementById('public-catalog-title');
    const publicSectionList = document.getElementById('public-section-list');
    const currentPublicSectionTitle = document.getElementById('current-public-section-title');
    const publicProductGridContainer = document.querySelector('.public-product-grid-container');
    const noPublicProductsMessage = document.getElementById('no-public-products-message');

    // Public Product Detail Modal elements
    const publicProductDetailModal = document.getElementById('public-product-detail-modal');
    const publicCloseModalBtn = publicProductDetailModal.querySelector('.public-close-modal');
    const publicModalProductName = publicProductDetailModal.querySelector('#public-modal-product-name');
    const publicModalProductSection = publicProductDetailModal.querySelector('#public-modal-product-section');
    const publicModalProductDescription = publicProductDetailModal.querySelector('#public-modal-product-description');
    const publicImageGallery = publicProductDetailModal.querySelector('.image-gallery');
    const publicMainImage = publicImageGallery.querySelector('.main-image img');
    const publicThumbnailImagesContainer = publicImageGallery.querySelector('.thumbnail-images');


    // --- Mock Data for Public View ---
    // In a real application, this data would be fetched from a public API endpoint
    // based on the shop ID in the URL (e.g., /api/public-catalog/:shopId)
    const mockShopData = {
        name: "Artisan Furniture Co.",
        sections: [
            { id: 'all-products', name: 'All Products', icon: 'fas fa-th-large', visible: true },
            { id: 'bedroom', name: 'Bedroom', icon: 'fas fa-bed', visible: true },
            { id: 'living', name: 'Living Room', icon: 'fas fa-couch', visible: true },
            { id: 'dining', name: 'Dining', icon: 'fas fa-chair', visible: true },
            { id: 'kitchen', name: 'Kitchen', icon: 'fas fa-sink', visible: true },
            { id: 'office', name: 'Office', icon: 'fas fa-briefcase', visible: true },
            { id: 'storage', name: 'Storage', icon: 'fas fa-boxes', visible: true },
            { id: 'outdoor', name: 'Outdoor', icon: 'fas fa-sun', visible: true },
            { id: 'custom', name: 'Custom', icon: 'fas fa-hammer', visible: true },
            { id: 'hidden-section', name: 'Hidden', icon: 'fas fa-eye-slash', visible: false } // Example hidden
        ],
        products: [
            {
                id: 'pub_prod1', name: 'Modern Bed Frame', sections: ['bedroom', 'all-products'],
                description: 'A sleek, modern bed frame crafted from solid oak with a minimalist design. Perfect for contemporary bedrooms.',
                images: ['/images/bedroom.jpg', '/images/hero.jpg']
            },
            {
                id: 'pub_prod2', name: 'Elegant Sofa Set', sections: ['living', 'all-products'],
                description: 'Luxurious velvet sofa set with comfortable cushions and robust wooden frame. Elevate your living space.',
                images: ['/images/living.jpg', '/images/hero2.jpg']
            },
            {
                id: 'pub_prod3', name: 'Contemporary Dining Table', sections: ['dining', 'all-products'],
                description: 'Stylish dining table with a tempered glass top and polished chrome legs. Seats six comfortably.',
                images: ['/images/dining.jpg']
            },
            {
                id: 'pub_prod4', name: 'Minimalist Kitchen Island', sections: ['kitchen', 'all-products'],
                description: 'Functional kitchen island with built-in storage and a durable quartz countertop. Ideal for meal prep and casual dining.',
                images: ['/images/kitchen.jpg']
            },
            {
                id: 'pub_prod5', name: 'Executive Office Desk', sections: ['office', 'all-products'],
                description: 'Spacious executive desk with integrated cable management and ample storage drawers. Designed for productivity.',
                images: ['/images/office.jpg']
            },
            {
                id: 'pub_prod6', name: 'Modular Storage Unit', sections: ['storage', 'all-products'],
                description: 'Versatile modular storage unit, configurable to fit any space. Perfect for organizing books, decor, and more.',
                images: ['/images/lc2.jpg']
            },
            {
                id: 'pub_prod7', name: 'Outdoor Lounge Chair', sections: ['outdoor', 'all-products'],
                description: 'Weather-resistant lounge chair with comfortable quick-dry cushions. Enjoy the outdoors in style.',
                images: ['/images/lc3.jpg']
            },
            {
                id: 'pub_prod8', name: 'Unique Custom Chair', sections: ['custom', 'all-products'],
                description: 'Hand-crafted chair made to order with unique specifications. Contact us for custom designs.',
                images: ['/images/art.jpg']
            },
            {
                id: 'pub_prod9', name: 'Decorative Item (Hidden Section)', sections: ['hidden-section', 'all-products'],
                description: 'This product is in a section that is not visible publicly.',
                images: ['/images/hero.jpg']
            }
        ]
    };

    // --- Helper Functions ---

    function renderPublicSectionNavigation() {
        publicSectionList.innerHTML = ''; // Clear existing list

        const sortedSections = mockShopData.sections.filter(s => s.visible).sort((a, b) => {
            if (a.id === 'all-products') return -1; // Keep 'All Products' first
            if (b.id === 'all-products') return 1;
            return a.name.localeCompare(b.name);
        });

        sortedSections.forEach(section => {
            const li = document.createElement('li');
            li.className = 'nav-item-public';
            li.dataset.section = section.id;
            li.textContent = section.name;
            publicSectionList.appendChild(li);
        });

        // Attach event listeners to newly rendered nav items
        publicSectionList.querySelectorAll('.nav-item-public').forEach(item => {
            item.addEventListener('click', handlePublicNavItemClick);
        });
    }

    function handlePublicNavItemClick(event) {
        event.preventDefault();
        const targetSectionId = event.currentTarget.dataset.section;
        switchPublicSection(targetSectionId);
    }

    function switchPublicSection(targetSectionId) {
        publicSectionList.querySelectorAll('.nav-item-public').forEach(item => item.classList.remove('active'));
        
        const activeNavItem = publicSectionList.querySelector(`.nav-item-public[data-section="${targetSectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
            currentPublicSectionTitle.textContent = activeNavItem.textContent.trim();
        } else {
            // Fallback if section not found (e.g., if direct URL to hidden section)
            currentPublicSectionTitle.textContent = 'Products'; 
        }

        renderPublicProductGrid(targetSectionId);
    }

    function renderPublicProductGrid(sectionId) {
        publicProductGridContainer.innerHTML = ''; // Clear existing products

        const filteredProducts = sectionId === 'all-products'
            ? mockShopData.products.filter(p => p.sections.some(sId => mockShopData.sections.find(s => s.id === sId)?.visible))
            : mockShopData.products.filter(p => p.sections.includes(sectionId) && mockShopData.sections.find(s => s.id === sectionId)?.visible);

        if (filteredProducts.length === 0) {
            noPublicProductsMessage.style.display = 'block';
        } else {
            noPublicProductsMessage.style.display = 'none';
            filteredProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'public-product-card';
                card.dataset.productId = product.id;
                card.innerHTML = `
                    <img src="${product.images[0] || '/images/placeholder.jpg'}" alt="${product.name}">
                    <div class="public-product-info">
                        <h4>${product.name}</h4>
                    </div>
                `;
                publicProductGridContainer.appendChild(card);
            });

            // Attach event listeners to newly rendered product cards
            publicProductGridContainer.querySelectorAll('.public-product-card').forEach(card => {
                card.addEventListener('click', () => openPublicProductDetailModal(card.dataset.productId));
            });
        }
    }

    // --- Public Product Detail Modal ---
    function openPublicProductDetailModal(productId) {
        const product = mockShopData.products.find(p => p.id === productId);
        if (!product || !product.sections.some(sId => mockShopData.sections.find(s => s.id === sId)?.visible)) return; // Ensure product and its section are visible

        publicModalProductName.textContent = product.name;
        publicModalProductSection.textContent = product.sections
            .filter(sId => mockShopData.sections.find(s => s.id === sId)?.visible) // Only show visible sections
            .map(id => mockShopData.sections.find(s => s.id === id)?.name || id)
            .join(', ');
        publicModalProductDescription.textContent = product.description || 'No description provided.';

        // Render images
        publicThumbnailImagesContainer.innerHTML = '';
        if (product.images && product.images.length > 0) {
            publicMainImage.src = product.images[0];
            publicMainImage.alt = product.name;

            product.images.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.alt = `${product.name} Thumbnail ${index + 1}`;
                if (index === 0) thumb.classList.add('active');
                thumb.addEventListener('click', () => {
                    publicMainImage.src = imgSrc;
                    publicThumbnailImagesContainer.querySelectorAll('img').forEach(i => i.classList.remove('active'));
                    thumb.classList.add('active');
                });
                publicThumbnailImagesContainer.appendChild(thumb);
            });
        } else {
            publicMainImage.src = '/images/placeholder.jpg';
            publicThumbnailImagesContainer.innerHTML = '<p class="text-muted">No additional images.</p>';
        }

        publicProductDetailModal.style.display = 'flex';
    }

    function closePublicProductDetailModal() {
        publicProductDetailModal.style.display = 'none';
    }

    // --- Initialization ---
    shopNameDisplay.textContent = mockShopData.name;
    publicCatalogTitle.textContent = `${mockShopData.name} - Catalog`;
    renderPublicSectionNavigation();
    
    // Check URL for specific section (e.g., /catalog/:shopId?section=bedroom)
    const urlParams = new URLSearchParams(window.location.search);
    const initialSection = urlParams.get('section') || 'all-products';
    switchPublicSection(initialSection);

    // Event Listeners for Public Modal
    publicCloseModalBtn.addEventListener('click', closePublicProductDetailModal);
    window.addEventListener('click', (event) => {
        if (event.target === publicProductDetailModal) {
            closePublicProductDetailModal();
        }
    });
});

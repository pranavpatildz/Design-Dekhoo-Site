document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item, .submenu-item');
    const sections = document.querySelectorAll('.dashboard-section');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const submenuToggle = document.querySelector('.has-submenu');

    // Handle navigation clicks with direct display manipulation
    navItems.forEach(item => { // navItems already selects .nav-item, which now also includes .sidebar-link
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.section; // Use dataset.section as updated

            if (targetId) {
                // Deactivate all sections by hiding them
                sections.forEach(section => section.style.display = "none");
                // Remove 'active' class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));

                // Show the target section
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = "block";
                }
                // Add 'active' class to the clicked nav item
                item.classList.add('active');

                // If it's a submenu item, also activate the parent (keep existing logic)
                if (item.classList.contains('submenu-item')) {
                    item.closest('.has-submenu').classList.add('active');
                }

                // Close sidebar on mobile after navigation
                if (sidebar) {
                    sidebar.classList.remove('show');
                    document.body.classList.remove('sidebar-open');
                }
            }
        });
    });

    // Toggle sidebar on mobile
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            document.body.classList.toggle('sidebar-open'); // Toggle a class on body for blur effect
        });
    }

    // Toggle submenu
    if (submenuToggle) {
        submenuToggle.addEventListener('click', (e) => {
            // Prevent navigating when clicking the parent
            if (e.target.closest('.has-submenu') === submenuToggle && !e.target.classList.contains('submenu-item')) {
                submenuToggle.classList.toggle('open');
            }
        });
    }

    // --- TASK 1: Display Shop Name Instead of "Shop Owner" ---
    const sidebarShopNameElement = document.getElementById('sidebar-shop-name');
    const sidebarShopOwnerTextElement = sidebarShopNameElement ? sidebarShopNameElement.nextElementSibling : null; // Assuming 'p' is next sibling
    const navbarProfileAvatar = document.getElementById('navbar-profile-avatar');

    if (window.currentUser) {
        if (window.currentUser.shopName) {
            if (sidebarShopNameElement) {
                sidebarShopNameElement.textContent = window.currentUser.shopName;
            }
            if (sidebarShopOwnerTextElement && sidebarShopOwnerTextElement.tagName === 'P') {
                sidebarShopOwnerTextElement.remove(); // Remove "Shop Owner" paragraph
            }
        } else {
            // Fallback to "Your Shop" if shopName is missing, and ensure "Shop Owner" is present
            if (sidebarShopNameElement) {
                if (!sidebarShopNameElement.textContent) {
                    sidebarShopNameElement.textContent = 'Your Shop';
                }
            }
            if (!sidebarShopOwnerTextElement && sidebarShopNameElement) {
                const ownerP = document.createElement('p');
                ownerP.textContent = 'Shop Owner';
                sidebarShopNameElement.insertAdjacentElement('afterend', ownerP);
            }
        }
    }

    // --- TASK 3: Profile Circle Clickable ---
    const shopProfileSettingsNavItem = document.querySelector('.nav-item[data-section="shop-profile-settings"]');

    if (navbarProfileAvatar && shopProfileSettingsNavItem) {
        navbarProfileAvatar.style.cursor = 'pointer'; // Indicate it's clickable
        navbarProfileAvatar.addEventListener('click', () => {
            // Simulate a click on the "Profile" sidebar nav item
            shopProfileSettingsNavItem.click();

            // Close dropdown if open (assuming profile-dropdown needs to close)
            const profileDropdown = document.getElementById('profile-dropdown');
            if (profileDropdown && profileDropdown.classList.contains('show')) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // --- LOGOUT CONFIRMATION MODAL & LOGO BEHAVIOR ---
    const logoutConfirmModal = document.getElementById('logout-confirm-modal');
    const logoutModalCloseBtn = document.getElementById('logout-modal-close-btn');
    const stayDesigningBtn = document.getElementById('stay-designing-btn');
    const yesTakeMeHomeBtn = document.getElementById('yes-take-me-home-btn');
    const logoutFormDropdown = document.getElementById('logout-form-dropdown'); // The new logout form
    const sidebarLogoutForm = document.getElementById('sidebar-logout-form'); // The new sidebar logout form

    // Function to show/hide logout modal
    function showLogoutModal() {
        if (logoutConfirmModal) {
            logoutConfirmModal.classList.add('show');
            document.body.classList.add('modal-open');
        }
    }

    function hideLogoutModal() {
        if (logoutConfirmModal) {
            logoutConfirmModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    }

    // Event listeners for the logout confirmation modal
    if (logoutModalCloseBtn) {
        logoutModalCloseBtn.addEventListener('click', hideLogoutModal);
    }
    if (stayDesigningBtn) {
        stayDesigningBtn.addEventListener('click', hideLogoutModal);
    }
    if (yesTakeMeHomeBtn && (logoutFormDropdown || sidebarLogoutForm)) {
        yesTakeMeHomeBtn.addEventListener('click', () => {
            // Determine which form to submit based on context, or just submit one.
            // For simplicity, I'll submit the sidebar form as it's more prominent.
            if (sidebarLogoutForm) {
                sidebarLogoutForm.submit();
            } else if (logoutFormDropdown) {
                logoutFormDropdown.submit();
            }
        });
    }

    // Handle clicks on elements that should open the logout modal
    const logoutTriggers = document.querySelectorAll('[data-modal-target="logout-confirm-modal"]');
    logoutTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            showLogoutModal();
        });
    });

    // --- SHARE CATALOG MODAL BEHAVIOR ---
    const shareCatalogModal = document.getElementById('share-catalog-modal');
    const shareCatalogModalCloseBtn = shareCatalogModal ? shareCatalogModal.querySelector('#modal-close-btn') : null;
    const shareCatalogSidebarBtn = document.getElementById('share-catalog-btn-sidebar');
    const publicCatalogLinkInput = document.getElementById('public-catalog-link');
    const copyCatalogLinkBtn = document.getElementById('copy-catalog-link-btn');
    const copySuccessMessage = document.getElementById('copy-success-message');

    function showShareCatalogModal() {
        shareCatalogModal.classList.add('show');
        document.body.classList.add('modal-open');
        // Generate and display the public catalog link
        if (publicCatalogLinkInput && window.currentUser && window.currentUser._id) { // Use _id from currentUser
            const publicUrl = `${window.location.protocol}//${window.location.host}/catalog/${window.currentUser._id}`;
            publicCatalogLinkInput.value = publicUrl;
        } else if (publicCatalogLinkInput) {
            publicCatalogLinkInput.value = "Error: Shop ID not found.";
        }
    }

    function hideShareCatalogModal() {
        shareCatalogModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }

    // Event listener to open the share catalog modal
    if (shareCatalogSidebarBtn) {
        shareCatalogSidebarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showShareCatalogModal();
        });
    }

    // Event listener to close the share catalog modal
    if (shareCatalogModalCloseBtn) {
        shareCatalogModalCloseBtn.addEventListener('click', hideShareCatalogModal);
    }

    // Event listener to copy the public catalog link to clipboard
    if (copyCatalogLinkBtn && publicCatalogLinkInput) {
        copyCatalogLinkBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(publicCatalogLinkInput.value);
                showNotification('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy: ', err);
                alert('Failed to copy the link. Please copy it manually.');
            }
        });
    }

    // Function to show a temporary success message (reused from profile, but can be made generic)
    let successMessageTimeout;
    function showNotification(message, isError = false) { // Renamed for generic use
        const notificationElement = copySuccessMessage; // Reusing the success message element for simplicity
        if (notificationElement) {
            notificationElement.textContent = message;
            notificationElement.className = `success-message ${isError ? 'error' : 'success'} show`; // Add error class if needed
            clearTimeout(successMessageTimeout);
            successMessageTimeout = setTimeout(() => {
                notificationElement.classList.remove('show');
                notificationElement.classList.remove('error');
            }, 3000); // Hide after 3 seconds
        }
    }


    // --- CUSTOM CATEGORY DROPDOWN AND DYNAMIC FILTERING (INCLUDING NEW CATEGORY ADDITION) ---
    const customSelectWrapper = document.getElementById('catalog-category-filter'); // The main wrapper for catalog filter
    const customSelectTrigger = customSelectWrapper ? customSelectWrapper.querySelector('.custom-select-trigger') : null;
    const selectedCategorySpan = customSelectWrapper ? customSelectWrapper.querySelector('.selected-category') : null;
    const customOptionsContainer = customSelectWrapper ? customSelectWrapper.querySelector('.custom-options') : null;
    const productCategorySelect = document.getElementById('product-category'); // The select element in "Add Product" form

    const newCategoryNameInput = document.getElementById('new-category-name-input');
    const addCategoryButton = document.getElementById('add-category-button');

    let currentFilterCategory = ''; // To keep track of the currently selected category

    // Function to load and populate categories in both dropdowns
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const categories = await response.json();

            // Populate Catalog Filter Dropdown
            if (customOptionsContainer) {
                customOptionsContainer.innerHTML = '<span class="custom-option selected" data-value="">All Categories</span>'; // Always add 'All Categories'
                categories.forEach(category => {
                    const option = document.createElement('span');
                    option.className = 'custom-option';
                    option.setAttribute('data-value', category.name);
                    option.textContent = category.name;
                    customOptionsContainer.appendChild(option);
                });
                // Re-attach event listeners for newly created options
                customOptionsContainer.querySelectorAll('.custom-option').forEach(option => {
                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        if (selectedCategorySpan) selectedCategorySpan.textContent = option.textContent;
                        customOptionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                        option.classList.add('selected');
                        if (customSelectWrapper) customSelectWrapper.classList.remove('active');
                        filterAndDisplayProducts(value);
                    });
                });
            }

            // Populate Add Product Form Category Select
            if (productCategorySelect) {
                productCategorySelect.innerHTML = '<option value="">Select a Category</option>'; // Default option
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    productCategorySelect.appendChild(option);
                });
            }

            // Ensure the initially selected filter is displayed correctly
            if (selectedCategorySpan) {
                const currentSelectedOption = customOptionsContainer.querySelector(`.custom-option[data-value="${currentFilterCategory}"]`);
                if (currentSelectedOption) {
                    selectedCategorySpan.textContent = currentSelectedOption.textContent;
                    currentSelectedOption.classList.add('selected');
                } else {
                    selectedCategorySpan.textContent = 'All Categories';
                    customOptionsContainer.querySelector('.custom-option[data-value=""]').classList.add('selected');
                }
            }

        } catch (error) {
            console.error('Error loading categories:', error);
            showNotification('Failed to load categories.', true);
        }
    }

    // Call loadCategories on initial load
    loadCategories();


    // Function to render products into the grid
    function renderProducts(products) {
        if (!myCatalogProductGrid) return;

        myCatalogProductGrid.innerHTML = ''; // Clear existing products

        if (products.length === 0) {
            myCatalogProductGrid.innerHTML = '<p class="no-products-msg">No products found for this category.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card-dash';
            productCard.innerHTML = `
                <img src="${product.images[0] || '/images/placeholder.jpg'}" alt="${product.title}">
                <div class="product-info-dash">
                    <h4>${product.title}</h4>
                    <p>Category: ${product.category}</p>
                    <p>Material: ${product.material || 'N/A'}</p>
                    <p>Price: ₹${product.price ? product.price.toLocaleString() : 'N/A'}</p>
                </div>
                <div class="product-actions-dash">
                    <button class="btn-secondary">Edit</button>
                    <button class="btn-danger">Delete</button>
                </div>
            `;
            myCatalogProductGrid.appendChild(productCard);
        });
    }

    // Function to fetch and display products based on category filter
    async function filterAndDisplayProducts(category = '') {
        currentFilterCategory = category;
        if (!myCatalogProductGrid) return;
        myCatalogProductGrid.innerHTML = '<p class="loading-msg">Loading products...</p>'; // Show loading message

        // Assuming session-based auth, no token is needed for this fetch
        // The backend will check for session
        let url = `/api/catalog/my-products`; // Changed to relative path
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // IMPORTANT: Include cookies with the request
            });

            if (!response.ok) {
                // Handle 401 specifically if session is invalid/expired
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to fetch products');
            }

            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            myCatalogProductGrid.innerHTML = `<p class="error-msg">Error: ${error.message}</p>`;
        }
    }

    // Toggle dropdown visibility for category filter
    if (customSelectTrigger && customOptionsContainer) {
        customSelectTrigger.addEventListener('click', () => {
            customSelectWrapper.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (customSelectWrapper && !customSelectWrapper.contains(e.target)) {
                customSelectWrapper.classList.remove('active');
            }
        });
    }

    // Handle "Add New Category" functionality
    if (addCategoryButton && newCategoryNameInput) {
        addCategoryButton.addEventListener('click', async () => {
            const categoryName = newCategoryNameInput.value.trim();
            if (!categoryName) {
                showNotification('Category name cannot be empty.', true);
                return;
            }

            try {
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: categoryName }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Failed to add category');
                }

                showNotification(`Category "${data.name}" added successfully!`, false);
                newCategoryNameInput.value = ''; // Clear input
                await loadCategories(); // Refresh dropdowns
            } catch (error) {
                console.error('Error adding category:', error);
                showNotification(error.message || 'An error occurred while adding category.', true);
            }
        });
    }

    // Initial load for "My Catalog" section
    const myCatalogSection = document.getElementById('my-catalog');
    if (myCatalogSection) {
        // Observer to check when the 'my-catalog' section becomes active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (myCatalogSection.classList.contains('active')) {
                        // Load products and categories only once when the section becomes active
                        if (!myCatalogSection.dataset.productsLoaded) {
                            loadCategories(); // Load categories for dropdowns
                            filterAndDisplayProducts(''); // Load all products initially
                            myCatalogSection.dataset.productsLoaded = 'true'; // Mark as loaded
                        }
                    } else {
                        // Reset if leaving the section (optional, could remove loaded flag)
                        myCatalogSection.dataset.productsLoaded = 'false';
                    }
                }
            });
        });

        observer.observe(myCatalogSection, { attributes: true });

        // Also check on initial page load if it's already active
        if (myCatalogSection.classList.contains('active')) {
             loadCategories(); // Load categories for dropdowns
             filterAndDisplayProducts(''); // Load all products initially
             myCatalogSection.dataset.productsLoaded = 'true';
        }
    }



    // --- CUSTOM CATEGORY DROPDOWN AND DYNAMIC FILTERING (INCLUDING NEW CATEGORY ADDITION) ---
    const customSelectWrapper = document.getElementById('catalog-category-filter'); // The main wrapper for catalog filter
    const customSelectTrigger = customSelectWrapper ? customSelectWrapper.querySelector('.custom-select-trigger') : null;
    const selectedCategorySpan = customSelectWrapper ? customSelectWrapper.querySelector('.selected-category') : null;
    const customOptionsContainer = customSelectWrapper ? customSelectWrapper.querySelector('.custom-options') : null;
    const productCategorySelect = document.getElementById('product-category'); // The select element in "Add Product" form

    const newCategoryNameInput = document.getElementById('new-category-name-input');
    const addCategoryButton = document.getElementById('add-category-button');

    let currentFilterCategory = ''; // To keep track of the currently selected category

    // Function to load and populate categories in both dropdowns
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const categories = await response.json();

            // Populate Catalog Filter Dropdown
            if (customOptionsContainer) {
                customOptionsContainer.innerHTML = '<span class="custom-option selected" data-value="">All Categories</span>'; // Always add 'All Categories'
                categories.forEach(category => {
                    const option = document.createElement('span');
                    option.className = 'custom-option';
                    option.setAttribute('data-value', category.name);
                    option.textContent = category.name;
                    customOptionsContainer.appendChild(option);
                });
                // Re-attach event listeners for newly created options
                customOptionsContainer.querySelectorAll('.custom-option').forEach(option => {
                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        if (selectedCategorySpan) selectedCategorySpan.textContent = option.textContent;
                        customOptionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                        option.classList.add('selected');
                        if (customSelectWrapper) customSelectWrapper.classList.remove('active');
                        filterAndDisplayProducts(value);
                    });
                });
            }

            // Populate Add Product Form Category Select
            if (productCategorySelect) {
                productCategorySelect.innerHTML = '<option value="">Select a Category</option>'; // Default option
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    productCategorySelect.appendChild(option);
                });
            }

            // Ensure the initially selected filter is displayed correctly
            if (selectedCategorySpan) {
                const currentSelectedOption = customOptionsContainer.querySelector(`.custom-option[data-value="${currentFilterCategory}"]`);
                if (currentSelectedOption) {
                    selectedCategorySpan.textContent = currentSelectedOption.textContent;
                    currentSelectedOption.classList.add('selected');
                } else {
                    selectedCategorySpan.textContent = 'All Categories';
                    customOptionsContainer.querySelector('.custom-option[data-value=""]').classList.add('selected');
                }
            }

        } catch (error) {
            console.error('Error loading categories:', error);
            showNotification('Failed to load categories.', true);
        }
    }

    // Call loadCategories on initial load
    loadCategories();


    // Function to render products into the grid
    function renderProducts(products) {
        if (!myCatalogProductGrid) return;

        myCatalogProductGrid.innerHTML = ''; // Clear existing products

        if (products.length === 0) {
            myCatalogProductGrid.innerHTML = '<p class="no-products-msg">No products found for this category.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card-dash';
            productCard.innerHTML = `
                <img src="${product.images[0] || '/images/placeholder.jpg'}" alt="${product.title}">
                <div class="product-info-dash">
                    <h4>${product.title}</h4>
                    <p>Category: ${product.category}</p>
                    <p>Material: ${product.material || 'N/A'}</p>
                    <p>Price: ₹${product.price ? product.price.toLocaleString() : 'N/A'}</p>
                </div>
                <div class="product-actions-dash">
                    <button class="btn-secondary">Edit</button>
                    <button class="btn-danger">Delete</button>
                </div>
            `;
            myCatalogProductGrid.appendChild(productCard);
        });
    }

    // Function to fetch and display products based on category filter
    async function filterAndDisplayProducts(category = '') {
        currentFilterCategory = category;
        if (!myCatalogProductGrid) return;
        myCatalogProductGrid.innerHTML = '<p class="loading-msg">Loading products...</p>'; // Show loading message

        // Assuming session-based auth, no token is needed for this fetch
        // The backend will check for session
        let url = `/api/catalog/my-products`; // Changed to relative path
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // IMPORTANT: Include cookies with the request
            });

            if (!response.ok) {
                // Handle 401 specifically if session is invalid/expired
                if (response.status === 401) {
                    throw new Error('Unauthorized: Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to fetch products');
            }

            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            myCatalogProductGrid.innerHTML = `<p class="error-msg">Error: ${error.message}</p>`;
        }
    }

    // Toggle dropdown visibility for category filter
    if (customSelectTrigger && customOptionsContainer) {
        customSelectTrigger.addEventListener('click', () => {
            customSelectWrapper.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (customSelectWrapper && !customSelectWrapper.contains(e.target)) {
                customSelectWrapper.classList.remove('active');
            }
        });
    }

    // Handle "Add New Category" functionality
    if (addCategoryButton && newCategoryNameInput) {
        addCategoryButton.addEventListener('click', async () => {
            const categoryName = newCategoryNameInput.value.trim();
            if (!categoryName) {
                showNotification('Category name cannot be empty.', true);
                return;
            }

            try {
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: categoryName }),
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Failed to add category');
                }

                showNotification(`Category "${data.name}" added successfully!`, false);
                newCategoryNameInput.value = ''; // Clear input
                await loadCategories(); // Refresh dropdowns
            } catch (error) {
                console.error('Error adding category:', error);
                showNotification(error.message || 'An error occurred while adding category.', true);
            }
        });
    }

    // Initial load for "My Catalog" section
    const myCatalogSection = document.getElementById('my-catalog');
    if (myCatalogSection) {
        // Observer to check when the 'my-catalog' section becomes active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (myCatalogSection.classList.contains('active')) {
                        // Load products and categories only once when the section becomes active
                        if (!myCatalogSection.dataset.productsLoaded) {
                            loadCategories(); // Load categories for dropdowns
                            filterAndDisplayProducts(''); // Load all products initially
                            myCatalogSection.dataset.productsLoaded = 'true'; // Mark as loaded
                        }
                    } else {
                        // Reset if leaving the section (optional, could remove loaded flag)
                        myCatalogSection.dataset.productsLoaded = 'false';
                    }
                }
            });
        });

        observer.observe(myCatalogSection, { attributes: true });

        // Also check on initial page load if it's already active
        if (myCatalogSection.classList.contains('active')) {
             loadCategories(); // Load categories for dropdowns
             filterAndDisplayProducts(''); // Load all products initially
             myCatalogSection.dataset.productsLoaded = 'true';
        }
    }


    // --- TASK 2: Material Dropdown Logic ---
    const productMaterialSelect = document.getElementById('product-material');
    const customMaterialGroup = document.getElementById('custom-material-group');
    const customProductMaterialInput = document.getElementById('custom-product-material');

    if (productMaterialSelect && customMaterialGroup && customProductMaterialInput) {
        productMaterialSelect.addEventListener('change', () => {
            if (productMaterialSelect.value === 'Other') {
                customMaterialGroup.style.display = 'block';
                customProductMaterialInput.setAttribute('required', 'required');
            } else {
                customMaterialGroup.style.display = 'none';
                customProductMaterialInput.removeAttribute('required');
                customProductMaterialInput.value = ''; // Clear custom input when hidden
            }
        });
    }


    // --- TASK 3 & 4: Image Upload and Product Creation ---
    const addProductForm = document.querySelector('.add-product-form');
    const productImagesInput = document.getElementById('product-images');
    const imagePreviewContainer = document.getElementById('image-preview');
    let selectedFiles = []; // To store files selected for upload

    function displayImagePreviews() {
        if (!imagePreviewContainer) return;

        imagePreviewContainer.innerHTML = ''; // Clear existing previews

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Product Image Preview">
                    <button type="button" class="remove-image-btn" data-index="${index}">&times;</button>
                `;
                imagePreviewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });

        // Add event listeners to remove buttons
        imagePreviewContainer.querySelectorAll('.remove-image-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                removeImage(indexToRemove);
            });
        });
    }

    function removeImage(index) {
        selectedFiles.splice(index, 1); // Remove file from array
        displayImagePreviews(); // Re-render previews
        // Also update the file input's files if necessary (more complex, often omitted for simplicity)
        // For simplicity, re-assigning files will clear selected ones from the input element
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        productImagesInput.files = dt.files;
    }

    if (productImagesInput) {
        productImagesInput.addEventListener('change', (event) => {
            selectedFiles = Array.from(event.target.files); // Get all selected files
            displayImagePreviews();
        });
    }

    // Handle Add Product Form Submission
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = addProductForm.querySelector('.btn-submit');
            submitButton.disabled = true; // Disable button to prevent multiple submissions
            submitButton.textContent = 'Adding Product...';

            let imageUrls = [];
            try {
                // Upload images first
                if (selectedFiles.length > 0) {
                    for (const file of selectedFiles) {
                        const formData = new FormData();
                        formData.append('image', file);

                        const uploadResponse = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                            credentials: 'include'
                        });

                        const uploadData = await uploadResponse.json();

                        if (!uploadResponse.ok) {
                            throw new Error(uploadData.message || 'Image upload failed');
                        }
                        imageUrls.push(uploadData.imageUrl);
                    }
                } else {
                    showNotification('Please upload at least one image.', true);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Add Product';
                    return;
                }

                // Collect other form data
                const productName = document.getElementById('product-name').value;
                const category = document.getElementById('product-category').value;
                let material = document.getElementById('product-material').value;
                const customMaterial = document.getElementById('custom-product-material').value;
                const description = document.getElementById('product-description').value;
                const notes = document.getElementById('product-notes').value;

                // Use custom material if 'Other' is selected
                if (material === 'Other') {
                    material = customMaterial.trim();
                    if (!material) {
                        showNotification('Custom material cannot be empty when "Other" is selected.', true);
                        submitButton.disabled = false;
                        submitButton.textContent = 'Add Product';
                        return;
                    }
                }

                if (!productName || !category || !material) {
                    showNotification('Please fill in all required fields.', true);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Add Product';
                    return;
                }


                const productData = {
                    title: productName,
                    category: category,
                    material: material,
                    description: description,
                    notes: notes,
                    images: imageUrls,
                };

                // Submit product data to backend
                const productResponse = await fetch('/api/catalog', { // Using POST /api/catalog
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                    credentials: 'include'
                });

                const productResult = await productResponse.json();

                if (!productResponse.ok) {
                    throw new Error(productResult.msg || 'Failed to add product');
                }

                showNotification('Product added successfully!', false);
                addProductForm.reset(); // Clear form
                selectedFiles = []; // Clear selected files
                displayImagePreviews(); // Clear image previews
                filterAndDisplayProducts(''); // Refresh My Catalog

                submitButton.disabled = false;
                submitButton.textContent = 'Add Product';

                // Optionally scroll back to My Catalog
                shopProfileSettingsNavItem.click(); // Assuming clicking nav item will switch to My Catalog or a default view.
                                                    // For now, I'll switch to My Catalog
                const myCatalogNavItem = document.querySelector('.nav-item[data-section="my-catalog"]');
                if (myCatalogNavItem) {
                    myCatalogNavItem.click();
                }


            } catch (error) {
                console.error('Error adding product:', error);
                showNotification(error.message || 'An error occurred while adding the product.', true);
                submitButton.disabled = false;
                submitButton.textContent = 'Add Product';
            }
        });
    }


    // --- SHOP PROFILE SETTINGS SECTION ---
    const shopProfileForm = document.getElementById('shop-profile-form');
    const profileFields = shopProfileForm ? shopProfileForm.querySelectorAll('input, textarea') : [];
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const profileMessage = document.getElementById('profile-message');

    // Function to show profile messages
    let profileMessageTimeout;
    function showProfileMessage(message, isError = false) {
        if (profileMessage) {
            profileMessage.textContent = message;
            profileMessage.className = `message ${isError ? 'error' : 'success'}`;
            profileMessage.style.display = 'block';
            clearTimeout(profileMessageTimeout);
            profileMessageTimeout = setTimeout(() => {
                profileMessage.style.display = 'none';
            }, 5000); // Hide after 5 seconds
        }
    }

    // Function to toggle edit mode
    function toggleEditMode(enable) {
        profileFields.forEach(field => {
            field.disabled = !enable;
        });
        editProfileBtn.style.display = enable ? 'none' : 'inline-block';
        saveProfileBtn.style.display = enable ? 'inline-block' : 'none';
        if (!enable) {
            showProfileMessage('Profile saved successfully!', false);
        }
    }

    // Initialize fields to disabled on load
    profileFields.forEach(field => {
        field.disabled = true;
    });

    // Event listener for Edit Profile button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            toggleEditMode(true);
            profileMessage.style.display = 'none'; // Clear previous messages
        });
    }

    // Event listener for Save Changes button (form submission)
    if (shopProfileForm) {
        shopProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(shopProfileForm);
            const formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            try {
                const response = await fetch(`/api/dashboard/profile/update`, { // Changed to relative path
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataObject),
                    credentials: 'include' // IMPORTANT: Include cookies with the request
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Failed to update profile');
                }

                // Profile updated successfully
                toggleEditMode(false); // Switch back to view mode
                showProfileMessage(data.msg || 'Profile updated successfully!', false);

            } catch (error) {
                console.error('Error updating profile:', error);
                showProfileMessage(error.message || 'An error occurred during profile update.', true);
            }
        });
    }

    // --- TASK 4: Profile Picture Upload Option ---
    const profilePictureInput = document.getElementById('profile-picture-input');
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    const changeProfilePictureBtn = document.getElementById('change-profile-picture-btn');
    const sidebarProfileAvatar = document.getElementById('sidebar-shop-initial'); // Already exists
    // const navbarProfileAvatar = document.getElementById('navbar-profile-avatar'); // Already defined above

    // Initial setup for profile pictures
    function setProfilePictures(imageUrl) {
        if (profilePicturePreview) {
            profilePicturePreview.src = imageUrl || '/images/placeholder.jpg';
        }
        if (sidebarProfileAvatar) {
            sidebarProfileAvatar.style.backgroundImage = `url(${imageUrl})`;
            sidebarProfileAvatar.textContent = ''; // Clear initials if image is present
        }
        if (navbarProfileAvatar) {
            navbarProfileAvatar.style.backgroundImage = `url(${imageUrl})`;
            navbarProfileAvatar.textContent = ''; // Clear initials if image is present
        }
    }

    // Set initial profile picture from currentUser
    if (window.currentUser) {
        if (window.currentUser.profilePicture) {
            setProfilePictures(window.currentUser.profilePicture);
        } else if (window.currentUser.name) {
            // Generate initials if no profile picture and name is available
            const initials = window.currentUser.name.charAt(0).toUpperCase();
            if (sidebarProfileAvatar) {
                sidebarProfileAvatar.textContent = initials;
                sidebarProfileAvatar.style.backgroundImage = 'none'; // Ensure no background image
            }
            if (navbarProfileAvatar) {
                navbarProfileAvatar.textContent = initials;
                navbarProfileAvatar.style.backgroundImage = 'none'; // Ensure no background image
            }
        }
    }

    if (profilePictureInput && changeProfilePictureBtn) {
        changeProfilePictureBtn.addEventListener('click', () => {
            profilePictureInput.click(); // Trigger file input click
        });

        profilePictureInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Display immediate preview
            const reader = new FileReader();
            reader.onload = (e) => {
                if (profilePicturePreview) {
                    profilePicturePreview.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);

            // Upload the file
            const formData = new FormData();
            formData.append('image', file); // 'image' is the field name expected by multer

            try {
                const uploadResponse = await fetch('/api/upload', { // Using the existing upload route
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                const uploadData = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(uploadData.message || 'Image upload failed');
                }

                const newImageUrl = uploadData.imageUrl;
                showProfileMessage('Profile picture uploaded successfully!', false);

                // Update all profile picture elements across the dashboard
                setProfilePictures(newImageUrl);

                // Update currentUser in JS
                if (window.currentUser) {
                    window.currentUser.profilePicture = newImageUrl;
                }

                // Persist the new image URL to the user's profile in the database
                if (window.currentUser && window.currentUser._id) {
                    const updateProfileResponse = await fetch(`/api/dashboard/profile/update`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ profilePicture: newImageUrl }),
                        credentials: 'include'
                    });

                    const updateProfileData = await updateProfileResponse.json();
                    if (!updateProfileResponse.ok) {
                        throw new Error(updateProfileData.msg || 'Failed to save profile picture URL');
                    }
                    showProfileMessage('Profile picture URL saved to profile!', false);
                }

            } catch (error) {
                console.error('Error uploading profile picture:', error);
                showProfileMessage(error.message || 'An error occurred during profile picture upload.', true);
            }
        });
    }
});

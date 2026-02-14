document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item, .submenu-item');
    const sections = document.querySelectorAll('.dashboard-section');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    const submenuToggle = document.querySelector('.has-submenu');

    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-section');

            if (targetId) {
                // Deactivate all sections and nav items
                sections.forEach(section => section.classList.remove('active'));
                navItems.forEach(nav => nav.classList.remove('active'));

                // Activate the target section and nav item
                document.getElementById(targetId)?.classList.add('active');
                item.classList.add('active');

                // If it's a submenu item, also activate the parent
                if (item.classList.contains('submenu-item')) {
                    item.closest('.has-submenu').classList.add('active');
                }

                // Close sidebar on mobile after navigation
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('show');
                }
            }
        });
    });

    // Toggle sidebar on mobile
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
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
    if (yesTakeMeHomeBtn && logoutFormDropdown) {
        yesTakeMeHomeBtn.addEventListener('click', () => {
            logoutFormDropdown.submit(); // Submit the form
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
        if (publicCatalogLinkInput && typeof currentShopOwnerId !== 'undefined') {
            const publicUrl = `${window.location.protocol}//${window.location.host}/catalog/${currentShopOwnerId}`;
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
                showSuccessMessage('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy: ', err);
                alert('Failed to copy the link. Please copy it manually.');
            }
        });
    }

    // Function to show a temporary success message
    let successMessageTimeout;
    function showSuccessMessage(message) {
        if (copySuccessMessage) {
            copySuccessMessage.textContent = message;
            copySuccessMessage.classList.add('show');
            clearTimeout(successMessageTimeout);
            successMessageTimeout = setTimeout(() => {
                copySuccessMessage.classList.remove('show');
            }, 3000); // Hide after 3 seconds
        }
    }

    // --- CUSTOM CATEGORY DROPDOWN AND DYNAMIC FILTERING ---
    const customSelectWrapper = document.getElementById('catalog-category-filter'); // The main wrapper
    const customSelectTrigger = customSelectWrapper ? customSelectWrapper.querySelector('.custom-select-trigger') : null;
    const selectedCategorySpan = customSelectWrapper ? customSelectWrapper.querySelector('.selected-category') : null;
    const customOptionsContainer = customSelectWrapper ? customSelectWrapper.querySelector('.custom-options') : null;
    const customOptions = customSelectWrapper ? customSelectWrapper.querySelectorAll('.custom-option') : null;
    const myCatalogProductGrid = document.getElementById('my-catalog-product-grid');

    let currentFilterCategory = ''; // To keep track of the currently selected category

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

    // Toggle dropdown visibility
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

    // Handle option selection
    if (customOptions && selectedCategorySpan) {
        customOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                selectedCategorySpan.textContent = option.textContent; // Update display
                customOptions.forEach(opt => opt.classList.remove('selected')); // Remove old selected
                option.classList.add('selected'); // Add new selected
                customSelectWrapper.classList.remove('active'); // Close dropdown
                filterAndDisplayProducts(value); // Filter products
            });
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
                        // Load products only once when the section becomes active
                        if (!myCatalogSection.dataset.productsLoaded) {
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
             filterAndDisplayProducts(''); // Load all products initially
             myCatalogSection.dataset.productsLoaded = 'true';
        }
    }

    // Make currentUser available from EJS
    // This assumes `user` object is passed to the EJS template and can be accessed
    // <script> window.currentUser = <%- JSON.stringify(user) %>; </script>
    // This is required for the share catalog link generation
    // I need to add this line in shop-dashboard.ejs within a <script> tag:
    // <script> window.currentUser = <%- JSON.stringify(user) %>; </script>

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
});

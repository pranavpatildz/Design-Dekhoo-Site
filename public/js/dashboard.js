document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".nav-btn[data-section]");
  const sections = document.querySelectorAll(".section");

  // Function to activate a section and highlight its nav button
  function activateSection(sectionId) {
    sections.forEach(sec => {
      sec.classList.remove("active-section");
    });

    buttons.forEach(btn => { // Remove active class from all nav buttons
      btn.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add("active-section");
      // Update URL hash without causing a page reload
      if (history.pushState) {
        history.pushState(null, '', `#${sectionId}`);
      } else {
        location.hash = `#${sectionId}`;
      }
    }

    const correspondingNavButton = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (correspondingNavButton) {
      correspondingNavButton.classList.add('active');
    }

    if (sectionId === 'catalog-home') {
      loadCatalog(); // Load catalog when its section is activated
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      const target = this.dataset.section;
      activateSection(target);
    });
  });

  // Activate section based on URL hash or default to dashboard-home on load
  const initialHash = window.location.hash.substring(1); // Remove '#'
  let sectionToActivate = "dashboard-home"; // Default

  if (initialHash && document.getElementById(initialHash)) {
    sectionToActivate = initialHash;
  }
  activateSection(sectionToActivate);

  // --- Dynamic Content Placeholders for Dashboard Home ---
  // The element 'sidebar-shop-name' is now handled by EJS directly
  // 'dashboard-welcome-shop-name' element has been removed from EJS
  const sidebarShopInitial = document.getElementById('sidebar-shop-initial');

  const navbarProfileAvatar = document.getElementById('navbar-profile-avatar');

    // --- Reusable function to render a single product card (Basic version) ---

    function renderProductCard(product) {

      console.log("PRODUCT OBJECT:", product); // Log entire product object for inspection

                 const imageUrl = product.images && product.images.length > 0

                   ? product.images[0]

                   : '/images/placeholder.jpg';    const formattedPrice = `₹${Number(product.price).toLocaleString("en-IN")}`;
    const categoryName = product.category?.name || 'N/A';

    return `
      <div class="product-card card" data-product-id="${product._id}">
        <div class="product-image-container">
          <img class="product-image catalog-image" src="${imageUrl}" alt="${product.title}">
        </div>
        <div class="product-details">
          <h4 class="product-title">${product.title}</h4>
          <p class="product-price">${formattedPrice}</p>
          <span class="category-badge">${categoryName}</span>
        </div>
        <div class="product-actions">
          <a href="#edit-product-home?id=${product._id}" class="btn-edit">Edit</a>
          <button class="btn-delete" data-product-id="${product._id}">Delete</button>
        </div>
      </div>
    `;
  }

  // --- Function to render products ---
  function renderProducts(products) {
    const container = document.getElementById("catalogContainer");
    if (!container) return;

    if (!products || products.length === 0) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    container.innerHTML = `<div class="product-grid">${products.map(renderProductCard).join("")}</div>`;
  }

  let allShopProducts = []; // Global variable to store all products

  // --- Function to fetch and render products ---
  function loadCatalog() {
    console.log("Loading catalog...");

    fetch("/api/products/my")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then(products => {
        console.log("Products received:", products);
        allShopProducts = products; // Store all products globally
        renderProducts(allShopProducts); // Initially render all products
      })
      .catch(error => {
        console.error("Catalog fetch error:", error);
        document.getElementById("catalogContainer").innerHTML =
          "<p>Error loading products</p>";
      });
  }

  // --- Function to filter and render products ---
  function filterProducts(categoryId) {
    let filteredProducts = [];
    if (categoryId === 'all') {
      filteredProducts = allShopProducts;
    } else {
      filteredProducts = allShopProducts.filter(product => product.category?._id === categoryId);
    }
    renderProducts(filteredProducts);
  }

  // --- Sidebar Toggle for Mobile ---
  const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
  const dashboardSidebar = document.querySelector('.dashboard-sidebar');

  if (sidebarToggleBtn && dashboardSidebar) {
      sidebarToggleBtn.addEventListener('click', () => {
          dashboardSidebar.classList.toggle('show');
          document.body.classList.toggle('sidebar-open');
      });
  }

  // --- Logout Button Functionality ---
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "/api/auth/logout"; // Direct redirect to GET /api/auth/logout route
      }
    });
  }

  // --- Profile Photo Circles Clickable ---
  const profileCircles = document.querySelectorAll(
      '#sidebar-shop-initial, #navbar-profile-avatar'
  );
  const profileSectionNavButton = document.querySelector('[data-section="profile-home"]');

  if (profileCircles.length > 0 && profileSectionNavButton) {
      profileCircles.forEach(circle => {
          circle.style.cursor = 'pointer';
          circle.addEventListener("click", function () {
              profileSectionNavButton.click(); // Simulate click on the Profile nav button
          });
      });
  }

  // --- Product Delete Functionality ---
  document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('btn-delete')) {
      const productId = event.target.dataset.productId;

      if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        try {
          const response = await fetch(`/api/dashboard/product/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const data = await response.json();

          if (response.ok) {
            alert(data.msg || 'Product deleted successfully!');
            loadCatalog(); // Re-render products after successful deletion
          } else {
            alert(data.msg || 'Error deleting product: ' + (data.msg || response.statusText));
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred during deletion.');
        }
      }
    }
  });

  // --- Add Product Form Submission ---
  const addProductForm = document.getElementById('addProductForm');

  if (addProductForm) {
    addProductForm.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent default form submission
      const formData = new FormData(this); // 'this' refers to the form element

      try {
        const response = await fetch('/api/products/', {
          method: 'POST',
          body: formData, // FormData handles 'multipart/form-data' header automatically
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.msg || 'Product added successfully!');
          this.reset(); // Reset the form fields
          activateSection('catalog-home'); // This will also call loadCatalog()
        } else {
          alert(result.msg || 'Error adding product: ' + (result.msg || response.statusText));
        }
      } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product.');
      }
    });
  }

  // --- Custom Dropdown Logic ---
  function setupCustomDropdown(wrapperId, hiddenInputId, optionsId, displayId, customInputContainerId, customInputId, customButtonId, addApiUrl, type) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const hiddenInput = document.getElementById(hiddenInputId);
    const display = wrapper.querySelector('.custom-select-display');
    const optionsContainer = document.getElementById(optionsId);
    const customInputContainer = wrapper.querySelector('.custom-add-input-container');
    const customInput = wrapper.querySelector('.custom-add-input');
    const customButton = wrapper.querySelector('.custom-add-button');
    const customOption = wrapper.querySelector('.custom-select-option.custom-add-option');

    display.addEventListener('click', () => {
      // Close other open dropdowns
      document.querySelectorAll('.custom-select-wrapper.open').forEach(openWrapper => {
        if (openWrapper !== wrapper) {
          openWrapper.classList.remove('open');
          openWrapper.querySelector('.custom-add-input-container').style.display = 'none'; // Hide custom input if dropdown closes
        }
      });
      wrapper.classList.toggle('open');
      if (!wrapper.classList.contains('open') && customInputContainer) {
        customInputContainer.style.display = 'none'; // Hide custom input when dropdown closes
        if (customInput) customInput.focus();
      } else {
        display.classList.add('focused');
      }
    });

    optionsContainer.addEventListener('click', async (event) => {
      const targetOption = event.target.closest('.custom-select-option');
      if (targetOption && targetOption.closest(`#${optionsId}`) === optionsContainer) {
        const value = targetOption.dataset.value;
        const text = targetOption.textContent.trim();

        if (value === '__custom__') {
          if (customInputContainer) {
            customInputContainer.style.display = 'flex';
            if (customInput) customInput.focus();
          }
        } else {
          hiddenInput.value = value;
          display.textContent = text;
          wrapper.classList.remove('open');
          if (customInputContainer) customInputContainer.style.display = 'none';
          display.classList.remove('focused');

          // Mark selected option
          optionsContainer.querySelectorAll('.custom-select-option').forEach(option => {
            option.classList.remove('selected');
          });
          targetOption.classList.add('selected');
        }
      }
    });

    // Handle custom add button click
    if (customButton) {
      customButton.addEventListener('click', async () => {
        const name = customInput.value.trim();
        if (!name) {
          alert(`Please enter a ${type} name.`);
          return;
        }

        try {
          const response = await fetch(addApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
          });
          const result = await response.json();

          if (response.ok) {
            alert(result.msg || `${type} added successfully!`);
            customInput.value = ''; // Clear input
            customInputContainer.style.display = 'none'; // Hide input container
            activateSection('add-product-home'); // Re-fetch and re-render add-product-home to update dropdowns
          } else {
            alert(result.msg || `Error adding ${type}: ` + (result.msg || response.statusText));
          }
        } catch (error) {
          console.error(`Error adding ${type}:`, error);
          alert(`An error occurred while adding the ${type}.`);
        }
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (event) => {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove('open');
        if (customInputContainer) customInputContainer.style.display = 'none';
        display.classList.remove('focused');
      }
    });

    // Optional: set initial value if hidden input has one
    if (hiddenInput.value) {
      const selectedOption = optionsContainer.querySelector(`.custom-select-option[data-value="${hiddenInput.value}"]`);
      if (selectedOption) {
        display.textContent = selectedOption.textContent.trim();
        selectedOption.classList.add('selected');
      }
    }
  }

  // --- Custom Filter Dropdown Logic (Simplified for My Catalog) ---
  function setupFilterDropdown(wrapperId, hiddenInputId, optionsId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const hiddenInput = document.getElementById(hiddenInputId);
    const display = wrapper.querySelector('.custom-select-display');
    const optionsContainer = document.getElementById(optionsId);

    display.addEventListener('click', () => {
      // Close other open dropdowns
      document.querySelectorAll('.custom-select-wrapper.open').forEach(openWrapper => {
        if (openWrapper !== wrapper) {
          openWrapper.classList.remove('open');
        }
      });
      wrapper.classList.toggle('open');
      if (wrapper.classList.contains('open')) {
        display.classList.add('focused');
      } else {
        display.classList.remove('focused');
      }
    });

    optionsContainer.addEventListener('click', (event) => {
      const targetOption = event.target.closest('.custom-select-option');
      if (targetOption && targetOption.closest(`#${optionsId}`) === optionsContainer) {
        const value = targetOption.dataset.value;
        const text = targetOption.textContent.trim();

        hiddenInput.value = value;
        display.textContent = text;
        wrapper.classList.remove('open');
        display.classList.remove('focused');

        // Mark selected option
        optionsContainer.querySelectorAll('.custom-select-option').forEach(option => {
          option.classList.remove('selected');
        });
        targetOption.classList.add('selected');

        filterProducts(value); // Trigger filtering
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (event) => {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove('open');
        display.classList.remove('focused');
      }
    });

    // Set initial display value based on hidden input
    if (hiddenInput.value) {
      const selectedOption = optionsContainer.querySelector(`.custom-select-option[data-value="${hiddenInput.value}"]`);
      if (selectedOption) {
        display.textContent = selectedOption.textContent.trim();
        selectedOption.classList.add('selected');
      }
    }
  }

  // Setup Category and Material Dropdowns
  setupCustomDropdown('categorySelectWrapper', 'productCategory', 'categoryOptions', 'categoryDisplay', 'customCategoryInputContainer', 'newCategoryName', 'addCustomCategoryBtn', '/api/dashboard/add-category', 'category');
  setupCustomDropdown('materialSelectWrapper', 'productMaterial', 'materialOptions', 'materialDisplay', 'customMaterialInputContainer', 'newMaterialName', 'addCustomMaterialBtn', '/api/dashboard/add-material', 'material');

  // Setup Catalog Category Filter
  setupFilterDropdown('catalogCategoryFilterWrapper', 'catalogProductCategory', 'catalogCategoryOptions');

});

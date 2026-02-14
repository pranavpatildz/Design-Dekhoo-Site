document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".nav-btn[data-section]");
  const sections = document.querySelectorAll(".section");

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      const target = this.dataset.section;

      sections.forEach(sec => {
        sec.classList.remove("active-section");
      });

      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.classList.add("active-section");
      }
    });
  });

  // --- Dynamic Content Placeholders for Dashboard Home ---
  // The element 'sidebar-shop-name' is now handled by EJS directly
  // 'dashboard-welcome-shop-name' element has been removed from EJS
  const sidebarShopInitial = document.getElementById('sidebar-shop-initial');
  const totalProductsCount = document.getElementById('total-products-count');
  const totalCategoriesCount = document.getElementById('total-categories-count');
  const profileCompletionPercentage = document.getElementById('profile-completion-percentage');
  const navbarProfileAvatar = document.getElementById('navbar-profile-avatar');


  // Placeholder Data (These values are now purely for the dashboard-home cards)
  const shopName = "Dekhoo Designs"; // Example Shop Name (Used for dashboardWelcomeShopName context previously)
  const profileImageUrl = "/images/profile-placeholder.jpg"; // Example profile image URL
  const productsCount = 120; // Example count
  const categoriesCount = 15; // Example count
  const profileCompletion = 75; // Example percentage

  // Populate dynamic elements
  // Removed: if (dashboardWelcomeShopName) dashboardWelcomeShopName.textContent = `Welcome, ${shopName}!`
  if (totalProductsCount) totalProductsCount.textContent = productsCount;
  if (totalCategoriesCount) totalCategoriesCount.textContent = categoriesCount;
  if (profileCompletionPercentage) profileCompletionPercentage.textContent = `${profileCompletion}%`;

  // Set profile images (using background-image for circles)
  if (sidebarShopInitial) {
    sidebarShopInitial.style.backgroundImage = `url(${profileImageUrl})`;
    sidebarShopInitial.textContent = ''; // Clear initials if image
  }
  if (navbarProfileAvatar) {
    navbarProfileAvatar.style.backgroundImage = `url(${profileImageUrl})`;
    navbarProfileAvatar.textContent = ''; // Clear initials if image
  }

  // --- Sidebar Toggle for Mobile (if needed, based on CSS) ---
  const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
  const dashboardSidebar = document.querySelector('.dashboard-sidebar');

  if (sidebarToggleBtn && dashboardSidebar) {
      sidebarToggleBtn.addEventListener('click', () => {
          dashboardSidebar.classList.toggle('show');
          document.body.classList.toggle('sidebar-open');
      });
  }

  // --- Logout Button Functionality (Simplified) ---
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
      '#sidebar-shop-initial, #navbar-profile-avatar' // Removed '#dashboard-profile-circle'
  );
  const profileSectionNavButton = document.querySelector('[data-section="profile-home"]');

  if (profileCircles.length > 0 && profileSectionNavButton) {
      profileCircles.forEach(circle => {
          circle.style.cursor = 'pointer'; // Indicate clickability
          circle.addEventListener("click", function () {
              profileSectionNavButton.click(); // Simulate click on the Profile nav button
          });
      });
  }

});
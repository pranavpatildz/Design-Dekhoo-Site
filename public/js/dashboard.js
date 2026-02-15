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
  const profileCompletionPercentage = document.getElementById('profile-completion-percentage');
  const navbarProfileAvatar = document.getElementById('navbar-profile-avatar');

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
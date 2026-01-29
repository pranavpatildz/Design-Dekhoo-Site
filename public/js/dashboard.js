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
            const targetId = item.getAttribute('data-target');

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
                    sidebar.classList.remove('open');
                }
            }
        });
    });

    // Toggle sidebar on mobile
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
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
});

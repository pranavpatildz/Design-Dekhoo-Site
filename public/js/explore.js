document.addEventListener('DOMContentLoaded', () => {
    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const filterCloseBtn = document.querySelector('.filter-close-btn');
    const budgetSlider = document.querySelector('.budget-slider');
    const budgetOutput = document.querySelector('output[for="budget"]');

    if (filterToggleBtn && filterSidebar && filterCloseBtn) {
        filterToggleBtn.addEventListener('click', () => {
            filterSidebar.classList.toggle('open');
        });

        filterCloseBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('open');
        });
    }

    if (budgetSlider && budgetOutput) {
        budgetSlider.addEventListener('input', () => {
            budgetOutput.textContent = budgetSlider.value;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) {
        return;
    }

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'visible' class to trigger the animation
                entry.target.classList.add('visible');
                // Stop observing the element so the animation only happens once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each element
    revealElements.forEach(el => {
        observer.observe(el);
    });
});

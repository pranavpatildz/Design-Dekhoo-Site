document.addEventListener('DOMContentLoaded', () => {
    const eyeIcons = document.querySelectorAll('.eye-icon');

    eyeIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordInput = document.getElementById(icon.dataset.target);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.add('visible');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('visible');
            }
        });
    });
});

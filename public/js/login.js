document.addEventListener('DOMContentLoaded', () => {
    const eyeIcons = document.querySelectorAll('.eye-icon');
    const loginForm = document.getElementById('login-form'); // Get login form

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

    // Handle Login Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;

            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include", // IMPORTANT: Include cookies with the request
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.msg || "Login failed");
                }

                // Assuming backend returns a success message or simply 200 OK
                // No need to parse JSON if backend redirects or sends empty 200
                // For now, we expect 200 OK after setting cookie, and we manually redirect
                window.location.href = "/shop-dashboard"; // Manual redirect

            } catch (err) {
                console.error("Login error:", err);
                alert(err.message || "An unexpected error occurred during login.");
            }
        });
    }
});

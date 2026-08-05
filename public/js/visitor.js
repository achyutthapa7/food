// Manages the visitor's name in localStorage — no server-side auth involved.
(function () {
    const STORAGE_KEY = 'visitorName';

    function getVisitorName() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function setVisitorName(name) {
        localStorage.setItem(STORAGE_KEY, name);
    }

    function clearVisitorName() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function showWelcomeOverlay() {
        const overlay = document.getElementById('welcomeOverlay');
        if (overlay) overlay.classList.remove('d-none');
    }

    function hideWelcomeOverlay() {
        const overlay = document.getElementById('welcomeOverlay');
        if (overlay) overlay.classList.add('d-none');
    }

    function updateGreeting() {
        const name = getVisitorName();
        const greetingEl = document.getElementById('visitorGreeting');
        if (greetingEl && name) {
            greetingEl.textContent = `Hello, ${name} \u{1F44B}`;
        }
        const nameInput = document.getElementById('orderVisitorName');
        if (nameInput && name) {
            nameInput.value = name;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const name = getVisitorName();
        if (!name) {
            showWelcomeOverlay();
        } else {
            hideWelcomeOverlay();
            updateGreeting();
        }

        const continueBtn = document.getElementById('welcomeContinueBtn');
        const nameInputField = document.getElementById('welcomeNameInput');
        const errorEl = document.getElementById('welcomeError');

        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                const value = (nameInputField.value || '').trim();
                if (!value) {
                    errorEl.classList.remove('d-none');
                    return;
                }
                errorEl.classList.add('d-none');
                setVisitorName(value);
                hideWelcomeOverlay();
                updateGreeting();
            });

            nameInputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') continueBtn.click();
            });
        }

        const changeNameBtn = document.getElementById('changeNameBtn');
        if (changeNameBtn) {
            changeNameBtn.addEventListener('click', () => {
                clearVisitorName();
                window.location.href = '/';
            });
        }
    });

    window.VisitorStore = { getVisitorName, setVisitorName, clearVisitorName };
})();

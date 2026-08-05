// Handles the Add Order form (price auto-fill, eligible calc, AJAX submit) and delete actions.
(function () {
    const ELIGIBLE_CAP = 100;

    function calcEligible(price) {
        return Math.min(Number(price) || 0, ELIGIBLE_CAP);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const menuSelect = document.getElementById('orderMenuItem');
        const priceInput = document.getElementById('orderPrice');
        const eligibleInput = document.getElementById('orderEligible');
        const form = document.getElementById('addOrderForm');
        const errorEl = document.getElementById('addOrderError');

        if (menuSelect) {
            menuSelect.addEventListener('change', () => {
                const selected = menuSelect.options[menuSelect.selectedIndex];
                const price = selected ? selected.getAttribute('data-price') : null;
                if (price) {
                    priceInput.value = price;
                    eligibleInput.value = calcEligible(price);
                } else {
                    priceInput.value = '';
                    eligibleInput.value = '';
                }
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorEl.classList.add('d-none');

                const visitorName = window.VisitorStore.getVisitorName();
                if (!visitorName) {
                    window.location.href = '/';
                    return;
                }

                const eventId = form.getAttribute('data-event-id');
                const payload = {
                    visitor_name: visitorName,
                    group_no: document.getElementById('orderGroup').value,
                    menu_item_id: menuSelect.value,
                };

                if (!payload.menu_item_id) {
                    errorEl.textContent = 'Please select a food item.';
                    errorEl.classList.remove('d-none');
                    return;
                }

                try {
                    const res = await fetch(`/events/${eventId}/orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        errorEl.textContent = data.error || 'Failed to save order.';
                        errorEl.classList.remove('d-none');
                        return;
                    }
                    window.location.reload();
                } catch (err) {
                    errorEl.textContent = 'Network error. Please try again.';
                    errorEl.classList.remove('d-none');
                }
            });
        }

        document.querySelectorAll('.delete-order-btn').forEach((btn) => {
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this order?')) return;
                const orderId = btn.getAttribute('data-order-id');
                try {
                    const res = await fetch(`/orders/${orderId}`, {
                        method: 'DELETE',
                        headers: { 'X-Requested-With': 'XMLHttpRequest' },
                    });
                    if (res.ok) {
                        window.location.reload();
                    } else {
                        alert('Failed to delete order.');
                    }
                } catch (err) {
                    alert('Network error. Please try again.');
                }
            });
        });
    });
})();

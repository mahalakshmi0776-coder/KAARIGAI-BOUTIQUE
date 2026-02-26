document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("orders-list-container");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="form-group empty-state">
                <p>No orders found.</p>
                <a href="../index.html" class="place-order-btn">Start Shopping</a>
            </div>`;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="form-group order-card">
            <div class="summary-line">
                <strong>Order ID: #${order.orderId}</strong>
                <span class="helper-text">${order.date}</span>
            </div>
            <hr>
            <div class="order-items-detail">
                ${order.items.map(item => `
                    <div class="summary-line item-row">
                        <div class="item-info">
                            <img src="${item.image}" alt="${item.name}" class="summary-img">
                            <div class="item-text">
                                <span class="item-name">${item.name}</span>
                                <span class="item-qty">Quantity: ${item.quantity}</span>
                            </div>
                        </div>
                        <span class="item-total-price">₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="summary-line total-highlight">
                <span>Grand Total Paid</span>
                <span>₹${order.total}</span>
            </div>
        </div>
    `).join('');
});
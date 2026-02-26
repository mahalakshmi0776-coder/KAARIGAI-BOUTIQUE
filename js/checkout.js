/**
 * Main Initialization on Page Load
 */
document.addEventListener("DOMContentLoaded", () => {
  updateCheckoutSummary();
  updateCartCount();
  setupPaymentToggle();
});

/**
 * Updates the Navbar Cart Counter
 */
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (countEl) {
    countEl.innerText = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

/**
 * Fetches the correct items (Buy Now or Cart) and updates Summary UI
 */
function updateCheckoutSummary() {
  const summaryContainer = document.getElementById("summaryItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalFinalEl = document.getElementById("totalFinal");
  const finalAmountEl = document.getElementById("finalAmount");

  // Buy Now item irukkanu check pannum
  const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
  let displayItems = buyNowItem ? [buyNowItem] : (JSON.parse(localStorage.getItem("cart")) || []);

  if (displayItems.length === 0) {
    summaryContainer.innerHTML = "<p class='helper-text'>Your checkout is empty.</p>";
    return;
  }

  // Mapping items to Summary HTML with Image
  summaryContainer.innerHTML = displayItems.map(item => `
        <div class="summary-line item-row">
            <div class="item-info">
                <img src="${item.image}" alt="${item.name}" class="summary-img" style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
                <div class="item-text">
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">Qty: ${item.quantity}</span>
                </div>
            </div>
            <span class="item-total-price">₹${item.price * item.quantity}</span>
        </div>
    `).join("");

  const total = displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  subtotalEl.innerText = total;
  totalFinalEl.innerText = total;
  finalAmountEl.innerText = total;
}

/**
 * Payment Toggle Logic
 */
function setupPaymentToggle() {
  const cardSection = document.getElementById("cardDetails");
  const gpaySection = document.getElementById("gpaySection");
  const codSection = document.getElementById("codSection");
  const radios = document.querySelectorAll('input[name="pay"]');

  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      cardSection.classList.add("hidden");
      gpaySection.classList.add("hidden");
      codSection.classList.add("hidden");

      if (e.target.value === "card") cardSection.classList.remove("hidden");
      else if (e.target.value === "gpay") gpaySection.classList.remove("hidden");
      else if (e.target.value === "cod") codSection.classList.remove("hidden");
    });
  });
}

/**
 * Handle Order Submission and Show Toast
 */
document.getElementById("paymentForm").onsubmit = function(e) {
  e.preventDefault();
  const submitBtn = document.getElementById("submitBtn");

  const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
  let orderItems = buyNowItem ? [buyNowItem] : (JSON.parse(localStorage.getItem("cart")) || []);

  if (orderItems.length === 0) {
    showToast("No items to order!", "fa-exclamation-triangle");
    return;
  }

  submitBtn.innerText = "Processing Your Order...";
  submitBtn.disabled = true;

  // Order Details Storage Logic
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const newOrder = {
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleString(),
    items: orderItems,
    total: total,
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.unshift(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Success Toast & Redirect
  setTimeout(() => {
    showToast("Order Placed Successfully!", "fa-check-circle");

    // Cleanup Storage
    if (buyNowItem) {
      localStorage.removeItem("buyNowItem");
    } else {
      localStorage.removeItem("cart");
    }

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  }, 1500);
};
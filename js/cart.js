// Global Cart Count Logic
let cartCount = 0;
const cartDisplay = document.getElementById("cart-count");

function updateCart() {
  cartCount++;
  if (cartDisplay) {
    cartDisplay.innerText = cartCount;
  }
}

/* --- ADDED CART LOGIC --- */

/**
 * Updates the Navbar Cart Counter
 * Now it only counts unique items (cart.length) instead of total quantity.
 */
function updateCartCountDisplay() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartDisplay = document.getElementById("cart-count");
  if (cartDisplay) {
    // Change: Using cart.length to count unique products only
    cartDisplay.innerText = cart.length; 
  }
}

// Global function to add to cart
function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    // Logic: Item exists, so we don't add a new row. 
    // The cart.length remains the same.
    showToast(name + " is already in your cart!", "fa-info-circle");
  } else {
    // Logic: New item added. cart.length will increase by 1.
    cart.push({ id, name, price, image, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCountDisplay();
    showToast(name + " added to cart!", "fa-shopping-bag");
  }
}

// Ensure the count stays correct on page load
window.addEventListener("DOMContentLoaded", () => {
  updateCartCountDisplay();
});

function displayCart() {
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total-amount");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px;">
            <p>Your bag is empty!</p>
            <a href="../index.html#collections" style="color: #e91e63;">Continue Shopping</a>
        </div>`;
    subtotalEl.innerText = "₹0";
    totalEl.innerText = "₹0";
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart
    .map((item) => {
      subtotal += item.price * item.quantity;
      return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">₹${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="changeQty('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    })
    .join("");

  subtotalEl.innerText = `₹${subtotal}`;
  totalEl.innerText = `₹${subtotal}`;
}

function changeQty(id, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity < 1) return removeItem(id);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCountDisplay(); // from script.js
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((i) => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCountDisplay(); // from script.js
}

document.addEventListener("DOMContentLoaded", displayCart);




/**
 * Handle Proceed to Checkout Button Click
 */
document.querySelector(".checkout-btn").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    // If cart is empty, show a message and don't go to checkout
    showToast("Your cart is empty! Add some items first.", "fa-info-circle");
  } else {
    // 1. Clear any 'Buy Now' temporary data to ensure full cart is shown
    localStorage.removeItem("buyNowItem");
    
    // 2. Redirect to checkout page
    window.location.href = "checkout.html";
  }
});
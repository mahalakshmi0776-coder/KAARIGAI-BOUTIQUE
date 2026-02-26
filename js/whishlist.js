/* --- WISHLIST LOGIC (PERSISTENT) --- */

/**
 * Toggles a product in the wishlist.
 */
function addToWishlist(id, name, price, image, buttonElement) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const index = wishlist.findIndex((item) => item.id === id);

  if (index === -1) {
    // Add new product
    wishlist.push({ id, name, price, image });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    if (buttonElement) buttonElement.classList.add("active");
    showToast(name + " added to wishlist!", "fa-heart");
  } else {
    // Remove product
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    if (buttonElement) buttonElement.classList.remove("active");
    showToast(name + " removed from wishlist.", "fa-heart-broken");
  }

  if (document.getElementById("wishlist-container")) {
    displayWishlist();
  }
}

/**
 * Displays items on the wishlist page
 */
function displayWishlist() {
  const wishlistContainer = document.getElementById("wishlist-container");
  if (!wishlistContainer) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:50px;">
                <p>Your wishlist is currently empty.</p>
                <br>
                <a href="../index.html#collections" class="buy-now-btn" style="text-decoration:none;">Go Shopping</a>
            </div>`;
    return;
  }

  wishlistContainer.innerHTML = wishlist
    .map(
      (item) => `
        <div class="product-card">
          <div class="product-img-container">
            <img src="${item.image}" alt="${item.name}" />
            <button class="wishlist-btn active" onclick="addToWishlist('${item.id}', '${item.name}', '${item.price}', '${item.image}', this)">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
          <div class="product-details">
            <h3 class="product-name">${item.name}</h3>
            <div class="price-container">
              <span class="current-price">₹${item.price}</span>
            </div>
            <div class="button-group">
              <button class="add-to-cart-btn" onclick="addToCart('${item.id}', '${item.name}', ${item.price}, '${item.image}')">Add to Cart</button>
              <button class="buy-now-btn" onclick="buyNow('${item.id}', '${item.name}', ${item.price}, '${item.image}')">Buy Now</button>
            </div>
          </div>
        </div>
    `,
    )
    .join("");
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  displayWishlist();
});

/**
 * Synchronizes the UI heart icons with the saved wishlist state
 * Run this on product listing pages
 */
function syncWishlistUI() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");

  wishlistButtons.forEach((btn) => {
    // Get the ID from the onclick attribute or a data-id attribute
    // This assumes your button has the ID passed in the onclick function
    const onclickAttr = btn.getAttribute("onclick");
    if (onclickAttr) {
      // Extract the ID (the first argument in the addToWishlist call)
      const match = onclickAttr.match(/'([^']+)'/);
      if (match && match[1]) {
        const productId = match[1];
        const isFavorited = wishlist.some((item) => item.id === productId);

        if (isFavorited) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      }
    }
  });
}

// Ensure this runs on every page load
document.addEventListener("DOMContentLoaded", () => {
  displayWishlist(); // Existing call for the wishlist page
  syncWishlistUI(); // New call for product/home pages
});

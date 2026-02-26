/**
 * Function to show dynamic toast notifications
 * @param {string} message - The message to display
 * @param {string} icon - FontAwesome icon class
 */
function showToast(message, icon = "fa-check-circle") {
    const container = document.getElementById("toast-container");
    
    // Create toast element
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 100);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
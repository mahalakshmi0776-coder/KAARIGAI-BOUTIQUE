// List of pages to scan for products
const productPages = [
    '../productpage/saree.html',
    '../productpage/kurti.html',
    '../productpage/ethnic-set.html',
    '../productpage/traditional-wear.html',
    '../productpage/office-wear.html'
];

const searchInput = document.getElementById('searchInput'); //
const searchBtn = document.getElementById('searchBtn'); //
const searchResults = document.getElementById('searchResults'); //
const resultCount = document.getElementById('resultCount'); //

// Function to fetch and parse products from other HTML files
async function performSearch() {
    const query = searchInput.value.toLowerCase().trim(); //
    
    if (query === "") {
        resultCount.textContent = "Please enter a keyword to search."; //
        searchResults.innerHTML = ""; //
        return;
    }

    resultCount.textContent = "Searching..."; //
    searchResults.innerHTML = ""; //
    let foundProducts = [];

    try {
        for (const page of productPages) {
            // Fetching the HTML content of each page
            const response = await fetch(page);
            if (!response.ok) continue; // Skip if page doesn't exist

            const htmlText = await response.text(); //
            const parser = new DOMParser(); //
            const doc = parser.parseFromString(htmlText, 'text/html'); //

            // Select all product cards from the fetched page
            const cards = doc.querySelectorAll('.product-card');

            cards.forEach(card => {
                const titleElement = card.querySelector('h3');
                if (!titleElement) return;

                const title = titleElement.textContent.toLowerCase(); //
                const category = page.replace('.html', '').replace('-', ' '); //

                // Check if search query matches title or page category
                if (title.includes(query) || category.includes(query)) {
                    
                    // --- FIX IMAGE PATHS ---
                    // Ensure images load correctly by adjusting relative paths
                    const img = card.querySelector('img');
                    if (img) {
                        const originalSrc = img.getAttribute('src');
                        // If path starts with '../', we keep it as is for root-relative consistency
                        if (originalSrc && !originalSrc.startsWith('http') && !originalSrc.startsWith('..')) {
                            img.src = originalSrc; 
                        }
                    }

                    // --- FIX LINK PATHS ---
                    // Ensure 'View' buttons or product links point to the correct page
                    const links = card.querySelectorAll('a');
                    links.forEach(link => {
                        const originalHref = link.getAttribute('href');
                        if (originalHref && !originalHref.startsWith('http') && !originalHref.startsWith('#')) {
                            // If the link is just a filename, point it back to the original page
                            if (!originalHref.includes('/')) {
                                link.setAttribute('href', originalHref);
                            }
                        }
                    });

                    foundProducts.push(card.outerHTML); //
                }
            });
        }

        displayResults(foundProducts, query); //
    } catch (error) {
        console.error("Error fetching products:", error); //
        resultCount.textContent = "An error occurred while searching."; //
    }
}

function displayResults(products, query) {
    if (products.length > 0) {
        resultCount.textContent = `Found ${products.length} results for "${query}"`; //
        // Remove duplicates and join into the grid
        searchResults.innerHTML = [...new Set(products)].join(''); //
    } else {
        resultCount.textContent = `No products found for "${query}"`; //
        searchResults.innerHTML = ""; //
    }
}

// Event Listeners
searchBtn.addEventListener('click', performSearch); //

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(); //
    }
});

function buyNow(id, name, price, image) {
    const item = {
        id: id,
        name: name,
        price: price,
        image: image,
        quantity: 1
    };

    localStorage.setItem("buyNowItem", JSON.stringify(item));

    window.location.href = "../subpages/checkout.html";
}
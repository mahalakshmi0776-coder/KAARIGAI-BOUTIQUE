const form = document.querySelector('.footer-form form');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Show a loading state on your button

    const btn = document.querySelector('.submit-btn');
    btn.innerHTML = "Sending...";

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
        .then(async (response) => {
            let res = await response.json();
            if (response.status == 200) {
                alert("Message sent successfully!");
            } else {
                console.log(response);
                alert(res.message);
            }
        })
        .catch(error => {
            console.log(error);
            alert("Something went wrong!");
        })
        .then(function () {
            form.reset();
            btn.innerHTML = "Send Message";
        });
});
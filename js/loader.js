window.addEventListener("load", () => {
  const loader = document.querySelector("#preloader");

  // Small delay to ensure smooth transition
  setTimeout(() => {
    loader.classList.add("loader-hidden");
  }, 2000);

  // Remove from DOM after transition for performance
  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});

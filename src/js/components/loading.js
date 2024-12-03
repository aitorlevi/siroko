document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loadingScreen");
  //   Wait for fonts to be loaded
  document.fonts.ready.then(() => {
    // Hide the loading screen
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  });
});
